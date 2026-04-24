import { collection, getDocs } from 'firebase/firestore';
import { initDB } from './firestore';
import * as fs from 'fs';
import * as path from 'path';

const { db } = initDB();

const OUTPUT_DIR = 'out';

const COLLECTIONS = ['events', 'topics', 'comments', 'writers'];

function serializeValue(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }
  if (typeof value === 'object') {
    if ('toDate' in value && typeof value.toDate === 'function') {
      return (value as { toDate: () => Date }).toDate().toISOString();
    }
    if (Array.isArray(value)) {
      return value.map(serializeValue);
    }
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = serializeValue(v);
    }
    return result;
  }
  return value;
}

async function dumpCollection(name: string) {
  const colRef = collection(db, name);
  const snapshot = await getDocs(colRef);

  const docs = snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...(serializeValue(docSnap.data()) as Record<string, unknown>),
  }));

  const filePath = path.join(OUTPUT_DIR, `${name}.json`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(docs, null, 2));

  console.log(`Dumped ${docs.length} docs from "${name}" -> ${filePath}`);
}

async function main() {
  for (const name of COLLECTIONS) {
    await dumpCollection(name);
  }
  console.log('Done.');
  process.exit(0);
}

main().catch(err => {
  console.error('Dump failed:', err);
  process.exit(1);
});
