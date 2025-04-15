interface IconProps {
  className?: string;
  color?: string;
}

export default function IconInfo(props: IconProps) {
  return (
    <svg
      className={props.className}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.125"
        y="1.125"
        width="9.75"
        height="9.75"
        rx="4.875"
        stroke={props.color || "#979797"}
        strokeWidth="0.75"
      />
      <path
        d="M6.381 3.87631C6.172 3.87631 6.02625 3.83506 5.94375 3.75256C5.86125 3.66456 5.82 3.55731 5.82 3.43081V3.27406C5.82 3.14756 5.86125 3.04031 5.94375 2.95231C6.02625 2.86431 6.172 2.82031 6.381 2.82031C6.59 2.82031 6.73575 2.86431 6.81825 2.95231C6.90075 3.04031 6.942 3.14756 6.942 3.27406V3.43081C6.942 3.55731 6.90075 3.66456 6.81825 3.75256C6.73575 3.83506 6.59 3.87631 6.381 3.87631ZM4.5 8.36431H5.99325V5.37781H4.5V4.74256H6.7605V8.36431H8.163V8.99956H4.5V8.36431Z"
        fill={props.color || "#979797"}
      />
    </svg>
  );
}
