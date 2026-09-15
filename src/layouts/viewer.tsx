import React from 'react';
import Description from '../components/layout/Description';
import Footer from '../components/layout/Footer';
import Hero from '../components/layout/Hero';
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
          <section id="hero" className="w-full bg-blue-2 px-6">
            <div className="m-auto w-full max-w-240">
              <Hero heroTitle="ข้อถกเถียงต่อยอด" />
            </div>
          </section>
        )}
        <section
          id="content"
          className={`${isReadOnly() ? 'h-full max-h-164' : 'h-full'}`}
        >
          {children}
        </section>
        {isReadOnly() && (
          <>
            <div className="flex h-10 items-end bg-blue-2">
              <div className="h-4 w-full bg-[url('/icon/ellipse.svg')] bg-repeat" />
            </div>

            <section id="description" className="bg-green-3 px-6 py-8 md:py-16">
              <div className="m-auto w-full max-w-240">
                <Description />
              </div>
            </section>

            <div className="relative flex h-10 bg-white pb-6">
              <div className="absolute -top-0.5 h-4 w-full rotate-180 bg-[url('/icon/ellipse.svg')] bg-repeat" />
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
          </>
        )}
      </>
    </DefaultLayout>
  );
};

export default ViewerLayout;
