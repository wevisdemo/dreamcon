import React, { useState } from 'react';
import CloseIcon from '@material-symbols/svg-700/rounded/close.svg?react';
import DeleteIcon from '@material-symbols/svg-700/rounded/delete.svg?react';
import EditIcon from '@material-symbols/svg-700/rounded/edit.svg?react';
import KeyboardArrowDownIcon from '@material-symbols/svg-700/rounded/keyboard_arrow_down.svg?react';
import KeyboardArrowUpIcon from '@material-symbols/svg-700/rounded/keyboard_arrow_up.svg?react';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Popper from '@mui/material/Popper';

interface TagPickerProps {
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  onRename: (tag: string, next: string) => Promise<void>;
  onDelete: (tag: string) => Promise<void>;
  placeholder: string;
  hint: string;
}

interface TagAction {
  type: 'rename' | 'delete';
  tag: string;
}

const tagClassName =
  'rounded-full border border-blue-4 bg-blue-2 px-2.5 py-1 text-blue-7';

const iconButtonClassName =
  'flex h-7 w-7 items-center justify-center text-gray-8 hover:cursor-pointer rounded hover:bg-gray-2';

const collator = new Intl.Collator('th');

const TagPicker: React.FC<TagPickerProps> = ({
  label,
  options,
  selected,
  onChange,
  onRename,
  onDelete,
  placeholder,
  hint,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
  const [rowAnchor, setRowAnchor] = useState<HTMLDivElement | null>(null);
  const [action, setAction] = useState<TagAction | null>(null);
  const [draft, setDraft] = useState('');

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

  const startAction = (next: TagAction) => {
    setAction(next);
    setDraft(next.tag);
  };

  const nextName = draft.trim();
  const canSubmitRename =
    nextName !== '' && nextName !== action?.tag && !options.includes(nextName);

  const submitAction = async () => {
    if (!action) return;
    const { type, tag } = action;
    setAction(null);
    if (type === 'rename') {
      await onRename(tag, nextName);
      onChange([...new Set(selected.map(s => (s === tag ? nextName : s)))]);
    } else {
      await onDelete(tag);
      onChange(selected.filter(s => s !== tag));
    }
  };

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
            <div className="flex max-h-60 flex-col overflow-y-auto">
              {matches.map(option => (
                <div key={option}>
                  <div
                    ref={action?.tag === option ? setRowAnchor : undefined}
                    className={`group flex items-center justify-between gap-2.5 p-1.25 hover:bg-gray-1 ${
                      action?.tag === option ? 'bg-gray-1' : ''
                    }`}
                  >
                    <button
                      type="button"
                      className={`${tagClassName} hover:cursor-pointer`}
                      onClick={() => add(option)}
                    >
                      {option}
                    </button>
                    <div className="flex opacity-0 group-focus-within:opacity-100 group-hover:opacity-100">
                      <button
                        type="button"
                        aria-label={`แก้ไข ${option}`}
                        className={iconButtonClassName}
                        onClick={() =>
                          startAction({ type: 'rename', tag: option })
                        }
                      >
                        <EditIcon className="h-4 w-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        aria-label={`ลบแท็ก ${option}`}
                        className={iconButtonClassName}
                        onClick={() =>
                          startAction({ type: 'delete', tag: option })
                        }
                      >
                        <DeleteIcon className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Popper>
        <Popper
          open={isOpen && !!action && !!rowAnchor}
          anchorEl={rowAnchor}
          placement="bottom"
          disablePortal
          popperOptions={{ strategy: 'fixed' }}
          className="z-30"
        >
          <div className="my-1 flex w-75 translate-x-12 flex-col items-center gap-2.5 rounded-2xl border border-gray-3 bg-white px-4 py-2.5 shadow-md">
            {action?.type === 'rename' ? (
              <input
                type="text"
                aria-label="ชื่อแท็กใหม่"
                autoFocus
                className="h-8.75 w-full rounded-lg border border-gray-3 bg-gray-1 px-2.5 focus:outline-none"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (canSubmitRename) submitAction();
                  } else if (e.key === 'Escape') setAction(null);
                }}
              />
            ) : (
              <p className="w-full">
                หากกดลบ แท็กนี้จะถูกลบออกจากวงสนทนาอื่น ๆ ทั้งหมดด้วย
              </p>
            )}
            <div className="flex w-full items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={action?.type === 'rename' && !canSubmitRename}
                className="wv-ibmplex rounded-full bg-blue-6 px-4 py-2.5 text-button font-bold text-white shadow-md disabled:bg-gray-2 disabled:text-gray-5 disabled:shadow-none"
                onClick={submitAction}
              >
                {action?.type === 'rename' ? 'ส่ง' : 'ยืนยัน'}
              </button>
              <button
                type="button"
                className="px-2 text-label text-gray-5 underline"
                onClick={() => setAction(null)}
              >
                ปิด
              </button>
            </div>
          </div>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

export default TagPicker;
