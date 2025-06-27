import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
// import { collection, getDocs, query, where } from 'firebase/firestore';
import { initDB } from './firestore';
import { DreamConEventDB } from '../types/event';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { TopicDB } from '../types/topic';
import { CommentView, CreateCommentDBPayload } from '../types/comment';
const { db } = initDB();

const newEventDisplays = ['Dream Con x The Active', 'TIJ Youth Dialogue'];

const getEventsByDisplayName = async (displayNames: string[]) => {
  const eventsCollection = collection(db, 'events');
  const events: DreamConEventDB[] = [];

  for (const displayName of displayNames) {
    const querySnapshot = await getDocs(
      query(eventsCollection, where('display_name', '==', displayName))
    );

    const eventsBatch = querySnapshot.docs.map(
      doc =>
        ({
          ...doc.data(),
          id: doc.id,
          created_at: doc.data()?.created_at.toDate(),
          updated_at: doc.data()?.updated_at.toDate(),
        }) as DreamConEventDB
    );
    events.push(...eventsBatch);
  }

  return events;
};

const getTopicsByEventId = async (eventId: string): Promise<TopicDB[]> => {
  const topicsCollection = collection(db, 'topics');
  const topicsQuery = query(topicsCollection, where('event_id', '==', eventId));
  const snapshot = await getDocs(topicsQuery);
  return snapshot.docs.map(
    doc =>
      ({
        ...doc.data(),
        id: doc.id,
        created_at: doc.data()?.created_at.toDate(),
        updated_at: doc.data()?.updated_at.toDate(),
      }) as TopicDB
  );
};

type CommentSheet = {
  CommentId: string;
  Comment: string;
  Relation: string;
  ParentComment: string;
  ParentCommentId: string;
  Argument: string;
  ArgumentId: string;
  Event: string;
};

type CommentRow = {
  [key: string]: string | number | boolean | null;
};

function readCommentSheet(filePath: string): CommentSheet[] {
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

  const worksheet = workbook.Sheets['Comments'];
  if (!worksheet) {
    throw new Error('Sheet "Comments" not found in the Excel file');
  }

  const rawData: (string | number | null)[][] = XLSX.utils.sheet_to_json(
    worksheet,
    {
      header: 1,
      defval: null,
    }
  );

  const [headers, ...rows] = rawData;

  const data: CommentRow[] = rows.map(row =>
    (headers as string[]).reduce((acc, header, idx) => {
      acc[header] = row[idx] ?? null;
      return acc;
    }, {} as CommentRow)
  );

  // filter empty rows
  const filteredData = data.filter(
    row =>
      row['CommentId'] !== null &&
      row['CommentId'] !== '' &&
      row['Comment'] !== null &&
      row['Comment'] !== ''
  );

  const commentSheets: CommentSheet[] = filteredData.map(row => ({
    CommentId: row['CommentId'] as string,
    Comment: row['Comment'] as string,
    Relation: row['Relation'] as string,
    ParentComment: row['ParentComment'] as string,
    ParentCommentId: row['ParentCommentId'] as string,
    Argument: row['Argument'] as string,
    ArgumentId: row['ArgumentId'] as string,
    Event: row['Event'] as string,
  }));

  return commentSheets;
}

const mapParentCommentID = (
  commentSheets: CommentSheet[]
): Record<string, string> => {
  const parentCommentMap: Record<string, string> = {};
  commentSheets.forEach(comment => {
    if (comment.ParentCommentId && comment.ParentCommentId !== '') {
      parentCommentMap[comment.CommentId] = comment.ParentCommentId;
    }
  });
  return parentCommentMap;
};

const getCommentParentsStack = (
  mapComment: Record<string, string>,
  commentId: string
): string[] => {
  const stack: string[] = [];
  let currentId = commentId;
  while (currentId) {
    const nextId = mapComment[currentId];
    if (nextId === undefined || nextId === null) {
      break;
    }
    stack.push(mapComment[currentId]);
    currentId = mapComment[currentId];
  }

  return stack.filter(id => id.trim() !== '').reverse();
};

