import React from 'react';
import { Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import styles from '../$mappingDetails/index.less';
import { isNvl } from '@/utils/utils';

class DetailForMapppingInfor extends React.PureComponent {
  render() {
    const { queryMappingInfo, companyName } = this.props;
    return (
      <React.Fragment>
        <div className="title-header">
          <span>{formatMessage({ id: 'COMMISSION_DETAIL' })}</span>
        </div>
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Row type="flex" justify="space-around">
              <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'MAPPING_MAIN_TA_PROFILE' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span>{!isNvl(companyName) && companyName !== 'null' ? companyName : '-'}</span>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Row type="flex" justify="space-around">
              <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'MAPPING_OPERA_EWALLET' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span>
                    {!isNvl(queryMappingInfo.operaEwallet) &&
                    queryMappingInfo.operaEwallet !== 'null'
                      ? queryMappingInfo.operaEwallet
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
                  <span>{formatMessage({ id: 'MAPPING_OPERA_AR_CREDIT' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span>
                    {!isNvl(queryMappingInfo.operaArCredit) &&
                    queryMappingInfo.operaArCredit !== 'null'
                      ? queryMappingInfo.operaArCredit
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
                  <span>{formatMessage({ id: 'MAPPING_GALAXY_EWALLET' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span>
                    {!isNvl(queryMappingInfo.galaxyEwallet) &&
                    queryMappingInfo.galaxyEwallet !== 'null'
                      ? queryMappingInfo.galaxyEwallet
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
                  <span>{formatMessage({ id: 'MAPPING_GALAXY_CREDIT' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
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
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Row type="flex" justify="space-around">
              <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'MAPPING_PEOPLESOFR_EWALLET_ID' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span>
                    {!isNvl(queryMappingInfo.peoplesoftEwalletId) &&
                    queryMappingInfo.peoplesoftEwalletId !== 'null'
                      ? queryMappingInfo.peoplesoftEwalletId
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
                  <span>{formatMessage({ id: 'MAPPING_PEOPLESOFR_AR_ACCOUNT_ID' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span>
                    {!isNvl(queryMappingInfo.peoplesoftArAccountId) &&
                    queryMappingInfo.peoplesoftArAccountId !== 'null'
                      ? queryMappingInfo.peoplesoftArAccountId
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
                  <span>{formatMessage({ id: 'MAPPING_CREDIT_TERM' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span>
                    {!isNvl(queryMappingInfo.creditTerm) && queryMappingInfo.creditTerm !== 'null'
                      ? queryMappingInfo.creditTerm
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
                  <span>{formatMessage({ id: 'MAPPING_CREDIT_LIMIT' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span>
                    {!isNvl(queryMappingInfo.creditLimit) && queryMappingInfo.creditLimit !== 'null'
                      ? queryMappingInfo.creditLimit
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
                  <span>{formatMessage({ id: 'MAPPING_EWALLET_FIXED_THRESHOLD' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span>
                    {!isNvl(queryMappingInfo.ewalletFixedThreshold) &&
                    queryMappingInfo.ewalletFixedThreshold !== 'null'
                      ? queryMappingInfo.ewalletFixedThreshold
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
                  <span>{formatMessage({ id: 'MAPPING_AR_FIXED_THRESHOLD' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span>
                    {!isNvl(queryMappingInfo.arFixedThreshold) &&
                    queryMappingInfo.arFixedThreshold !== 'null'
                      ? queryMappingInfo.arFixedThreshold
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
                  <span>{formatMessage({ id: 'MAPPING_ACCOUNT_COMMENCEMENT_DATE' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span>
                    {queryMappingInfo && queryMappingInfo.arAccountCommencementDate
                      ? moment(queryMappingInfo.arAccountCommencementDate).format(
                          'YYYY-MM-DD hh:mm:ss'
                        )
                      : ''}
                  </span>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Row type="flex" justify="space-around">
              <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'MAPPING_AR_ACCOUNT_END_DATE' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span>
                    {!isNvl(queryMappingInfo.arAccountEndDate)
                      ? moment(queryMappingInfo.arAccountEndDate, 'YYYY-MM-DD').format(
                          'YYYY-MM-DD hh:mm:ss'
                        )
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
                  <span>{formatMessage({ id: 'MAPPING_SECURITY_DEPOSIT_AMOUNT' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span>
                    {!isNvl(queryMappingInfo.securityDepositAmount) &&
                    queryMappingInfo.securityDepositAmount !== 'null'
                      ? queryMappingInfo.securityDepositAmount
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
                  <span>{formatMessage({ id: 'MAPPING_BANKER_GUARANTEE_AMOUNT' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span>
                    {!isNvl(queryMappingInfo.guaranteeAmount) &&
                    queryMappingInfo.guaranteeAmount !== 'null'
                      ? queryMappingInfo.guaranteeAmount
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
                  <span>{formatMessage({ id: 'MAPPING_BANKER_GUARANTEE_EXPIRY_DATE' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span>
                    {!isNvl(queryMappingInfo.guaranteeExpiryDate)
                      ? moment(queryMappingInfo.guaranteeExpiryDate, 'YYYY-MM-DD').format(
                          'YYYY-MM-DD hh:mm:ss'
                        )
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
                  <span>{formatMessage({ id: 'MAPPING_CURRENCY' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span>
                    {!isNvl(queryMappingInfo.currency) && queryMappingInfo.currency !== 'null'
                      ? queryMappingInfo.currency
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
                  <span>{formatMessage({ id: 'MAPPING_SALES_MANAGER' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span>
                    {!isNvl(queryMappingInfo.salesManager) &&
                    queryMappingInfo.salesManager !== 'null'
                      ? queryMappingInfo.salesManager
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
                  <span>{formatMessage({ id: 'MAPPING_PRODUCT' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span>
                    {!isNvl(queryMappingInfo.productName) && queryMappingInfo.productName !== 'null'
                      ? queryMappingInfo.productName
                      : '-'}
                  </span>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} style={{ height: 0 }}>
            &nbsp;
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
export default DetailForMapppingInfor;
