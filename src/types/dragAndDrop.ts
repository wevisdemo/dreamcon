import { Topic, TopicDB } from './topic';
import { Comment } from './comment';

export interface DraggableCommentProps {
  comment: Comment;
  level: number;
}

export type DroppableData =
  | DroppableDataTopic
  | DroppableDataComment
  | DroppableConvertToTopic;

export interface DroppableDataTopic {
  type: 'topic';
  topic: Topic;
}

export interface DroppableDataComment {
  type: 'comment';
  comment: Comment;
}

export interface DroppableConvertToTopic {
  type: 'convert-to-topic';
}

export interface MoveCommentEvent {
  comment: Comment;
  droppableData: DroppableData;
  initialTopic?: TopicDB;
}
