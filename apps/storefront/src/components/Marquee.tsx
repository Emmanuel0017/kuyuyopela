interface Props {
  items?: string[];
}

const DEFAULT_ITEMS = [
  'Clearer Skin', 'One Drop', 'Malawian Made', 'Trusted Nationwide',
  'Real Results', 'Glowing Confidence',
];

export function Marquee({ items = DEFAULT_ITEMS }: Props) {
  // duplicate for seamless loop
  const looped = [...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {looped.map((label, i) => (
          <span key={i}>
            {label}
            <span className="dot" />
          </span>
        ))}
      </div>
    </div>
  );
}