const findTopicIDFromRefID = (
  refID: string,
  topics: TopicDB[]
): string | null => {
  const topic = topics.find(t => t.ref_id === refID);
  return topic ? topic.id : null;
};

const convertToCommentView = (relation: string): CommentView => {
  switch (relation) {
    case 'เห็นด้วย':
      return CommentView.AGREE;
    case 'เห็นด้วยบางส่วน':
      return CommentView.PARTIAL_AGREE;
    case 'ไม่เห็นด้วย':
      return CommentView.DISAGREE;
    default:
      throw new Error(`Unknown relation: ${relation}`);
  }
};

const sortAndInsertComments = async (
  comments: CreateCommentDBPayload[]
): Promise<void> => {
  const mapCommentFirestoreID: Record<string, string> = {};
  const commentsCollection = collection(db, 'comments');
  // Sort comments so that those with fewer parent_comment_ids come first
  comments.sort((a, b) => {
    const aParents = a.parent_comment_ids?.length ?? 0;
    const bParents = b.parent_comment_ids?.length ?? 0;
    return aParents - bParents;
  });

  //   Insert comments in sorted order (example, actual insert logic not shown)
  for (const comment of comments) {
    if (comment.parent_comment_ids.length !== 0) {
      const newCommentParentIDs = comment.parent_comment_ids.map(
        refId => mapCommentFirestoreID[refId]
      );
      comment.parent_comment_ids = newCommentParentIDs;
    }
    try {
      const docRef = await addDoc(commentsCollection, comment);
      mapCommentFirestoreID[comment.ref_id || ''] = docRef.id;
      console.log(
        `Inserted comment with ref_id: ${comment.ref_id}, id: ${docRef.id}`
      );
    } catch (err) {
      console.error(
        `Error inserting comment with ref_id ${comment.ref_id}:`,
        err
      );
    }
  }
};

const convertToCommentDB = (
  commentSheet: CommentSheet,
  topics: TopicDB[],
  events: DreamConEventDB[],
  mapCommentParentID: Record<string, string>
): CreateCommentDBPayload => {
  const event = events.find(e => e.display_name === commentSheet.Event);
  if (!event) {
    throw new Error(`Event not found for display name: ${commentSheet.Event}`);
  }

  const topicID = findTopicIDFromRefID(commentSheet.ArgumentId, topics);
  if (!topicID) {
    throw new Error(
      `Topic not found for ArgumentId: ${commentSheet.ArgumentId}`
    );
  }

  const parentCommentIDs = getCommentParentsStack(
    mapCommentParentID,
    commentSheet.CommentId
  );

  return {
    comment_view: convertToCommentView(commentSheet.Relation),
    ref_id: commentSheet.CommentId,
    reason: commentSheet.Comment || '',
    parent_comment_ids: parentCommentIDs, // this is still not an id from firestore
    parent_topic_id: topicID,
    event_id: event.id,
    created_at: new Date(),
    updated_at: new Date(),
    notified_at: new Date(),
  };
};

const main = async () => {
  const events = await getEventsByDisplayName(newEventDisplays);
  const topics: TopicDB[] = [];
  for (const event of events) {
    const eventTopics = await getTopicsByEventId(event.id);
    topics.push(...eventTopics);
  }
  const commentSheets = readCommentSheet(
    'migration/[Dream Con] Argument Mastersheet.xlsx'
  );
  const mapCommentParentID = mapParentCommentID(commentSheets);
  const comments: CreateCommentDBPayload[] = commentSheets.map(commentSheet =>
    convertToCommentDB(commentSheet, topics, events, mapCommentParentID)
  );
  await sortAndInsertComments(comments);
  process.exit(0);
};

main().catch(err => {
  console.error('Error in migration script:', err);
  process.exit(1);
});
