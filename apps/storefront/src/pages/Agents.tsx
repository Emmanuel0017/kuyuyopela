import { useState } from 'react';
import { useAgentsControllerCreate } from '@kuyuyopela/api-client';
import { FaMoneyBillWave, FaArrowDown, FaArrowUp, FaGraduationCap, FaTruck, FaPalette, FaCheck } from 'react-icons/fa';
import { Reveal } from '../components/Reveal';

export function AgentsPage() {
  const [done, setDone] = useState(false);
  const { mutate: createAgent, isPending, error } = useAgentsControllerCreate();
  const [form, setForm] = useState({ name: '', phone: '', email: '', city: '', note: '' });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createAgent(
      { data: form },
      {
        onSuccess: () => {
          setDone(true);
          setForm({ name: '', phone: '', email: '', city: '', note: '' });
          setTimeout(() => setDone(false), 3000);
        },
      },
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="container mx-auto max-w-300 px-5">
          <h1>Become a One Drop Agent</h1>
          <p>Attractive prices. Marketing support. Nationwide demand.</p>
        </div>
      </div>
      <section className="section">
        <div className="container mx-auto max-w-300 px-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Reveal variant="left" className="benefit-box">
            <h4 className="font-display">Why Become an Agent?</h4>
            <ul className="list-none p-0 relative">
              <li><FaMoneyBillWave className="inline-block mr-2 align-middle text-tide" />High Profit Margins</li>
              <li><FaArrowDown className="inline-block mr-2 align-middle text-tide" />Low Investment Required</li>
              <li><FaArrowUp className="inline-block mr-2 align-middle text-tide" />Big Nationwide Demand</li>
              <li><FaGraduationCap className="inline-block mr-2 align-middle text-tide" />Free Training &amp; Support</li>
              <li><FaTruck className="inline-block mr-2 align-middle text-tide" />Fast Delivery to Your Area</li>
              <li><FaPalette className="inline-block mr-2 align-middle text-tide" />Marketing Materials Provided</li>
            </ul>
          </Reveal>
          <Reveal variant="right" className="bg-white p-5 rounded-xl shadow-sm">
            <h3 className="mb-4 font-display text-xl">Agent Application Form</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>City / District</label>
                <input
                  required
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Tell us about yourself</label>
                <textarea
                  placeholder="Business experience, capital available, etc."
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </div>
              {error != null && <p className="text-sm text-red-600">Something went wrong — try again.</p>}
              <button type="submit" disabled={isPending} className="btn btn-primary btn-block border-0">
                {isPending ? 'Sending…' : done ? <><FaCheck className="inline-block mr-1 align-middle" />Application Sent</> : 'Submit Application'}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
