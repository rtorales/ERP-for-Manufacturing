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

import { update, fetch } from '../../stores/quality_checks/quality_checksSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

const EditQuality_checks = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    check_date: new Date(),

    ['check_stage']: '',

    passed: false,
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { quality_checks } = useAppSelector((state) => state.quality_checks);

  const { quality_checksId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: quality_checksId }));
  }, [quality_checksId]);

  useEffect(() => {
    if (typeof quality_checks === 'object') {
      setInitialValues(quality_checks);
    }
  }, [quality_checks]);

  useEffect(() => {
    if (typeof quality_checks === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = quality_checks[el]),
      );

      setInitialValues(newInitialVal);
    }
  }, [quality_checks]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: quality_checksId, data }));
    await router.push('/quality_checks/quality_checks-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit quality_checks')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit quality_checks'}
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
              <FormField label='CheckDate'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.check_date
                      ? new Date(
                          dayjs(initialValues.check_date).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, check_date: date })
                  }
                />
              </FormField>

              <FormField label='CheckStage'>
                <Field name='check_stage' placeholder='Your CheckStage' />
              </FormField>

              <FormField label='Passed' labelFor='passed'>
                <Field
                  name='passed'
                  id='passed'
                  component={SwitchField}
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
                  onClick={() =>
                    router.push('/quality_checks/quality_checks-list')
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

EditQuality_checks.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_QUALITY_CHECKS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditQuality_checks;
