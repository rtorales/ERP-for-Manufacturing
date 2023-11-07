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

import { update, fetch } from '../../stores/inventories/inventoriesSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

const EditInventories = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    ['product_name']: '',

    available_quantity: '',

    reserved_quantity: '',

    returned_quantity: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { inventories } = useAppSelector((state) => state.inventories);

  const { inventoriesId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: inventoriesId }));
  }, [inventoriesId]);

  useEffect(() => {
    if (typeof inventories === 'object') {
      setInitialValues(inventories);
    }
  }, [inventories]);

  useEffect(() => {
    if (typeof inventories === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = inventories[el]),
      );

      setInitialValues(newInitialVal);
    }
  }, [inventories]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: inventoriesId, data }));
    await router.push('/inventories/inventories-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit inventories')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit inventories'}
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
              <FormField label='ProductName'>
                <Field name='product_name' placeholder='Your ProductName' />
              </FormField>

              <FormField label='AvailableQuantity'>
                <Field
                  type='number'
                  name='available_quantity'
                  placeholder='Your AvailableQuantity'
                />
              </FormField>

              <FormField label='ReservedQuantity'>
                <Field
                  type='number'
                  name='reserved_quantity'
                  placeholder='Your ReservedQuantity'
                />
              </FormField>

              <FormField label='ReturnedQuantity'>
                <Field
                  type='number'
                  name='returned_quantity'
                  placeholder='Your ReturnedQuantity'
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
                  onClick={() => router.push('/inventories/inventories-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditInventories.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_INVENTORIES'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditInventories;
