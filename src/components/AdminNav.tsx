import { ReactElement, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Popover } from '@mui/material';
import OpenInNewIcon from '@material-symbols/svg-700/rounded/open_in_new.svg?react';
import ProfileIcon from './icon/ProfileIcon';
import { usePermission } from '../hooks/usePermission';

// todo: if has some tabs later, we have to handle state
export default function AdminNav(): ReactElement {
  const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorMenu);
  const popoverID = openMenu ? 'user-menu' : undefined;
  const { logoutAsAdmin } = useAuth();

  const { userCanEdit } = usePermission();

  const logout = () => {
    logoutAsAdmin();
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-white flex items-center justify-between pl-4 pr-12 z-20">
      <div className="flex items-center gap-6">
        <img
          className="h-10"
          src="/dreamcon-logo-blue.png"
          alt="dreamcon-logo"
        />
        {userCanEdit() && (
          <a
            href="/?mode=view"
            target="_blank"
            className="flex text-blue-3 gap-2 items-center px-4 py-[5.5px] bg-blue-1 rounded-full font-bold"
          >
            <span>view site</span>
            <OpenInNewIcon className="h-4 w-4 text-blue-3" aria-hidden />
          </a>
        )}
      </div>

      <div
        className="flex gap-2 items-center pl-4 hover:cursor-pointer"
        onClick={e => {
          e.stopPropagation();
          setAnchorMenu(e.currentTarget);
        }}
      >
        <ProfileIcon
          className="rounded-full bg-blue-1 p-1 w-6.25 h-6.25 text-[#1C1C1C]"
          aria-hidden
        />
        <span className="wv-bold">Admin</span>
      </div>
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
