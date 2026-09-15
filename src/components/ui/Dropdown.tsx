import React, { useState } from 'react';
import CheckIcon from '@material-symbols/svg-700/rounded/check.svg?react';
import KeyboardArrowDownIcon from '@material-symbols/svg-700/rounded/keyboard_arrow_down.svg?react';
import ClickAwayListener from '@mui/material/ClickAwayListener';

interface DropdownProps {
  options: readonly string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  disabledOptions?: string[];
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selected,
  onChange,
  disabledOptions = [],
  placeholder = 'Select an option',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  /** Anything already selected stays listed, so a retired option can still be unticked. */
  const items = [...new Set([...options, ...selected])];

  /** Never disable what is already ticked, or it could not be unticked again. */
  const isDisabled = (option: string) =>
    disabledOptions.includes(option) && !selected.includes(option);

  const toggle = (option: string) =>
    onChange(
      selected.includes(option)
        ? selected.filter(s => s !== option)
        : [...selected, option]
    );

  const label =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? selected[0]
        : `${selected[0]} +${selected.length - 1}`;

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <div className="dropdown relative z-30 w-full">
        <button
          className="dropdown-toggle flex w-full justify-between gap-1 rounded-full bg-blue-6 px-4 py-2.5 text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="truncate">{label}</span>
          <KeyboardArrowDownIcon
            className="h-4 w-4 shrink-0 self-center hover:cursor-pointer"
            aria-hidden
          />
        </button>
        {isOpen && (
          <ul className="dropdown-menu absolute top-full left-0 max-h-72 w-full overflow-y-auto rounded-xl border border-gray-3 bg-white text-blue-7">
            {items.map(option => (
              <li
                key={option}
                className={`dropdown-item ${
                  isDisabled(option) ? 'text-gray-4' : 'hover:bg-gray-1'
                }`}
              >
                <label
                  className={`flex items-center gap-2 px-4 py-2 ${
                    isDisabled(option)
                      ? 'hover:cursor-not-allowed'
                      : 'hover:cursor-pointer'
                  }`}
                >
                  <span className="relative flex shrink-0">
                    <input
                      type="checkbox"
                      className="peer h-3 w-3 appearance-none rounded-sm border-[1.5px] border-blue-7 bg-transparent checked:bg-blue-7 disabled:border-gray-4"
                      checked={selected.includes(option)}
                      disabled={isDisabled(option)}
                      onChange={() => toggle(option)}
                    />
                    <CheckIcon
                      className="pointer-events-none absolute inset-0 hidden h-3 w-3 text-white peer-checked:block"
                      aria-hidden
                    />
                  </span>
                  <span className="truncate">{option}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default Dropdown;
