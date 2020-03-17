import React, { PureComponent } from 'react';
import { Col, Collapse, Icon, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import moment from 'moment';
import styles from './TASignUpDetails.less';

const { Panel } = Collapse;
const colParams = {
  xs: 24,
  md: 12,
};

@connect(({ taSignUpDetails }) => ({
  taSignUpDetails,
}))
class TASignUpDetails extends PureComponent {
  componentDidMount() {
    const { dispatch, businessId } = this.props;
    dispatch({
      type: 'taSignUpDetails/queryMappingDetail',
      payload: {
        taId: businessId,
      },
    });

    dispatch({
      type: 'taSignUpDetails/queryContractInfo',
      payload: {
        taId: businessId,
      },
    });
  }

  render() {
    const approveHeader = (
      <div className={styles.approveHeader}>
        <div className="left">{formatMessage({ id: 'TA_SIGNED_CONTRACT' })}</div>
        <div className="right">{formatMessage({ id: 'COMMON_EXPAND' })}</div>
      </div>
    );
    const mappingHeader = (
      <div className={styles.approveHeader}>
        <div className="left">{formatMessage({ id: 'COMMON_MAPPING' })}</div>
        <div className="right">{formatMessage({ id: 'COMMON_EXPAND' })}</div>
      </div>
    );
    const {
      taSignUpDetails: { queryMappingInfo, contractInfo },
    } = this.props;
    // const stepsIcon = <div className={styles.circelStyle} />;
    return (
      <React.Fragment>
        <Collapse
          expandIconPosition="right"
          bordered={false}
          defaultActiveKey={['1']}
          expandIcon={({ isActive }) => (
            <Icon type="down" rotate={isActive ? 0 : 180} style={{ color: '#1890FF' }} />
          )}
        >
          <Panel header={approveHeader} className={styles.DetailTitle} key="1">
            <Row>
              <Col {...colParams} className={styles.detailTopStyle}>
                <Row gutter={10}>
                  <Col {...colParams} className={styles.detailRightStyle}>
                    <div>
                      <span>{formatMessage({ id: 'TA_SIGNED_UPLOADED_BY' })}</span>
                    </div>
                  </Col>
                  <Col {...colParams}>
                    <div>
                      <span>{contractInfo ? contractInfo.uploadedBy : ''}</span>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col {...colParams} className={styles.detailTopStyle}>
                <Row gutter={10}>
                  <Col {...colParams} className={styles.detailRightStyle}>
                    <div>
                      <span>{formatMessage({ id: 'TA_SIGNED_UPLOADED_TIME' })}</span>
                    </div>
                  </Col>
                  <Col {...colParams}>
                    <div>
                      <span>
                        {contractInfo ? moment(contractInfo.uploadedTime).format('YYYY-MM-DD') : ''}
                      </span>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col {...colParams} className={styles.detailTopStyle}>
                <Row gutter={10}>
                  <Col {...colParams} className={styles.detailRightStyle}>
                    <div>
                      <span>{formatMessage({ id: 'TA_SIGNED_REGISTERATION_DOCS' })}</span>
                    </div>
                  </Col>
                  <Col {...colParams}>
                    <div className={styles.detailLeftStyle}>
                      {contractInfo &&
                        contractInfo.fileList &&
                        contractInfo.fileList.length > 0 &&
                        contractInfo.fileList.map(item => (
                          <div key={item.field + Math.random()} className={styles.uploadListItem}>
                            <div className={styles.uploadListItemInfo}>
                              <Icon type="paper-clip" className={styles.uploadPaperClip} />
                              <span className={styles.uploadListItemName}>{item.sourceName}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col {...colParams} className={styles.detailTopStyle}>
                <Row gutter={10} />
              </Col>
            </Row>
          </Panel>
        </Collapse>
        <Collapse
          expandIconPosition="right"
          bordered={false}
          defaultActiveKey={['1']}
          expandIcon={({ isActive }) => (
            <Icon type="down" rotate={isActive ? 0 : 180} style={{ color: '#1890FF' }} />
          )}
        >
          <Panel header={mappingHeader} className={styles.DetailTitle} key="1">
            <Row>
              <Col {...colParams} className={styles.detailTopStyle}>
                <Row gutter={10}>
                  <Col {...colParams} className={styles.detailRightStyle}>
                    <div>
                      <span>{formatMessage({ id: 'MAPPING_MAIN_TA_PROFILE' })}</span>
                    </div>
                  </Col>
                  <Col {...colParams}>
                    <div>
                      <span>{queryMappingInfo ? queryMappingInfo.companyName : ''}</span>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col span={24}> </Col>
              <Col {...colParams} className={styles.detailTopStyle}>
                <Row gutter={10}>
                  <Col {...colParams} className={styles.detailRightStyle}>
                    <div>
                      <span>{formatMessage({ id: 'MAPPING_OPERA_EWALLET' })}</span>
                    </div>
                  </Col>
                  <Col {...colParams}>
                    <div>
                      <span>{queryMappingInfo ? queryMappingInfo.operaEwallet : ''}</span>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col {...colParams} className={styles.detailTopStyle}>
                <Row gutter={10}>
                  <Col {...colParams} className={styles.detailRightStyle}>
                    <div>
                      <span>{formatMessage({ id: 'MAPPING_OPERA_AR_CREDIT' })}</span>
                    </div>
                  </Col>
                  <Col {...colParams}>
                    <div>
                      <span>{queryMappingInfo ? queryMappingInfo.operaArCredit : ''}</span>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col {...colParams} className={styles.detailTopStyle}>
                <Row gutter={10}>
                  <Col {...colParams} className={styles.detailRightStyle}>
                    <div>
                      <span>{formatMessage({ id: 'MAPPING_GALAXY_EWALLET' })}</span>
                    </div>
                  </Col>
                  <Col {...colParams}>
                    <div>
                      <span>{queryMappingInfo ? queryMappingInfo.galaxyEwallet : ''}</span>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col {...colParams} className={styles.detailTopStyle}>
                <Row gutter={10}>
                  <Col {...colParams} className={styles.detailRightStyle}>
                    <div>
                      <span>{formatMessage({ id: 'MAPPING_GALAXY_CREDIT' })}</span>
                    </div>
                  </Col>
                  <Col {...colParams}>
                    <div>
                      <span>{queryMappingInfo ? queryMappingInfo.galaxyArCredit : ''}</span>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col {...colParams} className={styles.detailTopStyle}>
                <Row gutter={10}>
                  <Col {...colParams} className={styles.detailRightStyle}>
                    <div>
                      <span>{formatMessage({ id: 'MAPPING_PEOPLESOFR_EWALLET_ID' })}</span>
                    </div>
                  </Col>
                  <Col {...colParams}>
                    <div>
                      <span>{queryMappingInfo ? queryMappingInfo.peoplesoftEwalletId : ''}</span>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col {...colParams} className={styles.detailTopStyle}>
                <Row gutter={10}>
                  <Col {...colParams} className={styles.detailRightStyle}>
                    <div>
                      <span>{formatMessage({ id: 'MAPPING_PEOPLESOFR_AR_ACCOUNT_ID' })}</span>
                    </div>
                  </Col>
                  <Col {...colParams}>
                    <div>
                      <span>{queryMappingInfo ? queryMappingInfo.peoplesoftArAccountId : ''}</span>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col {...colParams} className={styles.detailTopStyle}>
                <Row gutter={10}>
                  <Col {...colParams} className={styles.detailRightStyle}>
                    <div>
                      <span>{formatMessage({ id: 'MAPPING_CREDIT_TERM' })}</span>
                    </div>
                  </Col>
                  <Col {...colParams}>
                    <div>
                      <span>{queryMappingInfo ? queryMappingInfo.creditTerm : ''}</span>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col {...colParams} className={styles.detailTopStyle}>
                <Row gutter={10}>
                  <Col {...colParams} className={styles.detailRightStyle}>
                    <div>
                      <span>{formatMessage({ id: 'MAPPING_CREDIT_LIMIT' })}</span>
                    </div>
                  </Col>
                  <Col {...colParams}>
                    <div>
                      <span>{queryMappingInfo ? queryMappingInfo.creditLimit : ''}</span>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col {...colParams} className={styles.detailTopStyle}>
                <Row gutter={10}>
                  <Col {...colParams} className={styles.detailRightStyle}>
                    <div>
                      <span>{formatMessage({ id: 'MAPPING_EWALLET_FIXED_THRESHOLD' })}</span>
                    </div>
                  </Col>
                  <Col {...colParams}>
                    <div>
                      <span>{queryMappingInfo ? queryMappingInfo.ewalletFixedThreshold : ''}</span>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col {...colParams} className={styles.detailTopStyle}>
                <Row gutter={10}>
                  <Col {...colParams} className={styles.detailRightStyle}>
                    <div>
                      <span>{formatMessage({ id: 'MAPPING_AR_FIXED_THRESHOLD' })}</span>
                    </div>
                  </Col>
                  <Col {...colParams}>
                    <div>
                      <span>{queryMappingInfo ? queryMappingInfo.arFixedThreshold : ''}</span>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col {...colParams} className={styles.detailTopStyle}>
                <Row gutter={10}>
                  <Col {...colParams} className={styles.detailRightStyle}>
                    <div>
                      <span>{formatMessage({ id: 'MAPPING_ACCOUNT_COMMENCEMENT_DATE' })}</span>
                    </div>
                  </Col>
                  <Col {...colParams}>
                    <div>
                      <span>
                        {queryMappingInfo ? queryMappingInfo.arAccountCommencementDate : ''}
                      </span>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col {...colParams} className={styles.detailTopStyle}>
                <Row gutter={10}>
                  <Col {...colParams} className={styles.detailRightStyle}>
                    <div>
                      <span>{formatMessage({ id: 'MAPPING_AR_ACCOUNT_END_DATE' })}</span>
                    </div>
                  </Col>
                  <Col {...colParams}>
                    <div>
                      <span>{queryMappingInfo ? queryMappingInfo.arAccountEndDate : ''}</span>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col {...colParams} className={styles.detailTopStyle}>
                <Row gutter={10}>
                  <Col {...colParams} className={styles.detailRightStyle}>
                    <div>
                      <span>{formatMessage({ id: 'MAPPING_SECURITY_DEPOSIT_AMOUNT' })}</span>
                    </div>
                  </Col>
                  <Col {...colParams}>
                    <div>
                      <span>{queryMappingInfo ? queryMappingInfo.securityDepositAmount : ''}</span>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col {...colParams} className={styles.detailTopStyle}>
                <Row gutter={10}>
                  <Col {...colParams} className={styles.detailRightStyle}>
                    <div>
                      <span>{formatMessage({ id: 'MAPPING_BANKER_GUARANTEE_AMOUNT' })}</span>
                    </div>
                  </Col>
                  <Col {...colParams}>
                    <div>
                      <span>{queryMappingInfo ? queryMappingInfo.guaranteeAmount : ''}</span>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col {...colParams} className={styles.detailTopStyle}>
                <Row gutter={10}>
                  <Col {...colParams} className={styles.detailRightStyle}>
                    <div>
                      <span>{formatMessage({ id: 'MAPPING_BANKER_GUARANTEE_EXPIRY_DATE' })}</span>
                    </div>
                  </Col>
                  <Col {...colParams}>
                    <div>
                      <span>{queryMappingInfo ? queryMappingInfo.guaranteeExpiryDate : ''}</span>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col {...colParams} className={styles.detailTopStyle}>
                <Row gutter={10}>
                  <Col {...colParams} className={styles.detailRightStyle}>
                    <div>
                      <span>{formatMessage({ id: 'MAPPING_CURRENCY' })}</span>
                    </div>
                  </Col>
                  <Col {...colParams}>
                    <div>
                      <span>{queryMappingInfo ? queryMappingInfo.currencyName : ''}</span>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col {...colParams} className={styles.detailTopStyle}>
                <Row gutter={10}>
                  <Col {...colParams} className={styles.detailRightStyle}>
                    <div>
                      <span>{formatMessage({ id: 'MAPPING_SALES_MANAGER' })}</span>
                    </div>
                  </Col>
                  <Col {...colParams}>
                    <div>
                      <span>{queryMappingInfo ? queryMappingInfo.salesManager : ''}</span>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col {...colParams} className={styles.detailTopStyle}>
                <Row gutter={10}>
                  <Col {...colParams} className={styles.detailRightStyle}>
                    <div>
                      <span>{formatMessage({ id: 'MAPPING_PRODUCT' })}</span>
                    </div>
                  </Col>
                  <Col {...colParams}>
                    <div>
                      <span>{queryMappingInfo ? queryMappingInfo.productName : ''}</span>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Panel>
        </Collapse>
      </React.Fragment>
    );
  }
}

export default TASignUpDetails;
