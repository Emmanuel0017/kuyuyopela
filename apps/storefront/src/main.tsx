import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { queryClient } from './lib/queryClient';
import { SmoothScroll } from './lib/SmoothScroll';
import { Layout } from './layout/Layout';
import { HomePage } from './pages/Home';
import { ShopPage } from './pages/Shop';
import { ProductPage } from './pages/Product';
import { ResultsPage } from './pages/Results';
import { AgentsPage } from './pages/Agents';
import { StoresPage } from './pages/Stores';
import { AboutPage } from './pages/About';
import { ContactPage } from './pages/Contact';
import { CartPage } from './pages/Cart';
import { CheckoutPage } from './pages/Checkout';
import { OrderConfirmationPage } from './pages/OrderConfirmation';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SmoothScroll>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/stores" element={<StoresPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order/:id" element={<OrderConfirmationPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SmoothScroll>
    </QueryClientProvider>
  </StrictMode>,
);