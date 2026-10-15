import { createFileRoute } from '@tanstack/react-router';
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
        <section className="px-1.25 md:px-2.5">
          <div className="relative flex flex-col items-center overflow-hidden rounded-[30px] bg-blue-3 px-7.5 py-10 md:px-15 md:py-20">
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
      </div>
    );
  },
});
