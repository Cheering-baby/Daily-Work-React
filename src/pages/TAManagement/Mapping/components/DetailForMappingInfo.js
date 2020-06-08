import React from 'react';
import { Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import styles from '../$mappingDetails/index.less';
import { colLayOut, rowLayOut } from '../../utils/pubUtils';
import { isNvl } from '@/utils/utils';

class DetailForMapppingInfor extends React.PureComponent {
  toThousands = num => {
    num = (num || 0).toString();
    let number = 0;
    let floatNum = '';
    let intNum = '';
    if (num.indexOf('.') > 0) {
      number = num.indexOf('.');
      floatNum = num.substr(number);
      intNum = num.substring(0, number);
    } else {
      intNum = num;
    }
    const result = [];
    let counter = 0;
    intNum = intNum.split('');
    for (let i = intNum.length - 1; i >= 0; i -= 1) {
      counter += 1;
      result.unshift(intNum[i]);
      if (!(counter % 3) && i !== 0) {
        result.unshift(',');
      }
    }
    return result.join('') + floatNum || '';
  };

  render() {
    const { queryMappingInfo, companyName } = this.props;

    return (
      <React.Fragment>
        <div className="title-header" style={{ marginBottom: '8px' }}>
          <span>{formatMessage({ id: 'MAPPING_DETAIL' })}</span>
        </div>
        <Row {...rowLayOut}>
          <Col span={24}>
            <div className={styles.detailLabelStyle}>
              <span>{formatMessage({ id: 'MAPPING_MAIN_TA_PROFILE' })}:</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>{!isNvl(companyName) && companyName !== 'null' ? companyName : '-'}</span>
            </div>
          </Col>
        </Row>
        <div className={styles.DetailTitle} style={{ marginTop: '16px' }}>
          <span>{formatMessage({ id: 'BY_SALES_SUPPORT' })}</span>
        </div>
        <Row {...rowLayOut}>
          <Col {...colLayOut}>
            <div className={styles.detailLabelStyle}>
              <span>{formatMessage({ id: 'MAPPING_OPERA_EWALLET' })}:</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>
                {!isNvl(queryMappingInfo.operaEwallet) && queryMappingInfo.operaEwallet !== 'null'
                  ? queryMappingInfo.operaEwallet
                  : '-'}
              </span>
            </div>
          </Col>
          <Col {...colLayOut}>
            <div className={styles.detailLabelStyle}>
              <span>{formatMessage({ id: 'MAPPING_GALAXY_EWALLET' })}:</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>
                {!isNvl(queryMappingInfo.galaxyEwallet) && queryMappingInfo.galaxyEwallet !== 'null'
                  ? queryMappingInfo.galaxyEwallet
                  : '-'}
              </span>
            </div>
          </Col>
        </Row>
        <Row {...rowLayOut}>
          <Col {...colLayOut}>
            <div className={styles.detailLabelStyle}>
              <span>{formatMessage({ id: 'MAPPING_OPERA_AR_CREDIT' })}:</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>
                {!isNvl(queryMappingInfo.operaArCredit) && queryMappingInfo.operaArCredit !== 'null'
                  ? queryMappingInfo.operaArCredit
                  : '-'}
              </span>
            </div>
          </Col>
          <Col {...colLayOut}>
            <div className={styles.detailLabelStyle}>
              <span>{formatMessage({ id: 'MAPPING_GALAXY_CREDIT' })}:</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>
                {!isNvl(queryMappingInfo.galaxyArCredit) &&
                queryMappingInfo.galaxyArCredit !== 'null'
                  ? queryMappingInfo.galaxyArCredit
                  : '-'}
              </span>
            </div>
          </Col>
        </Row>
        <Row {...rowLayOut}>
          <Col {...colLayOut}>
            <div className={styles.detailLabelStyle}>
              <span>{formatMessage({ id: 'MAPPING_PRODUCT' })}:</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>
                {!isNvl(queryMappingInfo.productName) && queryMappingInfo.productName !== 'null'
                  ? queryMappingInfo.productName
                  : '-'}
              </span>
            </div>
          </Col>
        </Row>
        <div className={styles.DetailTitle}>
          <span>{formatMessage({ id: 'BY_ACCOUNTING_AR' })}</span>
        </div>
        <Row {...rowLayOut}>
          <Col {...colLayOut}>
            <div className={styles.detailLabelStyle}>
              <span>{formatMessage({ id: 'MAPPING_PEOPLESOFR_EWALLET_ID' })}:</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>
                {!isNvl(queryMappingInfo.peoplesoftEwalletId) &&
                queryMappingInfo.peoplesoftEwalletId !== 'null'
                  ? queryMappingInfo.peoplesoftEwalletId
                  : '-'}
              </span>
            </div>
          </Col>
          <Col {...colLayOut}>
            <div className={styles.detailLabelStyle}>
              <span>{formatMessage({ id: 'MAPPING_EWALLET_FIXED_THRESHOLD' })}:</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>
                {!isNvl(queryMappingInfo.ewalletFixedThreshold) &&
                queryMappingInfo.ewalletFixedThreshold !== 'null'
                  ? `$ ${this.toThousands(+queryMappingInfo.ewalletFixedThreshold)}`
                  : '-'}
              </span>
            </div>
          </Col>
        </Row>
        <Row {...rowLayOut}>
          <Col {...colLayOut}>
            <div className={styles.detailLabelStyle}>
              <span>{formatMessage({ id: 'MAPPING_PEOPLESOFR_AR_ACCOUNT_ID' })}:</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>
                {!isNvl(queryMappingInfo.peoplesoftArAccountId) &&
                queryMappingInfo.peoplesoftArAccountId !== 'null'
                  ? queryMappingInfo.peoplesoftArAccountId
                  : '-'}
              </span>
            </div>
          </Col>
          <Col {...colLayOut}>
            <div className={styles.detailLabelStyle}>
              <span>{formatMessage({ id: 'MAPPING_AR_FIXED_THRESHOLD' })}:</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>
                {!isNvl(queryMappingInfo.arFixedThreshold) &&
                queryMappingInfo.arFixedThreshold !== 'null'
                  ? `$ ${this.toThousands(+queryMappingInfo.arFixedThreshold)}`
                  : '-'}
              </span>
            </div>
          </Col>
          <Col {...colLayOut}>
            <div className={styles.detailLabelStyle}>
              <span>{formatMessage({ id: 'MAPPING_ACCOUNT_COMMENCEMENT_DATE' })}:</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>
                {queryMappingInfo && !isNvl(queryMappingInfo.arAccountCommencementDate)
                  ? moment(queryMappingInfo.arAccountCommencementDate).format('YYYY-MM-DD')
                  : '-'}
              </span>
            </div>
          </Col>
          <Col {...colLayOut}>
            <div className={styles.detailLabelStyle}>
              <span>{formatMessage({ id: 'MAPPING_AR_ACCOUNT_END_DATE' })}:</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>
                {!isNvl(queryMappingInfo.arAccountEndDate)
                  ? moment(queryMappingInfo.arAccountEndDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
                  : '-'}
              </span>
            </div>
          </Col>
        </Row>
        <Row {...rowLayOut}>
          <Col {...colLayOut}>
            <div className={styles.detailLabelStyle}>
              <span>{formatMessage({ id: 'MAPPING_CREDIT_TERM' })}:</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>
                {!isNvl(queryMappingInfo.creditTerm) && queryMappingInfo.creditTerm !== 'null'
                  ? `Net ${queryMappingInfo.creditTerm} days`
                  : '-'}
              </span>
            </div>
          </Col>
          <Col {...colLayOut}>
            <div className={styles.detailLabelStyle}>
              <span>{formatMessage({ id: 'MAPPING_CREDIT_LIMIT' })}:</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>
                {!isNvl(queryMappingInfo.creditLimit) && queryMappingInfo.creditLimit !== 'null'
                  ? `$ ${this.toThousands(+queryMappingInfo.creditLimit)}`
                  : '-'}
              </span>
            </div>
          </Col>

          <Col {...colLayOut}>
            <div className={styles.detailLabelStyle}>
              <span>{formatMessage({ id: 'MAPPING_SECURITY_DEPOSIT_AMOUNT' })}:</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>
                {!isNvl(queryMappingInfo.securityDepositAmount) &&
                queryMappingInfo.securityDepositAmount !== 'null'
                  ? `$ ${this.toThousands(+queryMappingInfo.securityDepositAmount)}`
                  : '-'}
              </span>
            </div>
          </Col>
          <Col {...colLayOut}>
            <div className={styles.detailLabelStyle}>
              <span>{formatMessage({ id: 'MAPPING_BANKER_GUARANTEE_AMOUNT' })}:</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>
                {!isNvl(queryMappingInfo.guaranteeAmount) &&
                queryMappingInfo.guaranteeAmount !== 'null'
                  ? `$ ${this.toThousands(+queryMappingInfo.guaranteeAmount)}`
                  : '-'}
              </span>
            </div>
          </Col>
          <Col {...colLayOut}>
            <div className={styles.detailLabelStyle}>
              <span>{formatMessage({ id: 'MAPPING_BANKER_GUARANTEE_EXPIRY_DATE' })}:</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>
                {!isNvl(queryMappingInfo.guaranteeExpiryDate)
                  ? moment(queryMappingInfo.guaranteeExpiryDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
                  : '-'}
              </span>
            </div>
          </Col>
          <Col {...colLayOut}>
            <div className={styles.detailLabelStyle}>
              <span>{formatMessage({ id: 'MAPPING_CURRENCY' })}:</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>
                {!isNvl(queryMappingInfo.currency) && queryMappingInfo.currency !== 'null'
                  ? queryMappingInfo.currency
                  : '-'}
              </span>
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
export default DetailForMapppingInfor;
