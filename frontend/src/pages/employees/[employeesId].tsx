import {
  mdiAccount,
  mdiChartTimelineVariant,
  mdiMail,
  mdiUpload,
} from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import { update, fetch } from '../../stores/employees/employeesSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

const EditEmployees = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    ['employee_name']: '',

    ['role']: '',

    ['shift']: '',

    ['pay_rate']: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { employees } = useAppSelector((state) => state.employees);

  const { employeesId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: employeesId }));
  }, [employeesId]);

  useEffect(() => {
    if (typeof employees === 'object') {
      setInitialValues(employees);
    }
  }, [employees]);

  useEffect(() => {
    if (typeof employees === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = employees[el]),
      );

      setInitialValues(newInitialVal);
    }
  }, [employees]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: employeesId, data }));
    await router.push('/employees/employees-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit employees')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit employees'}
          main
        >
          Breadcrumbs
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='EmployeeName'>
                <Field name='employee_name' placeholder='Your EmployeeName' />
              </FormField>

              <FormField label='Role'>
                <Field name='role' placeholder='Your Role' />
              </FormField>

              <FormField label='Shift'>
                <Field name='shift' placeholder='Your Shift' />
              </FormField>

              <FormField label='PayRate'>
                <Field
                  type='number'
                  name='pay_rate'
                  placeholder='Your PayRate'
                />
              </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() => router.push('/employees/employees-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditEmployees.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_EMPLOYEES'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditEmployees;
