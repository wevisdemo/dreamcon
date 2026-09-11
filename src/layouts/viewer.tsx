import React from 'react';
import Hero from '../components/Hero';
import Description from '../components/Description';
import Footer from '../components/Footer';
import { usePermission } from '../hooks/usePermission';
import DefaultLayout from './default';

const ViewerLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isReadOnly } = usePermission();
  return (
    <DefaultLayout>
      <>
        {isReadOnly() && (
          <section id="hero" className="px-6 bg-blue-2 w-full">
            <div className="max-w-240 w-full m-auto">
              <Hero heroTitle="ข้อถกเถียงต่อยอด" />
            </div>
          </section>
        )}
        <section
          id="content"
          className={`${isReadOnly() ? 'max-h-164 h-full' : 'h-full'}`}
        >
          {children}
        </section>
        {isReadOnly() && (
          <>
            <div className="bg-blue-2 h-10 flex items-end">
              <div className="bg-[url('/icon/ellipse.svg')] bg-repeat w-full h-4" />
            </div>

            <section id="description" className="px-6 py-8 md:py-16 bg-green-3">
              <div className="max-w-240 w-full m-auto">
                <Description />
              </div>
            </section>

            <div className="bg-white h-10 flex relative pb-6">
              <div className="bg-[url('/icon/ellipse.svg')] bg-repeat w-full h-4 absolute -top-0.5 rotate-180" />
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
          </>
        )}
      </>
    </DefaultLayout>
  );
};

export default ViewerLayout;
