import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProductsControllerFindOne } from '@kuyuyopela/api-client';
import { FaCheck, FaArrowLeft } from 'react-icons/fa';
import { useCartStore } from '../store/cartStore';
import { Reveal } from '../components/Reveal';

const fmt = (n: number) => `MK${n.toLocaleString()}`;

export function ProductPage() {
  const { id } = useParams();
  const { data: product, isLoading } = useProductsControllerFindOne(id!);
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (isLoading) return <div className="p-6">Loading…</div>;
  if (!product) return <div className="p-6">Product not found.</div>;

  return (
    <div>
      <section className="section">
        <div className="container mx-auto max-w-300 px-5">
          <Link to="/shop" className="btn btn-outline btn-sm inline-block mb-5 no-underline"><FaArrowLeft className="inline-block mr-1 align-middle" />Back to Shop</Link>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Reveal variant="left" className="img-reveal in">
{product.imageUrl
  ? <img src={product.imageUrl} alt={product.name} className="rounded-xl" />
  : <div className="rounded-xl bg-tide/10 h-80 flex items-center justify-center text-tide">No image</div>}            </Reveal>
            <Reveal variant="right">
              <div className="section-tag !text-left !block" style={{ left: 0, transform: 'none' }}>{product.category}</div>
              <h2 className="text-2xl font-display mb-2.5">{product.name}</h2>
              <div className="text-[22px] font-bold text-tide-dark mb-3.5">{fmt(product.price)}</div>
              {product.description && <p className="text-neutral-500 mb-5">{product.description}</p>}
              <div className="flex items-center gap-2.5 mb-5">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8 rounded-lg border border-neutral-300 bg-white">-</button>
                <span className="w-8 text-center">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="w-8 h-8 rounded-lg border border-neutral-300 bg-white">+</button>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  disabled={product.stock === 0}
                  className="btn btn-primary border-0 disabled:opacity-50"
                  onClick={() => {
                    addItem({ productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl }, qty);
                    setAdded(true);
                    setTimeout(() => setAdded(false), 1500);
                  }}
                >
                  {product.stock === 0 ? 'Out of stock' : added ? <><FaCheck className="inline-block mr-1 align-middle" />Added</> : 'Add to Cart'}
                </button>
                <a href="https://wa.me/265999666670" target="_blank" rel="noreferrer" className="btn btn-outline no-underline">Ask on WhatsApp</a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
