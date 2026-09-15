import { useContext, useEffect, useState } from 'react';
import ArrowForwardIcon from '@material-symbols/svg-700/rounded/arrow_forward.svg?react';
import KeyboardArrowDownIcon from '@material-symbols/svg-700/rounded/keyboard_arrow_down.svg?react';
import TopicSummary from '../components/allTopic/TopicSummary';
import Footer from '../components/layout/Footer';
import { useTopic } from '../hooks/useTopic';
import DefaultLayout from '../layouts/default';
import { StoreContext } from '../store';
import { Topic } from '../types/topic';

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
          className="m-auto flex w-full justify-center bg-blue-2 p-6"
        >
          <div className="flex w-full max-w-240 flex-col items-center gap-6">
            <div className="relative flex w-full flex-col p-4 md:gap-48">
              <img
                src="/logo/dream-con-logo-white.svg"
                alt="dream-con-logo-white"
                className="absolute top-1/2 left-1/2 max-h-40 w-full -translate-x-1/2 -translate-y-1/2"
              />
              <div className="flex w-full justify-between">
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
              <div className="flex w-full justify-between">
                <img
                  src="/icon/cloud-5.svg"
                  alt="cloud-5"
                  className="rotate-y-180 md:w-48"
                />
                <img
                  src="/icon/cloud-4.svg"
                  alt="cloud-4"
                  className="rotate-y-180 md:w-48"
                />
              </div>
            </div>
            <h3 className="wv-ibmplex text-center heading-3 font-semibold text-blue-7">
              พาความฝันของพวกเรา มาสร้างอนาคตประเทศไทยไปด้วยกัน
            </h3>
            <img
              src="/landing/concept.svg"
              alt="concept"
              className="max-h-28.5 w-full"
            />
            <KeyboardArrowDownIcon
              aria-hidden
              className="h-6 w-6 text-gray-8"
            />
            <p className="text-center text-b2">
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
            <div className="flex w-full justify-between">
              <img src="/icon/cloud-4.svg" alt="cloud-4" className="md:w-48" />
              <img src="/icon/cloud-5.svg" alt="cloud-5" className="md:w-48" />
            </div>
            <div className="flex w-full flex-col items-center justify-between gap-4">
              <h3 className="wv-ibmplex heading-3 font-bold">กระบวนการทำงาน</h3>
              <div className="relative flex w-full justify-center">
                <div className="relative h-0.5 w-[63.75%] max-w-153 bg-blue-6">
                  <div className="absolute -top-1.5 flex w-full items-center justify-between">
                    <div className="size-3 rounded-full bg-blue-6"></div>
                    <div className="size-3 rounded-full bg-blue-6"></div>
                    <div className="size-4 rounded-full bg-blue-6"></div>
                    <div className="size-3 rounded-full border-2 border-blue-6 bg-blue-2"></div>
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
            <a className="wv-ibmplex text-blue-7 !underline" href="/about">
              อ่านที่มาของโครงการเพิ่มเติม
            </a>
          </div>
        </section>
        <div className="flex h-10 items-end bg-blue-2">
          <div className="h-4 w-full bg-[url('/icon/ellipse.svg')] bg-repeat" />
        </div>
        <section className="bg-green-3 px-6 py-12 md:py-16" id="headway">
          <div className="m-auto flex w-full max-w-240 flex-col">
            <h2 className="wv-ibmplex heading-2 font-semibold">
              ความคืบหน้าตอนนี้
            </h2>
            <p className="text-blue-7">
              อัปเดตล่าสุดวันที่ วันที่ 16 ก.ย. 2568
            </p>
            <div className="mt-6 flex flex-col gap-6 md:flex-row md:gap-10">
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
          <div className="m-auto flex w-full max-w-240 flex-col gap-6">
            <h2 className="wv-ibmplex heading-2 font-semibold">
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
              className="m-auto flex w-fit items-center justify-between gap-2 rounded-full bg-blue-6 px-4 py-2.5"
              href="/topics"
            >
              <span className="wv-ibmplex text-button font-semibold text-white">
                ดูประเด็นทั้งหมด
              </span>
              <ArrowForwardIcon className="h-6 w-6 text-white" aria-hidden />
            </a>
          </div>
        </section>
        <div className="relative flex h-10 bg-white pb-6">
          <div className="absolute -top-0.5 h-4 w-full bg-[url('/icon/ellipse-3.svg')] bg-repeat" />
        </div>
        <section className="py-12">
          <div className="m-auto flex w-full max-w-240 justify-between space-x-6">
            <div className="flex w-1/2 flex-col">
              <span className="wv-bold text-b2 text-blue-7">
                จะเกิดอะไรขึ้นต่อไป
              </span>
              <span className="text-b2">
                หากคุณอยากรู้ความคืบหน้าของโครงการว่าไปถึงไหน
                เราจะคอยส่งข่าวให้คุณรู้!
              </span>
            </div>
            <div className="flex w-1/2 items-start">
              <input
                className="h-10 w-full rounded-full border border-solid border-gray-3 p-4 text-b3"
                type="text"
                name="email-enter"
                id="email-enter"
                placeholder="ใส่อีเมลของคุณ"
              />
              <button className="wv-ibmplex wv-bold mx-auto flex w-fit items-center justify-center rounded-full border border-solid border-gray-2 bg-blue-6 px-13.5 py-2.5 text-button text-white">
                ติดตาม
              </button>
            </div>
          </div>
        </section>
        <section className="bg-blue-6 px-6 py-12">
          <Footer />
        </section>
      </div>
    </DefaultLayout>
  );
}
