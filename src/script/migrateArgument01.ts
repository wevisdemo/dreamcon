import { collection, getDocs } from 'firebase/firestore';
import { DreamConEventDB } from '../types/event';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { initDB } from './firestore';
import { CreateTopicDBPayload, TopicDB } from '../types/topic';
import { addDoc, CollectionReference } from 'firebase/firestore';

const { db } = initDB();

/**
 * Get all events from the 'events' collection.
 * @returns An array of DreamConEventDB objects.
 */
export const getAllEvents = async (): Promise<DreamConEventDB[]> => {
  try {
    const eventsCollection = collection(db, 'events');
    const snapshot = await getDocs(eventsCollection);

    return snapshot.docs.map(
      docSnap =>
        ({
          id: docSnap.id,
          ...docSnap.data(),
          created_at: docSnap.data()?.created_at?.toDate?.(),
          updated_at: docSnap.data()?.updated_at?.toDate?.(),
        }) as DreamConEventDB
    );
  } catch (err) {
    console.error('Error fetching all events:', err);
    return [];
  }
};

type ArgumentRow = {
  [key: string]: string | number | boolean | null;
};

type ArgumentSheet = {
  ArgumentId: string;
  Argument: string;
  Event: string;
  EventId: string;
  Tag: string;
};

function readArgumentsSheet(filePath: string): ArgumentSheet[] {
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

  const worksheet = workbook.Sheets['Arguments'];
  if (!worksheet) {
    throw new Error('Sheet "Arguments" not found in the Excel file');
  }

  const rawData: (string | number | null)[][] = XLSX.utils.sheet_to_json(
    worksheet,
    {
      header: 1,
      defval: null,
    }
  );

  const [headers, ...rows] = rawData;

  const data: ArgumentRow[] = rows.map(row =>
    (headers as string[]).reduce((acc, header, idx) => {
      acc[header] = row[idx] ?? null;
      return acc;
    }, {} as ArgumentRow)
  );

  // filter empty rows
  const filteredData = data.filter(
    row =>
      row['ArgumentId'] !== null &&
      row['ArgumentId'] !== '' &&
      row['Argument'] !== null &&
      row['Argument'] !== ''
  );

  const argumentSheets: ArgumentSheet[] = filteredData.map(row => ({
    ArgumentId: String(row['ArgumentId'] ?? ''),
    Argument: String(row['Argument'] ?? ''),
    Event: String(row['Event'] ?? ''),
    EventId: String(row['EventId'] ?? ''),
    Tag: String(row['Tag'] ?? ''),
  }));

  return argumentSheets;
}

const mapArgumentsToTopic = (
  dremcomArguments: ArgumentSheet[],
  events: DreamConEventDB[]
): CreateTopicDBPayload[] => {
  return dremcomArguments.map(arg => {
    const event = events.find(event => event.display_name === arg.Event);
    if (!event) {
      console.log('event not found for argument:', arg.Argument);
    }
    return {
      ref_id: arg.ArgumentId,
      title: arg.Argument,
      event_id: event?.id || '',
      category: arg.Tag,
      created_at: new Date(),
      updated_at: new Date(),
      notified_at: new Date(),
    };
  });
};

const main = async () => {
  const events = await getAllEvents();
  const allArguments = readArgumentsSheet(
    'migration/[Dream Con] Argument Mastersheet.xlsx'
  );
  const topics = mapArgumentsToTopic(allArguments, events);

  await insertTopics(topics);
  process.exit(0);
};

const insertTopics = async (topics: CreateTopicDBPayload[]) => {
  const topicsCollection = collection(
    db,
    'topics'
  ) as CollectionReference<TopicDB>;

  for (const topic of topics) {
    try {
      const doc = await addDoc(topicsCollection, topic);
      console.log(`Inserted topic with id: ${doc.id}`);
    } catch (err) {
      console.error(`Error inserting topic with id ${topic.ref_id}:`, err);
    }
  }
};

main()
  .then(() => console.log('Migration completed successfully.'))
  .catch(error => console.error('Migration failed:', error));
