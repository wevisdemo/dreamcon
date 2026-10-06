import type { ButtonHTMLAttributes } from 'react';
import type { CommentView } from '../constants/comment-views';

const views: Record<CommentView, { default: string; selected: string }> = {
  เห็นด้วย: {
    default: 'border-green-4 bg-green-2 hover:bg-green-3',
    selected: 'border-green-4 bg-green-4',
  },
  เห็นด้วยบางส่วน: {
    default: 'border-yellow-3 bg-yellow-1 hover:bg-yellow-2',
    selected: 'border-yellow-3 bg-yellow-3',
  },
  ไม่เห็นด้วย: {
    default: 'border-red-4 bg-red-2 hover:bg-red-3',
    selected: 'border-red-4 bg-red-4',
  },
};

const sizes = {
  medium: 'h-7 px-2.5 text-b6',
  small: 'h-5.5 px-1.25 text-b7',
};

export function CommentTag({
  view,
  count,
  size = 'medium',
  selected = false,
  className = '',
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  view: CommentView;
  count: number;
  size?: keyof typeof sizes;
  selected?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border ${selected ? `${views[view].selected} text-black` : `${views[view].default} text-gray-6 hover:text-gray-7`} ${sizes[size]} ${className}`}
      {...props}
    >
      <span className="[text-box:trim-both_cap_alphabetic]">
        {count} {view}
      </span>
    </button>
  );
}
