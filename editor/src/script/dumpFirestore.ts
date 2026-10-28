import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { csvFormat, csvParse } from 'd3-dsv';
import { collection, getDocs } from 'firebase/firestore';
import { initDB } from './firestore';

const { db } = initDB();

const OUTPUT_DIR = 'out';

const GLOSSARY_URL =
  'https://docs.google.com/spreadsheets/d/1I5zayl6xMft3eJZlmdh06LA9IGKqqJNMHFRB3JxPHkE/gviz/tq?tqx=out:csv&sheet=glossary';

const PUBLIC_COLUMNS: Record<string, string[]> = {
  events: [
    'id',
    'target_group',
    'date',
    'description',
    'display_name',
    'news_link',
    'location',
    'title_en',
    'participants',
    'title_th',
    'document_link',
    'organizers',
    'target_group_types',
  ],
  topics: ['id', 'event_ids', 'title', 'categories'],
  comments: [
    'id',
    'event_ids',
    'comment_view',
    'reason',
    'parent_topic_id',
    'parent_comment_id',
  ],
};

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
    return value.trim() === '-' ? null : value;
  }
  if (Array.isArray(value)) {
    return value.join(',');
  }
  return JSON.stringify(value);
}

function normalizeComment(
  doc: Record<string, unknown>
): Record<string, unknown> {
  const parentCommentIds = doc['parent_comment_ids'];
  if (Array.isArray(parentCommentIds) && parentCommentIds.length > 0) {
    doc['parent_comment_id'] = parentCommentIds[parentCommentIds.length - 1];
  }
  delete doc['parent_comment_ids'];
  return doc;
}

async function loadGlossary(): Promise<Map<string, string>> {
  const response = await fetch(GLOSSARY_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch glossary: ${response.status}`);
  }
  const rows = csvParse(await response.text());
  return new Map(
    rows.flatMap(row =>
      row['Terms'] && row['Related terms']
        ? [[row['Related terms'].trim(), row['Terms'].trim()] as const]
        : []
    )
  );
}

function replaceRelatedTerms(
  text: string,
  glossary: Map<string, string>
): string {
  const pattern = [...glossary.keys(), ...glossary.values()]
    .sort((a, b) => b.length - a.length)
    // escape regex metacharacters so terms like "กม." match the literal dot
    .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  return text.replace(
    new RegExp(pattern, 'g'),
    match => glossary.get(match) ?? match
  );
}

function toCsvRow(
  obj: Record<string, unknown>
): Record<string, string | number | boolean | null> {
  const row: Record<string, string | number | boolean | null> = {};
  for (const [k, v] of Object.entries(obj)) {
    row[k] = toCsvValue(v);
  }
  return row;
}

async function dumpCollection(name: string, glossary: Map<string, string>) {
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
    if (name === 'topics' && typeof data['title'] === 'string') {
      data['title'] = replaceRelatedTerms(data['title'], glossary);
    }
    return data;
  });

  const rows = docs.map(toCsvRow);
  const filePath = join(OUTPUT_DIR, `${name}.csv`);
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(filePath, csvFormat(rows, PUBLIC_COLUMNS[name]));

  console.log(`Dumped ${docs.length} docs from "${name}" -> ${filePath}`);
}

async function main() {
  const glossary = await loadGlossary();
  for (const name of Object.keys(PUBLIC_COLUMNS)) {
    await dumpCollection(name, glossary);
  }
  console.log('Done.');
  process.exit(0);
}

main().catch(err => {
  console.error('Dump failed:', err);
  process.exit(1);
});
