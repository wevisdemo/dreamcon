import { Link } from '@tanstack/react-router';
import logo from '../assets/logo-stacked.svg';
import { menus } from '../constants/menus';
import { MailIcon } from '../icons/mail';

const email = 'team@wevis.info';

export function Footer() {
  return (
    <footer className="flex justify-between gap-5 bg-blue-7 p-5 text-white md:items-center md:p-7.5">
      <Link to="/" className="shrink-0">
        <img src={logo} alt="Dream Con" className="h-7.5 md:h-10" />
      </Link>
      <div className="flex flex-col gap-5 md:contents">
        <ul className="flex flex-col gap-1.25 text-h8 md:flex-row md:gap-15 md:text-h10">
          {menus.map(({ label, to }) => (
            <li key={label}>
              <Link
                to={to}
                className="flex items-center hover:text-blue-5 md:h-12.5 md:px-5"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <a
          href={`mailto:${email}`}
          className="flex gap-1.25 text-b5 hover:text-blue-5 md:text-b6"
        >
          <MailIcon className="size-5" />
          {email}
        </a>
      </div>
    </footer>
  );
}
