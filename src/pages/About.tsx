import DefaultLayout from '../layouts/default';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import { externalEvents } from '../data/about';
import ExternalEventCard from '../components/about/ExternalEventCard';
import { useContext, useEffect } from 'react';
import { StoreContext } from '../store';

export default function AboutPage() {
  const { currentPage } = useContext(StoreContext);
  useEffect(() => {
    currentPage.setValue('about');
  }, [currentPage]);
  return (
    <DefaultLayout>
      <div className="w-full">
        <section id="hero" className="px-6 bg-blue-2 w-full">
          <div className="max-w-240 w-full m-auto">
            <Hero heroTitle="เกี่ยวกับโครงการ" />
          </div>
        </section>
        <div className="bg-blue-2 h-10 flex items-end">
          <div className="bg-[url('/icon/ellipse.svg')] bg-repeat w-full h-4" />
        </div>
        <section className="bg-green-3 px-6 py-12 md:py-16" id="content">
          <div className="w-full max-w-240 m-auto">
            <div className="w-full flex flex-col md:flex-row gap-10 text-b2">
              <div className="w-full md:w-1/2 flex flex-col gap-4">
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
              <div className="w-full md:w-1/2 flex flex-col gap-4">
                <h4 className="heading-4 wv-ibmplex font-bold">
                  แผนการดำเนินงาน
                </h4>

                <div>
                  <span>
                    Dream Constitution มีแผนการดำเนินการแบ่งออกเป็น 3 ระยะ
                  </span>
                  <ul className="list-disc list-outside px-6">
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
            <div className="flex flex-col md:flex-row gap-2 justify-between items-center mt-7.5">
              <h4 className="heading-4 wv-ibmplex font-bold">
                จัดทำโครงการโดย
              </h4>
              <div className="w-full md:w-auto flex md:space-x-4 justify-between">
                <div className="flex md:flex-row flex-col md:space-x-4 space-y-4 md:space-y-0 md:items-center">
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
                <div className="flex md:flex-row flex-col md:space-x-4 space-y-4 md:space-y-0 md:items-center">
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
            <h2 className="w-full max-w-240 m-auto px-6  heading-2 wv-ibmplex font-bold ">
              หากคุณสนใจเรื่องนี้
            </h2>
            <p className="w-full max-w-240 m-auto px-6  text-b2">
              ระหว่างนี้สามารถไปเยี่ยมชมโปรเจกต์อื่น
              ที่เกี่ยวกับเรื่องรัฐธรรมนูญได้
            </p>

            <div className="flex flex-col md:flex-row gap-6 overflow-x-auto">
              {externalEvents.map((event, index) => (
                <div className="shrink-0 m-auto">
                  <ExternalEventCard event={event} key={index} />
                </div>
              ))}
            </div>
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
