import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  useProductsControllerFindAll,
  useTestimonialsControllerFindAll,
} from '@kuyuyopela/api-client';
import {
  FaCheck,
  FaShieldAlt,
  FaFlask,
  FaFlag,
  FaTruck,
  FaMoneyBillWave,
  FaArrowDown,
  FaArrowUp,
  FaHandshake,
  FaStar,
  FaRegStar,
} from 'react-icons/fa';
import { LiquidDrop } from '../components/LiquidDrop';
import { Marquee } from '../components/Marquee';
import { Reveal } from '../components/Reveal';
import { useCartStore } from '../store/cartStore';
import { useSettingsControllerGet } from '@kuyuyopela/api-client';

function AboutImage() {
  const { data: settings } = useSettingsControllerGet();
  const src = settings?.aboutImageUrl ?? 'https://placehold.co/560x360/e6f0ea/0B3D24?text=Manufacturing+Facility';
  return <img src={src} className="rounded-xl" alt="facility" />;
}

gsap.registerPlugin(ScrollTrigger);

const fmt = (n: number) => `MK${n.toLocaleString()}`;

export function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { data: products } = useProductsControllerFindAll({ includeInactive: 'false' });
  const { data: testimonials } = useTestimonialsControllerFindAll();
  const featured = products?.slice(0, 4) ?? [];
  const recent = testimonials?.slice(0, 4) ?? [];
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-eyebrow', { opacity: 0, y: 12, duration: 0.6 })
        .from('.hero-title', { opacity: 0, y: 24, duration: 0.8 }, '-=0.3')
        .from('.hero-sub', { opacity: 0, y: 16, duration: 0.6 }, '-=0.4')
        .from('.hero-feats', { opacity: 0, y: 12, duration: 0.5 }, '-=0.3')
        .from('.hero-cta-row', { opacity: 0, y: 12, duration: 0.5 }, '-=0.3')
        .from('.drop-stage', { scale: 0, opacity: 0, duration: 1, ease: 'back.out(1.4)' }, '-=0.7');
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div>
      <section ref={heroRef} className="hero relative">
        <div className="hero-floating-shapes" aria-hidden="true">
          <div className="shape s1" /><div className="shape s2" /><div className="shape s3" />
        </div>
        <div className="container mx-auto max-w-[1200px] px-5 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center relative z-[2]">
          <div>
            <span className="hero-eyebrow">#1 Liquid Bathing Soap in Malawi</span>
            <h1 className="hero-title mt-3.5">
              <span className="hero-word"><span>Clearer</span></span>{' '}
              <span className="hero-word"><span>Skin</span></span>{' '}
              <span className="hero-word"><span>Starts</span></span>{' '}
              <span className="hero-word"><span>With</span></span>{' '}
              <span className="hero-word"><span className="shimmer-text">One Drop.</span></span>
            </h1>
            <p className="hero-sub text-neutral-500 mt-4 max-w-[480px]">
              Fights pimples, dark spots, oily skin and body acne. Feel the difference in just one week.
            </p>
            <div className="hero-feats">
              <div><FaCheck className="inline-block mr-2 align-middle" />Clears Pimples</div>
              <div><FaCheck className="inline-block mr-2 align-middle" />Fades Dark Spots</div>
              <div><FaCheck className="inline-block mr-2 align-middle" />Deep Cleansing</div>
              <div><FaCheck className="inline-block mr-2 align-middle" />Brightens Skin</div>
            </div>
            <div className="hero-cta-row mt-5">
              <Link to="/shop" className="btn btn-primary glow-btn no-underline">Order Now</Link>
              <a href="https://wa.me/265999666670" target="_blank" rel="noreferrer" className="btn btn-outline no-underline">WhatsApp Us</a>
            </div>
          </div>
          <div className="flex justify-center"><LiquidDrop /></div>
        </div>
      </section>

      <Reveal className="trust-bar">
        <div><FaShieldAlt className="inline-block mr-2 align-middle" />Trusted by 10,000+ Customers</div>
        <div><FaFlask className="inline-block mr-2 align-middle" />Clinically Inspired Formula</div>
        <div><FaFlag className="inline-block mr-2 align-middle" />Made in Malawi</div>
        <div><FaTruck className="inline-block mr-2 align-middle" />Fast &amp; Safe Delivery</div>
      </Reveal>

      <Marquee />

      <section className="section">
        <div className="container mx-auto max-w-[1200px] px-5">
          <Reveal className="text-center">
            <div className="section-tag">Real People. Real Results.</div>
            <h2 className="section-title">See The <span className="accent">Difference</span></h2>
          </Reveal>
          <Reveal variant="stagger" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recent.length === 0 && (
              <div className="col-span-full text-center text-neutral-500 py-8">
                Results will appear here once added in the admin dashboard.
              </div>
            )}
            {recent.map((t) => (
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
          <Reveal className="text-center mt-8">
            <Link to="/results" className="btn btn-outline no-underline">View All Results</Link>
          </Reveal>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container mx-auto max-w-[1200px] px-5">
          <Reveal className="text-center">
            <div className="section-tag">Shop Our Products</div>
            <h2 className="section-title">Our <span className="accent">Best Sellers</span></h2>
          </Reveal>
          <Reveal variant="stagger" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.length === 0 && (
              <div className="col-span-full text-center text-neutral-500 py-8">
                No products yet — add them in the admin dashboard.
              </div>
            )}
            {featured.map((p) => (
              <div className="product-card" key={p.id}>
                <Link to={`/product/${p.id}`} className="img-wrap block">
                  {p.imageUrl
                    ? <img src={p.imageUrl} alt={p.name} />
                    : <div className="w-full h-full bg-tide/10 flex items-center justify-center text-tide">No image</div>}
                </Link>
                <div className="body">
                  <h4><Link to={`/product/${p.id}`} className="text-inherit no-underline">{p.name}</Link></h4>
                  <div className="price">{fmt(p.price)}</div>
                  <button
                    className="btn btn-primary btn-sm btn-block border-0"
                    onClick={() => addItem({
                      productId: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl,
                    })}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </Reveal>
          <Reveal className="text-center mt-8">
            <Link to="/shop" className="btn btn-primary no-underline">View All Products</Link>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container mx-auto max-w-[1200px] px-5 grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          <Reveal variant="left" className="bg-white p-5 rounded-xl shadow-sm">
            <div className="section-tag !text-left !block" style={{ left: 0, transform: 'none' }}>Become an Agent</div>
            <h3 className="text-2xl mb-2.5 font-display">Start Your Own Profitable Business</h3>
            <p className="text-neutral-500 mb-4">Join hundreds of successful One Drop agents nationwide.</p>
            <ul className="list-none p-0 mb-4 text-sm space-y-2">
              <li><FaCheck className="inline-block mr-2 align-middle text-tide" />Attractive wholesale prices</li>
              <li><FaCheck className="inline-block mr-2 align-middle text-tide" />Marketing materials provided</li>
              <li><FaCheck className="inline-block mr-2 align-middle text-tide" />Training &amp; support</li>
              <li><FaCheck className="inline-block mr-2 align-middle text-tide" />Fast delivery to your area</li>
            </ul>
            <Link to="/agents" className="btn btn-primary no-underline">Apply Now</Link>
          </Reveal>
          <Reveal variant="right" className="benefit-box">
            <h4 className="font-display">Agent Benefits</h4>
            <ul className="list-none p-0 relative">
              <li><FaMoneyBillWave className="inline-block mr-2 align-middle text-tide" />High Profit Margins</li>
              <li><FaArrowDown className="inline-block mr-2 align-middle text-tide" />Low Investment</li>
              <li><FaArrowUp className="inline-block mr-2 align-middle text-tide" />Big Demand</li>
              <li><FaHandshake className="inline-block mr-2 align-middle text-tide" />Nationwide Support</li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container mx-auto max-w-[1200px] px-5">
          <Reveal className="text-center">
            <div className="section-tag">About Us</div>
            <h2 className="section-title">Kuyuyopela <span className="accent">Industries</span></h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
            <Reveal variant="left" className="img-reveal in">
  <AboutImage />
</Reveal>
            <Reveal variant="right">
              <p className="text-neutral-500 mb-4">
                We are a Malawian skincare manufacturing company committed to providing high quality, effective and affordable skincare solutions for every household.
              </p>
              <ul className="list-none p-0 mb-4 text-sm space-y-2">
                <li><FaCheck className="inline-block mr-2 align-middle text-tide" />Quality Ingredients</li>
                <li><FaCheck className="inline-block mr-2 align-middle text-tide" />Safe &amp; Effective</li>
                <li><FaCheck className="inline-block mr-2 align-middle text-tide" />Affordable Pricing</li>
              </ul>
              <Link to="/about" className="btn btn-outline no-underline">Read Our Story</Link>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
