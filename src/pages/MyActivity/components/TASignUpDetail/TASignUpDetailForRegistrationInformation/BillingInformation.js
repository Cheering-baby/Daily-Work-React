import React from 'react';
import { Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './TaRegistration.less';
import { isNvl } from '@/utils/utils';
import { colLayOut, rowLayOut } from '@/pages/MyActivity/components/constants';
import {
  getCountryAndCityStr,
  getSalutationStr,
  getTelStr,
} from '@/pages/TAManagement/utils/pubUtils';

const BillingInformation = props => {
  const { billingInfo = {}, countryList = [], bilCityList = [], salutationList = [] } = props;
  return (
    <React.Fragment>
      <Row {...rowLayOut}>
        <Col span={24}>
          <span className={styles.detailTitle}>{formatMessage({ id: 'BILLING_INFORMATION' })}</span>
        </Col>
      </Row>
      <Row {...rowLayOut} className={styles.contentDetail}>
        <Col {...colLayOut}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'BIL_CONTACT_PERSON_SALUTATION' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{getSalutationStr(salutationList, billingInfo.salutation)}</span>
          </div>
        </Col>
        <Col {...colLayOut}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'BIL_CONTACT_PERSON_FIRST_NAME' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{!isNvl(billingInfo.firstName) ? billingInfo.firstName : '-'}</span>
          </div>
        </Col>
        <Col {...colLayOut}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'BIL_CONTACT_PERSON_LAST_NAME' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{!isNvl(billingInfo.lastName) ? billingInfo.lastName : '-'}</span>
          </div>
        </Col>
        <Col {...colLayOut}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'BILLING_EMAIL' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{!isNvl(billingInfo.email) ? billingInfo.email : '-'}</span>
          </div>
        </Col>
        <Col {...colLayOut}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'BILLING_TEL' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{getTelStr(countryList, billingInfo.country, billingInfo.phone)}</span>
          </div>
        </Col>
        <Col {...colLayOut}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'BIL_MOBILE_NO' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>
              {getTelStr(countryList, billingInfo.mobileCountry, billingInfo.mobileNumber)}
            </span>
          </div>
        </Col>
        <Col {...colLayOut}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'BILLING_COMPANY_NAME' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{!isNvl(billingInfo.companyName) ? billingInfo.companyName : '-'}</span>
          </div>
        </Col>
        <Col {...colLayOut}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'BILLING_COUNTRY_AND_CITY_STATE' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>
              {getCountryAndCityStr(
                countryList,
                billingInfo.country,
                billingInfo.city,
                bilCityList
              )}
            </span>
          </div>
        </Col>
        <Col {...colLayOut}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'BILLING_ZIP_POSTAL_CODE' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{!isNvl(billingInfo.postalCode) ? billingInfo.postalCode : '-'}</span>
          </div>
        </Col>
        <Col span={24}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'BIL_ADDRESS' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{!isNvl(billingInfo.address) ? billingInfo.address : '-'}</span>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default BillingInformation;
