import React from 'react';
import { Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { isNvl } from '@/utils/utils';
import { getFinanceType, getTelStr } from '@/pages/TAManagement/utils/pubUtils';
import styles from './TaRegistration.less';
import { colLayOut, rowLayOut } from '@/pages/MyActivity/components/constants';

const TaFinanceContact = props => {
  const { financeContactList = [], countryList = [] } = props;
  const { financeTypeOne, financeTypeTwo } = getFinanceType() || {};
  let financeInfoOne = {};
  if (financeContactList && financeContactList.length > 0) {
    financeInfoOne = financeContactList.find(
      item => String(item.financeType).toLowerCase() === financeTypeOne
    );
  }
  if (isNvl(financeInfoOne)) financeInfoOne = {};
  let financeInfoTwo = {};
  if (financeContactList && financeContactList.length > 0) {
    financeInfoTwo = financeContactList.find(
      item => String(item.financeType).toLowerCase() === financeTypeTwo
    );
  }
  if (isNvl(financeInfoTwo)) financeInfoTwo = {};
  return (
    <React.Fragment>
      <Row {...rowLayOut}>
        <Col span={24}>
          <span className={styles.detailTitle}>{formatMessage({ id: 'TA_FINANCE_CONTACT' })}</span>
        </Col>
      </Row>
      <Row {...rowLayOut} className={styles.contentDetail}>
        <Col {...colLayOut}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'TA_FINANCE_PRIMARY_CONTACT_PERSON' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{!isNvl(financeInfoOne.contactPerson) ? financeInfoOne.contactPerson : '-'}</span>
          </div>
        </Col>
        <Col {...colLayOut}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'TA_FINANCE_PRIMARY_CONTACT_MOBILE_NO' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>
              {getTelStr(countryList, financeInfoOne.mobileCountry, financeInfoOne.mobileNumber)}
            </span>
          </div>
        </Col>
        <Col {...colLayOut}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'TA_FINANCE_PRIMARY_CONTACT_NO' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{getTelStr(countryList, financeInfoOne.country, financeInfoOne.contactNo)}</span>
          </div>
        </Col>
        <Col {...colLayOut}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'TA_FINANCE_PRIMARY_CONTACT_EMAIL' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{!isNvl(financeInfoOne.contactEmail) ? financeInfoOne.contactEmail : '-'}</span>
          </div>
        </Col>
      </Row>
      <Row {...rowLayOut} className={styles.contentDetail}>
        <Col {...colLayOut}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'TA_FINANCE_SECONDARY_CONTACT_PERSON' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{!isNvl(financeInfoTwo.contactPerson) ? financeInfoTwo.contactPerson : '-'}</span>
          </div>
        </Col>
        <Col {...colLayOut}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'TA_FINANCE_SECONDARY_CONTACT_MOBILE_NO' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>
              {getTelStr(countryList, financeInfoTwo.mobileCountry, financeInfoTwo.mobileNumber)}
            </span>
          </div>
        </Col>
        <Col {...colLayOut}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'TA_FINANCE_SECONDARY_CONTACT_NO' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{getTelStr(countryList, financeInfoTwo.country, financeInfoTwo.contactNo)}</span>
          </div>
        </Col>
        <Col {...colLayOut}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'TA_FINANCE_SECONDARY_CONTACT_EMAIL' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{!isNvl(financeInfoTwo.contactEmail) ? financeInfoTwo.contactEmail : '-'}</span>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default TaFinanceContact;
