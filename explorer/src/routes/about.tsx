import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import fnfLogo from '../assets/partner-fnf.svg';
import handLogo from '../assets/partner-hand.png';
import tijLogo from '../assets/partner-tij.svg';
import wevisLogo from '../assets/partner-wevis.svg';
import { AboutData } from '../components/about/about-data';
import { Button, ButtonLink } from '../components/button';
import { DownloadModal } from '../components/download-modal';
import { ExternalLink } from '../components/external-link';
import { getPartners } from '../data/server-functions';
import { DownloadIcon } from '../icons/download';
import { MailIcon } from '../icons/mail';

const ORGANIZERS = [
  {
    name: 'มูลนิธิฟรีดริช เนามัน ประเทศไทย (FNF Thailand)',
    logo: fnfLogo,
    width: 130,
    height: 36,
  },
  { name: 'วีวิซ เดโม (WeVis)', logo: wevisLogo, width: 100, height: 30 },
  {
    name: 'สถาบันเพื่อการยุติธรรมแห่งประเทศไทย (TIJ)',
    logo: tijLogo,
    width: 82,
    height: 41,
  },
  { name: 'Hand Social Enterprises', logo: handLogo, width: 98, height: 43 },
];

const TEAM = [
  ['เขียนโปรแกรม', ['ทรงพล นิลวงษ์', 'วิถี ภูษิตาศัย']],
  ['ออกแบบ', ['มนสิชา ศรีสวนแตง', 'โสรยา ระดาฤทธิ์', 'น้ำใส ศุภวงศ์']],
  ['บันทึกข้อมูล', ['ณภัทร แต้เถา', 'ขวัญข้าว วงศ์พินิจวโรดม']],
  ['จัดการข้อมูล', ['ปฏิภาณ ศรีชัย']],
  ['ที่ปรึกษาโครงการ', ['ธนิสรา เรืองเดช', 'ณัฐกานต์ อมาตยกุล']],
  [
    'ประสานงานและจัดวงสนทนา',
    ['อาลาวีย์ วาแม', 'อัญชิสา บุญแก้ว', 'วิจักขณ์ฤทธิ์ จิวจินดา', 'ขวัญข้าว วงศ์พินิจวโรดม'],
  ],
] as const;

