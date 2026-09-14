import { ReactElement } from 'react';

export default function Footer(): ReactElement {
  return (
    <div className="flex flex-col max-w-240 w-full m-auto text-white text-b2 space-y-12 text-left">
      <div className="flex md:flex-row flex-col md:justify-between md:items-center space-y-8 ">
        <img
          className="h-12 w-fit"
          src="/logo/dream-con-logo-white.svg"
          alt="dream-con-logo-white"
        />
      </div>
      <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0">
        <div className="flex flex-col md:justify-between space-y-2">
          <span className="wv-ibmplex wv-bold">ติดต่อสอบถาม</span>
          <a
            className="!underline !text-white"
            href="mailto: contact@wevis.info"
          >
            contact@wevis.info
          </a>
        </div>
        <div className="flex flex-col justify-between">
          <span className="wv-ibmplex wv-bold">จัดทำโครงการโดย</span>
          <div className="flex md:space-x-4 justify-between">
            <div className="flex md:flex-row flex-col md:space-x-4 space-y-4 md:space-y-0 md:items-center">
              <a target="_blank" href="https://wevis.info/">
                <img
                  className="h-8"
                  src="/logo/wevis-logo.svg"
                  alt="wevis-logo"
                />
              </a>
              <a target="_blank" href="https://www.freiheit.org/thailand">
                <img className="h-8" src="/logo/fnf-logo.svg" alt="fnf-logo" />
              </a>

              <a target="_blank" href="https://theactive.net/">
                <img
                  className="h-8"
                  src="/logo/the-active-logo.svg"
                  alt="the-active-logo"
                />
              </a>
            </div>
            <div className="flex md:flex-row flex-col md:space-x-4 space-y-4 md:space-y-0 md:items-center">
              <a target="_blank" href="https://101pub.org/">
                <img
                  className="h-8"
                  src="/logo/101pub-logo.svg"
                  alt="101pub-logo"
                />
              </a>

              <a target="_blank" href="https://hand.co.th/">
                <img
                  className="h-8"
                  src="/logo/hand-logo.svg"
                  alt="hand-logo"
                />
              </a>

              <a target="_blank" href="https://www.tijthailand.org/">
                <img className="h-8" src="/logo/tij-logo.svg" alt="tij-logo" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
