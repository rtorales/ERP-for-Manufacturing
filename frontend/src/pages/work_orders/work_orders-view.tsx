import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/work_orders/work_ordersSlice';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import BaseButton from '../../components/BaseButton';
import BaseDivider from '../../components/BaseDivider';
import { mdiChartTimelineVariant } from '@mdi/js';
import { SwitchField } from '../../components/SwitchField';
import FormField from '../../components/FormField';

const Work_ordersView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { work_orders } = useAppSelector((state) => state.work_orders);

  const { id } = router.query;

  useEffect(() => {
    dispatch(fetch({ id }));
  }, [dispatch, id]);

  return (
    <>
      <Head>
        <title>{getPageTitle('View work_orders')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'View work_orders'}
          main
        >
          Breadcrumbs
        </SectionTitleLineWithButton>
        <CardBox>
          <FormField label='OrderDate'>
            {work_orders.order_date ? (
              <DatePicker
                dateFormat='yyyy-MM-dd hh:mm'
                showTimeSelect
                selected={
                  work_orders.order_date
                    ? new Date(
                        dayjs(work_orders.order_date).format(
                          'YYYY-MM-DD hh:mm',
                        ),
                      )
                    : null
                }
                disabled
              />
            ) : (
              <p>No OrderDate</p>
            )}
          </FormField>

          <>
            <p className={'block font-bold mb-2'}>MaterialsNeeded</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>MaterialName</th>

                      <th>StockQuantity</th>

                      <th>ReorderLevel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {work_orders.materials_needed &&
                      Array.isArray(work_orders.materials_needed) &&
                      work_orders.materials_needed.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/raw_materials/raw_materials-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='material_name'>
                            {item.material_name}
                          </td>

                          <td data-label='stock_quantity'>
                            {item.stock_quantity}
                          </td>

                          <td data-label='reorder_level'>
                            {item.reorder_level}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!work_orders?.materials_needed?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>LaborAssigned</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>EmployeeName</th>

                      <th>Role</th>

                      <th>Shift</th>

                      <th>PayRate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {work_orders.labor_assigned &&
                      Array.isArray(work_orders.labor_assigned) &&
                      work_orders.labor_assigned.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/employees/employees-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='employee_name'>
                            {item.employee_name}
                          </td>

                          <td data-label='role'>{item.role}</td>

                          <td data-label='shift'>{item.shift}</td>

                          <td data-label='pay_rate'>{item.pay_rate}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!work_orders?.labor_assigned?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>MachineryUsed</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>MachineName</th>

                      <th>MaintenanceSchedule</th>

                      <th>DowntimeHours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {work_orders.machinery_used &&
                      Array.isArray(work_orders.machinery_used) &&
                      work_orders.machinery_used.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/machinery/machinery-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='machine_name'>{item.machine_name}</td>

                          <td data-label='maintenance_schedule'>
                            {dataFormatter.dateTimeFormatter(
                              item.maintenance_schedule,
                            )}
                          </td>

                          <td data-label='downtime_hours'>
                            {item.downtime_hours}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!work_orders?.machinery_used?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/work_orders/work_orders-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

Work_ordersView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_WORK_ORDERS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default Work_ordersView;
