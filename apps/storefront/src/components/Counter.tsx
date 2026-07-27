import { useEffect, useRef, useState } from 'react';

interface Props {
  target: number;
  suffix?: string;
  duration?: number;
}

export function Counter({ target, suffix = '', duration = 1800 }: Props) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setVal(Math.floor(eased * target));
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}