import { ReactElement, useContext, useState } from 'react';
import OpenInNewIcon from '@material-symbols/svg-700/rounded/open_in_new.svg?react';
import { Popover } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import { usePermission } from '../../hooks/usePermission';
import { StoreContext } from '../../store';

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
    <nav className="fixed top-0 left-0 z-40 flex h-16 w-full items-center justify-between bg-white pr-12 pl-4">
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
            className="ml-6 flex items-center gap-2 rounded-full bg-blue-1 px-4 py-[5.5px] font-bold text-blue-3"
          >
            <span>preview</span>
            <OpenInNewIcon className="h-4 w-4 text-blue-3" aria-hidden />
          </a>
        )}
      </div>
      {isReadOnly() && (
        <div className="flex">
          <a
            className={`wv-ibmplex h-full px-4 py-5.5 text-button !font-bold !text-black ${
              currentPage.value === 'about' ? 'bg-blue-2' : ''
            }`}
            href="/about"
          >
            เกี่ยวกับโครงการ
          </a>
          <a
            className={`wv-ibmplex h-full px-4 py-5.5 text-button !font-bold !text-black ${
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
        <div className="flex items-center gap-4">
          <span className="text-gray-5">สร้างข้อถกเถียงของ</span>
          <div
            className="flex items-center gap-2 pl-4 hover:cursor-pointer"
            onClick={e => {
              e.stopPropagation();
              setAnchorMenu(e.currentTarget);
            }}
          >
            <img
              className="h-6.25 w-6.25 rounded-full"
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
          className="bg-blue-1 p-2"
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
