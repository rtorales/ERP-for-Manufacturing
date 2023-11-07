import { mdiChartTimelineVariant } from '@mdi/js';
import Head from 'next/head';
import React from 'react';
import axios from 'axios';
import type { ReactElement } from 'react';
import LayoutAuthenticated from '../layouts/Authenticated';
import SectionMain from '../components/SectionMain';
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton';
import { mdiInformation } from '@mdi/js';
import BaseIcon from '../components/BaseIcon';
import { getPageTitle } from '../config';
import Link from 'next/link';

import { hasPermission } from '../helpers/userPermissions';
import { useAppSelector } from '../stores/hooks';

const Dashboard = () => {
  const [users, setUsers] = React.useState('Loading...');
  const [employees, setEmployees] = React.useState('Loading...');
  const [inventories, setInventories] = React.useState('Loading...');
  const [machinery, setMachinery] = React.useState('Loading...');
  const [quality_checks, setQuality_checks] = React.useState('Loading...');
  const [raw_materials, setRaw_materials] = React.useState('Loading...');
  const [suppliers, setSuppliers] = React.useState('Loading...');
  const [work_orders, setWork_orders] = React.useState('Loading...');
  const [roles, setRoles] = React.useState('Loading...');
  const [permissions, setPermissions] = React.useState('Loading...');

  const { currentUser } = useAppSelector((state) => state.auth);

  async function loadData() {
    const entities = [
      'users',
      'employees',
      'inventories',
      'machinery',
      'quality_checks',
      'raw_materials',
      'suppliers',
      'work_orders',
      'roles',
      'permissions',
    ];
    const fns = [
      setUsers,
      setEmployees,
      setInventories,
      setMachinery,
      setQuality_checks,
      setRaw_materials,
      setSuppliers,
      setWork_orders,
      setRoles,
      setPermissions,
    ];

    const requests = entities.map((entity, index) => {
      if (hasPermission(currentUser, `READ_${entity.toUpperCase()}`)) {
        return axios.get(`/${entity.toLowerCase()}/count`);
      } else {
        fns[index](null);
        return Promise.resolve({ data: { count: null } });
      }
    });

    Promise.all(requests)
      .then((res) => res.map((el) => el.data))
      .then((data) => data.forEach((el, i) => fns[i](el.count)));
  }

  React.useEffect(() => {
    if (!currentUser) return;
    loadData().then();
  }, [currentUser]);

  return (
    <>
      <Head>
        <title>{getPageTitle('Dashboard')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title='Overview'
          main
        >
          Breadcrumbs
        </SectionTitleLineWithButton>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6'>
          {hasPermission(currentUser, 'READ_USERS') && (
            <Link href={'/users/users-list'} className='mr-3'>
              <div className='rounded dark:bg-gray-900/70 bg-white border border-pavitra-400 p-6'>
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight text-gray-500 dark:text-gray-400'>
                      Users
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {users}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className='text-blue-500'
                      w='w-16'
                      h='h-16'
                      size={48}
                      path={mdiInformation}
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_EMPLOYEES') && (
            <Link href={'/employees/employees-list'} className='mr-3'>
              <div className='rounded dark:bg-gray-900/70 bg-white border border-pavitra-400 p-6'>
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight text-gray-500 dark:text-gray-400'>
                      Employees
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {employees}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className='text-blue-500'
                      w='w-16'
                      h='h-16'
                      size={48}
                      path={mdiInformation}
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_INVENTORIES') && (
            <Link href={'/inventories/inventories-list'} className='mr-3'>
              <div className='rounded dark:bg-gray-900/70 bg-white border border-pavitra-400 p-6'>
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight text-gray-500 dark:text-gray-400'>
                      Inventories
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {inventories}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className='text-blue-500'
                      w='w-16'
                      h='h-16'
                      size={48}
                      path={mdiInformation}
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_MACHINERY') && (
            <Link href={'/machinery/machinery-list'} className='mr-3'>
              <div className='rounded dark:bg-gray-900/70 bg-white border border-pavitra-400 p-6'>
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight text-gray-500 dark:text-gray-400'>
                      Machinery
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {machinery}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className='text-blue-500'
                      w='w-16'
                      h='h-16'
                      size={48}
                      path={mdiInformation}
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_QUALITY_CHECKS') && (
            <Link href={'/quality_checks/quality_checks-list'} className='mr-3'>
              <div className='rounded dark:bg-gray-900/70 bg-white border border-pavitra-400 p-6'>
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight text-gray-500 dark:text-gray-400'>
                      Quality_checks
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {quality_checks}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className='text-blue-500'
                      w='w-16'
                      h='h-16'
                      size={48}
                      path={mdiInformation}
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_RAW_MATERIALS') && (
            <Link href={'/raw_materials/raw_materials-list'} className='mr-3'>
              <div className='rounded dark:bg-gray-900/70 bg-white border border-pavitra-400 p-6'>
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight text-gray-500 dark:text-gray-400'>
                      Raw_materials
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {raw_materials}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className='text-blue-500'
                      w='w-16'
                      h='h-16'
                      size={48}
                      path={mdiInformation}
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_SUPPLIERS') && (
            <Link href={'/suppliers/suppliers-list'} className='mr-3'>
              <div className='rounded dark:bg-gray-900/70 bg-white border border-pavitra-400 p-6'>
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight text-gray-500 dark:text-gray-400'>
                      Suppliers
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {suppliers}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className='text-blue-500'
                      w='w-16'
                      h='h-16'
                      size={48}
                      path={mdiInformation}
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_WORK_ORDERS') && (
            <Link href={'/work_orders/work_orders-list'} className='mr-3'>
              <div className='rounded dark:bg-gray-900/70 bg-white border border-pavitra-400 p-6'>
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight text-gray-500 dark:text-gray-400'>
                      Work_orders
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {work_orders}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className='text-blue-500'
                      w='w-16'
                      h='h-16'
                      size={48}
                      path={mdiInformation}
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_ROLES') && (
            <Link href={'/roles/roles-list'} className='mr-3'>
              <div className='rounded dark:bg-gray-900/70 bg-white border border-pavitra-400 p-6'>
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight text-gray-500 dark:text-gray-400'>
                      Roles
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {roles}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className='text-blue-500'
                      w='w-16'
                      h='h-16'
                      size={48}
                      path={mdiInformation}
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {hasPermission(currentUser, 'READ_PERMISSIONS') && (
            <Link href={'/permissions/permissions-list'} className='mr-3'>
              <div className='rounded dark:bg-gray-900/70 bg-white border border-pavitra-400 p-6'>
                <div className='flex justify-between align-center'>
                  <div>
                    <div className='text-lg leading-tight text-gray-500 dark:text-gray-400'>
                      Permissions
                    </div>
                    <div className='text-3xl leading-tight font-semibold'>
                      {permissions}
                    </div>
                  </div>
                  <div>
                    <BaseIcon
                      className='text-blue-500'
                      w='w-16'
                      h='h-16'
                      size={48}
                      path={mdiInformation}
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </SectionMain>
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default Dashboard;
