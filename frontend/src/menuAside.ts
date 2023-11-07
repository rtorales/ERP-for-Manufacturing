import {
  mdiAccountCircle,
  mdiMonitor,
  mdiGithub,
  mdiLock,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiViewList,
  mdiPalette,
  mdiVuejs,
} from '@mdi/js';
import { MenuAsideItem } from './interfaces';

const menuAside: MenuAsideItem[] = [
  {
    href: '/dashboard',
    icon: mdiMonitor,
    label: 'Dashboard',
  },

  {
    href: '/users/users-list',
    label: 'Users',
    icon: mdiTable,
    permissions: 'READ_USERS',
  },
  {
    href: '/employees/employees-list',
    label: 'Employees',
    icon: mdiTable,
    permissions: 'READ_EMPLOYEES',
  },
  {
    href: '/inventories/inventories-list',
    label: 'Inventories',
    icon: mdiTable,
    permissions: 'READ_INVENTORIES',
  },
  {
    href: '/machinery/machinery-list',
    label: 'Machinery',
    icon: mdiTable,
    permissions: 'READ_MACHINERY',
  },
  {
    href: '/quality_checks/quality_checks-list',
    label: 'Quality checks',
    icon: mdiTable,
    permissions: 'READ_QUALITY_CHECKS',
  },
  {
    href: '/raw_materials/raw_materials-list',
    label: 'Raw materials',
    icon: mdiTable,
    permissions: 'READ_RAW_MATERIALS',
  },
  {
    href: '/suppliers/suppliers-list',
    label: 'Suppliers',
    icon: mdiTable,
    permissions: 'READ_SUPPLIERS',
  },
  {
    href: '/work_orders/work_orders-list',
    label: 'Work orders',
    icon: mdiTable,
    permissions: 'READ_WORK_ORDERS',
  },
  {
    href: '/roles/roles-list',
    label: 'Roles',
    icon: mdiTable,
    permissions: 'READ_ROLES',
  },
  {
    href: '/permissions/permissions-list',
    label: 'Permissions',
    icon: mdiTable,
    permissions: 'READ_PERMISSIONS',
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: mdiAccountCircle,
  },
  {
    href: '/api-docs',
    label: 'Swagger API',
    icon: mdiAccountCircle,
    permissions: 'READ_API_DOCS',
  },
];

export default menuAside;
