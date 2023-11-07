import { mdiChartTimelineVariant } from '@mdi/js';
import Head from 'next/head';
import { uniqueId } from 'lodash';
import React, { ReactElement, useState } from 'react';
import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';
import TableEmployees from '../../components/Employees/TableEmployees';
import BaseButton from '../../components/BaseButton';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import CardBoxModal from '../../components/CardBoxModal';
import DragDropFilePicker from '../../components/DragDropFilePicker';
import { setRefetch, uploadCsv } from '../../stores/employees/employeesSlice';

import { hasPermission } from '../../helpers/userPermissions';

const EmployeesTablesPage = () => {
  const [filterItems, setFilterItems] = useState([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isModalActive, setIsModalActive] = useState(false);

  const { currentUser } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  const [filters] = useState([
    { label: 'EmployeeName', title: 'employee_name' },
    { label: 'Role', title: 'role' },
    { label: 'Shift', title: 'shift' },

    { label: 'PayRate', title: 'pay_rate', number: 'true' },
  ]);

  const hasCreatePermission =
    currentUser && hasPermission(currentUser, 'CREATE_EMPLOYEES');

  const addFilter = () => {
    const newItem = {
      id: uniqueId(),
      fields: {
        filterValue: '',
        filterValueFrom: '',
        filterValueTo: '',
        selectedField: '',
      },
    };
    newItem.fields.selectedField = filters[0].title;
    setFilterItems([...filterItems, newItem]);
  };

  const getEmployeesCSV = async () => {
    const response = await axios({
      url: '/employees?filetype=csv',
      method: 'GET',
      responseType: 'blob',
    });
    const type = response.headers['content-type'];
    const blob = new Blob([response.data], { type: type });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'employeesCSV.csv';
    link.click();
  };

  const onModalConfirm = async () => {
    if (!csvFile) return;
    await dispatch(uploadCsv(csvFile));
    dispatch(setRefetch(true));
    setCsvFile(null);
    setIsModalActive(false);
  };

  const onModalCancel = () => {
    setCsvFile(null);
    setIsModalActive(false);
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Employees')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title='Employees Table'
          main
        >
          Breadcrumbs
        </SectionTitleLineWithButton>
        <CardBox className='mb-6'>
          {hasCreatePermission && (
            <BaseButton
              className={'mr-3'}
              href={'/employees/employees-new'}
              color='info'
              label='New Item'
            />
          )}

          <BaseButton
            className={'mr-3'}
            color='info'
            label='Add Filter'
            onClick={addFilter}
          />
          <BaseButton
            className={'mr-3'}
            color='info'
            label='Download CSV'
            onClick={getEmployeesCSV}
          />

          {hasCreatePermission && (
            <BaseButton
              color='info'
              label='Upload CSV'
              onClick={() => setIsModalActive(true)}
            />
          )}
        </CardBox>
        <CardBox className='mb-6' hasTable>
          <TableEmployees
            filterItems={filterItems}
            setFilterItems={setFilterItems}
            filters={filters}
          />
        </CardBox>
      </SectionMain>
      <CardBoxModal
        title='Upload CSV'
        buttonColor='info'
        buttonLabel={'Confirm'}
        // buttonLabel={false ? 'Deleting...' : 'Confirm'}
        isActive={isModalActive}
        onConfirm={onModalConfirm}
        onCancel={onModalCancel}
      >
        <DragDropFilePicker
          file={csvFile}
          setFile={setCsvFile}
          formats={'.csv'}
        />
      </CardBoxModal>
    </>
  );
};

EmployeesTablesPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_EMPLOYEES'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EmployeesTablesPage;
