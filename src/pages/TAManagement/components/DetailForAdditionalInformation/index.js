import React, { PureComponent } from 'react';
import { Col, Descriptions, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import { isNvl } from '@/utils/utils';
import {
  getCategoryAndCustomerGroupStr,
  getMarketStr,
  getSalesPersonStr,
  getSalesPersonEmailStr,
  getSalesPersonContactNumberStr,
  detailLayOut,
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
    } = this.props;
    const { companyInfo = {} } = customerInfo || {};
    return (
      <Row type="flex" justify="space-around">
        <Col span={24}>
          <Descriptions className={styles.descriptionsStyle} column={1}>
            <Descriptions.Item label={formatMessage({ id: 'ADDITIONAL_MARKET' })}>
              {getMarketStr(marketList, companyInfo.market)}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions className={styles.descriptionsStyle} column={detailLayOut}>
            <Descriptions.Item label={formatMessage({ id: 'ADDITIONAL_EFFECTIVE_DATE' })}>
              {!isNvl(companyInfo.effectiveDate)
                ? moment(companyInfo.effectiveDate, 'YYYY-MM-DD').format('DD-MMM-YYYY')
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'ADDITIONAL_END_DATE' })}>
              {!isNvl(companyInfo.endDate)
                ? moment(companyInfo.endDate, 'YYYY-MM-DD').format('DD-MMM-YYYY')
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'ADDITIONAL_SALES_MANAGER' })}>
              {getSalesPersonStr(salesPersonList, companyInfo.salesPerson)}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'ADDITIONAL_SALES_MANAGER_EMAIL' })}>
              {getSalesPersonEmailStr(salesPersonList, companyInfo.salesPerson)}
            </Descriptions.Item>
            <Descriptions.Item
              label={formatMessage({ id: 'ADDITIONAL_SALES_MANAGER_CONTACT_NUMBER' })}
            >
              {getSalesPersonContactNumberStr(salesPersonList, companyInfo.salesPerson)}
            </Descriptions.Item>
            <Descriptions.Item
              label={formatMessage({ id: 'ADDITIONAL_CATEGORY_AND_CUSTOMER_GROUP' })}
            >
              {getCategoryAndCustomerGroupStr(
                categoryList,
                customerGroupList,
                companyInfo.category,
                companyInfo.customerGroup
              )}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'ADDITIONAL_REMARK' })}>
              {companyInfo.remark || '-'}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    );
  }
}

export default DetailForAdditionalInformation;
