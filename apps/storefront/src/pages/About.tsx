import { useEffect } from 'react';
import { useSettingsControllerGet } from '@kuyuyopela/api-client';
import { Counter } from '../components/Counter';
import { Reveal } from '../components/Reveal';

const FALLBACK_IMG = 'https://placehold.co/560x400/e6f0ea/0B3D24?text=Our+Team';

export function AboutPage() {
  const { data: settings, isLoading } = useSettingsControllerGet();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (isLoading) return <div className="p-6">Loading…</div>;

  const aboutImg = settings?.aboutImageUrl ?? FALLBACK_IMG;
  const siteName = settings?.siteName ?? 'Kuyuyopela Industries';

  return (
    <div>
      <div className="page-header">
        <div className="container mx-auto max-w-300 px-5">
          <h1>About {siteName}</h1>
          <p>Malawian-made skincare, trusted nationwide.</p>
        </div>
      </div>
      <section className="section">
        <div className="container mx-auto max-w-300 px-5 grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          <Reveal variant="left" className="img-reveal in">
            <img src={aboutImg} className="rounded-xl" alt={`${siteName} facility`} />
          </Reveal>
          <Reveal variant="right">
            <h3 className="mb-3 text-2xl font-display">Our Story</h3>
            <p className="text-neutral-500 mb-3.5">
              Kuyuyopela Industries was founded with a simple mission: to make effective, affordable skincare accessible to every Malawian household. Our flagship product, One Drop, was developed to address common skin concerns like acne, dark spots, and oily skin using ingredients suited to our climate.
            </p>
            <p className="text-neutral-500">
              Today, we serve over 10,000 customers through a growing network of agents and stockists across the country, backed by a commitment to quality, safety, and affordability.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container mx-auto max-w-300 px-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Reveal variant="zoom" className="stat-box"><h2><Counter target={10000} suffix="+" /></h2><p>Happy Customers</p></Reveal>
          <Reveal variant="zoom" className="stat-box"><h2><Counter target={50} suffix="+" /></h2><p>Agents Nationwide</p></Reveal>
          <Reveal variant="zoom" className="stat-box"><h2><Counter target={100} suffix="%" /></h2><p>Made in Malawi</p></Reveal>
        </div>
      </section>
    </div>
  );
}