interface PropTypes {
  "data-dndkit-disable-drag"?: boolean;
  className?: string;
  color?: string;
  onClick?: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

export default function BubblePlusIcon(props: PropTypes) {
  return (
    <svg
      data-dndkit-disable-drag={props["data-dndkit-disable-drag"]}
      className={props.className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={(e) => {
        if (props.onClick) {
          props.onClick(e);
        }
      }}
    >
      <mask
        id="mask0_2197_94"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="18"
        height="18"
      >
        <rect width="18" height="18" fill={props.color || "#D9D9D9"} />
      </mask>
      <g mask="url(#mask0_2197_94)" pointerEvents="none">
        <path
          d="M1.76267 12.1499C1.51267 11.6249 1.33142 11.0812 1.21892 10.5187C1.10642 9.95615 1.05017 9.3874 1.05017 8.8124C1.05017 7.6919 1.26379 6.6389 1.69104 5.6534C2.11829 4.6679 2.6981 3.81065 3.43048 3.08165C4.16285 2.35265 5.02404 1.77553 6.01404 1.35028C7.00417 0.925028 8.06204 0.712402 9.18767 0.712402C10.3082 0.712402 11.3612 0.925028 12.3467 1.35028C13.3322 1.77553 14.1894 2.35265 14.9184 3.08165C15.6474 3.81065 16.2245 4.6679 16.6498 5.6534C17.075 6.6389 17.2877 7.6919 17.2877 8.8124C17.2877 9.93803 17.075 10.9959 16.6498 11.986C16.2245 12.976 15.6474 13.8372 14.9184 14.5696C14.1894 15.302 13.3322 15.8818 12.3467 16.309C11.3612 16.7363 10.3082 16.9499 9.18767 16.9499C8.61267 16.9499 8.04392 16.8937 7.48142 16.7812C6.91892 16.6687 6.37517 16.4874 5.85017 16.2374L1.81892 17.4187C1.44392 17.5312 1.11579 17.4468 0.834542 17.1655C0.553292 16.8843 0.468917 16.5562 0.581417 16.1812L1.76267 12.1499ZM3.00017 14.9999L5.46785 14.2535C5.64773 14.2011 5.82829 14.1812 6.00954 14.1937C6.19079 14.2062 6.36267 14.2499 6.52517 14.3249C6.95017 14.5249 7.38504 14.6812 7.82979 14.7937C8.27467 14.9062 8.72585 14.9624 9.18336 14.9624C10.8862 14.9624 12.3314 14.3655 13.5189 13.1718C14.7064 11.978 15.3002 10.527 15.3002 8.81878C15.3002 7.11065 14.7074 5.66378 13.5219 4.47815C12.3363 3.29265 10.8894 2.6999 9.18129 2.6999C7.47304 2.6999 6.02204 3.29259 4.82829 4.47797C3.63454 5.66334 3.03767 7.10996 3.03767 8.81784C3.03767 9.27672 3.09023 9.73059 3.19535 10.1795C3.30048 10.6285 3.45817 11.0582 3.66842 11.4685C3.76042 11.6353 3.81267 11.8093 3.82517 11.9905C3.83767 12.1718 3.81267 12.3499 3.75017 12.5249L3.00017 14.9999ZM8.17517 9.8249V11.1187C8.17517 11.3937 8.27204 11.628 8.46579 11.8218C8.65954 12.0155 8.89392 12.1124 9.16892 12.1124C9.44392 12.1124 9.67829 12.0155 9.87204 11.8218C10.0658 11.628 10.1627 11.3937 10.1627 11.1187V9.8249H11.4564C11.7314 9.8249 11.9658 9.72803 12.1595 9.53428C12.3533 9.34053 12.4502 9.10615 12.4502 8.83115C12.4502 8.55615 12.3533 8.32178 12.1595 8.12803C11.9658 7.93428 11.7314 7.8374 11.4564 7.8374H10.1627V6.54365C10.1627 6.26865 10.0658 6.03428 9.87204 5.84053C9.67829 5.64678 9.44392 5.5499 9.16892 5.5499C8.89392 5.5499 8.65954 5.64678 8.46579 5.84053C8.27204 6.03428 8.17517 6.26865 8.17517 6.54365V7.8374H6.88142C6.60642 7.8374 6.37204 7.93428 6.17829 8.12803C5.98454 8.32178 5.88767 8.55615 5.88767 8.83115C5.88767 9.10615 5.98454 9.34053 6.17829 9.53428C6.37204 9.72803 6.60642 9.8249 6.88142 9.8249H8.17517Z"
          fill={props.color || "#4999FA"}
          pointerEvents="none"
        />
      </g>
    </svg>
  );
}
