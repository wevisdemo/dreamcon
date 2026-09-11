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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetch once on mount
  }, []);

  return (
    <DefaultLayout>
      <div className="w-full">
        <section
          id="introduce"
          className="w-full bg-blue-2 flex justify-center m-auto p-6"
        >
          <div className="w-full max-w-240 flex flex-col items-center gap-6">
            <div className="w-full flex flex-col md:gap-48 p-4 relative">
              <img
                src="/logo/dream-con-logo-white.svg"
                alt="dream-con-logo-white"
                className="w-full max-h-40 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />
              <div className="flex justify-between w-full">
                <img
                  src="/icon/cloud-2.svg"
                  alt="cloud-2"
                  className="md:w-48"
                />
                <img
                  src="/icon/cloud-6.svg"
                  alt="cloud-6"
                  className="md:w-48"
                />
              </div>
              <div className="flex justify-between w-full">
                <img
                  src="/icon/cloud-5.svg"
                  alt="cloud-5"
                  className="md:w-48 rotate-y-180"
                />
                <img
                  src="/icon/cloud-4.svg"
                  alt="cloud-4"
                  className="md:w-48 rotate-y-180"
                />
              </div>
            </div>
            <h3 className="heading-3 text-center wv-ibmplex font-semibold text-blue-7">
              พาความฝันของพวกเรา มาสร้างอนาคตประเทศไทยไปด้วยกัน
            </h3>
            <img
              src="/landing/concept.svg"
              alt="concept"
              className="w-full max-h-28.5"
            />
            <img
              src="/icon/arrow-down-black.svg"
              alt="icon-arrow-down-black"
              className="h-6 w-6"
            />
            <p className="text-b2 text-center">
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
              <img src="/icon/cloud-4.svg" alt="cloud-4" className="md:w-48" />
              <img src="/icon/cloud-5.svg" alt="cloud-5" className="md:w-48" />
            </div>
            <div className="w-full flex flex-col items-center justify-between gap-4">
              <h3 className="heading-3 wv-ibmplex font-bold">กระบวนการทำงาน</h3>
              <div className="w-full flex justify-center relative">
                <div className="w-[63.75%] max-w-153 h-0.5 bg-blue-6 relative">
                  <div className="absolute flex justify-between w-full items-center -top-1.5">
                    <div className="size-3 bg-blue-6 rounded-full"></div>
                    <div className="size-3 bg-blue-6 rounded-full"></div>
                    <div className="size-4 bg-blue-6 rounded-full"></div>
                    <div className="size-3 bg-blue-2 border-2 border-blue-6 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="flex w-full max-w-207.5 justify-between text-center">
                <div className="flex flex-col gap-1">
                  <p className="wv-ibmplex wv-bold text-b2">รวบรวมข้อคิดเห็น</p>
                  <p>จากการทำแบบสอบถามทางออนไลน์</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="wv-ibmplex wv-bold text-b2">
                    ริเริ่มข้อถกเถียง
                  </p>
                  <p>จัดวงสนทนากับกลุ่มต่างๆ</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="wv-ibmplex wv-bold text-b2">
                    เรียบเรียงข้อถกเถียง
                  </p>
                  <p>จัดระบบเป็นโครงสร้างข้อมูล</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="wv-ibmplex wv-bold text-b2">รายงานข้อสรุป</p>
                  <p>สรุปผลเพื่อส่งต่อให้ สสร. ในอนาคต</p>
                </div>
              </div>
            </div>
            <a className="!underline text-blue-7 wv-ibmplex" href="/about">
              อ่านที่มาของโครงการเพิ่มเติม
            </a>
          </div>
        </section>
        <div className="bg-blue-2 h-10 flex items-end">
          <div className="bg-[url('/icon/ellipse.svg')] bg-repeat w-full h-4" />
        </div>
        <section className="bg-green-3 px-6 py-12 md:py-16" id="headway">
          <div className="w-full max-w-240 m-auto flex flex-col ">
            <h2 className="heading-2 wv-ibmplex font-semibold ">
              ความคืบหน้าตอนนี้
            </h2>
            <p className="text-blue-7">
              อัปเดตล่าสุดวันที่ วันที่ 16 ก.ย. 2568
            </p>
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 mt-6">
              <img
                className="w-full max-w-115"
                src="/landing/previous-event.jpg"
                alt="previous-event"
              />
              <p className="text-b2">
                เราได้พัฒนาแพลตฟอร์มที่พร้อมให้ผู้จัดกระบวนการนำไปใช้ในวงสนทนาต่างๆ
                ที่หลากหลายเสร็จสมบูรณ์แล้ว
                เพื่อให้สามารถรวบรวมข้อคิดเห็นและข้อเสนอแนะจากคนกลุ่มต่างๆ
                มาไว้ที่เดียวกัน
              </p>
            </div>
          </div>
        </section>
        <section className="bg-blue-2 px-6 py-12" id="influence">
          <div className="w-full max-w-240 m-auto flex flex-col gap-6">
            <h2 className="heading-2 wv-ibmplex font-semibold ">
              มามีส่วนร่วมกัน!
            </h2>
            <p className="text-b2">
              พอได้ผลลัพธ์ข้อคิดเห็นจากประชาชนในขั้นตอนแรกแล้ว
              เราได้นำหัวข้อเหล่านี้มาตั้งเป็นหัวข้อหลักของข้อถกเถียง
              ทั้งแบบออนไลน์ในเว็บไซต์นี้
              หรือวงพูดคุยที่จัดโดยผู้จัดกระบวนการภายนอก ทั้งสื่อมวลชน
              นักวิชาการ และองค์กรภาคประชาสังคม
            </p>
            <p className="text-b2">
              ลองดูประเด็นตัวอย่างด้านล่างนี้ หากคุณสนใจ สามารถร่วมแสดงความเห็น
              และยังมีอีกหลายเรื่องให้สำรวจหรือสร้างประเด็นใหม่ได้
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topics.map(topic => (
                <div key={topic.id}>
                  <TopicSummary
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
              className="flex justify-between items-center gap-2 px-4 py-2.5 bg-blue-6 w-fit rounded-full m-auto"
              href="/topics"
            >
              <span className="text-button wv-ibmplex font-semibold text-white">
                ดูประเด็นทั้งหมด
              </span>
              <img
                className="w-6 h-6"
                src="/icon/arrow-forward.svg"
                alt="arrow-forward"
              />
            </a>
          </div>
        </section>
        <div className="bg-white h-10 flex relative pb-6">
          <div className="bg-[url('/icon/ellipse-3.svg')] bg-repeat w-full h-4 absolute -top-0.5" />
        </div>
        <section className="py-12">
          <div className="flex justify-between max-w-240 w-full m-auto space-x-6">
            <div className="flex flex-col w-1/2">
              <span className="text-blue-7 text-b2 wv-bold">
                จะเกิดอะไรขึ้นต่อไป
              </span>
              <span className="text-b2">
                หากคุณอยากรู้ความคืบหน้าของโครงการว่าไปถึงไหน
                เราจะคอยส่งข่าวให้คุณรู้!
              </span>
            </div>
            <div className="flex w-1/2 items-start">
              <input
                className="w-full h-10 p-4 text-b3 border border-solid border-gray-3 rounded-full"
                type="text"
                name="email-enter"
                id="email-enter"
                placeholder="ใส่อีเมลของคุณ"
              />
              <button className="flex mx-auto w-fit py-2.5 px-13.5 items-center justify-center border-solid border rounded-full border-gray-2 bg-blue-6 wv-ibmplex wv-bold text-button text-white">
                ติดตาม
              </button>
            </div>
          </div>
        </section>
        <section className="bg-blue-6 py-12 px-6">
          <Footer />
        </section>
      </div>
    </DefaultLayout>
  );
}
