import React, { PureComponent } from 'react';
import { Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import { isNvl } from '@/utils/utils';
import {
  getCategoryAndCustomerGroupStr,
  getMarketStr,
  getSalesPersonStr,
  getSettlementCycleStr,
} from '../../utils/pubUtils';
import styles from './index.less';

class DetailForAdditionalInformation extends PureComponent {
  render() {
    const {
      customerInfo = {},
      marketList = [],
      salesPersonList = [],
      categoryList = [],
      customerGroupList = [],
      settlementCycleList = [],
    } = this.props;
    const { companyInfo = {} } = customerInfo || {};
    // console.log('settlementCycleList:', settlementCycleList);
    return (
      <Row type="flex" justify="space-around">
        <Col span={24}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={6} xl={4} xxl={4}>
              <div className={styles.addDetailRightStyle}>
                <span>{formatMessage({ id: 'ADDITIONAL_SETTLEMENT_CYCLE' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={18} xl={20} xxl={20}>
              <div className={styles.addDetailLeftStyle}>
                <span>
                  {getSettlementCycleStr(
                    settlementCycleList,
                    companyInfo.settlementCycle,
                    companyInfo.settlementValue
                  )}
                </span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={6} xl={4} xxl={4}>
              <div className={styles.addDetailRightStyle}>
                <span>{formatMessage({ id: 'ADDITIONAL_MARKET' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={18} xl={20} xxl={20}>
              <div className={styles.addDetailLeftStyle}>
                <span>{getMarketStr(marketList, companyInfo.market)}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.addDetailRightStyle}>
                <span>{formatMessage({ id: 'ADDITIONAL_EFFECTIVE_DATE' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.addDetailLeftStyle}>
                <span>
                  {!isNvl(companyInfo.effectiveDate)
                    ? moment(companyInfo.effectiveDate, 'YYYY-MM-DD').format('DD-MMM-YYYY')
                    : '-'}
                </span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.addDetailRightStyle}>
                <span>{formatMessage({ id: 'ADDITIONAL_END_DATE' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.addDetailLeftStyle}>
                <span>
                  {!isNvl(companyInfo.endDate)
                    ? moment(companyInfo.endDate, 'YYYY-MM-DD').format('DD-MMM-YYYY')
                    : '-'}
                </span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.addDetailRightStyle}>
                <span>{formatMessage({ id: 'ADDITIONAL_SALES_MANAGER' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.addDetailLeftStyle}>
                <span>{getSalesPersonStr(salesPersonList, companyInfo.salesPerson)}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
              <div className={styles.addDetailRightStyle}>
                <span>{formatMessage({ id: 'ADDITIONAL_CATEGORY_AND_CUSTOMER_GROUP' })}</span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
              <div className={styles.addDetailLeftStyle}>
                <span>
                  {getCategoryAndCustomerGroupStr(
                    categoryList,
                    customerGroupList,
                    companyInfo.category,
                    companyInfo.customerGroup
                  )}
                </span>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default DetailForAdditionalInformation;
