import Description from "../components/Description";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

export default function UserHome() {
  return (
    <div className="flex flex-col">
      <section id="hero" className="px-[24px] bg-[#BDE6FF]">
        <div className="max-w-[960px] w-full m-auto">
          <Hero />
        </div>
      </section>
      <div className="bg-[#BDE6FF] h-[40px] flex items-end">
        <div
          style={{ backgroundImage: "url('/icon/ellipse.svg')" }}
          className="bg-repeat w-full h-[16px]"
        />
      </div>

      <section
        id="description"
        className="px-[24px] py-[32px] md:py-[64px] bg-[#D2FED6]"
      >
        <div className="max-w-[960px] w-full m-auto">
          <Description />
        </div>
      </section>
      <section
        id="mini-card"
        className="px-[24px] py-[32px] md:py-[64px] bg-[#F8F8F8]"
      >
        <div className="max-w-[960px] w-full m-auto"></div>
      </section>
      <div className="bg-[#FFFFFF] h-[40px] flex relative pb-[24px]">
        <div
          style={{ backgroundImage: "url('/icon/ellipse-2.svg')" }}
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
  );
}
