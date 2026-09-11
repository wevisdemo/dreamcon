/**
 * Lossless JSON backup/restore of every Firestore collection.
 *
 *   tsx src/script/firestoreBackup.ts backup [outFile]
 *   tsx src/script/firestoreBackup.ts restore <file> [--force]
 *
 * Unlike `dumpFirestore.ts` (a lossy CSV export for analysis), this keeps
 * types, arrays and missing fields intact so a restore reproduces the source.
 */
import {
  Timestamp,
  collection,
  doc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import * as fs from 'fs';
import * as path from 'path';
import { initDB } from './firestore';
import { isEmulatorEnabled } from '../utils/firebaseEmulator';

const OUTPUT_DIR = 'out';
const COLLECTIONS = ['events', 'topics', 'comments', 'writers'];
const BATCH_LIMIT = 500;

const NS_PER_MS = 1e6;

/**
 * Firestore values -> JSON. Timestamps become `{ $ts: ISO }`, plus `$ns` for
 * the sub-millisecond remainder an ISO string cannot hold (server timestamps
 * and Admin SDK writes carry nanoseconds; the web client does not).
 */
const encode = (value: unknown): unknown => {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (value instanceof Timestamp) {
    const $ts = value.toDate().toISOString();
    const $ns = value.nanoseconds % NS_PER_MS;
    return $ns === 0 ? { $ts } : { $ts, $ns };
  }
  if (Array.isArray(value)) {
    return value.map(encode);
  }
  if (Object.getPrototypeOf(value) !== Object.prototype) {
    throw new Error(
      `Unsupported Firestore value type: ${value.constructor?.name}`
    );
  }
  return Object.fromEntries(
    Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => [k, encode(v)])
  );
};

/** JSON -> Firestore values. `{ $ts, $ns? }` becomes a Timestamp. */
const decode = (value: unknown): unknown => {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(decode);
  }
  const { $ts, $ns } = value as { $ts?: unknown; $ns?: number };
  if (typeof $ts === 'string') {
    const ms = new Date($ts).getTime();
    const seconds = Math.floor(ms / 1000);
    return new Timestamp(
      seconds,
      (ms - seconds * 1000) * NS_PER_MS + ($ns ?? 0)
    );
  }
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => [k, decode(v)])
  );
};

type BackupDoc = { id: string } & Record<string, unknown>;
type Backup = {
  exported_at: string;
  collections: Record<string, BackupDoc[]>;
};

const backup = async (outFile?: string) => {
  const { db } = initDB();

  const collections = Object.fromEntries(
    await Promise.all(
      COLLECTIONS.map(async name => {
        const snapshot = await getDocs(collection(db, name));
        const docs: BackupDoc[] = snapshot.docs
          .map(d => ({
            id: d.id,
            ...(encode(d.data()) as Record<string, unknown>),
          }))
          .sort((a, b) => a.id.localeCompare(b.id));
        console.log(`[backup] ${name}: ${docs.length} docs`);
        return [name, docs] as const;
      })
    )
  );

  const now = new Date();
  const filePath =
    outFile ??
    path.join(
      OUTPUT_DIR,
      `firestore-backup-${now.toISOString().replace(/[:.]/g, '-')}.json`
    );
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
    JSON.stringify(
      { exported_at: now.toISOString(), collections } satisfies Backup,
      null,
      2
    )
  );
  console.log(`[backup] -> ${filePath}`);
};

const restore = async (file: string, force: boolean) => {
  const useEmulator = isEmulatorEnabled(process.env.VITE_USE_FIREBASE_EMULATOR);
  if (!useEmulator && !force) {
    throw new Error(
      'Refusing to restore into the real project. Re-run with --force if that is intended.'
    );
  }

  const parsed = JSON.parse(fs.readFileSync(file, 'utf8')) as Backup;
  if (!parsed.collections) {
    throw new Error(`Backup file has no "collections" object: ${file}`);
  }
  const unknown = Object.keys(parsed.collections).filter(
    name => !COLLECTIONS.includes(name)
  );
  if (unknown.length > 0) {
    throw new Error(
      `Backup file has unknown collections: ${unknown.join(', ')}`
    );
  }

  const { db, auth } = initDB();
  console.log(`[restore] target project: ${db.app.options.projectId}`);

  const email = process.env.BACKUP_ADMIN_EMAIL;
  const password = process.env.BACKUP_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error(
      'Set BACKUP_ADMIN_EMAIL and BACKUP_ADMIN_PASSWORD: writing writers requires a signed-in user.'
    );
  }
  await signInWithEmailAndPassword(auth, email, password);

  for (const [name, docs] of Object.entries(parsed.collections)) {
    for (let i = 0; i < docs.length; i += BATCH_LIMIT) {
      const batch = writeBatch(db);
      docs.slice(i, i + BATCH_LIMIT).forEach(({ id, ...data }) => {
        batch.set(doc(db, name, id), decode(data) as Record<string, unknown>);
      });
      await batch.commit();
    }
    console.log(`[restore] ${name}: ${docs.length} docs`);
  }
};

const [command, ...args] = process.argv.slice(2);
const positional = args.filter(a => !a.startsWith('--'));
const force = args.includes('--force');

const run = async () => {
  if (command === 'backup') {
    return backup(positional[0]);
  }
  if (command === 'restore') {
    if (!positional[0]) {
      throw new Error('restore needs a backup file path');
    }
    return restore(positional[0], force);
  }
  throw new Error('Usage: backup [outFile] | restore <file> [--force]');
};

run()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('[firestoreBackup] Failed:', err.message ?? err);
    process.exit(1);
  });
