import React, { PureComponent } from 'react';
import { Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import styles from './index.less';
import { isNvl } from '@/utils/utils';

class DetailForAccountingInformation extends PureComponent {
  render() {
    const { mappingInfo = {}, accountInfo = {}, taId } = this.props;
    return (
      <Row type="flex" justify="space-around">
        <Col span={24}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={6} xl={4} xxl={4}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'ACCOUNTING_AGENT_ID' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={18} xl={20} xxl={20}>
              <div className={styles.detailLeftStyle}>
                <span>{!isNvl(taId) ? taId : '-'}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'ACCOUNTING_PEOPLE_SOFT_E_WALLET_ID' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.detailLeftStyle}>
                <span>
                  {!isNvl(accountInfo.peoplesoftEwalletId) ? accountInfo.peoplesoftEwalletId : '-'}
                </span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'ACCOUNTING_PEOPLE_SOFT_AR_ACCOUNT_ID' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.detailLeftStyle}>
                <span>
                  {!isNvl(accountInfo.peoplesoftArAccountId)
                    ? accountInfo.peoplesoftArAccountId
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
                <span>{formatMessage({ id: 'ACCOUNTING_EFFECTIVE_DATE' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.detailLeftStyle}>
                <span>
                  {!isNvl(mappingInfo.effectiveDate)
                    ? moment(mappingInfo.effectiveDate, 'YYYY-MM-DD').format('DD-MMM-YYYY')
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
                <span>{formatMessage({ id: 'ACCOUNTING_LAST_ACTIVITY_DATE' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.detailLeftStyle}>
                <span>
                  {!isNvl(accountInfo.lastActivityDate)
                    ? moment(accountInfo.lastActivityDate, 'YYYY-MM-DD').format('DD-MMM-YYYY')
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
                <span>{formatMessage({ id: 'ACCOUNTING_MODIFIED_DATE' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.detailLeftStyle}>
                <span>
                  {!isNvl(accountInfo.modifiedTime)
                    ? moment(accountInfo.modifiedTime, 'YYYY-MM-DD').format('DD-MMM-YYYY')
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
                <span>{formatMessage({ id: 'ACCOUNTING_MODIFIED_BY' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.detailLeftStyle}>
                <span>{!isNvl(accountInfo.modifiedBy) ? accountInfo.modifiedBy : '-'}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'ACCOUNTING_AR_CREDIT_BALANCE' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.detailLeftStyle}>
                <span>
                  {!isNvl(accountInfo.arCreditBalance) ? accountInfo.arCreditBalance : '-'}
                </span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'ACCOUNTING_E_WALLET_BALANCE' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.detailLeftStyle}>
                <span>
                  {!isNvl(accountInfo.ewalletIdBalance) ? accountInfo.ewalletIdBalance : '-'}
                </span>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default DetailForAccountingInformation;
