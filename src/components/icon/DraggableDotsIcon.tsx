import type { SVGProps } from 'react';

export default function DraggableDotsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <circle cx="10" cy="16" r="1" />
      <circle cx="10" cy="12" r="1" />
      <circle cx="10" cy="8" r="1" />
      <circle cx="15" cy="16" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="8" r="1" />
    </svg>
  );
}
