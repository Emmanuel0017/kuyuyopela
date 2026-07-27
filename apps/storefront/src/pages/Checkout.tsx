import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrdersControllerCreate } from '@kuyuyopela/api-client';
import { useCartStore } from '../store/cartStore';
import { Reveal } from '../components/Reveal';

const fmt = (n: number) => `MK${n.toLocaleString()}`;
const DELIVERY = 2000;

// matches the shape your api-client returns on create — adjust field names if yours differ
interface CreatedOrder { id: string }

export function CheckoutPage() {
  const { items, total, clear } = useCartStore();
  const navigate = useNavigate();
  const { mutate: createOrder, isPending, error } = useOrdersControllerCreate();
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    city: '',
    paymentMethod: 'Cash on Delivery',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createOrder(
      {
        data: {
          ...form,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        },
      },
      {
        // ← FIX 1: type the order so order.id isn't `unknown`
        onSuccess: (order: CreatedOrder) => {
          clear();
          navigate(`/order/${order.id}`);
        },
      },
    );
  }

  if (items.length === 0) return <p className="p-6">Your cart is empty.</p>;

  return (
    <div className="p-6 max-w-275 mx-auto">
      <h1 className="font-display text-2xl mb-5">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-5">
        <Reveal className="bg-white p-5 rounded-xl shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group"><label>Full Name</label>
              <input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
            </div>
            <div className="form-group"><label>Phone Number</label>
              <input required type="tel" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} />
            </div>
            <div className="form-group"><label>Email</label>
              <input required type="email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} />
            </div>
            <div className="form-group"><label>Delivery Address</label>
              <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="form-group"><label>City</label>
              <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
                <option>Cash on Delivery</option>
                <option>Airtel Money</option>
                <option>TNM Mpamba</option>
                <option>Bank Transfer</option>
                <option>Visa / Mastercard</option>
              </select>
            </div>
            {/* ← FIX 2: `error != null` narrows unknown to a safe check */}
            {error != null && (
              <p className="text-sm text-red-600">
                Something went wrong — check stock and try again.
              </p>
            )}
            <button disabled={isPending} className="btn btn-primary btn-block border-0 disabled:opacity-50">
              {isPending ? 'Placing order…' : 'Place Order'}
            </button>
          </form>
        </Reveal>
        <Reveal className="bg-white p-5 rounded-xl shadow-sm h-fit">
          <h3 className="font-display text-lg mb-3">Order Summary</h3>
          {items.map((i) => (
            <div key={i.productId} className="flex justify-between text-sm mb-2">
              <span>{i.name} × {i.quantity}</span>
              <span>{fmt(i.price * i.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between mt-2.5"><span>Delivery</span><span>{fmt(DELIVERY)}</span></div>
          <div className="flex justify-between font-bold text-lg border-t border-neutral-200 pt-2 mt-2.5">
            <span>Total</span><span>{fmt(total() + DELIVERY)}</span>
          </div>
        </Reveal>
      </div>
    </div>
  );
}