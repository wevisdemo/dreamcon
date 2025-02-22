import React, { useState } from "react";
import TopicCard from "../components/topic/TopicCard";
import CommentWrapper from "../components/topic/CommentWrapper";
import { mockComments1, mockComments2, mockComments3 } from "../data/comment";

export default function Topic() {
  const comments = useState([{ name: "John Doe", comment: "I agree with" }]);
  return (
    <div className="bg-[#6EB7FE] min-h-screen min-w-screen flex flex-col items-center ">
      <div className="max-w-[920px]">
        <div className="header-section relative overflow-hidden flex justify-end">
          <div className="max-w-[892px] flex justify-end z-10">
            <TopicCard />
          </div>
          <div className="absolute w-[50%] left-0 top-[50%] rounded-[16px] border-solid border-[2px] border-blue3 h-full"></div>
        </div>
        <div className="comment-section mt-[10px]">
          <p className="text-[16px] wv-bold wv-ibmplex mt-[24px]">
            {comments.length} ความคิดเห็น
          </p>
          <div className="comment-section-body flex flex-col gap-[24px]">
            <div className="view-wrapper mt-[16px]">
              <div className="bg-lightGreen px-[10px] py-[4px] w-fit rounded-[16px] text[13px]">
                {mockComments1.length} เห็นด้วย
              </div>
              <CommentWrapper
                comments={mockComments1}
                isFirstLevel
                isLastChildOfParent
              />
            </div>
            <div className="view-wrapper">
              <div className="bg-lightYellow px-[10px] py-[4px] w-fit rounded-[16px] text[13px]">
                {mockComments2.length} เห็นด้วยบางส่วน
              </div>
              <CommentWrapper
                comments={mockComments2}
                isFirstLevel
                isLastChildOfParent
              />
            </div>
            {/* section */}
            <div className="view-wrapper">
              <div className="bg-lightRed px-[10px] py-[4px] w-fit rounded-[16px] text[13px]">
                {mockComments3.length} ไม่เห็นด้วย
              </div>
              <CommentWrapper
                comments={mockComments3}
                isFirstLevel
                isLastChildOfParent
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
