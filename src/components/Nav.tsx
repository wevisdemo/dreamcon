import { ReactElement, useContext, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { StoreContext } from '../store';
import { Popover } from '@mui/material';
import OpenInNewIcon from '@material-symbols/svg-700/rounded/open_in_new.svg?react';
import { usePermission } from '../hooks/usePermission';

// todo: if has some tabs later, we have to handle state
export default function Nav(): ReactElement {
  const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorMenu);
  const popoverID = openMenu ? 'user-menu' : undefined;
  const { logoutAsWriter, logoutAsAdmin } = useAuth();

  const { currentPage } = useContext(StoreContext);

  const { isReadOnly, userCanEdit, getWriterEvent } = usePermission();

  const logout = () => {
    logoutAsWriter();
    logoutAsAdmin();
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-white flex items-center justify-between pl-4 pr-12 z-40">
      <div className="flex items-center gap-6">
        {isReadOnly() && (
          <a href="/">
            <img
              className="h-10"
              src="/dreamcon-logo-blue.png"
              alt="dreamcon-logo"
            />
          </a>
        )}

        {userCanEdit() && (
          <a
            href="/topics/?mode=view"
            target="_blank"
            className="flex text-blue-3 gap-2 items-center px-4 py-[5.5px] bg-blue-1 rounded-full font-bold ml-6"
          >
            <span>preview</span>
            <OpenInNewIcon className="h-4 w-4 text-blue-3" aria-hidden />
          </a>
        )}
      </div>
      {isReadOnly() && (
        <div className="flex ">
          <a
            className={`px-4 h-full py-5.5 wv-ibmplex !text-black !font-bold text-button ${
              currentPage.value === 'about' ? 'bg-blue-2' : ''
            }`}
            href="/about"
          >
            เกี่ยวกับโครงการ
          </a>
          <a
            className={`px-4 h-full py-5.5 wv-ibmplex !text-black !font-bold text-button ${
              currentPage.value === 'all-topic' || currentPage.value === 'topic'
                ? 'bg-blue-2'
                : ''
            }`}
            href="/topics"
          >
            ร่วมถกเถียง
          </a>
        </div>
      )}
      {getWriterEvent() && !isReadOnly() && (
        <div className="flex items-center gap-4 ">
          <span className="text-gray-5">สร้างข้อถกเถียงของ</span>
          <div
            className="flex gap-2 items-center pl-4 hover:cursor-pointer"
            onClick={e => {
              e.stopPropagation();
              setAnchorMenu(e.currentTarget);
            }}
          >
            <img
              className="rounded-full w-6.25 h-6.25"
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
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        classes={{ paper: 'box-1' }}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
      >
        <button
          className="p-2 bg-blue-1"
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
