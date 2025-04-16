import { ReactElement } from "react";

export default function Footer(): ReactElement {
  return (
    <div className="flex flex-col max-w-[960px] w-full m-auto text-white text-[16px] space-y-[48px] text-left">
      <div className="flex md:flex-row flex-col md:justify-between md:items-center space-y-[32px] ">
        <img
          className="h-[48px] w-fit"
          src="/logo/dream-con-logo-white.svg"
          alt="dream-con-logo-white"
        />
      </div>
      <div className="flex flex-col md:flex-row justify-between space-y-[32px] md:space-y-0">
        <div className="flex flex-col md:justify-between space-y-[8px]">
          <span className="wv-ibmplex wv-bold">ติดต่อสอบถาม</span>
          <a className="underline" href="mailto: contact@wevis.info">
            contact@wevis.info
          </a>
        </div>
        <div className="flex flex-col justify-between">
          <span className="wv-ibmplex wv-bold">จัดทำโครงการโดย</span>
          <div className="flex md:space-x-[16px] justify-between">
            <div className="flex md:flex-row flex-col md:space-x-[16px] space-y-[16px] md:space-y-0 md:items-center">
              <a target="_blank" href="https://wevis.info/">
                <img
                  className="h-[32px]"
                  src="/logo/wevis-logo.svg"
                  alt="wevis-logo"
                />
              </a>
              <a target="_blank" href="https://www.freiheit.org/thailand">
                <img
                  className="h-[32px]"
                  src="/logo/fnf-logo.svg"
                  alt="fnf-logo"
                />
              </a>

              <a target="_blank" href="https://theactive.net/">
                <img
                  className="h-[32px]"
                  src="/logo/the-active-logo.svg"
                  alt="the-active-logo"
                />
              </a>
            </div>
            <div className="flex md:flex-row flex-col md:space-x-[16px] space-y-[16px] md:space-y-0 md:items-center">
              <a target="_blank" href="https://101pub.org/">
                <img
                  className="h-[32px]"
                  src="/logo/101pub-logo.svg"
                  alt="101pub-logo"
                />
              </a>

              <a target="_blank" href="https://hand.co.th/">
                <img
                  className="h-[32px]"
                  src="/logo/hand-logo.svg"
                  alt="hand-logo"
                />
              </a>

              <a target="_blank" href="https://www.tijthailand.org/">
                <img
                  className="h-[32px]"
                  src="/logo/tij-logo.svg"
                  alt="tij-logo"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
