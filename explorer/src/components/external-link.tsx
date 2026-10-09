import type { AnchorHTMLAttributes } from 'react';

export function ExternalLink({
  href,
  className = '',
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const opensNewTab = href.startsWith('http');

  return (
    <a
      href={href}
      target={opensNewTab ? '_blank' : undefined}
      rel={opensNewTab ? 'noreferrer' : undefined}
      className={`underline hover:text-blue-7 ${className}`}
      {...props}
    />
  );
}
