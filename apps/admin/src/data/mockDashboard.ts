// Mock data for the dashboard — swap to real APIs when you add analytics endpoints

export const STATS = [
  { id: 'revenue',  label: 'Total Revenue',  value: 'MK 1,842,500', delta: '+12.5% vs last week', trend: 'up' as const },
  { id: 'orders',   label: 'Total Orders',   value: 348,              delta: '+8.2%',               trend: 'up' as const },
  { id: 'pending',  label: 'Pending Orders', value: 23,               delta: '-3 from yesterday',   trend: 'down' as const },
  { id: 'products', label: 'Active Products', value: 42,              delta: '+2 this month',       trend: 'up' as const },
];

export const WEEKLY_SALES = [
  { label: 'Mon', value: 145 },
  { label: 'Tue', value: 230 },
  { label: 'Wed', value: 198 },
  { label: 'Thu', value: 312 },
  { label: 'Fri', value: 278 },
  { label: 'Sat', value: 425 },
  { label: 'Sun', value: 386 },
];

export const RECENT_ACTIVITY = [
  { id: 1, icon: 'order',    text: 'New order #1287 from Thandiwe Banda', time: '2 min ago' },
  { id: 2, icon: 'agent',    text: 'Agent application from Mzimba — Chisomo', time: '14 min ago' },
  { id: 3, icon: 'payment',  text: 'Payment received: MK 48,500', time: '1 hour ago' },
  { id: 4, icon: 'order',    text: 'Order #1285 marked as DELIVERED', time: '3 hours ago' },
  { id: 5, icon: 'product',  text: 'Stock low: One Drop 50ml (3 left)', time: '5 hours ago' },
  { id: 6, icon: 'testimonial', text: 'New testimonial from Blantyre', time: '1 day ago' },
];