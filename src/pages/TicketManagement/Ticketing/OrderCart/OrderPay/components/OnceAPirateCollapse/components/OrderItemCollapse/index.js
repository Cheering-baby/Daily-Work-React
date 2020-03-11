import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { Icon, Row, Col, Checkbox, Collapse, Form, Button } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import SCREEN from '@/utils/screen';
import styles from './index.less';

class OrderItemCollapse extends Component {

  constructor(props) {
    super(props);
  }

  allClickEvent = (e) => {
    e.stopPropagation();
  };

  render() {

    const {
      onceAPirateOrderData = [],
      form: { getFieldDecorator }
    } = this.props;

    return (
      <Collapse
        bordered={false}
        defaultActiveKey={['OrderPanel','OrderPanel2']}
        expandIcon={({ isActive }) => <Icon style={{fontSize:'14px'}} className={styles.collapsePanelHeaderIcon} type="caret-right" rotate={isActive ? 90 : 0} />}
      >
        <Collapse.Panel
          className={styles.collapsePanelStyles}
          key='OrderPanel'
          header={
            <Row gutter={24} className={styles.collapsePanelHeaderRow}>
              <Col span={18}>
                <span className={styles.collapsePanelHeaderTitle}>01-Oct-2019 12:20:45</span>
              </Col>
              <Col span={4} className={styles.sumPriceCol}>
                <span className={styles.sumPriceSpan}>{`$160.00`}</span>
              </Col>
            </Row>
          }
        >
          <Row gutter={24} className={styles.contentRow}>
            <Col span={10} className={styles.titleCol}>
              <span className={styles.titleSpan}>{'Zone A Regular Adult'}</span>
            </Col>
            <Col span={4} className={styles.dataCol}>
              <span className={styles.dataSpan}>Quantity {'x 2'}</span>
            </Col>
            <Col span={4} className={styles.dataCol}>
              <span className={styles.dataSpan}>Meals {'x 2'}</span>
            </Col>
            <Col span={4} className={styles.priceCol}>
              <span className={styles.priceSpan}>{`$160.00`}</span>
            </Col>
          </Row>
          <Row gutter={24} className={styles.contentRowTwo} style={{margin:'0'}}>
            <Col span={11} className={styles.titleCol}>
            </Col>
            <Col span={11} className={styles.totalPriceCol}>
              <span className={styles.totalPriceSpan}>TOTAL: {`$160.00`}</span>
            </Col>
          </Row>
        </Collapse.Panel>
      </Collapse>
    );

  }

}

export default OrderItemCollapse;
