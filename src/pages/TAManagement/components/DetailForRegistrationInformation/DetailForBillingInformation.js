import React from 'react';
import { Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { isNvl } from '@/utils/utils';
import { getCountryAndCityStr, getSalutationStr, getTelStr } from '../../utils/pubUtils';

const DetailForBillingInformation = props => {
  const { billingInfo = {}, countryList = [], bilCityList = [], salutationList = [] } = props;
  return (
    <React.Fragment>
      <Row type="flex" justify="space-around">
        <Col span={24}>
          <span className={styles.DetailTitle}>{formatMessage({ id: 'BILLING_INFORMATION' })}</span>
        </Col>
      </Row>
      <Row type="flex" justify="space-around">
        <Col span={24}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={6} xl={4} xxl={4}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'BIL_COMPANY_NAME' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={18} xl={20} xxl={20}>
              <div className={styles.detailLeftStyle}>
                <span>{!isNvl(billingInfo.companyName) ? billingInfo.companyName : '-'}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'BIL_COUNTRY_AND_CITY_STATE' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
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
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'BIL_ZIP_POSTAL_CODE' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.detailLeftStyle}>
                <span>{!isNvl(billingInfo.postalCode) ? billingInfo.postalCode : '-'}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={6} xl={4} xxl={4}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'BIL_ADDRESS' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={18} xl={20} xxl={20}>
              <div className={styles.detailLeftStyle}>
                <span>{!isNvl(billingInfo.address) ? billingInfo.address : '-'}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'BIL_EMAIL' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.detailLeftStyle}>
                <span>{!isNvl(billingInfo.email) ? billingInfo.email : '-'}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'BIL_TEL' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.detailLeftStyle}>
                <span>{getTelStr(countryList, billingInfo.country, billingInfo.phone)}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'BIL_CONTACT_PERSON_SALUTATION' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.detailLeftStyle}>
                <span>{getSalutationStr(salutationList, billingInfo.salutation)}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} style={{ height: 0 }}>
          &nbsp;
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'BIL_CONTACT_PERSON_FIRST_NAME' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.detailLeftStyle}>
                <span>{!isNvl(billingInfo.firstName) ? billingInfo.firstName : '-'}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'BIL_CONTACT_PERSON_LAST_NAME' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
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
export default DetailForBillingInformation;
