import React from 'react';
import { Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './TaRegistration.less';
import { isNvl } from '@/utils/utils';
import {
  getCountryAndCityStr,
  getSalutationStr,
  getTelStr,
} from '@/pages/TAManagement/utils/pubUtils';

const BillingInformation = props => {
  const {
    billingInfo = {},
    countryList = [],
    bilCityList = [],
    salutationList = [],
    layoutDisplay = {},
    valueDisplay = {},
    longLayoutDisplay = {},
    longValueDisplay = {},
  } = props;
  return (
    <React.Fragment>
      <Row type="flex" justify="space-around">
        <Col span={24}>
          <span className={styles.detailTitle}>{formatMessage({ id: 'BILLING_INFORMATION' })}</span>
        </Col>
      </Row>
      <Row type="flex" justify="space-around">
        <Col span={24}>
          <Row type="flex" justify="space-around">
            <Col
              xs={longLayoutDisplay.xs}
              sm={longLayoutDisplay.sm}
              md={longLayoutDisplay.md}
              lg={longLayoutDisplay.lg}
              xl={longLayoutDisplay.xl}
              xxl={longLayoutDisplay.xxl}
            >
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'BILLING_COMPANY_NAME' })}</span>
              </div>
            </Col>
            <Col
              xs={longValueDisplay.xs}
              sm={longValueDisplay.sm}
              md={longValueDisplay.md}
              lg={longValueDisplay.lg}
              xl={longValueDisplay.xl}
              xxl={longValueDisplay.xxl}
            >
              <div className={styles.detailLeftStyle}>
                <span>{!isNvl(billingInfo.companyName) ? billingInfo.companyName : '-'}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col
              xs={layoutDisplay.xs}
              sm={layoutDisplay.sm}
              md={layoutDisplay.md}
              lg={layoutDisplay.lg}
              xl={layoutDisplay.xl}
              xxl={layoutDisplay.xxl}
            >
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'BILLING_COUNTRY_AND_CITY_STATE' })}</span>
              </div>
            </Col>
            <Col
              xs={valueDisplay.xs}
              sm={valueDisplay.sm}
              md={valueDisplay.md}
              lg={valueDisplay.lg}
              xl={valueDisplay.xl}
              xxl={valueDisplay.xxl}
            >
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
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col
              xs={layoutDisplay.xs}
              sm={layoutDisplay.sm}
              md={layoutDisplay.md}
              lg={layoutDisplay.lg}
              xl={layoutDisplay.xl}
              xxl={layoutDisplay.xxl}
            >
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'BILLING_ZIP_POSTAL_CODE' })}</span>
              </div>
            </Col>
            <Col
              xs={valueDisplay.xs}
              sm={valueDisplay.sm}
              md={valueDisplay.md}
              lg={valueDisplay.lg}
              xl={valueDisplay.xl}
              xxl={valueDisplay.xxl}
            >
              <div className={styles.detailLeftStyle}>
                <span>{!isNvl(billingInfo.postalCode) ? billingInfo.postalCode : '-'}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row type="flex" justify="space-around">
            <Col
              xs={longLayoutDisplay.xs}
              sm={longLayoutDisplay.sm}
              md={longLayoutDisplay.md}
              lg={longLayoutDisplay.lg}
              xl={longLayoutDisplay.xl}
              xxl={longLayoutDisplay.xxl}
            >
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'BIL_ADDRESS' })}</span>
              </div>
            </Col>
            <Col
              xs={longValueDisplay.xs}
              sm={longValueDisplay.sm}
              md={longValueDisplay.md}
              lg={longValueDisplay.lg}
              xl={longValueDisplay.xl}
              xxl={longValueDisplay.xxl}
            >
              <div className={styles.detailLeftStyle}>
                <span>{!isNvl(billingInfo.address) ? billingInfo.address : '-'}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col
              xs={layoutDisplay.xs}
              sm={layoutDisplay.sm}
              md={layoutDisplay.md}
              lg={layoutDisplay.lg}
              xl={layoutDisplay.xl}
              xxl={layoutDisplay.xxl}
            >
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'BILLING_EMAIL' })}</span>
              </div>
            </Col>
            <Col
              xs={valueDisplay.xs}
              sm={valueDisplay.sm}
              md={valueDisplay.md}
              lg={valueDisplay.lg}
              xl={valueDisplay.xl}
              xxl={valueDisplay.xxl}
            >
              <div className={styles.detailLeftStyle}>
                <span>{!isNvl(billingInfo.email) ? billingInfo.email : '-'}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col
              xs={layoutDisplay.xs}
              sm={layoutDisplay.sm}
              md={layoutDisplay.md}
              lg={layoutDisplay.lg}
              xl={layoutDisplay.xl}
              xxl={layoutDisplay.xxl}
            >
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'BILLING_TEL' })}</span>
              </div>
            </Col>
            <Col
              xs={valueDisplay.xs}
              sm={valueDisplay.sm}
              md={valueDisplay.md}
              lg={valueDisplay.lg}
              xl={valueDisplay.xl}
              xxl={valueDisplay.xxl}
            >
              <div className={styles.detailLeftStyle}>
                <span>{getTelStr(countryList, billingInfo.country, billingInfo.phone)}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col
              xs={layoutDisplay.xs}
              sm={layoutDisplay.sm}
              md={layoutDisplay.md}
              lg={layoutDisplay.lg}
              xl={layoutDisplay.xl}
              xxl={layoutDisplay.xxl}
            >
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'BIL_CONTACT_PERSON_SALUTATION' })}</span>
              </div>
            </Col>
            <Col
              xs={valueDisplay.xs}
              sm={valueDisplay.sm}
              md={valueDisplay.md}
              lg={valueDisplay.lg}
              xl={valueDisplay.xl}
              xxl={valueDisplay.xxl}
            >
              <div className={styles.detailLeftStyle}>
                <span>{getSalutationStr(salutationList, billingInfo.salutation)}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} style={{ height: 0 }}>
          <Row type="flex" justify="space-around">
            <Col
              xs={layoutDisplay.xs}
              sm={layoutDisplay.sm}
              md={layoutDisplay.md}
              lg={layoutDisplay.lg}
              xl={layoutDisplay.xl}
              xxl={layoutDisplay.xxl}
            >
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'BIL_MOBILE_NO' })}</span>
              </div>
            </Col>
            <Col
              xs={valueDisplay.xs}
              sm={valueDisplay.sm}
              md={valueDisplay.md}
              lg={valueDisplay.lg}
              xl={valueDisplay.xl}
              xxl={valueDisplay.xxl}
            >
              <div className={styles.detailLeftStyle}>
                <span>
                  {getTelStr(countryList, billingInfo.mobileCountry, billingInfo.mobileNumber)}
                </span>
              </div>
            </Col>
          </Row>{' '}
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col
              xs={layoutDisplay.xs}
              sm={layoutDisplay.sm}
              md={layoutDisplay.md}
              lg={layoutDisplay.lg}
              xl={layoutDisplay.xl}
              xxl={layoutDisplay.xxl}
            >
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'BIL_CONTACT_PERSON_FIRST_NAME' })}</span>
              </div>
            </Col>
            <Col
              xs={valueDisplay.xs}
              sm={valueDisplay.sm}
              md={valueDisplay.md}
              lg={valueDisplay.lg}
              xl={valueDisplay.xl}
              xxl={valueDisplay.xxl}
            >
              <div className={styles.detailLeftStyle}>
                <span>{!isNvl(billingInfo.firstName) ? billingInfo.firstName : '-'}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col
              xs={layoutDisplay.xs}
              sm={layoutDisplay.sm}
              md={layoutDisplay.md}
              lg={layoutDisplay.lg}
              xl={layoutDisplay.xl}
              xxl={layoutDisplay.xxl}
            >
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'BIL_CONTACT_PERSON_LAST_NAME' })}</span>
              </div>
            </Col>
            <Col
              xs={valueDisplay.xs}
              sm={valueDisplay.sm}
              md={valueDisplay.md}
              lg={valueDisplay.lg}
              xl={valueDisplay.xl}
              xxl={valueDisplay.xxl}
            >
              <div className={styles.detailLeftStyle}>
                <span>{!isNvl(billingInfo.lastName) ? billingInfo.lastName : '-'}</span>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default BillingInformation;
