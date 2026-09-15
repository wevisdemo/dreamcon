import { useContext, useEffect } from 'react';
import ExternalEventCard from '../components/about/ExternalEventCard';
import Footer from '../components/layout/Footer';
import Hero from '../components/layout/Hero';
import { externalEvents } from '../data/about';
import DefaultLayout from '../layouts/default';
import { StoreContext } from '../store';

export default function AboutPage() {
  const { currentPage } = useContext(StoreContext);
  useEffect(() => {
    currentPage.setValue('about');
  }, [currentPage]);
  return (
    <DefaultLayout>
      <div className="w-full">
        <section id="hero" className="w-full bg-blue-2 px-6">
          <div className="m-auto w-full max-w-240">
            <Hero heroTitle="เกี่ยวกับโครงการ" />
          </div>
        </section>
        <div className="flex h-10 items-end bg-blue-2">
          <div className="h-4 w-full bg-[url('/icon/ellipse.svg')] bg-repeat" />
        </div>
        <section className="bg-green-3 px-6 py-12 md:py-16" id="content">
          <div className="m-auto w-full max-w-240">
            <div className="flex w-full flex-col gap-10 text-b2 md:flex-row">
              <div className="flex w-full flex-col gap-4 md:w-1/2">
                <span>
                  Dream Con หรือ Dream Conversation for Constitution คือ
                  โครงการระดมความคิดเห็นของคนไทยเกี่ยวกับรัฐธรรมนูญในฝัน
                  เริ่มจากคำถามตั้งต้นเรียบง่ายว่าเราอยากเห็นอะไรในกติกาที่ใช้อยู่ร่วมกันในสังคม
                  เพราะรัฐธรรมนูญอาจฟังไกลตัวในบางครั้ง
                  เราจึงอยากจูงมือทุกคนมานับหนึ่งด้วยกันแล้วร่างภาพความฝันที่หลากหลายเหล่านั้นให้กลายเป็นเรื่องราวเดียว
                  แล้วส่งต่อให้ผู้มีหน้าที่ในการร่างรัฐธรรมนูญใหม่นำไปพิจารณาประกอบขึ้นเป็นร่างของประชาชนอย่างแท้จริง
                </span>
                <span>
                  โครงการ Dream Con เกิดจากความร่วมมือขององค์กรต่างๆ ได้แก่
                  มูลนิธิฟรีดริช เนามัน (FNF) วีวิซ เดโม (WeVis)
                  สถาบันเพื่อการยุติธรรมแห่งประเทศไทย (TIJ) และ Hand Social
                  Enterprises
                </span>
              </div>
              <div className="flex w-full flex-col gap-4 md:w-1/2">
                <h4 className="wv-ibmplex heading-4 font-bold">
                  แผนการดำเนินงาน
                </h4>

                <div>
                  <span>
                    Dream Constitution มีแผนการดำเนินการแบ่งออกเป็น 3 ระยะ
                  </span>
                  <ul className="list-outside list-disc px-6">
                    <li>
                      <p>
                        <span className="font-bold">ระยะที่ 1</span> -
                        ทำแบบสอบถามออนไลน์เผยแพร่ทางโซเชียลมีเดียและเครือข่าย
                        เพื่อสำรวจความสนใจของคนไทยในแต่ละภูมิภาค
                      </p>
                    </li>
                    <li>
                      <p>
                        <span className="font-bold">ระยะที่ 2</span> -
                        นำผลลัพธ์จากแบบสอบถามเผยแพร่ในเว็บไซต์และส่งต่อให้ผู้จัดกระบวนการนำไปสร้างบทสนทนาในพื้นที่ต่างๆ
                        จากนั้นนำเนื้อหาการสนทนามาขึ้นโครงสร้างข้อถกเถียงในเว็บไซต์
                      </p>
                    </li>
                    <li>
                      <p>
                        <span className="font-bold">ระยะที่ 3</span> -
                        ส่งต่อโครงสร้างข้อถกเถียงเท่าที่รวบรวมได้ภายใน 3 เดือน
                        ให้นักวิชาการนำไปศึกษาและจัดทำรายงานข้อเสนอแนะต่อ สสร.
                        ต่อไป
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-7.5 flex flex-col items-center justify-between gap-2 md:flex-row">
              <h4 className="wv-ibmplex heading-4 font-bold">
                จัดทำโครงการโดย
              </h4>
              <div className="flex w-full justify-between md:w-auto md:space-x-4">
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
                  <a target="_blank" href="https://wevis.info/">
                    <img
                      className="h-8"
                      src="/logo/wevis-logo-black.svg"
                      alt="wevis-logo"
                    />
                  </a>
                  <a target="_blank" href="https://www.freiheit.org/thailand">
                    <img
                      className="h-8"
                      src="/logo/fnf-logo-black.svg"
                      alt="fnf-logo"
                    />
                  </a>

                  <a target="_blank" href="https://theactive.net/">
                    <img
                      className="h-8"
                      src="/logo/the-active-logo-black.svg"
                      alt="the-active-logo"
                    />
                  </a>
                </div>
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
                  <a target="_blank" href="https://101pub.org/">
                    <img
                      className="h-8"
                      src="/logo/101pub-logo-black.svg"
                      alt="101pub-logo"
                    />
                  </a>

                  <a target="_blank" href="https://hand.co.th/">
                    <img
                      className="h-8"
                      src="/logo/hand-logo-black.svg"
                      alt="hand-logo"
                    />
                  </a>

                  <a target="_blank" href="https://www.tijthailand.org/">
                    <img
                      className="h-8"
                      src="/logo/tij-logo-black.svg"
                      alt="tij-logo"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-blue-2 py-12" id="influence">
          <div className="flex flex-col gap-6">
            <h2 className="wv-ibmplex m-auto w-full max-w-240 px-6 heading-2 font-bold">
              หากคุณสนใจเรื่องนี้
            </h2>
            <p className="m-auto w-full max-w-240 px-6 text-b2">
              ระหว่างนี้สามารถไปเยี่ยมชมโปรเจกต์อื่น
              ที่เกี่ยวกับเรื่องรัฐธรรมนูญได้
            </p>

            <div className="flex flex-col gap-6 overflow-x-auto md:flex-row">
              {externalEvents.map((event, index) => (
                <div className="m-auto shrink-0">
                  <ExternalEventCard event={event} key={index} />
                </div>
              ))}
            </div>
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
