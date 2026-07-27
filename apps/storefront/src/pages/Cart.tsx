import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Reveal } from '../components/Reveal';

const fmt = (n: number) => `MK${n.toLocaleString()}`;
const DELIVERY = 2000;

export function CartPage() {
  const { items, setQuantity, removeItem, total } = useCartStore();

  if (items.length === 0) {
    return (
      <Reveal className="p-6 max-w-2xl mx-auto">
        <p>Your cart is empty.</p>
        <Link to="/shop" className="text-sm underline">Continue shopping</Link>
      </Reveal>
    );
  }

  return (
    <div className="p-6 max-w-275 mx-auto">
      <h1 className="font-display text-2xl mb-5">Your cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-5">
        <Reveal className="space-y-4">
          {items.map((i) => (
            <div key={i.productId} className="flex items-center justify-between border-b border-neutral-200 pb-4 gap-3">
              {i.imageUrl && <img src={i.imageUrl} alt={i.name} className="w-16 h-16 object-cover rounded" />}
              <div className="flex-1">
                <p className="font-medium">{i.name}</p>
                <p className="text-sm text-neutral-500">{fmt(i.price)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button onClick={() => setQuantity(i.productId, Math.max(1, i.quantity - 1))} className="w-8 h-8 rounded border border-neutral-300">-</button>
                  <span className="w-6 text-center">{i.quantity}</span>
                  <button onClick={() => setQuantity(i.productId, i.quantity + 1)} className="w-8 h-8 rounded border border-neutral-300">+</button>
                </div>
              </div>
              <button onClick={() => removeItem(i.productId)} className="text-sm text-red-600 underline">Remove</button>
            </div>
          ))}
        </Reveal>
        <Reveal className="bg-white p-5 rounded-xl shadow-sm h-fit">
          <h3 className="font-display text-lg mb-3">Order Summary</h3>
          <div className="flex justify-between mb-2"><span>Subtotal</span><span>{fmt(total())}</span></div>
          <div className="flex justify-between mb-2"><span>Delivery</span><span>{fmt(DELIVERY)}</span></div>
          <div className="flex justify-between font-bold text-lg border-t border-neutral-200 pt-2 mt-2 mb-4">
            <span>Total</span><span>{fmt(total() + DELIVERY)}</span>
          </div>
          <Link to="/checkout" className="btn btn-primary btn-block text-center no-underline">Proceed to Checkout</Link>
        </Reveal>
      </div>
    </div>
  );
}