import React from 'react';
import { Col, Descriptions, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { isNvl } from '@/utils/utils';
import { getCountryAndCityStr, getSalutationStr, getTelStr } from '../../utils/pubUtils';

const DetailForBillingInformation = props => {
  const { billingInfo = {}, countryList = [], bilCityList = [], salutationList = [] } = props;
  const layout = { xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 };
  return (
    <React.Fragment>
      <Row type="flex" justify="space-around">
        <Col span={24}>
          <span className={styles.DetailTitle}>{formatMessage({ id: 'BILLING_INFORMATION' })}</span>
        </Col>
      </Row>
      <Row type="flex" justify="space-around" className={styles.detailContent}>
        <Col span={24}>
          <Descriptions className={styles.descriptionsStyle} column={1}>
            <Descriptions.Item label={formatMessage({ id: 'BIL_COMPANY_NAME' })}>
              {!isNvl(billingInfo.companyName) ? billingInfo.companyName : '-'}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions className={styles.descriptionsStyle} column={layout}>
            <Descriptions.Item label={formatMessage({ id: 'BIL_COUNTRY_AND_CITY_STATE' })}>
              {getCountryAndCityStr(
                countryList,
                billingInfo.country,
                billingInfo.city,
                bilCityList
              )}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'BIL_ZIP_POSTAL_CODE' })}>
              {!isNvl(billingInfo.postalCode) ? billingInfo.postalCode : '-'}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions className={styles.descriptionsStyle} column={1}>
            <Descriptions.Item label={formatMessage({ id: 'BIL_ADDRESS' })}>
              {!isNvl(billingInfo.address) ? billingInfo.address : '-'}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions className={styles.descriptionsStyle} column={layout}>
            <Descriptions.Item label={formatMessage({ id: 'BIL_EMAIL' })}>
              {!isNvl(billingInfo.email) ? billingInfo.email : '-'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'BIL_TEL' })}>
              {getTelStr(countryList, billingInfo.phoneCountry, billingInfo.phone)}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'BIL_CONTACT_PERSON_SALUTATION' })}>
              {getSalutationStr(salutationList, billingInfo.salutation)}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'BIL_MOBILE_NO' })}>
              {getTelStr(countryList, billingInfo.mobileCountry, billingInfo.mobileNumber)}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'BIL_CONTACT_PERSON_FIRST_NAME' })}>
              {!isNvl(billingInfo.firstName) ? billingInfo.firstName : '-'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'BIL_CONTACT_PERSON_LAST_NAME' })}>
              {!isNvl(billingInfo.lastName) ? billingInfo.lastName : '-'}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default DetailForBillingInformation;
