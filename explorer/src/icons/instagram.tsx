import type { SVGProps } from 'react';

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden {...props}>
      <rect x="4" y="4.67" width="11.33" height="10.67" rx="3.33" />
      <ellipse
        cx="9.67"
        cy="10"
        rx="2.83"
        ry="2.67"
        fill="none"
        stroke="black"
        strokeWidth="0.67"
      />
      <ellipse cx="13.21" cy="6.67" rx="0.71" ry="0.67" fill="black" />
    </svg>
  );
}
