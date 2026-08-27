import { collection, getDocs } from 'firebase/firestore';
import { csvFormat } from 'd3-dsv';
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

function toCsvValue(value: unknown): string | number | boolean | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'boolean' || typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    return value;
  }
  return JSON.stringify(value);
}

function normalizeComment(
  doc: Record<string, unknown>
): Record<string, unknown> {
  const parentCommentIds = doc['parent_comment_ids'];
  if (Array.isArray(parentCommentIds) && parentCommentIds.length > 0) {
    doc['parent_comment_id'] = parentCommentIds[0];
  }
  delete doc['parent_comment_ids'];
  return doc;
}

function toCsvRow(obj: Record<string, unknown>): Record<string, string | number | boolean | null> {
  const row: Record<string, string | number | boolean | null> = {};
  for (const [k, v] of Object.entries(obj)) {
    row[k] = toCsvValue(v);
  }
  return row;
}

async function dumpCollection(name: string) {
  const colRef = collection(db, name);
  const snapshot = await getDocs(colRef);

  const docs = snapshot.docs.map(docSnap => {
    let data: Record<string, unknown> = {
      id: docSnap.id,
      ...(serializeValue(docSnap.data()) as Record<string, unknown>),
    };
    if (name === 'comments') {
      data = normalizeComment(data);
    }
    return data;
  });

  const rows = docs.map(toCsvRow);
  const filePath = path.join(OUTPUT_DIR, `${name}.csv`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(filePath, csvFormat(rows));

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
