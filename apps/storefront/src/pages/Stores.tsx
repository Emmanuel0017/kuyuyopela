import { useState } from 'react';
import { useStoresControllerFindAll } from '@kuyuyopela/api-client';
import { Reveal } from '../components/Reveal';
import { cn } from '../lib/cn';

export function StoresPage() {
  const { data: stores, isLoading } = useStoresControllerFindAll();
  const [active, setActive] = useState<number | null>(null);

  if (isLoading) return <div className="page-header"><div className="container"><h1>Loading…</h1></div></div>;

  return (
    <div>
      <div className="page-header">
        <div className="container mx-auto max-w-[1200px] px-5">
          <h1>Find One Drop Near You</h1>
          <p>We have agents in major cities across Malawi.</p>
        </div>
      </div>
      <section className="section">
        <div className="container mx-auto max-w-[1200px] px-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          {stores?.length === 0 ? (
            <div className="col-span-full text-center text-neutral-500 py-12">
              No store locations yet — they'll appear here once added in the admin dashboard.
            </div>
          ) : (
            <>
              <Reveal variant="stagger" className="flex flex-col gap-3">
                {stores?.map((s, i) => (
                  <div key={s.id} className={cn('store-item', active === i && 'active')} onClick={() => setActive(i)}>
                    <div className="font-bold">{s.city}</div>
                    <div className="text-[13px] text-neutral-500">{s.address}</div>
                    <div className="text-[13px] text-tide">{s.phone}</div>
                  </div>
                ))}
              </Reveal>
              <Reveal variant="zoom" className="map-placeholder">
                {active === null ? 'Select a location to view on map' : (
                  <div>
                    📍 <strong>{stores![active].city}</strong>
                    <br />{stores![active].address}
                    <br />{stores![active].phone}
                  </div>
                )}
              </Reveal>
            </>
          )}
        </div>
      </section>
    </div>
  );
}