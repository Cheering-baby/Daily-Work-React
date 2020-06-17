import React from 'react';
import { Card, Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import styles from '../index.less';
import { isNvl } from '@/utils/utils';
import { colLayOut, rowLayOut } from '../../constants';

class CommissionFee extends React.PureComponent {
  render() {
    const { customerInfo } = this.props;
    const feeStartDate = customerInfo && customerInfo.feeStartDate ? customerInfo.feeStartDate : '' ;
    const feeEndDate = customerInfo && customerInfo.feeEndDate ? customerInfo.feeEndDate : '';
    const start = feeStartDate ? moment(feeStartDate).format('YYYY-MM-DD') : '';
    const end = feeEndDate ? moment(feeEndDate).format('YYYY-MM-DD') : '';
    return (
      <React.Fragment>
        <Row {...rowLayOut}>
          <Col span={24}>
            <span className={styles.titleHeader}>COMMISSION FEE</span>
          </Col>
        </Row>
        <Row {...rowLayOut} className={styles.contentDetail}>
          <Col {...colLayOut} className={styles.colStyle}>
            <div className={styles.detailLabelStyle}>
              <span>{formatMessage({ id: 'PRODUCT_COMMISSION_TYPE' })}:</span>
            </div>
            <div className={styles.detailLeftStyle} style={{ marginBottom: '8px' }}>
              <span>
                 {!isNvl(customerInfo.commissionType)
                   ? customerInfo.commissionType
                   : '-'}
              </span>
            </div>
          </Col>
          <Col {...colLayOut} className={styles.colStyle}>
            <div className={styles.detailLabelStyle}>
              <span>Commission Amount Fee:</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>
                 {!isNvl(customerInfo.befGstFee)
                   ? `$ ${customerInfo.befGstFee}`
                   : '-'}
              </span>
            </div>
          </Col>
          <Col {...colLayOut} className={styles.colStyle}>
            <div className={styles.detailLabelStyle}>
              <span>Commission BefGst Fee:</span>
            </div>
            <div className={styles.detailLeftStyle} style={{ marginBottom: '8px' }}>
              <span>
                {!isNvl(customerInfo.befGstFee)
                  ? `$ ${customerInfo.befGstFee}`
                  : '-'}
              </span>
            </div>
          </Col>
          <Col {...colLayOut} className={styles.colStyle}>
            <div className={styles.detailLabelStyle}>
              <span>Commission Tax:</span>
            </div>
            <div className={styles.detailLeftStyle}>
            <span>
               {!isNvl(customerInfo.tax)
                 ? `$ ${customerInfo.tax}`
                 : '-'}
            </span>
            </div>
          </Col>
          <Col {...colLayOut} className={styles.colStyle}>
            <div className={styles.detailLabelStyle}>
              <span>Commission Fee cycle:</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>{!isNvl(start) && !isNvl(end) ? `${start} ~ ${end}` : '-'}</span>
            </div>
          </Col>
          <Col {...colLayOut} className={styles.colStyle}>
            <div className={styles.detailLabelStyle}>
              <span>Commission cycle:</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>
                {!isNvl(customerInfo.calculationCycle)
                  ? customerInfo.calculationCycle
                  : '-'}
              </span>
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
export default CommissionFee;
