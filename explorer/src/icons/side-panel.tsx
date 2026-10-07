import type { SVGProps } from 'react';

export function SidePanelIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <rect
        x="4.5"
        y="7"
        width="15"
        height="11"
        rx="1.6"
        fill="none"
        stroke="currentColor"
      />
      <rect x="12" y="8.1" width="6.4" height="8.8" rx="0.8" />
    </svg>
  );
}
