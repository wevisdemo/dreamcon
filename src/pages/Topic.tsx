import React, { useState } from "react";
import TopicCard from "../components/topic/TopicCard";

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
                1 เห็นด้วย
              </div>
              <div className="parent-wrapper flex flex-col gap-[16px] mt-[10px]">
                <div className="comment-wrapper flex flex-col">
                  <div>
                    <div className=" p-[10px] bg-white rounded-[16px] text[13px] flex items-center">
                      <div className="w-[12px] h-[12px] rounded-full bg-lightGreen mr-[10px]"></div>
                      <span>
                        เพราะ..การเป็นสมาชิกพรรคการเมืองแสดงถึงการต้องการมีส่วนร่วมทางการเมือง
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="view-wrapper">
              <div className="bg-lightYellow px-[10px] py-[4px] w-fit rounded-[16px] text[13px]">
                2 เห็นด้วยบางส่วน
              </div>
              <div className="parent-wrapper flex flex-col gap-[16px] mt-[10px]">
                <div className="comment-wrapper flex flex-col">
                  <div>
                    {/* has child */}
                    <div className="p-[10px] bg-white rounded-l-[16px] rounded-tr-[16px] text[13px] flex items-center">
                      <div className="w-[12px] h-[12px] rounded-full bg-lightGreen mr-[10px]"></div>
                      <span>
                        เพราะ..สสร จากพรรคการเมืองไม่ผิด แต่ควร declare
                        อย่างชัดเจนว่าผู้สมัครมีจุดยืนทางการเมือง/จุดยืนเรื่องการแก้
                        รธน อย่างไร
                      </span>
                    </div>
                    <div className="ml-[20px] p-[10px] bg-white rounded-b-[16px] text[13px] flex items-center">
                      <div className="w-[12px] h-[12px] rounded-full bg-lightGreen mr-[10px]"></div>
                      <span>
                        เพราะ..ผู้เลือกต้องรู้ว่าคนที่เราเลือกเป็นใคร จะทำอะไร
                      </span>
                    </div>
                  </div>
                </div>
                <div className="comment-wrapper flex flex-col">
                  <div className=" p-[10px] bg-white rounded-[16px] text[13px] flex items-center">
                    <div className="w-[12px] h-[12px] rounded-full bg-lightYellow mr-[10px]"></div>
                    <span>เพราะ..</span>
                  </div>
                </div>
              </div>
            </div>
            {/* section */}
            <div className="view-wrapper">
              <div className="bg-lightRed px-[10px] py-[4px] w-fit rounded-[16px] text[13px]">
                3 ไม่เห็นด้วย
              </div>
              <div className="parent-wrapper flex flex-col gap-[16px] mt-[10px]">
                <div className="comment-wrapper flex flex-col">
                  <div>
                    {/* has child */}
                    <div className="p-[10px] bg-white rounded-l-[16px] rounded-tr-[16px] text[13px] flex items-center">
                      <div className="w-[12px] h-[12px] rounded-full bg-lightRed mr-[10px]"></div>
                      <span>
                        เพราะ..ผู้สมัคร สสร. จำเป็นต้องแยกขาดจาก พรรคการเมือง
                        เพื่อให้สะท้อนความเป็น อิสร
                      </span>
                    </div>
                    {/* child 1 and has sibling (not rounded)*/}
                    <div className="ml-[20px] p-[10px] bg-white text[13px] flex items-center">
                      <div className="w-[12px] h-[12px] rounded-full bg-lightGreen mr-[10px]"></div>
                      <span>
                        จะเป็นตัวแทนประชาชนแล้ว
                        ไม่จำเป็นต้องเป็นสมาชิกพรรคการเมือง{" "}
                      </span>
                    </div>
                    {/* child 1 and has child 2 (not rounded right)*/}
                    <div className="ml-[20px] p-[10px] bg-white text[13px] rounded-bl-[16px] flex items-center">
                      <div className="w-[12px] h-[12px] rounded-full bg-lightYellow mr-[10px]"></div>
                      <span>
                        สามารถเป็นสมาชิกพรรคได้ แต่ต้องเว้น <br />
                        วรรคจากการดำรงตำแหน่งทางการ <br />
                        เมืองมาไม่น้อยกว่า 5 ปี
                      </span>
                    </div>
                    {/* child 2 and last but has child 1 next (not rounded bottom-right)*/}
                    <div className="ml-[40px] p-[10px] bg-white text[13px] rounded-bl-[16px] flex items-center">
                      <div className="w-[12px] h-[12px] rounded-full bg-lightRed mr-[10px]"></div>
                      <span>
                        ไม่ต้องเว้นวรรคก็ได้ แค่ต้องลาออก ณ วันที่สมัคร
                      </span>
                    </div>
                    {/* child 1, previous has child, not last (round top-left)*/}
                    {/* !!! rounded bottom-right is only last child of parent comment */}
                    {/* !!! rounded bottom-left if has child and last child in that level */}
                    {/* !!! rounded top-left if previous has children */}
                    {/* !!! rounded top-right if parent*/}
                    <div className="ml-[20px] p-[10px] bg-white text[13px] rounded-tl-[16px] flex items-center">
                      <div className="w-[12px] h-[12px] rounded-full bg-lightYellow mr-[10px]"></div>
                      <span>
                        คิดว่าควรออกแบบกลไกไม่ให้เห็นการเสนอจากพรรคการเมืองแบบโจ่งแจ้งเพราะจะเป็นการสร้างความขัดแย้งทาง
                        ความเห็น/สนามการเมือง
                      </span>
                    </div>
                    <div className="ml-[20px] p-[10px] bg-white text[13px] rounded-bl-[16px] rounded-br-[16px] flex items-center">
                      <div className="w-[12px] h-[12px] rounded-full bg-lightYellow mr-[10px]"></div>
                      <span>
                        สสร.ไม่ควรยึดโยงกับพรรคการเมืองหรือกลุ่มการเมืองอื่นๆ
                        เช่น สว.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-[10px] bg-white rounded-tl-[16px] rounded-tr-[16px] rounded-bl-[16px] rounded-br-[16px] text[13px] flex items-center">
                  <div className="w-[12px] h-[12px] rounded-full bg-lightRed mr-[10px]"></div>
                  <span>
                    เพราะ..ไม่ควร เพราะจะไม่ต่างกับการให้ สส.ร่าง
                    <br />
                    รัฐธรรมนูญ
                  </span>
                </div>

                <div className="p-[10px] bg-white rounded-tl-[16px] rounded-tr-[16px] rounded-bl-[16px] rounded-br-[16px] text[13px] flex items-center">
                  <div className="w-[12px] h-[12px] rounded-full bg-lightRed mr-[10px]"></div>
                  <span>
                    เพราะ..การเป็นสมาชิกพรรคการเมืองแสดงถึงการต้องการมีส่วนร่วมทางการเมือง
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
