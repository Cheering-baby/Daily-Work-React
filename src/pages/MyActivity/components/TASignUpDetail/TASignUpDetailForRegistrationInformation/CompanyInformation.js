import React from 'react';
import { Col, Row } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { isNvl } from '@/utils/utils';
import styles from './TaRegistration.less';
import { getCountryAndCityStr, getOrganizationRoleStr } from '@/pages/TAManagement/utils/pubUtils';

const CompanyInformation = props => {
  const { companyInfo = {}, countryList = [], cityList = [], organizationRoleList = [] } = props;
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
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'COMPANY_NAME' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.detailLeftStyle}>
                <span>{!isNvl(companyInfo.companyName) ? companyInfo.companyName : '-'}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'UEN_BUSINESS_REGISTRATION_NUMBER' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.detailLeftStyle}>
                <span>{!isNvl(companyInfo.registrationNo) ? companyInfo.registrationNo : '-'}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={6} xl={4} xxl={4}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'ORGANISATION_ROLE' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={18} xl={20} xxl={20}>
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
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'COUNTRY_AND_CITY_STATE' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
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
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'ZIP_POSTAL_CODE' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.detailLeftStyle}>
                <span>{!isNvl(companyInfo.postalCode) ? companyInfo.postalCode : '-'}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={6} xl={4} xxl={4}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'COMPANY_ADDRESS' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={18} xl={20} xxl={20}>
              <div className={styles.detailLeftStyle}>
                <span>{!isNvl(companyInfo.address) ? companyInfo.address : '-'}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'DATE_OF_INCORPORATION' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.detailLeftStyle}>
                <span>
                  {!isNvl(companyInfo.incorporationDate)
                    ? moment(companyInfo.incorporationDate).format('DD-MMM-YYYY')
                    : '-'}
                </span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'STB_TRAVEL_AGENT_LICENSE_NUMBER' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.detailLeftStyle}>
                <span>
                  {String(companyInfo.country).toLowerCase() === 'singapore'
                    ? companyInfo.travelAgentNo
                    : '-'}
                </span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={6} xl={4} xxl={4}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'TRAVEL_AGENT_REGISTRATION_NUMBER' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={18} xl={20} xxl={20}>
              <div className={styles.detailLeftStyle}>
                <span>
                  {String(companyInfo.country).toLowerCase() !== 'singapore'
                    ? companyInfo.travelAgentNo
                    : '-'}
                </span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={6} xl={4} xxl={4}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'COMPANY_REGISTRATION_NUMBER' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={18} xl={20} xxl={20}>
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
