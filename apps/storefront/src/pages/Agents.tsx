import { useState } from 'react';
import { Reveal } from '../components/Reveal';

export function AgentsPage() {
  const [done, setDone] = useState(false);

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
              <li>💰 High Profit Margins</li>
              <li>📉 Low Investment Required</li>
              <li>📈 Big Nationwide Demand</li>
              <li>🎓 Free Training &amp; Support</li>
              <li>🚚 Fast Delivery to Your Area</li>
              <li>🎨 Marketing Materials Provided</li>
            </ul>
          </Reveal>
          <Reveal variant="right" className="bg-white p-5 rounded-xl shadow-sm">
            <h3 className="mb-4 font-display text-xl">Agent Application Form</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
                setTimeout(() => setDone(false), 3000);
                (e.target as HTMLFormElement).reset();
              }}
            >
              <div className="form-group"><label>Full Name</label><input required type="text" /></div>
              <div className="form-group"><label>Phone Number</label><input required type="tel" /></div>
              <div className="form-group"><label>Email Address</label><input required type="email" /></div>
              <div className="form-group"><label>City / District</label><input required type="text" /></div>
              <div className="form-group">
                <label>Tell us about yourself</label>
                <textarea placeholder="Business experience, capital available, etc." />
              </div>
              <button type="submit" className="btn btn-primary btn-block border-0">
                {done ? 'Application Sent ✓' : 'Submit Application'}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}