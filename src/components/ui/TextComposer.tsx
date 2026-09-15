import ArrowUpwardIcon from '@material-symbols/svg-700/rounded/arrow_upward.svg?react';
import CommunityIcon from '../icon/CommunityIcon';

const ROWS = 3;
const MAX_LENGTH = 140;

interface PropTypes {
  id: string;
  label: string;
  eventName: string;
  value: string;
  placeholder: string;
  autoFocus?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export default function TextComposer(props: PropTypes) {
  const canSubmit = props.value.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    props.onSubmit();
  };

  return (
    <div className="flex flex-col gap-2">
      <div>
        <label
          htmlFor={props.id}
          className="px-2.5 py-2 bg-gray-2 flex gap-1 text-label-sm border border-gray-3 border-b-0 rounded-t items-center"
        >
          <span>{props.label}</span>
          <CommunityIcon className="text-gray-8" aria-hidden />
          <span className="font-semibold">{props.eventName}</span>
        </label>
        <textarea
          className="w-full p-2.5 text-b3 bg-gray-1 resize-none focus:outline-none border border-t-0 border-gray-3 rounded-b"
          name={props.id}
          id={props.id}
          rows={ROWS}
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={props.placeholder}
          maxLength={MAX_LENGTH}
          autoFocus={props.autoFocus}
        />
      </div>
      {canSubmit && (
        <button
          className="w-full py-2.5 flex items-center justify-center gap-2 hover:bg-blue-2 border-2 rounded-full wv-ibmplex text-button font-bold"
          onClick={handleSubmit}
        >
          <ArrowUpwardIcon className="w-4.5 h-4.5" aria-hidden />
          ส่ง
        </button>
      )}
    </div>
  );
}
