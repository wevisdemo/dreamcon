import { createFileRoute } from '@tanstack/react-router';
import dataStructure from '../assets/data-structure-white.png';
import logo from '../assets/logo-stacked.svg';
import { ButtonLink } from '../components/button';
import { CloudGraphic } from '../components/landing/cloud-graphic';
import { StatCounter } from '../components/landing/stat-counter';
import { EVENT_DATE_FORMAT } from '../constants/event';
import { getConversations, getEvents } from '../data/server-functions';
import { ArrowUpIcon } from '../icons/arrow-up';

export const Route = createFileRoute('/')({
  loader: async () => {
    const [events, conversations] = await Promise.all([
      getEvents(),
      getConversations(),
    ]);
    return {
      topicCount: conversations.length,
      eventCount: events.length,
      latestEventDate: new Date(
        Math.max(...events.map(({ date }) => date.getTime()))
      ),
    };
  },
  component: function Home() {
    const { topicCount, eventCount, latestEventDate } = Route.useLoaderData();

    return (
      <div className="flex flex-1 flex-col bg-blue-7">
        <section className="flex min-h-[calc(100dvh-3rem)] flex-col px-1.25 md:min-h-[calc(100dvh-4rem)] md:px-2.5">
          <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-[30px] bg-blue-3 px-7.5 py-10 md:px-15 md:py-20">
            <CloudGraphic />
            <div className="relative flex w-full max-w-212 flex-col items-center gap-5 text-center">
              <h1>
                <img src={logo} alt="Dream Con" className="w-60 md:w-md" />
              </h1>
              <p className="text-h8 font-bold text-blue-7">
                Conversation for Constitution
              </p>
              <p className="text-b4">
                พื้นที่รวบรวมบทสนทนาเกี่ยวกับ “รัฐธรรมนูญในฝัน” จากผู้คนหลากหลาย
                <br />
                เพื่อเป็นฐานข้อมูลส่งต่อให้ผู้เกี่ยวข้อง นำเสียงของประชาชนไปใช้อย่างมีความหมาย
              </p>
              <div className="flex w-full items-center justify-center gap-2.5">
                <StatCounter value={topicCount} label="ข้อถกเถียง" />
                <span className="text-b4">จาก</span>
                <StatCounter value={eventCount} label="วงสนทนา" />
              </div>
              <p className="text-b7 text-gray-7">
                วงสนทนาล่าสุด: {EVENT_DATE_FORMAT.format(latestEventDate)}
              </p>
              <div className="flex w-full flex-col gap-1.25 md:w-auto md:flex-row">
                <ButtonLink
                  to="/dashboard"
                  variant="primary-blue"
                  icon={<ArrowUpIcon className="rotate-90" />}
                >
                  สำรวจข้อถกเถียง
                </ButtonLink>
                <ButtonLink
                  to="/"
                  hash="project"
                  variant="secondary"
                  icon={<ArrowUpIcon className="rotate-180" />}
                >
                  เข้าใจโครงการ
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
        <section
          id="project"
          className="flex flex-col gap-1 px-1 pt-1 md:scroll-mt-14 md:flex-row md:gap-2.5 md:px-2.5 md:pt-2.5"
        >
          <div className="flex items-center justify-center overflow-hidden rounded-[30px] bg-white md:min-w-85 md:flex-1">
            <img
              src={dataStructure}
              alt="แผนภาพโครงสร้างข้อมูล ข้อถกเถียงแตกออกเป็นความคิดเห็นที่เห็นด้วย เห็นด้วยบางส่วน และไม่เห็นด้วย ซึ่งแต่ละความคิดเห็นมีความคิดเห็นต่อยอดได้"
              width={805}
              height={579}
              className="h-auto w-full max-w-85"
            />
          </div>
          <div className="flex flex-col items-center gap-3.75 rounded-[30px] bg-green-3 p-7.5 text-center md:flex-2 md:p-15">
            <h2 className="text-h7 font-bold">
              ความหลากหลายของมุมมอง คือหัวใจสำคัญของโครงการนี้
            </h2>
            <p className="max-w-212 text-b4">
              เรานำ 'ข้อถกเถียง'
              จากหลากหลายวงสนทนามาเรียบเรียงและจัดโครงสร้างให้เป็นระบบ
              เพื่อให้ผู้ที่มีส่วนในการร่างรัฐธรรมนูญสามารถพิจารณาทางเลือกต่าง ๆ
              โดยเห็นถึงมุมมองและข้อเสนอที่หลากหลายจากประชาชน
              และนำไปสู่การพูดคุยเพื่อหาข้อตกลงร่วมกันเพื่อร่างรัฐธรรมนูญฉบับใหม่
            </p>
            <div className="flex max-w-212 flex-col gap-0.5 p-1.25 text-b7 text-gray-6">
              <b>ข้อควรระวังในการตีความข้อมูล</b>
              <p>
                ข้อมูลในแพลตฟอร์มนี้ ไม่ใช่ผลสำรวจความคิดเห็น (Poll)
                และไม่อาจใช้อ้างอิงเป็นตัวแทนความคิดเห็นของคนทั้งประเทศได้
                เนื่องจากโครงการเน้นการเก็บรวบรวมมุมมองปลายเปิดที่หลากหลายจากวงสนทนา
                โดยไม่ได้เน้นการโหวตนับจำนวนผู้เห็นด้วยหรือคัดค้านเป็นหลัก
              </p>
            </div>
            <ButtonLink
              to="/about"
              variant="secondary"
              icon={<ArrowUpIcon className="rotate-90" />}
            >
              อ่านรายละเอียด
            </ButtonLink>
          </div>
        </section>
        <section className="flex flex-col items-center gap-2.5 py-10 text-white">
          <h2 className="text-h6 font-bold">สำรวจข้อถกเถียง</h2>
          <ButtonLink
            to="/dashboard"
            variant="primary-white"
            icon={<ArrowUpIcon className="rotate-90" />}
          >
            สำรวจทั้งหมด
          </ButtonLink>
        </section>
      </div>
    );
  },
});
