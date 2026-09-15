import { ReactElement, useState } from 'react';
import OpenInNewIcon from '@material-symbols/svg-700/rounded/open_in_new.svg?react';
import { Popover } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import { usePermission } from '../../hooks/usePermission';
import ProfileIcon from '../icon/ProfileIcon';

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
    <nav className="fixed top-0 left-0 z-20 flex h-16 w-full items-center justify-between bg-white pr-12 pl-4">
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
            className="flex items-center gap-2 rounded-full bg-blue-1 px-4 py-[5.5px] font-bold text-blue-3"
          >
            <span>view site</span>
            <OpenInNewIcon className="h-4 w-4 text-blue-3" aria-hidden />
          </a>
        )}
      </div>

      <div
        className="flex items-center gap-2 pl-4 hover:cursor-pointer"
        onClick={e => {
          e.stopPropagation();
          setAnchorMenu(e.currentTarget);
        }}
      >
        <ProfileIcon
          className="h-6.25 w-6.25 rounded-full bg-blue-1 p-1 text-[#1C1C1C]"
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
