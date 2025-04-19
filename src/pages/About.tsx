import DefaultLayout from "../layouts/default";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import { externalEvents } from "../data/about";
import ExternalEventCard from "../components/about/ExternalEventCard";

export default function AboutPage() {
  return (
    <DefaultLayout>
      <div className="w-full">
        <section id="hero" className="px-[24px] bg-[#BDE6FF] w-full">
          <div className="max-w-[960px] w-full m-auto">
            <Hero heroTitle="เกี่ยวกับโครงการ" />
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
          id="content"
        >
          <div className="w-full max-w-[960px] m-auto">
            <div className="w-full flex flex-col md:flex-row gap-[40px] text-[16px]">
              <div className="w-full md:w-[50%] flex flex-col gap-[16px]">
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
              <div className="w-full md:w-[50%] flex flex-col gap-[16px]">
                <h4 className="md:text-[25px] text-[20px] wv-ibmplex font-bold">
                  แผนการดำเนินงาน
                </h4>

                <div>
                  <span>
                    Dream Constitution มีแผนการดำเนินการแบ่งออกเป็น 3 ระยะ
                  </span>
                  <ul className="list-disc list-outside px-[24px]">
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
            <div className="flex flex-col md:flex-row gap-[8px] justify-between items-center mt-[30px]">
              <h4 className="text-[20px] wv-ibmplex font-bold">
                จัดทำโครงการโดย
              </h4>
              <div className="w-full md:w-auto flex md:space-x-[16px] justify-between">
                <div className="flex md:flex-row flex-col md:space-x-[16px] space-y-[16px] md:space-y-0 md:items-center">
                  <a target="_blank" href="https://wevis.info/">
                    <img
                      className="h-[32px]"
                      src="/logo/wevis-logo-black.svg"
                      alt="wevis-logo"
                    />
                  </a>
                  <a target="_blank" href="https://www.freiheit.org/thailand">
                    <img
                      className="h-[32px]"
                      src="/logo/fnf-logo-black.svg"
                      alt="fnf-logo"
                    />
                  </a>

                  <a target="_blank" href="https://theactive.net/">
                    <img
                      className="h-[32px]"
                      src="/logo/the-active-logo-black.svg"
                      alt="the-active-logo"
                    />
                  </a>
                </div>
                <div className="flex md:flex-row flex-col md:space-x-[16px] space-y-[16px] md:space-y-0 md:items-center">
                  <a target="_blank" href="https://101pub.org/">
                    <img
                      className="h-[32px]"
                      src="/logo/101pub-logo-black.svg"
                      alt="101pub-logo"
                    />
                  </a>

                  <a target="_blank" href="https://hand.co.th/">
                    <img
                      className="h-[32px]"
                      src="/logo/hand-logo-black.svg"
                      alt="hand-logo"
                    />
                  </a>

                  <a target="_blank" href="https://www.tijthailand.org/">
                    <img
                      className="h-[32px]"
                      src="/logo/tij-logo-black.svg"
                      alt="tij-logo"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-blue2 py-[48px]" id="influence">
          <div className="flex flex-col gap-[24px]">
            <h2 className="w-full max-w-[960px] m-auto px-[24px]  text-[31px] md:text-[39px] wv-ibmplex font-bold ">
              หากคุณสนใจเรื่องนี้
            </h2>
            <p className="w-full max-w-[960px] m-auto px-[24px]  text-[16px]">
              ระหว่างนี้สามารถไปเยี่ยมชมโปรเจกต์อื่น
              ที่เกี่ยวกับเรื่องรัฐธรรมนูญได้
            </p>

            <div className="flex flex-col md:flex-row gap-[24px] overflow-x-auto">
              {externalEvents.map((event, index) => (
                <div className="shrink-0 m-auto">
                  <ExternalEventCard event={event} key={index} />
                </div>
              ))}
            </div>
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
