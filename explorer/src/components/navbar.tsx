import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import logo from '../assets/logo-horizontal.svg';
import { menus } from '../constants/menus';
import { CloseIcon } from '../icons/close';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuLinks = menus.map(({ label, to }) => (
    <li key={label}>
      <Link
        to={to}
        activeOptions={{ exact: to === '/' }}
        activeProps={{ className: 'font-bold' }}
        onClick={() => setIsOpen(false)}
        className="flex h-12.5 items-center px-5 hover:text-blue-5"
      >
        {label}
      </Link>
    </li>
  ));

  return (
    <header className="relative bg-blue-7 text-white">
      <nav className="flex h-10 items-center justify-between md:h-14">
        <Link to="/" className="px-2.5 md:px-5">
          <img src={logo} alt="Dream Con" className="h-3.75 md:h-5" />
        </Link>
        <ul className="hidden text-h10 md:flex">{menuLinks}</ul>
        <button
          type="button"
          aria-label={isOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="flex size-10 cursor-pointer flex-col items-center justify-center gap-1.25 hover:text-blue-5 md:hidden"
        >
          {isOpen ? (
            <CloseIcon className="size-6" />
          ) : (
            [1, 2, 3].map(bar => (
              <span key={bar} className="h-0.5 w-5 rounded-full bg-current" />
            ))
          )}
        </button>
      </nav>
      {isOpen && (
        <ul className="absolute inset-x-0 top-full z-10 bg-blue-7 text-h8 md:hidden">
          {menuLinks}
        </ul>
      )}
    </header>
  );
}
