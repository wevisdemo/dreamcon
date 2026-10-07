import { useEffect, useState } from 'react';
import { ArrowUpIcon } from '../icons/arrow-up';
import { Button } from './button';

export function BackToTopButton() {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsShown(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Button
      variant="primary-gray"
      size="small"
      icon={<ArrowUpIcon />}
      inert={!isShown}
      onClick={() => window.scrollTo({ top: 0 })}
      className={`fixed bottom-5 left-1/2 z-10 -translate-x-1/2 motion-safe:transition-[translate,visibility] motion-safe:duration-300 ${isShown ? '' : 'invisible translate-y-[calc(100%+(--spacing(5)))]'}`}
    >
      กลับด้านบน
    </Button>
  );
}
