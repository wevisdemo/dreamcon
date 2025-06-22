import { useContext, useEffect, useState } from 'react';
import { useTopic } from '../hooks/useTopic';
import TopicSummary from '../components/allTopic/TopicSummary';
import { Topic } from '../types/topic';
import DefaultLayout from '../layouts/default';
import Footer from '../components/Footer';
import { StoreContext } from '../store';

export default function LandingPage() {
  const { currentPage } = useContext(StoreContext);
  const { getTopicsByFilter } = useTopic();

  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const fetchedTopics = await getTopicsByFilter({
        limit: 3,
        orderBy: {
          direction: 'desc',
          field: 'created_at',
        },
      });
      setTopics(fetchedTopics);
    };

    currentPage.setValue('home');
    fetchTopics();
  }, []);

  return (
    <DefaultLayout>
      <div className="w-full">
        <section
          id="introduce"
          className="w-full bg-blue2 flex justify-center m-auto p-[24px]"
        >
          <div className="w-full max-w-[960px] flex flex-col items-center gap-[24px]">
            <div className="w-full flex flex-col md:gap-[192px] p-[16px] relative">
              <img
                src="/logo/dream-con-logo-white.svg"
                alt="dream-con-logo-white"
                className="w-full max-h-[160px] absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2"
              />
              <div className="flex justify-between w-full">
                <img
                  src="/icon/cloud-2.svg"
                  alt="cloud-2"
                  className="md:w-[192px]"
                />
                <img
                  src="/icon/cloud-6.svg"
                  alt="cloud-6"
                  className="md:w-[192px]"
                />
              </div>
              <div className="flex justify-between w-full">
                <img
                  src="/icon/cloud-5.svg"
                  alt="cloud-5"
                  className="md:w-[192px] rotate-y-180"
                />
                <img
                  src="/icon/cloud-4.svg"
                  alt="cloud-4"
                  className="md:w-[192px] rotate-y-180"
                />
              </div>
            </div>
            <h3 className="md:text-[31px] text-[24px] text-center wv-ibmplex font-semibold text-blue7">
              พาความฝันของพวกเรา มาสร้างอนาคตประเทศไทยไปด้วยกัน
            </h3>
            <img
              src="/landing/concept.svg"
              alt="concept"
              className="w-full max-h-[114px]"
            />
            <img
              src="/icon/arrow-down-black.svg"
              alt="icon-arrow-down-black"
              className="h-[24px] w-[24px]"
            />
            <p className="text-[16px] text-center">
              <span className="wv-bold">Dream Constitution</span>{' '}
              <span>
                โครงการรวบรวมความคิดเห็นของคนไทยเพื่อเป็นศูนย์รวมไอเดียในการร่างรัฐธรรมนูญฉบับประชาชน
              </span>
              <br />
              <span>
                เพราะรัฐธรรมนูญอาจฟังไกลตัวในบางครั้ง
                เราจึงอยากชวนทุกคนนำความคิดฝันที่หลากหลายมาวางไว้ให้กลายเป็นเรื่องราวเดียว
                แล้วส่งต่อให้ผู้มีหน้าที่ในการร่างรัฐธรรมนูญใหม่นำไปประกอบขึ้นเป็นร่างของประชาชนอย่างแท้จริง
              </span>
            </p>
            <div className="flex justify-between w-full">
              <img
                src="/icon/cloud-4.svg"
                alt="cloud-4"
                className="md:w-[192px]"
              />
              <img
                src="/icon/cloud-5.svg"
                alt="cloud-5"
                className="md:w-[192px]"
              />
            </div>
            <div className="w-full flex flex-col items-center justify-between gap-[16px]">
              <h3 className="text-[31px] wv-ibmplex font-bold">
                กระบวนการทำงาน
              </h3>
              <div className="w-full flex justify-center relative">
                <div className="w-[63.75%] max-w-[612px] h-[2px] bg-blue6 relative">
                  <div className="absolute flex justify-between w-full items-center top-[-6px]">
                    <div className="w-[16px] h-[16px] bg-blue6 rounded-full"></div>
                    <div className="w-[12px] h-[12px] bg-blue2 border-[2px] border-blue6 rounded-full"></div>
                    <div className="w-[12px] h-[12px] bg-blue2 border-[2px] border-blue6 rounded-full"></div>
                    <div className="w-[12px] h-[12px] bg-blue2 border-[2px] border-blue6 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="flex w-full max-w-[830px] justify-between text-center">
                <div className="flex flex-col gap-[4px]">
                  <p className="wv-ibmplex wv-bold text-[16px]">
                    รวบรวมข้อคิดเห็น
                  </p>
                  <p>จากการทำแบบสอบถามทางออนไลน์</p>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <p className="wv-ibmplex wv-bold text-[16px]">
                    ริเริ่มข้อถกเถียง
                  </p>
                  <p>จัดวงสนทนากับกลุ่มต่างๆ</p>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <p className="wv-ibmplex wv-bold text-[16px]">
                    เรียบเรียงข้อถกเถียง
                  </p>
                  <p>จัดระบบเป็นโครงสร้างข้อมูล</p>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <p className="wv-ibmplex wv-bold text-[16px]">
                    รายงานข้อสรุป
                  </p>
                  <p>สรุปผลเพื่อส่งต่อให้ สสร. ในอนาคต</p>
                </div>
              </div>
            </div>
            <a className="!underline text-blue7 wv-ibmplex" href="/about">
              อ่านที่มาของโครงการเพิ่มเติม
            </a>
          </div>
        </section>
        <div className="bg-[#BDE6FF] h-[40px] flex items-end">
          <div
            style={{ backgroundImage: "url('/icon/ellipse.svg')" }}
            className="bg-repeat w-full h-[16px]"
          />
        </div>
        <section
          className="bg-green3 px-[24px] py-[48px] md:py-[64px]"
          id="headway"
        >
          <div className="w-full max-w-[960px] m-auto flex flex-col ">
            <h2 className="text-[31px] md:text-[39px] wv-ibmplex font-semibold ">
              ความคืบหน้าตอนนี้
            </h2>
            <p className="text-blue7">
              อัปเดตล่าสุดวันที่ วันที่ 20 เม.ย. 2568
            </p>
            <div className="flex flex-col md:flex-row gap-[24px] md:gap-[40px] mt-[24px]">
              <img
                className="w-full max-w-[460px]"
                src="/landing/previous-event.jpg"
                alt="previous-event"
              />
              <p className="text-[16px]">
                เราได้พัฒนาแพลตฟอร์มที่พร้อมให้ผู้จัดกระบวนการนำไปใช้ในวงสนทนาต่างๆ
                ที่หลากหลายเสร็จสมบูรณ์แล้ว
                เพื่อให้สามารถรวบรวมข้อคิดเห็นและข้อเสนอแนะจากคนกลุ่มต่างๆ
                มาไว้ที่เดียวกัน
              </p>
            </div>
          </div>
        </section>
        <section className="bg-blue2 px-[24px] py-[48px]" id="influence">
          <div className="w-full max-w-[960px] m-auto flex flex-col gap-[24px]">
            <h2 className="text-[31px] md:text-[39px] wv-ibmplex font-semibold ">
              มามีส่วนร่วมกัน!
            </h2>
            <p className="text-[16px]">
              พอได้ผลลัพธ์ข้อคิดเห็นจากประชาชนในขั้นตอนแรกแล้ว
              เราได้นำหัวข้อเหล่านี้มาตั้งเป็นหัวข้อหลักของข้อถกเถียง
              ทั้งแบบออนไลน์ในเว็บไซต์นี้
              หรือวงพูดคุยที่จัดโดยผู้จัดกระบวนการภายนอก ทั้งสื่อมวลชน
              นักวิชาการ และองค์กรภาคประชาสังคม
            </p>
            <p className="text-[16px]">
              ลองดูประเด็นตัวอย่างด้านล่างนี้ หากคุณสนใจ สามารถร่วมแสดงความเห็น
              และยังมีอีกหลายเรื่องให้สำรวจหรือสร้างประเด็นใหม่ได้
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
              {topics.map((topic, index) => (
                <div>
                  <TopicSummary
                    key={'topic-' + index}
                    topic={topic}
                    isSelected={false}
                    onClick={() => {
                      window.location.href = `/topics/${topic.id}`;
                    }}
                    onAddComment={() => {}}
                    isOver={false}
                    isPinned={false}
                    hideSideScreenIcon
                    isReadOnly
                  />
                </div>
              ))}
            </div>
            <a
              className="flex justify-between items-center gap-[8px] px-[16px] py-[10px] bg-blue6 w-fit rounded-[48px] m-auto"
              href="/topics"
            >
              <span className="text-[16px] wv-ibmplex font-semibold text-white">
                ดูประเด็นทั้งหมด
              </span>
              <img
                className="w-[24px] h-[24px]"
                src="/icon/arrow-forward.svg"
                alt="arrow-forward"
              />
            </a>
          </div>
        </section>
        <div className="bg-[#FFFFFF] h-[40px] flex relative pb-[24px]">
          <div
            style={{ backgroundImage: "url('/icon/ellipse-3.svg')" }}
            className="bg-repeat w-full h-[16px] absolute top-[-2px]"
          />
        </div>
        <section className="py-[48px]">
          <div className="flex justify-between max-w-[960px] w-full m-auto space-x-[24px]">
            <div className="flex flex-col w-[50%]">
              <span className="text-[#1C4CD3] text-[16px] wv-bold">
                จะเกิดอะไรขึ้นต่อไป
              </span>
              <span className="text-[16px]">
                หากคุณอยากรู้ความคืบหน้าของโครงการว่าไปถึงไหน
                เราจะคอยส่งข่าวให้คุณรู้!
              </span>
            </div>
            <div className="flex w-[50%] items-start">
              <input
                className="w-full h-[40px] p-[16px] text-[13px] border-[1px] border-solid border-[#D4D4D4] rounded-[48px]"
                type="text"
                name="email-enter"
                id="email-enter"
                placeholder="ใส่อีเมลของคุณ"
              />
              <button className="flex mx-auto w-fit py-[10px] px-[54px] items-center justify-center border-solid border-[1px] rounded-[48px] border-[#E8E8E8] bg-[#2579F5] wv-ibmplex wv-bold text-[16px] leading-[20px] text-[#FFFFFF]">
                ติดตาม
              </button>
            </div>
          </div>
        </section>
        <section className="bg-[#2579F5] py-[48px] px-[24px]">
          <Footer />
        </section>
      </div>
    </DefaultLayout>
  );
}
