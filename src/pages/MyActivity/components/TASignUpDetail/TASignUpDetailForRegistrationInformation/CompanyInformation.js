import React from 'react';
import { Col, Row } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { isNvl } from '@/utils/utils';
import styles from './TaRegistration.less';
import {
  getCountryAndCityStr,
  getOrganizationRoleStr,
  getTravelAgentNoLabel,
} from '@/pages/TAManagement/utils/pubUtils';

const CompanyInformation = props => {
  const {
    companyInfo = {},
    countryList = [],
    cityList = [],
    organizationRoleList = [],
    layoutDisplay = {},
    valueDisplay = {},
    longLayoutDisplay = {},
    longValueDisplay = {},
  } = props;
  return (
    <React.Fragment>
      <Row type="flex" justify="space-around">
        <Col span={24}>
          <span className={styles.detailTitle}>{formatMessage({ id: 'COMPANY_INFORMATION' })}</span>
        </Col>
      </Row>
      <Row type="flex" justify="space-around">
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
                <span>{formatMessage({ id: 'COMPANY_NAME' })}</span>
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
                <span>{!isNvl(companyInfo.companyName) ? companyInfo.companyName : '-'}</span>
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
                <span>{formatMessage({ id: 'UEN_BUSINESS_REGISTRATION_NUMBER' })}</span>
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
                <span>{!isNvl(companyInfo.registrationNo) ? companyInfo.registrationNo : '-'}</span>
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
                <span>{formatMessage({ id: 'ORGANISATION_ROLE' })}</span>
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
                <span>
                  {getOrganizationRoleStr(organizationRoleList, companyInfo.organizationRole)}
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
                <span>{formatMessage({ id: 'COUNTRY_AND_CITY_STATE' })}</span>
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
                    companyInfo.country,
                    companyInfo.city,
                    cityList
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
                <span>{formatMessage({ id: 'ZIP_POSTAL_CODE' })}</span>
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
                <span>{!isNvl(companyInfo.postalCode) ? companyInfo.postalCode : '-'}</span>
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
                <span>{formatMessage({ id: 'COMPANY_ADDRESS' })}</span>
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
                <span>{!isNvl(companyInfo.address) ? companyInfo.address : '-'}</span>
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
                <span>{formatMessage({ id: 'DATE_OF_INCORPORATION' })}</span>
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
                  {!isNvl(companyInfo.incorporationDate)
                    ? moment(companyInfo.incorporationDate, 'YYYY-MM-DD').format('DD-MMM-YYYY')
                    : '-'}
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
                <span>{getTravelAgentNoLabel(companyInfo.country)}</span>
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
                <span>{!isNvl(companyInfo.travelAgentNo) ? companyInfo.travelAgentNo : '-'}</span>
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
                <span>{formatMessage({ id: 'COMPANY_REGISTRATION_NUMBER' })}</span>
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
                <span>{!isNvl(companyInfo.gstRegNo) ? companyInfo.gstRegNo : '-'}</span>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default CompanyInformation;
