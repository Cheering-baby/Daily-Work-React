import React from 'react';
import { Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import { isNvl } from '@/utils/utils';
import { getCurrencyStr, getFinanceType, getMoneyStr } from '../../utils/pubUtils';
import styles from './index.less';

const DetailForTaFinanceContact = props => {
  const {
    mappingInfo = {},
    financeContactList = [],
    currencyList = [],
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
      <Row type="flex" justify="space-around">
        <Col span={24}>
          <span className={styles.DetailTitle}>{formatMessage({ id: 'PRIMARY_FINANCE' })}</span>
        </Col>
      </Row>
      <Row type="flex" justify="space-around">
        <Col xs={12} sm={12} md={10} lg={6} xl={4} xxl={4}>
          <div className={styles.detailRightStyle}>
            <span>{formatMessage({ id: 'TA_FINANCE_PRIMARY_CONTACT_PERSON' })}</span>
          </div>
        </Col>
        <Col xs={12} sm={12} md={14} lg={18} xl={20} xxl={20}>
          <div className={styles.detailLeftStyle}>
            <span>{!isNvl(financeInfoOne.contactPerson) ? financeInfoOne.contactPerson : '-'}</span>
          </div>
        </Col>
      </Row>
      <Row type="flex" justify="space-around">
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'TA_FINANCE_PRIMARY_CONTACT_NO' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.detailLeftStyle}>
                <span>{!isNvl(financeInfoOne.contactNo) ? financeInfoOne.contactNo : '-'}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'TA_FINANCE_PRIMARY_CONTACT_EMAIL' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.detailLeftStyle}>
                <span>
                  {!isNvl(financeInfoOne.contactEmail) ? financeInfoOne.contactEmail : '-'}
                </span>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row type="flex" justify="space-around">
        <Col xs={12} sm={12} md={10} lg={6} xl={4} xxl={4}>
          <div className={styles.detailRightStyle}>
            <span>{formatMessage({ id: 'TA_FINANCE_SECONDARY_CONTACT_PERSON' })}</span>
          </div>
        </Col>
        <Col xs={12} sm={12} md={14} lg={18} xl={20} xxl={20}>
          <div className={styles.detailLeftStyle}>
            <span>{!isNvl(financeInfoTwo.contactPerson) ? financeInfoTwo.contactPerson : '-'}</span>
          </div>
        </Col>
      </Row>
      <Row type="flex" justify="space-around">
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'TA_FINANCE_SECONDARY_CONTACT_NO' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.detailLeftStyle}>
                <span>{!isNvl(financeInfoTwo.contactNo) ? financeInfoTwo.contactNo : '-'}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'TA_FINANCE_SECONDARY_CONTACT_EMAIL' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.detailLeftStyle}>
                <span>
                  {!isNvl(financeInfoTwo.contactEmail) ? financeInfoTwo.contactEmail : '-'}
                </span>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      {(isMainTaRoleFlag || isAccountingArRoleFlag) && (
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Row type="flex" justify="space-around">
              <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'TA_FINANCE_SECONDARY_CONTACT_AMOUNT' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span>{getMoneyStr(mappingInfo.securityDepositAmount)}</span>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Row type="flex" justify="space-around">
              <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'TA_FINANCE_CURRENCY' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span>{getCurrencyStr(currencyList, mappingInfo.currency)}</span>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
      {isAccountingArRoleFlag && (
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Row type="flex" justify="space-around">
              <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'TA_FINANCE_E_WALLET_FIXED_THRESHOLD' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span>
                    {!isNvl(mappingInfo.ewalletFixedThreshold)
                      ? mappingInfo.ewalletFixedThreshold
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
                  <span>{formatMessage({ id: 'TA_FINANCE_AR_FIXED_THRESHOLD' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span>
                    {!isNvl(mappingInfo.arFixedThreshold) ? mappingInfo.arFixedThreshold : '-'}
                  </span>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
      {(isMainTaRoleFlag || isAccountingArRoleFlag) && (
        <React.Fragment>
          <Row type="flex" justify="space-around">
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Row type="flex" justify="space-around">
                <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                  <div className={styles.detailRightStyle}>
                    <span>{formatMessage({ id: 'TA_FINANCE_BANKER_GUARANTEE_AMOUNT' })}</span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                  <div className={styles.detailLeftStyle}>
                    <span>{getMoneyStr(mappingInfo.guaranteeAmount)}</span>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Row type="flex" justify="space-around">
                <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                  <div className={styles.detailRightStyle}>
                    <span>{formatMessage({ id: 'TA_FINANCE_BANKER_GUARANTEE_EXPIRY_DATE' })}</span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                  <div className={styles.detailLeftStyle}>
                    <span>
                      {!isNvl(mappingInfo.guaranteeExpiryDate)
                        ? moment(mappingInfo.guaranteeExpiryDate, 'YYYY-MM-DD').format(
                            'DD-MMM-YYYY'
                          )
                        : '-'}
                    </span>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row type="flex" justify="space-around">
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Row type="flex" justify="space-around">
                <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                  <div className={styles.detailRightStyle}>
                    <span>{formatMessage({ id: 'TA_FINANCE_CREDIT_TERM' })}</span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                  <div className={styles.detailLeftStyle}>
                    <span>{!isNvl(mappingInfo.creditTerm) ? mappingInfo.creditTerm : '-'}</span>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Row type="flex" justify="space-around">
                <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                  <div className={styles.detailRightStyle}>
                    <span>{formatMessage({ id: 'TA_FINANCE_CREDIT_LIMIT' })}</span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                  <div className={styles.detailLeftStyle}>
                    <span>{!isNvl(mappingInfo.creditLimit) ? mappingInfo.creditLimit : '-'}</span>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
export default DetailForTaFinanceContact;
