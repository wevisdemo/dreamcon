import React, { useContext } from "react";
import NewTabIcon from "../components/icon/NewTab";
import { StoreContext } from "../store";
import { DreamConEventDB } from "../types/event";

const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user: userContext } = useContext(StoreContext);
  const userCanEdit = () => {
    const isWriter = userContext.userState?.role === "writer";
    const isAdmin = userContext.userState?.role === "admin";
    return isAdmin || isWriter;
  };
  const getWriterEvent = (): DreamConEventDB | null => {
    if (userContext.userState?.role === "writer") {
      return userContext.userState.event;
    }
    return null;
  };
  return (
    <div>
      <nav className="fixed top-0 left-0 w-full h-[64px] bg-white flex items-center justify-between pl-[16px] pr-[48px] z-20">
        <div className="flex items-center gap-[24px]">
          <img
            className="h-[40px]"
            src="/dreamcon-logo-blue.png"
            alt="dreamcon-logo"
          />
          {userCanEdit() && (
            <a
              href="/?mode=read"
              target="_blank"
              className="flex text-blue3 gap-[8px] items-center px-[16px] py-[5.5px] bg-blue1 rounded-[48px] font-bold"
            >
              <span>view site</span>
              <NewTabIcon className="h-[16px] w-[16px]" color="#95D0FF" />
            </a>
          )}
        </div>
        {userCanEdit() && (
          <div className="flex items-center gap-[16px]">
            <span className="text-gray5">สร้างข้อถกเถียงของ</span>
            {getWriterEvent() && (
              <div className="flex gap-[8px] items-center pl-[16px]">
                <img
                  className="rounded-full w-[25px] h-[25px]"
                  src={getWriterEvent()?.avatar_url}
                  alt={`avatar-event-${getWriterEvent()?.display_name}`}
                />
                <span className="wv-bold">
                  {getWriterEvent()?.display_name}
                </span>
              </div>
            )}
          </div>
        )}
      </nav>
      <main
        className="mt-[64px] overflow-hidden"
        style={{ height: "calc(100vh - 64px)" }}
      >
        {children}
      </main>
    </div>
  );
};

export default DefaultLayout;
