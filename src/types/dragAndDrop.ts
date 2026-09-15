import { Comment } from './comment';
import { Topic, TopicDB } from './topic';

export interface DraggableCommentProps {
  comment: Comment;
  level: number;
}

export type DroppableData =
  DroppableDataTopic | DroppableDataComment | DroppableConvertToTopic;

interface DroppableDataTopic {
  type: 'topic';
  topic: Topic;
}

interface DroppableDataComment {
  type: 'comment';
  comment: Comment;
}

interface DroppableConvertToTopic {
  type: 'convert-to-topic';
}

export interface MoveCommentEvent {
  comment: Comment;
  droppableData: DroppableData;
  initialTopic?: TopicDB;
}
