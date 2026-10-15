import { useEffect, useState } from 'react';

const COUNT_UP_DURATION = 1500;

function CountUp({ to }: { to: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / COUNT_UP_DURATION, 1);
      setValue(Math.round(to * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [to]);

  return value;
}

export function StatCounter({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-1 flex-col md:flex-none md:items-center">
      <span className="rounded-full bg-white px-7.5 py-1 text-h4 font-bold tabular-nums">
        <CountUp to={value} />
      </span>
      <span className="rounded-full bg-white px-2.5 py-1 text-h9 font-bold whitespace-nowrap md:px-5">
        {label}
      </span>
    </div>
  );
}
