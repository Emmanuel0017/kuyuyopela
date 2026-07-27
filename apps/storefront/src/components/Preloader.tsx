import { useEffect, useState } from 'react';

export function Preloader() {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHide(true), 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`preloader ${hide ? 'hide' : ''}`} aria-hidden={hide}>
      <div className="drop" />
      <div className="pl-title">ONE DROP</div>
      <div className="pl-sub">Kuyuyopela Industries</div>
      <div className="pl-bar" />
    </div>
  );
}