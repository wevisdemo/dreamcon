import { Comment } from '../../types/comment';
import CommentAndChildren from './CommentAndChildren';

interface PropTypes {
  comments: Comment[];
  level: number;
}

export default function CommentWrapper(props: PropTypes) {
  return (
    <div className="comment-wrapper mt-2.5 flex flex-col gap-4">
      {props.comments.map(comment => (
        <CommentAndChildren
          key={comment.id}
          comment={comment}
          level={props.level}
        />
      ))}
    </div>
  );
}
