import { useTestimonialsControllerFindAll } from '@kuyuyopela/api-client';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { Reveal } from '../components/Reveal';

export function ResultsPage() {
  const { data: testimonials, isLoading } = useTestimonialsControllerFindAll();

  if (isLoading) return <div className="p-6">Loading…</div>;

  // first 6 = the before/after grid
  const featured = testimonials?.slice(0, 6) ?? [];
  // next 3 = the "more testimonials" text-only section
  const more = testimonials?.slice(6, 9) ?? [];

  return (
    <div>
      <div className="page-header">
        <div className="container mx-auto max-w-[1200px] px-5">
          <h1>Visible Results You Can Trust</h1>
          <p>Real customers. Real stories.</p>
        </div>
      </div>

      <section className="section">
        <div className="container mx-auto max-w-[1200px] px-5">
          {featured.length === 0 && (
            <div className="text-center text-neutral-500 py-12">
              No results yet — they'll appear here once added in the admin dashboard.
            </div>
          )}
          <Reveal variant="stagger" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((t) => (
              <div className="ba-card" key={t.id}>
                <div className="ba-imgs">
                  <div><span className="ba-label">Before</span>
                    <img src={t.beforeImage ?? 'https://placehold.co/300x220/999/fff?text=Before'} alt="before" />
                  </div>
                  <div><span className="ba-label">After</span>
                    <img src={t.afterImage ?? 'https://placehold.co/300x220/198754/fff?text=After'} alt="after" />
                  </div>
                </div>
                <div className="ba-info">
                  <div className="stars flex gap-0.5 text-gold">
                    {Array.from({ length: 5 }).map((_, i) =>
                      i < t.rating
                        ? <FaStar key={i} className="inline-block" />
                        : <FaRegStar key={i} className="inline-block" />
                    )}
                  </div>
                  <div className="font-semibold text-sm">{t.note ?? ''}</div>
                  <div className="text-neutral-500 text-[13px]">— {t.name}, {t.location}</div>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container mx-auto max-w-[1200px] px-5">
          <h2 className="section-title">More <span className="accent">Testimonials</span></h2>
          <Reveal variant="stagger" className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {more.length === 0 && featured.length === 0 && (
              <div className="col-span-full text-center text-neutral-500 py-12">
                No reviews yet.
              </div>
            )}
            {more.map((t) => (
              <div className="bg-white p-5 rounded-xl shadow-sm" key={t.id}>
                <div className="stars flex gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) =>
                    i < t.rating
                      ? <FaStar key={i} className="inline-block" />
                      : <FaRegStar key={i} className="inline-block" />
                  )}
                </div>
                <p className="my-2.5 text-neutral-500 text-sm">"{t.note ?? ''}"</p>
                <div className="font-semibold text-[13px]">{t.name}, {t.location}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
