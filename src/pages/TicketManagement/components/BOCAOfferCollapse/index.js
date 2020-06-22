import React from 'react';
import { Col, Row } from 'antd';
import styles from './index.less';
import { toThousandsByRound } from '@/pages/TicketManagement/utils/orderCartUtil';

class BOCAOfferCollapse extends React.PureComponent {
  render() {
    const { companyType = '01', quantity = 0, pricePax = 0 } = this.props;

    return (
      <div>
        <Row key="package_orderInfo_1" gutter={24} className={styles.contentRow}>
          <Col offset={1} span={7} className={styles.dataCol}>
            <span className={styles.dataSpan}>Quantity</span>
          </Col>
          <Col span={6} className={styles.dataCol2}>
            <span className={styles.dataSpan}>Fee(SGD)</span>
          </Col>
          <Col span={9} className={styles.dataCol2}>
            <span className={styles.dataSpan}>Sub-Total(SGD)</span>
          </Col>
        </Row>
        <Row
          key="package_orderInfo_2"
          gutter={24}
          className={styles.contentRow}
          style={{ backgroundColor: '#fff' }}
        >
          <Col offset={1} span={7} className={styles.titleCol}>
            <span className={styles.dataSpan}>{quantity}</span>
          </Col>
          <Col span={6} className={styles.dataCol2}>
            {companyType === '01' && (
              <span className={styles.priceSpan}>
                {toThousandsByRound(Number(pricePax).toFixed(2))}/Ticket
              </span>
            )}
          </Col>
          <Col span={9} className={styles.priceCol}>
            {companyType === '01' && (
              <span className={styles.priceSpan}>
                {toThousandsByRound(Number(pricePax * quantity).toFixed(2))}
              </span>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default BOCAOfferCollapse;