export const Route = createFileRoute('/about')({
  loader: () => getPartners(),
  head: () => ({
    meta: [{ title: 'เกี่ยวกับเรา | Dream Constitution' }],
  }),
  component: function About() {
    const partners = Route.useLoaderData();
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

    return (
      <div className="flex flex-col items-center px-5 md:px-0">
        <h1 className="py-7.5 text-center text-h4 font-bold md:py-15">
          เกี่ยวกับเรา
        </h1>

        <div className="flex w-full max-w-212.5 flex-col gap-10 py-10 text-b4 md:w-[80vw]">
          <article className="flex flex-col gap-5">
            <h2 className="text-h5 font-bold">DreamCon คืออะไร?</h2>
            <p>
              DreamCon คือพื้นที่รวบรวมความคิด ความหวัง
              และความฝันเกี่ยวกับรัฐธรรมนูญจากผู้คนที่หลากหลาย
              ทุกคนสามารถเข้าร่วมได้โดยไม่จำเป็นต้องเป็นผู้รู้หรือผู้เชี่ยวชาญ
            </p>
            <p>
              เรานำบทสนทนาและข้อถกเถียงจากเวทีต่าง ๆ มาจัดเก็บอย่างเป็นระบบ
              เพื่อสร้างเป็นฐานข้อมูลสาธารณะสำหรับส่งต่อให้ผู้มีส่วนเกี่ยวข้องกับการจัดทำรัฐธรรมนูญฉบับใหม่
              และช่วยให้เสียงของประชาชนถูกนำไปใช้ในกระบวนการอย่างมีความหมาย
            </p>

            <section className="flex flex-col gap-5">
              <h3 className="text-h7 font-bold">ทำไมต้องมี DreamCon?</h3>
              <div>
                <p>DreamCon เริ่มพัฒนาตั้งแต่ปลายปี 2024 เพื่อตอบโจทย์สำคัญ 2 เรื่อง</p>
                <ol className="list-decimal pl-6">
                  <li>
                    บทสนทนาเรื่องรัฐธรรมนูญมีอยู่มาก แต่ยังกระจัดกระจาย
                    <ul className="list-disc pl-6">
                      <li>
                        เวทีสนทนาหลายแห่งสร้างข้อเสนอและข้อถกเถียงที่มีคุณค่า
                        แต่ยังขาดระบบรวบรวม เชื่อมโยง และนำข้อมูลกลับมาใช้ต่อ
                      </li>
                      <li>
                        DreamCon จึงพัฒนา
                        <b>เครื่องมือจัดการข้อมูล (Information Tool)</b> สำหรับบันทึก
                        จัดกลุ่ม และแสดงผลบทสนทนาจากเวทีต่าง ๆ อย่างเป็นระบบ
                      </li>
                    </ul>
                  </li>
                  <li>
                    ประชาชนจำนวนมากยังรู้สึกว่ารัฐธรรมนูญเป็นเรื่องไกลตัว
                    <ul className="list-disc pl-6">
                      <li>
                        หลายคนอาจรู้สึกว่าตนไม่มีความรู้ ไม่เชี่ยวชาญ
                        หรือไม่คุ้นเคยกับประเด็นทางกฎหมายและการเมือง
                      </li>
                      <li>
                        DreamCon จึงจัดทำ<b>คู่มือกระบวนการ (Process Guideline)</b>{' '}
                        พร้อมทีมสนับสนุน
                        เพื่อให้ผู้สนใจสามารถจัดวงสนทนาเรื่องรัฐธรรมนูญกับชุมชนหรือกลุ่มของตนเองได้
                      </li>
                    </ul>
                  </li>
                </ol>
              </div>
            </section>

            <section className="flex flex-col gap-5">
              <h3 className="text-h7 font-bold">
                ความหลากหลายของมุมมอง คือหัวใจสำคัญของโครงการนี้
              </h3>
              <p>
                DreamCon พัฒนาบนฐานคิดประชาธิปไตยแบบปรึกษาหารือ (
                <ExternalLink href="https://en.wikipedia.org/wiki/Deliberative_democracy">
                  Deliberative Democracy
                </ExternalLink>
                ) ซึ่งให้ความสำคัญกับการสนทนาที่เปิดกว้าง เคารพกัน มีข้อมูลประกอบ
                และแลกเปลี่ยนเหตุผลระหว่างผู้เข้าร่วมอย่างเท่าเทียม
              </p>
              <p>
                เราได้นำ 'ข้อถกเถียง'
                จากหลากหลายวงสนทนามาเรียบเรียงและจัดโครงสร้างให้เป็นระบบ
                เพื่อให้ผู้ที่มีส่วนในการร่างรัฐธรรมนูญสามารถพิจารณาทางเลือกต่าง ๆ
                โดยเห็นถึงมุมมองและข้อเสนอที่หลากหลายจากประชาชน
                และนำไปสู่การพูดคุยเพื่อหาข้อตกลงร่วมกันเพื่อร่างรัฐธรรมนูญฉบับใหม่
              </p>
            </section>
          </article>

          <AboutData />

          <article className="flex flex-col gap-7.5">
            <section className="flex flex-col gap-5">
              <h2 className="text-h5 font-bold">ผู้จัดทำโครงการ</h2>
              <p>
                โครงการ Dream Con เกิดขึ้นจากความร่วมมือขององค์กรต่าง ๆ ได้แก่ มูลนิธิฟรีดริช
                เนามัน ประเทศไทย (FNF Thailand) วีวิซ เดโม (WeVis)
                สถาบันเพื่อการยุติธรรมแห่งประเทศไทย (TIJ) และ Hand Social Enterprises
              </p>
              <ul className="grid grid-cols-2 md:flex">
                {ORGANIZERS.map(({ name, logo, width, height }) => (
                  <li
                    key={name}
                    className="flex h-24.75 items-center justify-center md:w-37.5"
                  >
                    <img src={logo} alt={name} width={width} height={height} />
                  </li>
                ))}
              </ul>
            </section>

            <section className="flex flex-col gap-5">
              <h3 className="text-h7 font-bold">องค์กรภาคีเครือข่าย</h3>
              <div>
                <p>
                  องค์กรที่ขับเคลื่อนกิจกรรมและร่วมจัดวงสนทนาตามวาระต่าง ๆ ให้บรรลุเป้าหมาย
                  ได้แก่
                </p>
                <ul className="list-disc pl-6">
                  {partners.map(({ name }) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
              <aside className="flex flex-col rounded-xl bg-green-3 p-7.5">
                <h4 className="text-h9 font-bold">
                  เป็นพาร์ตเนอร์กับ WeVis เพื่อจัดวงสนทนา
                </h4>
                <ul className="list-disc pl-6">
                  <li>รับคู่มือเพื่อออกแบบและจัดวงสนทนาด้วยตนเอง</li>
                  <li>
                    ใช้เครื่องมือบันทึก เชื่อมโยง และจัดเก็บข้อถกเถียงจากวงสนทนาอย่างเป็นระบบ
                  </li>
                </ul>
                <p>
                  สามารถติดต่อได้ที่{' '}
                  <ExternalLink
                    href="mailto:team@wevis.info"
                    className="font-bold"
                  >
                    team@wevis.info
                  </ExternalLink>
                </p>
              </aside>
            </section>

            <section className="flex flex-col gap-5">
              <h3 className="text-h7 font-bold">ทีมงานร่วมพัฒนา</h3>
              <dl className="grid gap-x-2.5 gap-y-4.5 md:grid-cols-2">
                {TEAM.map(([role, members]) => (
                  <div key={role} className="flex flex-col gap-2.5">
                    <dt className="text-h9 font-bold">{role}</dt>
                    <dd>
                      {members.map(member => (
                        <p key={member}>{member}</p>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </article>
        </div>

        <div className="flex w-full flex-col gap-2.5 py-7.5 md:w-auto md:flex-row md:py-15">
          <Button
            variant="primary-blue"
            icon={<DownloadIcon />}
            onClick={() => setIsDownloadModalOpen(true)}
          >
            ดาวน์โหลดข้อมูล
          </Button>
          <ButtonLink
            variant="secondary"
            icon={<MailIcon />}
            href="https://airtable.com/appsowPzCsRLmUvNx/shryu4errnlj1LWsM"
            target="_blank"
            rel="noreferrer"
          >
            Feedback
          </ButtonLink>
        </div>
        <DownloadModal
          isOpen={isDownloadModalOpen}
          onClose={() => setIsDownloadModalOpen(false)}
        />
      </div>
    );
  },
});
