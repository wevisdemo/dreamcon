import { createFileRoute } from '@tanstack/react-router';
import dataStructure from '../assets/data-structure-white.png';
import logo from '../assets/logo-stacked.svg';
import { ButtonLink } from '../components/button';
import { ExternalLink } from '../components/external-link';
import { Carousel } from '../components/landing/carousel';
import { CategoryCard } from '../components/landing/category-card';
import { CloudGraphic } from '../components/landing/cloud-graphic';
import {
  DemographicCard,
  type DemographicCardData,
} from '../components/landing/demographic-card';
import {
  EventCard,
  type EventCardData,
} from '../components/landing/event-card';
import { ProjectCard } from '../components/landing/project-card';
import { StatCounter } from '../components/landing/stat-counter';
import { Metadata } from '../components/metadata';
import { Sharer } from '../components/sharer';
import { EVENT_DATE_FORMAT } from '../constants/event';
import { ORGANIZERS, ORGANIZERS_SUMMARY } from '../constants/organizers';
import { PROJECTS } from '../constants/projects';
import {
  getConversations,
  getEvents,
  getGroupQuestions,
} from '../data/server-functions';
import { ArrowUpIcon } from '../icons/arrow-up';
import { ChatAddIcon } from '../icons/chat-add';
import { FacebookIcon } from '../icons/facebook';
import { InstagramIcon } from '../icons/instagram';
import { PartnershipIcon } from '../icons/partnership';
import { XIcon } from '../icons/x';
import { summarizeCategories } from '../utils/category';
import {
  countEventTopics,
  getTargetGroupTypes,
  sortEventsByDate,
} from '../utils/event';

const CATEGORY_GROUP_PREVIEW_COUNT = 3;
const CONTACT_EMAIL = 'team@wevis.info';
const SOCIAL_LINKS = [
  { href: 'https://www.facebook.com/wevisdemo', Icon: FacebookIcon },
  { href: 'https://x.com/wevisdemo', Icon: XIcon },
  { href: 'https://www.instagram.com/wevisdemo', Icon: InstagramIcon },
];

