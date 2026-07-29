import { useParams } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

export function OrderConfirmationPage() {
  const { id } = useParams();
  return (
    <div className="mx-auto max-w-md p-6 text-center">
      <FaCheckCircle className="text-6xl mb-4 text-green-500 mx-auto" />
      <h1 className="font-display text-2xl">Order placed</h1>
      <p className="mt-2 text-neutral-500">
        Thank you — your order <span className="font-mono text-sm">#{id?.slice(0, 8)}</span> has been received.
        We'll be in touch to confirm delivery.
      </p>
    </div>
  );
}
