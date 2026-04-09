import { Role } from '@/types/role';

export const DASHBOARD_ROUTE: Record<Role, string> = {
  ADMIN:    '/dashboard',
  SELLER:   '/dashboard',
  CUSTOMER: '/dashboard',
};