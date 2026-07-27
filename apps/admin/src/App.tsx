import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { ThemeProvider } from './theme/ThemeContext';
import { LoginPage } from './pages/Login';
import { DashboardPage } from './pages/Dashboard';
import { ProductsPage } from './pages/Products';
import { OrdersPage } from './pages/Orders';
import { CustomersPage } from './pages/Customers';
import { AgentsPage } from './pages/Agents';
import { StoresPage } from './pages/Stores';
import { TestimonialsPage } from './pages/Testimonials';
import { SettingsPage } from './pages/Settings';
import { DashboardLayout } from './layout/DashboardLayout';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard"    element={<DashboardPage />} />
                  <Route path="/products"     element={<ProductsPage />} />
                  <Route path="/orders"       element={<OrdersPage />} />
                  <Route path="/customers"    element={<CustomersPage />} />
                  <Route path="/agents"       element={<AgentsPage />} />
                  <Route path="/stores"       element={<StoresPage />} />
                  <Route path="/testimonials" element={<TestimonialsPage />} />
                  <Route path="/settings"     element={<SettingsPage />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}