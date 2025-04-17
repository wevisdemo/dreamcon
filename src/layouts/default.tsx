import React, { useContext } from "react";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Description from "../components/Description";
import Footer from "../components/Footer";
import { StoreContext } from "../store";

const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user: userContext, mode: modeContext } = useContext(StoreContext);
  const isReadOnly = () => {
    console.log("modeContext.value", modeContext.value);
    if (modeContext.value === "view") return true;
    if (userContext.userState?.role === "user") return true;
    return false;
  };
  return (
    <div className="flex flex-col w-screen">
      <Nav />
      <main className="mt-[64px]" style={{ height: "calc(100vh - 64px)" }}>
        {isReadOnly() && (
          <section id="hero" className="px-[24px] bg-[#BDE6FF] w-full">
            <div className="max-w-[960px] w-full m-auto">
              <Hero />
            </div>
          </section>
        )}

        <section
          id="content"
          className={`${isReadOnly() ? "max-h-[656px]" : "h-full"}`}
        >
          {children}
        </section>
        {isReadOnly() && (
          <>
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

            <div className="bg-[#FFFFFF] h-[40px] flex relative pb-[24px]">
              <div
                style={{ backgroundImage: "url('/icon/ellipse.svg')" }}
                className="bg-repeat w-full h-[16px] absolute top-[-2px] rotate-180"
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
          </>
        )}
      </main>
    </div>
  );
};

export default DefaultLayout;
