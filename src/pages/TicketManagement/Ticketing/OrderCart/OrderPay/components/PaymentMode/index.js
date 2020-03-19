import React, { Component } from 'react';
import { Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from './index.less';

class PaymentModel extends Component {
  render() {
    return (
      <div>
        <Row>
          <Col span={24}>
            <span className={styles.titleBlack}>{formatMessage({ id: 'PAYMENT_MODE' })}</span>
          </Col>
        </Row>
      </div>
    );
  }
}

export default PaymentModel;