export const Route = createFileRoute('/')({
  loader: async () => {
    const [events, conversations, groupQuestions] = await Promise.all([
      getEvents(),
      getConversations(),
      getGroupQuestions(),
    ]);

    const categories = summarizeCategories(groupQuestions, conversations).map(
      summary => ({
        ...summary,
        groups: summary.groups.slice(0, CATEGORY_GROUP_PREVIEW_COUNT),
      })
    );

    const eventCards: EventCardData[] = sortEventsByDate(events).map(
      ({ id, displayName, date, location, participantCount, targetGroup }) => ({
        id,
        displayName,
        date,
        location,
        participantCount,
        targetGroupTypes: targetGroup.types,
        topicCount: countEventTopics(conversations, id),
      })
    );

    const demographics: DemographicCardData[] = getTargetGroupTypes(events)
      .map(type => ({
        type,
        eventCount: events.filter(({ targetGroup }) =>
          targetGroup.types.includes(type)
        ).length,
      }))
      .toSorted((a, b) => b.eventCount - a.eventCount);

    return {
      topicCount: conversations.length,
      eventCount: events.length,
      latestEventDate: new Date(
        Math.max(...events.map(({ date }) => date.getTime()))
      ),
      categories,
      eventCards,
      demographics,
    };
  },
  component: function Home() {
    const {
      topicCount,
      eventCount,
      latestEventDate,
      categories,
      eventCards,
      demographics,
    } = Route.useLoaderData();

    return (
      <div className="flex flex-1 flex-col bg-blue-7">
        <Metadata />
        <section className="flex min-h-[calc(100dvh-3rem)] flex-col px-1.25 md:min-h-[calc(100dvh-4rem)] md:px-2.5">
          <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-3xl bg-blue-3 px-7.5 py-10 md:px-15 md:py-20">
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
              <Sharer />
            </div>
          </div>
        </section>
        <section
          id="project"
          className="flex flex-col gap-1 px-1 pt-1 md:scroll-mt-14 md:flex-row md:gap-2.5 md:px-2.5 md:pt-2.5"
        >
          <div className="flex items-center justify-center overflow-hidden rounded-3xl bg-white md:min-w-85 md:flex-1">
            <img
              src={dataStructure}
              alt="แผนภาพโครงสร้างข้อมูล ข้อถกเถียงแตกออกเป็นความคิดเห็นที่เห็นด้วย เห็นด้วยบางส่วน และไม่เห็นด้วย ซึ่งแต่ละความคิดเห็นมีความคิดเห็นต่อยอดได้"
              width={805}
              height={579}
              className="h-auto w-full max-w-lg"
            />
          </div>
          <div className="flex flex-col items-center gap-3.75 rounded-3xl bg-green-3 p-7.5 text-center md:flex-2 md:p-15">
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
        <section className="px-1 pb-1 md:px-2.5 md:pb-2.5">
          <div className="flex flex-col items-center gap-3 rounded-3xl bg-blue-4 py-5 md:gap-5 md:py-10">
            <h2 className="text-h8 font-bold text-blue-8">
              เลือกจากหมวดหมู่ ({categories.length})
            </h2>
            <Carousel label="หมวดหมู่">
              {categories.map(category => (
                <li key={category.category} className="shrink-0 snap-start">
                  <CategoryCard {...category} />
                </li>
              ))}
            </Carousel>
          </div>
        </section>
        <section className="px-1 pb-1 md:px-2.5 md:pb-2.5">
          <div className="flex flex-col items-center gap-3 rounded-3xl bg-blue-4 py-5 md:gap-5 md:py-10">
            <div className="text-center text-blue-8">
              <h2 className="text-h8 font-bold">
                เลือกจากวงสนทนา ({eventCards.length})
              </h2>
              <p className="text-b6">เรียงตามวันที่จัด: ใหม่ไปเก่า</p>
            </div>
            <Carousel label="วงสนทนา">
              {eventCards.map(event => (
                <li key={event.id} className="shrink-0 snap-start">
                  <EventCard {...event} />
                </li>
              ))}
            </Carousel>
            <div className="text-center text-blue-8">
              <h3 className="mt-2 text-h10 font-bold">
                หรือเลือกวงสนทนาตามลักษณะผู้เข้าร่วม
              </h3>
              <p className="text-b6">
                หมายเหตุ: 1 วงสนทนามีผู้เข้าร่วมได้มากกว่า 1 ลักษณะ
              </p>
            </div>
            <Carousel label="ลักษณะผู้เข้าร่วม">
              {demographics.map(demographic => (
                <li key={demographic.type} className="shrink-0 snap-start">
                  <DemographicCard {...demographic} />
                </li>
              ))}
            </Carousel>
          </div>
        </section>
        <section className="px-1 pb-1 md:px-2.5 md:pb-2.5">
          <div className="flex flex-col overflow-hidden rounded-2xl lg:grid lg:grid-cols-[calc((100%-1.25rem)/3)_1fr]">
            <h2 className="flex items-center justify-center bg-green-4 p-7.5 text-center text-h7 font-bold md:p-15">
              ช่องทางการมีส่วนร่วม
            </h2>
            <div className="flex flex-col gap-7.5 bg-green-3 p-7.5 md:p-15 lg:flex-row">
              <div className="flex flex-1 gap-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-4 text-green-6 md:size-20">
                  <PartnershipIcon className="h-5.75 md:h-11.5" />
                </span>
                <div className="flex flex-1 flex-col">
                  <h3 className="text-h9 font-bold">
                    เป็นพาร์ตเนอร์กับ WeVis เพื่อจัดวงสนทนา
                  </h3>
                  <ul className="list-disc pl-6 text-b4">
                    <li>รับคู่มือเพื่อออกแบบและจัดวงสนทนาด้วยตนเอง</li>
                    <li>
                      ใช้เครื่องมือบันทึก เชื่อมโยง
                      และจัดเก็บข้อถกเถียงจากวงสนทนาอย่างเป็นระบบ
                    </li>
                  </ul>
                  <p className="text-b4">
                    สามารถติดต่อได้ที่{' '}
                    <ExternalLink href={`mailto:${CONTACT_EMAIL}`}>
                      {CONTACT_EMAIL}
                    </ExternalLink>
                  </p>
                </div>
              </div>
              <div className="flex flex-1 gap-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-4 text-green-6 md:size-20">
                  <ChatAddIcon className="size-4.25 md:size-8.5" />
                </span>
                <div className="flex flex-1 flex-col">
                  <h3 className="text-h9 font-bold">เข้าร่วมวงสนทนาในอนาคต</h3>
                  <p className="text-b4">
                    สามารถติดตามการประชาสัมพันธ์ได้ทาง social media ของ WeVis
                  </p>
                  <ul className="flex flex-wrap gap-2.5 py-1.25 text-b5">
                    {SOCIAL_LINKS.map(({ href, Icon }) => (
                      <li key={href}>
                        <ExternalLink href={href} className="flex gap-1.25">
                          <Icon className="size-5 rounded-full bg-black text-white" />
                          wevisdemo
                        </ExternalLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="grid grid-cols-1 gap-1 px-1 pb-1 md:grid-cols-2 md:gap-2.5 md:px-2.5 md:pb-2.5 lg:grid-cols-3">
          <h2 className="flex items-center justify-center rounded-2xl bg-blue-8 p-7.5 py-28 text-center text-h7 font-bold text-white md:p-15">
            โครงการอื่น ๆ เกี่ยวกับรัฐธรรมนูญ
          </h2>
          {PROJECTS.map(project => (
            <ProjectCard key={project.href} {...project} />
          ))}
        </section>
        <section className="px-1 pb-1 md:px-2.5 md:pb-2.5">
          <div className="rounded-3xl bg-blue-3 p-7.5 md:p-15">
            <div className="mx-auto flex max-w-7xl flex-col items-start gap-5 md:flex-row">
              <div className="flex flex-1 flex-col items-start gap-3.75">
                <h2 className="text-h7 font-bold">ผู้จัดทำโครงการ</h2>
                <p className="text-b4">{ORGANIZERS_SUMMARY}</p>
                <ButtonLink
                  to="/about"
                  hash="organizers"
                  variant="primary-blue"
                  icon={<ArrowUpIcon className="rotate-90" />}
                >
                  อ่านรายละเอียด
                </ButtonLink>
              </div>
              <ul className="grid grid-cols-4 gap-1 md:shrink-0 md:grid-cols-2 md:gap-2.5">
                {ORGANIZERS.map(({ name, logo }) => (
                  <li
                    key={name}
                    className="flex aspect-square max-w-28 items-center justify-center rounded-2xl bg-white"
                  >
                    <img
                      src={logo}
                      alt={name}
                      className="max-h-1/2 max-w-4/5 object-contain"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    );
  },
});
