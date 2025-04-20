import { ReactElement, useState } from "react";
import useAuth from "../hooks/useAuth";
import { Popover } from "@mui/material";
import NewTabIcon from "./icon/NewTab";
import { usePermission } from "../hooks/usePermission";

// todo: if has some tabs later, we have to handle state
export default function AdminNav(): ReactElement {
  const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorMenu);
  const popoverID = openMenu ? "user-menu" : undefined;
  const { logoutAsAdmin } = useAuth();

  const { userCanEdit } = usePermission();

  const logout = () => {
    logoutAsAdmin();
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-[64px] bg-white flex items-center justify-between pl-[16px] pr-[48px] z-20">
      <div className="flex items-center gap-[24px]">
        <img
          className="h-[40px]"
          src="/dreamcon-logo-blue.png"
          alt="dreamcon-logo"
        />
        {userCanEdit() && (
          <a
            href="/?mode=view"
            target="_blank"
            className="flex text-blue3 gap-[8px] items-center px-[16px] py-[5.5px] bg-blue1 rounded-[48px] font-bold"
          >
            <span>view site</span>
            <NewTabIcon className="h-[16px] w-[16px]" color="#95D0FF" />
          </a>
        )}
      </div>

      <div
        className="flex gap-[8px] items-center pl-[16px] hover:cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setAnchorMenu(e.currentTarget);
        }}
      >
        <img
          className="rounded-full bg-blue1 p-[4px] w-[25px] h-[25px]"
          src="/icon/profile.svg"
          alt={`avatar-event-admin`}
        />
        <span className="wv-bold">Admin</span>
      </div>
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
