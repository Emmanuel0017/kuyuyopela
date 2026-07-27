import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProductsControllerFindAll } from '@kuyuyopela/api-client';
import { Reveal } from '../components/Reveal';
import { useCartStore } from '../store/cartStore';

const fmt = (n: number) => `MK${n.toLocaleString()}`;

export function ShopPage() {
  const { data: products, isLoading } = useProductsControllerFindAll({ includeInactive: 'false' });
  const [filter, setFilter] = useState<string>('All');
  const addItem = useCartStore((s) => s.addItem);

  const cats = useMemo(() => {
    const set = new Set<string>();
    products?.forEach((p) => p.category && set.add(p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  const filtered = !products
    ? []
    : filter === 'All'
      ? products
      : products.filter((p) => p.category === filter);

  if (isLoading) return <div className="p-6">Loading products…</div>;

  return (
    <div>
      <div className="page-header">
        <div className="container mx-auto max-w-[1200px] px-5">
          <h1>Shop Our Products</h1>
          <p>High quality skincare solutions for healthy, glowing skin.</p>
        </div>
      </div>
      <section className="section">
        <div className="container mx-auto max-w-[1200px] px-5">
          <Reveal>
            <div className="filters">
              {cats.map((c) => (
                <button key={c} className={`filter-btn border-2 ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>
                  {c}
                </button>
              ))}
            </div>
          </Reveal>
          <Reveal variant="stagger" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.length === 0 && (
              <div className="col-span-full text-center text-neutral-500 py-12">
                No products in this category yet.
              </div>
            )}
            {filtered.map((p) => (
              <div className="product-card" key={p.id}>
                <Link to={`/product/${p.id}`} className="img-wrap block">
                  {p.imageUrl
                    ? <img src={p.imageUrl} alt={p.name} />
                    : <div className="w-full h-full bg-tide/10 flex items-center justify-center text-tide">No image</div>}
                </Link>
                <div className="body">
                  <h4><Link to={`/product/${p.id}`} className="text-inherit no-underline">{p.name}</Link></h4>
                  <div className="price">{fmt(p.price)}</div>
                  {p.stock === 0 && <span className="text-xs text-red-600">Out of stock</span>}
                  <button
                    disabled={p.stock === 0}
                    className="btn btn-primary btn-sm btn-block border-0 disabled:opacity-50"
                    onClick={() => addItem({ productId: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl })}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  );
}