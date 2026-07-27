// apps/storefront/src/components/DropDivider.tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

export function DropDivider() {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pathRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        pathRef.current,
        { attr: { d: 'M50 10 C 20 40, 20 70, 50 70 C 80 70, 80 40, 50 10 Z' } }, // resting drop
        {
          attr: { d: 'M50 0 C 35 30, 35 90, 50 100 C 65 90, 65 30, 50 0 Z' }, // stretched, falling
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex justify-center py-8">
      <svg width="40" height="60" viewBox="0 0 100 100" className="fill-tide">
        <path ref={pathRef} d="M50 10 C 20 40, 20 70, 50 70 C 80 70, 80 40, 50 10 Z" />
      </svg>
    </div>
  );
}