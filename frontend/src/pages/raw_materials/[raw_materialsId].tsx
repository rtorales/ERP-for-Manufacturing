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

import { update, fetch } from '../../stores/raw_materials/raw_materialsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

const EditRaw_materials = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    ['material_name']: '',

    stock_quantity: '',

    reorder_level: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { raw_materials } = useAppSelector((state) => state.raw_materials);

  const { raw_materialsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: raw_materialsId }));
  }, [raw_materialsId]);

  useEffect(() => {
    if (typeof raw_materials === 'object') {
      setInitialValues(raw_materials);
    }
  }, [raw_materials]);

  useEffect(() => {
    if (typeof raw_materials === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = raw_materials[el]),
      );

      setInitialValues(newInitialVal);
    }
  }, [raw_materials]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: raw_materialsId, data }));
    await router.push('/raw_materials/raw_materials-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit raw_materials')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit raw_materials'}
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
              <FormField label='MaterialName'>
                <Field name='material_name' placeholder='Your MaterialName' />
              </FormField>

              <FormField label='StockQuantity'>
                <Field
                  type='number'
                  name='stock_quantity'
                  placeholder='Your StockQuantity'
                />
              </FormField>

              <FormField label='ReorderLevel'>
                <Field
                  type='number'
                  name='reorder_level'
                  placeholder='Your ReorderLevel'
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
                  onClick={() =>
                    router.push('/raw_materials/raw_materials-list')
                  }
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditRaw_materials.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_RAW_MATERIALS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditRaw_materials;
