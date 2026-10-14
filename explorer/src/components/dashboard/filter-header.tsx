import { CloseIcon } from '../../icons/close';
import { Button } from '../button';

export function FilterHeader({
  title,
  selectionLabel,
  clearLabel,
  onClear,
}: {
  title: string;
  selectionLabel?: string;
  clearLabel: string;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col px-2.5 pt-2.5">
      <p className="text-b6 font-bold text-gray-8">{title}</p>
      {selectionLabel !== undefined && (
        <>
          <p className="truncate text-b7 text-blue-7">
            กรองเฉพาะ: {selectionLabel}
          </p>
          <Button
            variant="tertiary-gray"
            icon={<CloseIcon />}
            onClick={onClear}
            className="my-1 self-end"
          >
            {clearLabel}
          </Button>
        </>
      )}
    </div>
  );
}
