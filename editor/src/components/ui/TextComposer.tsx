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
          className="flex items-center gap-1 rounded-t border border-b-0 border-gray-3 bg-gray-2 px-2.5 py-2 text-label-sm"
        >
          <span>{props.label}</span>
          <CommunityIcon className="text-gray-8" aria-hidden />
          <span className="font-semibold">{props.eventName}</span>
        </label>
        <textarea
          className="w-full resize-none rounded-b border border-t-0 border-gray-3 bg-gray-1 p-2.5 text-b3 focus:outline-none"
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
          className="wv-ibmplex flex w-full items-center justify-center gap-2 rounded-full border-2 py-2.5 text-button font-bold hover:bg-blue-2"
          onClick={handleSubmit}
        >
          <ArrowUpwardIcon className="h-4.5 w-4.5" aria-hidden />
          ส่ง
        </button>
      )}
    </div>
  );
}
