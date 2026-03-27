import { Role } from '@/types/role';

export const DASHBOARD_ROUTE: Record<Role, string> = {
  ADMIN: '/admin',
  SELLER: '/seller/dashboard',
  CUSTOMER: '/orders',
};
