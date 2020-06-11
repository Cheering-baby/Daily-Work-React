import React, { PureComponent } from 'react';
import { Col, Descriptions, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import styles from './index.less';
import {
  detailLayOut,
} from '../../utils/pubUtils';
import { isNvl } from '@/utils/utils';

class DetailForAccountingInformation extends PureComponent {
  render() {
    const { mappingInfo = {}, accountInfo = {}, taId } = this.props;
    return (
      <Row type="flex" justify="space-around">
        <Col span={24}>
          <Descriptions className={styles.descriptionsStyle} column={1}>
            <Descriptions.Item label={formatMessage({ id: 'ACCOUNTING_AGENT_ID' })}>
              {!isNvl(taId) ? taId : '-'}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions
            className={styles.descriptionsStyle}
            column={detailLayOut}
          >
            <Descriptions.Item label={formatMessage({ id: 'ACCOUNTING_PEOPLE_SOFT_E_WALLET_ID' })}>
              {!isNvl(accountInfo.peoplesoftEwalletId) ? accountInfo.peoplesoftEwalletId : '-'}
            </Descriptions.Item>
            <Descriptions.Item
              label={formatMessage({ id: 'ACCOUNTING_PEOPLE_SOFT_AR_ACCOUNT_ID' })}
            >
              {!isNvl(accountInfo.peoplesoftArAccountId) ? accountInfo.peoplesoftArAccountId : '-'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'ACCOUNTING_E_WALLET_BALANCE' })}>
              {!isNvl(accountInfo.ewalletIdBalance)
                ? `$${Number(accountInfo.ewalletIdBalance)
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'ACCOUNTING_AR_CREDIT_BALANCE' })}>
              {!isNvl(accountInfo.arCreditBalance)
                ? `$${Number(accountInfo.arCreditBalance)
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'ACCOUNTING_EFFECTIVE_DATE' })}>
              {!isNvl(mappingInfo.effectiveDate)
                ? moment(mappingInfo.effectiveDate, 'YYYY-MM-DD').format('DD-MMM-YYYY')
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'ACCOUNTING_LAST_ACTIVITY_DATE' })}>
              {!isNvl(accountInfo.lastActivityDate)
                ? moment(accountInfo.lastActivityDate, 'YYYY-MM-DD').format('DD-MMM-YYYY')
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'ACCOUNTING_MODIFIED_DATE' })}>
              {!isNvl(accountInfo.modifiedTime)
                ? moment(accountInfo.modifiedTime, 'YYYY-MM-DD').format('DD-MMM-YYYY')
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'ACCOUNTING_MODIFIED_BY' })}>
              {!isNvl(accountInfo.modifiedBy) ? accountInfo.modifiedBy : '-'}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    );
  }
}

export default DetailForAccountingInformation;
