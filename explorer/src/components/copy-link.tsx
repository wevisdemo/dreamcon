import { useEffect, useState } from 'react';
import { ShareIcon } from '../icons/share';
import { Button } from './button';

const COPIED_DURATION = 10_000;

export function CopyLink({
  path,
  className = '',
}: {
  path: string;
  className?: string;
}) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;
    const timeout = setTimeout(() => setIsCopied(false), COPIED_DURATION);
    return () => clearTimeout(timeout);
  }, [isCopied]);

  return (
    <Button
      variant="tertiary-white"
      icon={<ShareIcon />}
      onClick={async () => {
        await navigator.clipboard.writeText(
          new URL(path, window.location.origin).href
        );
        setIsCopied(true);
      }}
      className={className}
    >
      {isCopied ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}
    </Button>
  );
}
