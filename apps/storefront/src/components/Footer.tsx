import { Link } from 'react-router-dom';
import { useSettingsControllerGet } from '@kuyuyopela/api-client';

export function Footer() {
  const { data: settings } = useSettingsControllerGet();
  const siteName = settings?.siteName ?? 'Kuyuyopela Industries';
  const supportPhone = settings?.supportPhone ?? '0999 666 670';
  const supportEmail = settings?.supportEmail ?? 'info@kuyuyopela.com';

  return (
    <footer className="site-footer">
      <div className="container mx-auto max-w-[1200px] px-5">
        <div className="footer-grid">
          <div>
            <div className="font-bold mb-3">
              KY <span className="text-gold">|</span> {siteName.toUpperCase()}
            </div>
            <p className="text-[13px] opacity-85">
              Clearer skin starts with One Drop. Malawian-made, trusted nationwide.
            </p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul className="list-none p-0">
              <li><Link to="/shop" className="text-inherit no-underline">Shop</Link></li>
              <li><Link to="/results" className="text-inherit no-underline">Results</Link></li>
              <li><Link to="/agents" className="text-inherit no-underline">Become an Agent</Link></li>
              <li><Link to="/stores" className="text-inherit no-underline">Store Locator</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul className="list-none p-0 text-[13px] opacity-90">
              <li>📞 {supportPhone}</li>
              <li>✉️ {supportEmail}</li>
              <li>📍 {siteName}</li>
            </ul>
          </div>
          <div>
            <h4>Payment Methods</h4>
            <p className="text-[13px]">Airtel Money · TNM Mpamba · Visa · Mastercard · Cash on Delivery</p>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 {siteName}. All Rights Reserved. Made with ❤️ in Malawi.
        </div>
      </div>
    </footer>
  );
}