import React from 'react';
import { Col, Row } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { isNvl } from '@/utils/utils';
import styles from './TaRegistration.less';
import { colLayOut, rowLayOut } from '@/pages/MyActivity/components/constants';
import {
  getCountryAndCityStr,
  getOrganizationRoleStr,
  getTravelAgentNoLabel,
} from '@/pages/TAManagement/utils/pubUtils';

const CompanyInformation = props => {
  const { companyInfo = {}, countryList = [], cityList = [], organizationRoleList = [] } = props;
  return (
    <React.Fragment>
      <Row {...rowLayOut}>
        <Col span={24}>
          <span className={styles.detailTitle}>{formatMessage({ id: 'COMPANY_INFORMATION' })}</span>
        </Col>
      </Row>
      <Row {...rowLayOut} className={styles.contentDetail}>
        <Col span={24} className={styles.colStyle}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'COMPANY_NAME' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{!isNvl(companyInfo.companyName) ? companyInfo.companyName : '-'}</span>
          </div>
        </Col>
        <Col span={24} className={styles.colStyle}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'COMPANY_ADDRESS' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{!isNvl(companyInfo.address) ? companyInfo.address : '-'}</span>
          </div>
        </Col>
        <Col {...colLayOut} className={styles.colStyle}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'UEN_BUSINESS_REGISTRATION_NUMBER' })}</span>
          </div>

          <div className={styles.detailLeftStyle}>
            <span>{!isNvl(companyInfo.registrationNo) ? companyInfo.registrationNo : '-'}</span>
          </div>
        </Col>
        <Col {...colLayOut} className={styles.colStyle}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'ORGANISATION_ROLE' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>
              {getOrganizationRoleStr(organizationRoleList, companyInfo.organizationRole)}
            </span>
          </div>
        </Col>
        <Col {...colLayOut} className={styles.colStyle}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'COUNTRY_AND_CITY_STATE' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>
              {getCountryAndCityStr(countryList, companyInfo.country, companyInfo.city, cityList)}
            </span>
          </div>
        </Col>
        <Col {...colLayOut} className={styles.colStyle}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'ZIP_POSTAL_CODE' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{!isNvl(companyInfo.postalCode) ? companyInfo.postalCode : '-'}</span>
          </div>
        </Col>
        <Col {...colLayOut} className={styles.colStyle}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'DATE_OF_INCORPORATION' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>
              {!isNvl(companyInfo.incorporationDate)
                ? moment(companyInfo.incorporationDate, 'YYYY-MM-DD').format('DD-MMM-YYYY')
                : '-'}
            </span>
          </div>
        </Col>
        <Col {...colLayOut} className={styles.colStyle}>
          <div className={styles.detailLabelStyle}>
            <span>{getTravelAgentNoLabel(companyInfo.country)}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{!isNvl(companyInfo.travelAgentNo) ? companyInfo.travelAgentNo : '-'}</span>
          </div>
        </Col>
        <Col {...colLayOut} className={styles.colStyle}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'COMPANY_REGISTRATION_NUMBER' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{!isNvl(companyInfo.gstRegNo) ? companyInfo.gstRegNo : '-'}</span>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default CompanyInformation;
