import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/quality_checks/quality_checksSlice';
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

const Quality_checksView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { quality_checks } = useAppSelector((state) => state.quality_checks);

  const { id } = router.query;

  useEffect(() => {
    dispatch(fetch({ id }));
  }, [dispatch, id]);

  return (
    <>
      <Head>
        <title>{getPageTitle('View quality_checks')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'View quality_checks'}
          main
        >
          Breadcrumbs
        </SectionTitleLineWithButton>
        <CardBox>
          <FormField label='CheckDate'>
            {quality_checks.check_date ? (
              <DatePicker
                dateFormat='yyyy-MM-dd hh:mm'
                showTimeSelect
                selected={
                  quality_checks.check_date
                    ? new Date(
                        dayjs(quality_checks.check_date).format(
                          'YYYY-MM-DD hh:mm',
                        ),
                      )
                    : null
                }
                disabled
              />
            ) : (
              <p>No CheckDate</p>
            )}
          </FormField>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>CheckStage</p>
            <p>{quality_checks?.check_stage}</p>
          </div>

          <SwitchField
            field={{ name: 'passed', value: quality_checks?.passed }}
            form={{ setFieldValue: () => null }}
            disabled
          />

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/quality_checks/quality_checks-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

Quality_checksView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_QUALITY_CHECKS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default Quality_checksView;
