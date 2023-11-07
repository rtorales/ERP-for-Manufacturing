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

import { update, fetch } from '../../stores/work_orders/work_ordersSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

const EditWork_orders = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    order_date: new Date(),

    materials_needed: [],

    labor_assigned: [],

    machinery_used: [],
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { work_orders } = useAppSelector((state) => state.work_orders);

  const { work_ordersId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: work_ordersId }));
  }, [work_ordersId]);

  useEffect(() => {
    if (typeof work_orders === 'object') {
      setInitialValues(work_orders);
    }
  }, [work_orders]);

  useEffect(() => {
    if (typeof work_orders === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = work_orders[el]),
      );

      setInitialValues(newInitialVal);
    }
  }, [work_orders]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: work_ordersId, data }));
    await router.push('/work_orders/work_orders-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit work_orders')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit work_orders'}
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
              <FormField label='OrderDate'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.order_date
                      ? new Date(
                          dayjs(initialValues.order_date).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, order_date: date })
                  }
                />
              </FormField>

              <FormField label='MaterialsNeeded' labelFor='materials_needed'>
                <Field
                  name='materials_needed'
                  id='materials_needed'
                  component={SelectFieldMany}
                  options={initialValues.materials_needed}
                  itemRef={'raw_materials'}
                  showField={'material_name'}
                ></Field>
              </FormField>

              <FormField label='LaborAssigned' labelFor='labor_assigned'>
                <Field
                  name='labor_assigned'
                  id='labor_assigned'
                  component={SelectFieldMany}
                  options={initialValues.labor_assigned}
                  itemRef={'employees'}
                  showField={'employee_name'}
                ></Field>
              </FormField>

              <FormField label='MachineryUsed' labelFor='machinery_used'>
                <Field
                  name='machinery_used'
                  id='machinery_used'
                  component={SelectFieldMany}
                  options={initialValues.machinery_used}
                  itemRef={'machinery'}
                  showField={'machine_name'}
                ></Field>
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
                  onClick={() => router.push('/work_orders/work_orders-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditWork_orders.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_WORK_ORDERS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditWork_orders;
