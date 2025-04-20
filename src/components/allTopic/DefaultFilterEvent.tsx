import { useState } from "react";

interface PropTypes {
  onClick: () => void;
  isSelected?: boolean;
  count: number;
}

export default function DefaultFilterEvent(props: PropTypes) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex flex-col items-center h-[112px] justify-end"
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      <div
        className={`w-[75px] h-[75px] rounded-full cursor-pointer flex items-center justify-center ${
          !props.isSelected && hovered ? "border-2 border-gray8" : ""
        } ${
          props.isSelected ? "bg-blue6 text-white" : "bg-blue1 text-[#4999FA]"
        }`}
        onClick={() => props.onClick()}
      >
        <span className="text-[20px] wv-bold">{props.count}</span>
      </div>
      <p
        className={`text-[10px] text-gray5 px-[5px] py-[3px] text-center whitespace-nowrap ${
          props.isSelected ? "bg-blue6 rounded-full text-white wv-semibold" : ""
        }`}
      >
        จากทุกวงสนทนา
      </p>
    </div>
  );
}
