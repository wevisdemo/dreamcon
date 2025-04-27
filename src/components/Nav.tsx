import { ReactElement, useContext, useState } from "react";
import useAuth from "../hooks/useAuth";
import { StoreContext } from "../store";
import { Popover } from "@mui/material";
import NewTabIcon from "./icon/NewTab";
import { usePermission } from "../hooks/usePermission";

// todo: if has some tabs later, we have to handle state
export default function Nav(): ReactElement {
  const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorMenu);
  const popoverID = openMenu ? "user-menu" : undefined;
  const { logoutAsWriter } = useAuth();

  const { currentPage } = useContext(StoreContext);

  const { isReadOnly, userCanEdit, getWriterEvent } = usePermission();

  const logout = () => {
    logoutAsWriter();
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-[64px] bg-white flex items-center justify-between pl-[16px] pr-[48px] z-40">
      <div className="flex items-center gap-[24px]">
        {isReadOnly() ? (
          <a href="/">
            <img
              className="h-[40px]"
              src="/dreamcon-logo-blue.png"
              alt="dreamcon-logo"
            />
          </a>
        ) : (
          <img
            className="h-[40px]"
            src="/dreamcon-logo-blue.png"
            alt="dreamcon-logo"
          />
        )}

        {userCanEdit() && (
          <a
            href="/topics/?mode=view"
            target="_blank"
            className="flex text-blue3 gap-[8px] items-center px-[16px] py-[5.5px] bg-blue1 rounded-[48px] font-bold"
          >
            <span>view site</span>
            <NewTabIcon className="h-[16px] w-[16px]" color="#95D0FF" />
          </a>
        )}
      </div>
      {isReadOnly() && (
        <div className="flex ">
          <a
            className={`px-[16px] h-full py-[22px] wv-ibmplex !text-black !font-bold text-[16px] ${
              currentPage.value === "about" ? "bg-blue2" : ""
            }`}
            href="/about"
          >
            เกี่ยวกับโครงการ
          </a>
          <a
            className={`px-[16px] h-full py-[22px] wv-ibmplex !text-black !font-bold text-[16px] ${
              currentPage.value === "all-topic" || currentPage.value === "topic"
                ? "bg-blue2"
                : ""
            }`}
            href="/topics"
          >
            ร่วมถกเถียง
          </a>
        </div>
      )}
      {getWriterEvent() && !isReadOnly() && (
        <div className="flex items-center gap-[16px] ">
          <span className="text-gray5">สร้างข้อถกเถียงของ</span>
          <div
            className="flex gap-[8px] items-center pl-[16px] hover:cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setAnchorMenu(e.currentTarget);
            }}
          >
            <img
              className="rounded-full w-[25px] h-[25px]"
              src={getWriterEvent()?.avatar_url}
              alt={`avatar-event-${getWriterEvent()?.display_name}`}
            />
            <span className="wv-bold">{getWriterEvent()?.display_name}</span>
          </div>
        </div>
      )}
      <Popover
        id={popoverID}
        open={openMenu}
        anchorEl={anchorMenu}
        onClose={() => setAnchorMenu(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        classes={{ paper: "box-1" }}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
      >
        <button
          className="p-[8px] bg-blue1"
          onClick={() => {
            logout();
            setAnchorMenu(null);
          }}
        >
          Logout
        </button>
      </Popover>
    </nav>
  );
}
