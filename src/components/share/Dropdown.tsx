import React, { useState } from 'react';

interface DropdownProps {
  options: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  onSelect,
  placeholder = 'Select an option',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="dropdown relative w-[116px] z-30">
      <button
        className="dropdown-toggle flex justify-between gap-[4px] bg-blue6 px-[12px] py-[5px] rounded-[48px] text-white w-[116px]"
        onClick={handleToggle}
      >
        <span className="truncate">{selectedOption || placeholder}</span>
        <img className="hover:cursor-pointer" src="/icon/arrow-down.svg" />
      </button>
      {isOpen && (
        <ul className="dropdown-menu absolute top-[100%] left-0 bg-white w-[116px] border border-gray3 text-blue7 rounded-[12px] overflow-hidden">
          {options.map((option, index) => (
            <li
              key={index}
              className="dropdown-item px-[16px] py-[6px] hover:bg-gray1 hover:cursor-pointer"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
