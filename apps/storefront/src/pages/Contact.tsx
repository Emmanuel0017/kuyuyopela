import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaCheck } from 'react-icons/fa';
import { Reveal } from '../components/Reveal';

export function ContactPage() {
  const [done, setDone] = useState(false);
  return (
    <div>
      <div className="page-header">
        <div className="container mx-auto max-w-300 px-5">
          <h1>Get In Touch</h1>
          <p>We're here to help.</p>
        </div>
      </div>
      <section className="section">
        <div className="container mx-auto max-w-300 px-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Reveal variant="left" className="bg-white p-5 rounded-xl shadow-sm">
            <h3 className="mb-4 font-display text-xl">Send Us a Message</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
                setTimeout(() => setDone(false), 3000);
                (e.target as HTMLFormElement).reset();
              }}
            >
              <div className="form-group"><label>Name</label><input required type="text" /></div>
              <div className="form-group"><label>Email</label><input required type="email" /></div>
              <div className="form-group"><label>Message</label><textarea required /></div>
              <button type="submit" className="btn btn-primary btn-block border-0">
                {done ? <><FaCheck className="inline-block mr-1 align-middle" />Sent</> : 'Send Message'}
              </button>
            </form>
          </Reveal>
          <Reveal variant="right">
            <img src="https://placehold.co/500x300/0F5132/FFFFFF?text=Customer+Care" className="rounded-xl mb-5 shadow-xl" alt="care" />
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <p className="mb-2.5 flex items-center"><FaPhone className="inline-block mr-2 align-middle text-tide" />0999 666 670 / 0995 666 190</p>
              <p className="mb-2.5 flex items-center"><FaEnvelope className="inline-block mr-2 align-middle text-tide" />info@kuyuyopela.com</p>
              <p className="mb-2.5 flex items-center"><FaMapMarkerAlt className="inline-block mr-2 align-middle text-tide" />@kuyuyopela_industries</p>
              <a href="https://wa.me/265999666670" target="_blank" rel="noreferrer" className="btn btn-outline btn-block no-underline">
                <FaWhatsapp className="inline-block mr-2 align-middle" />Message Us on WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
