import { ReactElement } from 'react';

export default function Footer(): ReactElement {
  return (
    <div className="m-auto flex w-full max-w-240 flex-col space-y-12 text-left text-b2 text-white">
      <div className="flex flex-col space-y-8 md:flex-row md:items-center md:justify-between">
        <img
          className="h-12 w-fit"
          src="/logo/dream-con-logo-white.svg"
          alt="dream-con-logo-white"
        />
      </div>
      <div className="flex flex-col justify-between space-y-8 md:flex-row md:space-y-0">
        <div className="flex flex-col space-y-2 md:justify-between">
          <span className="wv-ibmplex wv-bold">ติดต่อสอบถาม</span>
          <a
            className="!text-white !underline"
            href="mailto: contact@wevis.info"
          >
            contact@wevis.info
          </a>
        </div>
        <div className="flex flex-col justify-between">
          <span className="wv-ibmplex wv-bold">จัดทำโครงการโดย</span>
          <div className="flex justify-between md:space-x-4">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
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
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
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
