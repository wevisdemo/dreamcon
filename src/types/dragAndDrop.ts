import { Topic, TopicDB } from "./topic";
import { Comment } from "./comment";

export interface DraggableCommentProps {
  comment: Comment;
  previousComment: Comment | null;
  nextComment: Comment | null;
  level: number;
  isLastChildOfParent?: boolean;
  parent: Topic | Comment;
}

export type DroppableData =
  | DroppableDataTopic
  | DroppableDataComment
  | DroppableConvertToTopic;

export interface DroppableDataTopic {
  type: "topic";
  topic: Topic;
}

export interface DroppableDataComment {
  type: "comment";
  comment: Comment;
}

export interface DroppableConvertToTopic {
  type: "convert-to-topic";
}

export interface MoveCommentEvent {
  comment: Comment;
  droppableData: DroppableData;
  initialTopic?: TopicDB;
}
