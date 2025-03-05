import { Topic } from "./topic";
import { Comment } from "./comment";

export interface DraggableCommentProps {
  comment: Comment;
  previousComment: Comment | null;
  nextComment: Comment | null;
  level: number;
  isLastChildOfParent?: boolean;
  parent: Topic | Comment;
}
