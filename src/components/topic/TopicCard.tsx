import { useEffect, useState } from "react";
import { CommentView } from "../../types/comment";
import { Topic } from "../../types/topic";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";

interface PropTypes {
  topic: Topic;
  onAddComment: (commentView: CommentView, reason: string) => void;
  onChangeTopicTitle: (title: string) => void;
}

export default function TopicCard(props: PropTypes) {
  const [topicTitle, setTopicTitle] = useState<string>(props.topic.title);
  const [commentView, setCommentView] = useState<null | CommentView>(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [isEditingTopicTitle, setIsEditingTopicTitle] = useState(false);

  useEffect(() => {
    resetNewCommentText();
  }, [props.topic]);

  const handleSelectCommentView = (selectedView: CommentView) => {
    if (commentView === selectedView) {
      setCommentView(null);
      return;
    }
    setCommentView(selectedView);
  };

  const resetNewCommentText = () => {
    setCommentView(null);
    setNewCommentText("");
  };

  const handlerSubmitTopicTitle = () => {
    props.onChangeTopicTitle(topicTitle);
    resetEditTopic();
  };

  const resetEditTopic = () => {
    setTopicTitle(props.topic.title);
    setIsEditingTopicTitle(false);
  };

  const handleAddComment = () => {
    if (newCommentText.trim().length > 0 && commentView !== null) {
      props.onAddComment(commentView, newCommentText);
    }
    resetNewCommentText();
  };

  const canSubmit = () => {
    return newCommentText.trim().length > 0 && commentView !== null;
  };

  return (
    <div className="w-full p-[16px] bg-white rounded-[16px] shadow-[0px 4px 16px rgba(0, 0, 0, 0.1)] flex flex-col gap-[10px]">
      <div className="flex justify-between items-start">
        <div className="badge px-[8px] py-[4px] rounded-[48px] bg-accent text-white w-fit">
          สสร.
        </div>
        <img
          className="w-[18px] h-[18px] hover:cursor-pointer"
          src="/icon/menu.svg"
          alt="menu-icon"
        />
      </div>
      <div className="relative w-full">
        {isEditingTopicTitle ? (
          <>
            <TextareaAutosize
              id="topic-title"
              className="w-full p-[10px] wv-ibmplex text-[20px] wv-bold resize-none overflow-hidden"
              value={topicTitle}
              onChange={(e) => {
                setTopicTitle(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handlerSubmitTopicTitle();
                }
              }}
              autoFocus
              maxLength={140}
            />
            <span className="absolute bottom-[10px] right-[10px]  text-[10px] text-gray5">
              {topicTitle.length}/140
            </span>
          </>
        ) : (
          <h2
            className="p-[10px] wv-ibmplex text-[20px] wv-bold"
            onClick={() => setIsEditingTopicTitle(true)}
          >
            {props.topic.title}
          </h2>
        )}
      </div>

      <div className="flex gap-[8px]">
        <button
          className={`py-[10px] ${
            commentView === CommentView.AGREE
              ? "bg-lightGreen"
              : "bg-lightGreen/25"
          } hover:bg-lightGreen border-solid border-[1px] border-lightGreen rounded-[48px] w-full`}
          onClick={() => handleSelectCommentView(CommentView.AGREE)}
        >
          เห็นด้วย
        </button>
        <button
          className={`py-[10px] ${
            commentView === CommentView.PARTIAL_AGREE
              ? "bg-lightYellow"
              : "bg-lightYellow/25"
          } hover:bg-lightYellow border-solid border-[1px] border-lightYellow rounded-[48px] w-full`}
          onClick={() => handleSelectCommentView(CommentView.PARTIAL_AGREE)}
        >
          เห็นด้วยบ้าง
        </button>
        <button
          className={`py-[10px] ${
            commentView === CommentView.DISAGREE
              ? "bg-lightRed"
              : "bg-lightRed/25"
          } hover:bg-lightRed border-solid border-[1px] border-lightRed rounded-[48px] w-full
          `}
          onClick={() => handleSelectCommentView(CommentView.DISAGREE)}
        >
          ไม่เห็นด้วย
        </button>
      </div>
      {commentView && (
        <div className="relative flex">
          <textarea
            className="w-full h-full p-[10px] text-[13px] bg-gray1 border-[1px] border-gray3 rounded-[4px] resize-none min-h-[52px] focus:outline-none "
            name="add-comment-in-topic-card"
            id="add-comment-in-topic-card"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
            placeholder="เพราะว่า...(140ตัวอักษร)"
            maxLength={140}
          />
          {canSubmit() && (
            <img
              className="w-[18px] h-[18px] absolute bottom-[10px] right-[10px]"
              src="/icon/upload.svg"
              alt="upload-icon"
            />
          )}
        </div>
      )}
    </div>
  );
}
