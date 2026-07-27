import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

const fmt = (n: number) => `MK${n.toLocaleString()}`;

export function CartDrawer() {
  const { items, drawerOpen, closeDrawer, setQuantity, removeItem, total } = useCartStore();

  return (
    <>
      <div className={`cart-overlay ${drawerOpen ? 'show' : ''}`} onClick={closeDrawer} />
      <aside className={`cart-drawer ${drawerOpen ? 'show' : ''}`} aria-hidden={!drawerOpen}>
        <div className="cart-header">
          <h3 className="font-display text-lg">Your Cart</h3>
          <button onClick={closeDrawer} className="text-xl bg-transparent border-0 cursor-pointer">✕</button>
        </div>
        <div className="cart-items">
          {items.length === 0 && <p className="text-neutral-500">Your cart is empty.</p>}
          {items.map((i) => (
            <div className="cart-item" key={i.productId}>
              {i.imageUrl && <img src={i.imageUrl} alt={i.name} />}
              <div className="flex-1">
                <div className="text-[13px] font-semibold">{i.name}</div>
                <div className="text-[13px] font-bold text-tide-dark">{fmt(i.price)}</div>
                <div className="qty">
                  <button onClick={() => setQuantity(i.productId, Math.max(1, i.quantity - 1))}>-</button>
                  <span>{i.quantity}</span>
                  <button onClick={() => setQuantity(i.productId, i.quantity + 1)}>+</button>
                </div>
              </div>
              <button
                onClick={() => removeItem(i.productId)}
                className="text-xs text-red-600 underline ml-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="cart-footer">
          <div className="flex justify-between font-bold mb-3.5">
            <span>Total</span>
            <span>{fmt(total())}</span>
          </div>
          <Link to="/cart" onClick={closeDrawer} className="btn btn-primary btn-block text-center no-underline">
            View Cart
          </Link>
          <Link to="/checkout" onClick={closeDrawer} className="btn btn-outline btn-block text-center no-underline mt-2">
            Checkout
          </Link>
        </div>
      </aside>
    </>
  );
}