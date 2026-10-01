import React, { useState } from 'react';
import CloseIcon from '@material-symbols/svg-700/rounded/close.svg?react';
import KeyboardArrowDownIcon from '@material-symbols/svg-700/rounded/keyboard_arrow_down.svg?react';
import KeyboardArrowUpIcon from '@material-symbols/svg-700/rounded/keyboard_arrow_up.svg?react';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Popper from '@mui/material/Popper';

interface TagPickerProps {
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
  hint: string;
}

const tagClassName =
  'rounded-full border border-blue-4 bg-blue-2 px-2.5 py-1 text-blue-7';

const collator = new Intl.Collator('th');

const TagPicker: React.FC<TagPickerProps> = ({
  label,
  options,
  selected,
  onChange,
  placeholder,
  hint,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);

  const trimmedQuery = query.trim();
  const matches = options
    .filter(
      option =>
        !selected.includes(option) &&
        option.toLowerCase().includes(trimmedQuery.toLowerCase())
    )
    .sort(collator.compare);
  const canCreate =
    trimmedQuery !== '' &&
    !options.includes(trimmedQuery) &&
    !selected.includes(trimmedQuery);

  const add = (value: string) => {
    onChange([...selected, value]);
    setQuery('');
  };

  const remove = (value: string) => onChange(selected.filter(s => s !== value));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (canCreate) add(trimmedQuery);
      else if (trimmedQuery && matches.length > 0) add(matches[0]);
    } else if (e.key === 'Backspace' && query === '' && selected.length > 0) {
      remove(selected[selected.length - 1]);
    }
  };

  const ArrowIcon = isOpen ? KeyboardArrowUpIcon : KeyboardArrowDownIcon;

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <div className="relative w-full">
        <div
          ref={setAnchor}
          className="flex min-h-8.75 w-full items-center gap-1 rounded-lg border border-gray-3 bg-gray-1 px-2.5 py-1"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex flex-1 flex-wrap items-center gap-1">
            {selected.map(value => (
              <span
                key={value}
                className={`flex items-center gap-1 ${tagClassName}`}
              >
                {value}
                <button
                  type="button"
                  aria-label={`ลบ ${value}`}
                  className="hover:cursor-pointer"
                  onClick={() => remove(value)}
                >
                  <CloseIcon className="h-3 w-3" aria-hidden />
                </button>
              </span>
            ))}
            <input
              type="text"
              aria-label={label}
              className="min-w-16 flex-1 bg-transparent focus:outline-none"
              placeholder={selected.length === 0 ? placeholder : ''}
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <ArrowIcon className="h-4 w-4 shrink-0 text-gray-8" aria-hidden />
        </div>
        <Popper
          open={isOpen}
          anchorEl={anchor}
          placement="bottom-start"
          disablePortal
          className="z-10 w-full"
        >
          <div className="my-1 flex flex-col gap-1.5 rounded-lg border border-gray-3 bg-white p-2.5">
            <p className="text-label text-gray-5">{hint}</p>
            {canCreate && (
              <button
                type="button"
                className="flex items-center gap-2 hover:cursor-pointer"
                onClick={() => add(trimmedQuery)}
              >
                สร้าง
                <span className="rounded-full border border-gray-4 bg-gray-2 px-2.5 py-0.5 text-gray-6">
                  {trimmedQuery}
                </span>
              </button>
            )}
            <div className="flex max-h-60 flex-wrap gap-1 overflow-y-auto">
              {matches.map(option => (
                <button
                  key={option}
                  type="button"
                  className={`${tagClassName} hover:cursor-pointer hover:bg-blue-2`}
                  onClick={() => add(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

export default TagPicker;
