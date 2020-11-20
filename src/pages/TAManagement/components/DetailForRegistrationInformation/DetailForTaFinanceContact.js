import React from 'react';
import { Col, Descriptions, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import { isNvl } from '@/utils/utils';
import {
  getCreateTeamStr,
  getCurrencyStr,
  getFinanceType,
  getMoneyStr,
  getTelStr,
  detailLayOut,
} from '../../utils/pubUtils';
import styles from './index.less';

const DetailForTaFinanceContact = props => {
  const {
    mappingInfo = {},
    financeContactList = [],
    currencyList = [],
    countryList = [],
    createTeamList = [],
    isMainTaRoleFlag,
    isAccountingArRoleFlag,
  } = props;
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
      <Row type="flex">
        <Col span={24}>
          <span className={styles.DetailTitle}>{formatMessage({ id: 'PRIMARY_FINANCE' })}</span>
        </Col>
      </Row>
      <Row type="flex" className={styles.detailContent}>
        <Col span={24}>
          <Descriptions className={styles.descriptionsStyle} column={detailLayOut}>
            <Descriptions.Item label={formatMessage({ id: 'TA_FINANCE_PRIMARY_CONTACT_PERSON' })}>
              {!isNvl(financeInfoOne.contactPerson) ? financeInfoOne.contactPerson : '-'}
            </Descriptions.Item>
            <Descriptions.Item
              label={formatMessage({ id: 'TA_FINANCE_PRIMARY_CONTACT_MOBILE_NO' })}
            >
              {getTelStr(countryList, financeInfoOne.mobileCountry, financeInfoOne.mobileNumber)}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'TA_FINANCE_PRIMARY_CONTACT_NO' })}>
              {getTelStr(countryList, financeInfoOne.country, financeInfoOne.contactNo)}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'TA_FINANCE_PRIMARY_CONTACT_EMAIL' })}>
              {!isNvl(financeInfoOne.contactEmail) ? financeInfoOne.contactEmail : '-'}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <Row type="flex">
        <Col span={24}>
          <span className={styles.DetailTitle}>{formatMessage({ id: 'SECONDARY_FINANCE' })}</span>
        </Col>
      </Row>
      <Row type="flex" className={styles.detailContent}>
        <Col span={24}>
          <Descriptions className={styles.descriptionsStyle} column={detailLayOut}>
            <Descriptions.Item label={formatMessage({ id: 'TA_FINANCE_SECONDARY_CONTACT_PERSON' })}>
              {!isNvl(financeInfoTwo.contactPerson) ? financeInfoTwo.contactPerson : '-'}
            </Descriptions.Item>
            <Descriptions.Item
              label={formatMessage({ id: 'TA_FINANCE_SECONDARY_CONTACT_MOBILE_NO' })}
            >
              {getTelStr(countryList, financeInfoTwo.mobileCountry, financeInfoTwo.mobileNumber)}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'TA_FINANCE_SECONDARY_CONTACT_NO' })}>
              {getTelStr(countryList, financeInfoTwo.country, financeInfoTwo.contactNo)}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'TA_FINANCE_SECONDARY_CONTACT_EMAIL' })}>
              {!isNvl(financeInfoTwo.contactEmail) ? financeInfoTwo.contactEmail : '-'}
            </Descriptions.Item>
          </Descriptions>
          {(isMainTaRoleFlag || isAccountingArRoleFlag) && (
            <Descriptions className={styles.descriptionsStyle} column={detailLayOut}>
              <Descriptions.Item
                label={formatMessage({ id: 'TA_FINANCE_SECONDARY_CONTACT_AMOUNT' })}
              >
                {getMoneyStr(mappingInfo.securityDepositAmount)}
              </Descriptions.Item>
              <Descriptions.Item label={formatMessage({ id: 'TA_FINANCE_CURRENCY' })}>
                {getCurrencyStr(currencyList, mappingInfo.currency)}
              </Descriptions.Item>
            </Descriptions>
          )}
          {isAccountingArRoleFlag && (
            <Descriptions className={styles.descriptionsStyle} column={detailLayOut}>
              <Descriptions.Item
                label={formatMessage({ id: 'TA_FINANCE_E_WALLET_FIXED_THRESHOLD' })}
              >
                {getMoneyStr(mappingInfo.ewalletFixedThreshold)}
              </Descriptions.Item>
              <Descriptions.Item label={formatMessage({ id: 'TA_FINANCE_AR_FIXED_THRESHOLD' })}>
                {getMoneyStr(mappingInfo.arFixedThreshold)}
              </Descriptions.Item>
            </Descriptions>
          )}
          {(isMainTaRoleFlag || isAccountingArRoleFlag) && (
            <Descriptions className={styles.descriptionsStyle} column={detailLayOut}>
              <Descriptions.Item
                label={formatMessage({ id: 'TA_FINANCE_BANKER_GUARANTEE_AMOUNT' })}
              >
                {getMoneyStr(mappingInfo.guaranteeAmount)}
              </Descriptions.Item>
              <Descriptions.Item
                label={formatMessage({ id: 'TA_FINANCE_BANKER_GUARANTEE_EXPIRY_DATE' })}
              >
                {!isNvl(mappingInfo.guaranteeExpiryDate)
                  ? moment(mappingInfo.guaranteeExpiryDate, 'YYYY-MM-DD').format('DD-MMM-YYYY')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={formatMessage({ id: 'TA_FINANCE_CREDIT_TERM' })}>
                {!isNvl(mappingInfo.creditTerm)
                  ? getCreateTeamStr(createTeamList, mappingInfo.creditTerm)
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={formatMessage({ id: 'TA_FINANCE_CREDIT_LIMIT' })}>
                {getMoneyStr(mappingInfo.creditLimit)}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default DetailForTaFinanceContact;
