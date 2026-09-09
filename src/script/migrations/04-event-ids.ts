/**
 * One-time migration: topics/comments `event_id: string` -> `event_ids: string[]`.
 *
 *   VITE_USE_FIREBASE_EMULATOR=true pnpm tsx src/script/migrations/04-event-ids.ts [--apply] [--drop-legacy]
 *
 * Dry-run by default. `--apply` writes. `--drop-legacy` also deletes `event_id`.
 * Idempotent: docs that already have an `event_ids` array are skipped.
 *
 * This runs through the client SDK, so production security rules apply.
 * Prod rollout order:
 *   1. In the Firebase console, replace `isEventUnchanged()` with the version in
 *      firestore.rules. It compares `event_ids` and exempts docs that don't have
 *      the field yet, so unmigrated docs stay updatable and the old app keeps
 *      working (it never writes `event_ids`, so the comparison holds).
 *   2. `--apply` (no `--drop-legacy`).
 *   3. Deploy the new build.
 *   4. `--apply --drop-legacy`. Denied by the pre-step-1 rule, which errors on
 *      the now-missing `event_id`.
 */
import {
  collection,
  deleteField,
  getDocs,
  writeBatch,
  type DocumentReference,
} from 'firebase/firestore';
import { initDB } from '../firestore';
import {
  EMULATOR_FIREBASE_CONFIG,
  isEmulatorEnabled,
} from '../../utils/firebaseEmulator';

const apply = process.argv.includes('--apply');
const dropLegacy = process.argv.includes('--drop-legacy');
const BATCH_SIZE = 500;

const { db } = initDB();
const useEmulator = isEmulatorEnabled(process.env.VITE_USE_FIREBASE_EMULATOR);
const target = useEmulator
  ? `emulator (${EMULATOR_FIREBASE_CONFIG.projectId})`
  : `PRODUCTION (${db.app.options.projectId})`;
console.log(
  `[migrate] target: ${target} | mode: ${apply ? 'APPLY' : 'dry-run'}${dropLegacy ? ' + drop legacy event_id' : ''}`
);

const migrateCollection = async (name: string) => {
  const snapshot = await getDocs(collection(db, name));
  const pending: { ref: DocumentReference; eventIds: string[] }[] = [];
  let skipped = 0;
  let missing = 0;

  snapshot.docs.forEach(d => {
    const data = d.data();
    const hasEventIds = Array.isArray(data.event_ids);
    if (hasEventIds && !(dropLegacy && 'event_id' in data)) {
      skipped += 1;
      return;
    }
    if (!data.event_id) missing += 1;
    pending.push({
      ref: d.ref,
      eventIds: hasEventIds
        ? data.event_ids
        : data.event_id
          ? [data.event_id]
          : [],
    });
  });

  console.log(
    `[migrate] ${name}: total=${snapshot.size} toMigrate=${pending.length} skipped=${skipped} missingEventId=${missing}`
  );
  if (!apply) return;

  for (let i = 0; i < pending.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    pending.slice(i, i + BATCH_SIZE).forEach(({ ref, eventIds }) =>
      batch.update(ref, {
        event_ids: eventIds,
        ...(dropLegacy ? { event_id: deleteField() } : {}),
      })
    );
    await batch.commit();
    console.log(
      `[migrate] ${name}: wrote ${Math.min(i + BATCH_SIZE, pending.length)}/${pending.length}`
    );
  }
};

const main = async () => {
  await migrateCollection('topics');
  await migrateCollection('comments');
};

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('[migrate] Failed:', err);
    process.exit(1);
  });
