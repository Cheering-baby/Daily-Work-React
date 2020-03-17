import React, { Component } from 'react';
import { Icon, Row, Col, Checkbox, Collapse, Tooltip, Modal } from 'antd';
import moment from 'moment';
import styles from './index.less';

class OrderItemCollapse extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    const {
      companyType = '01',
      quantity = 0,
      pricePax = 0,
    } = this.props;

    return (
      <Collapse
        bordered={false}
        defaultActiveKey={['BOCAOffer']}
        expandIcon={({ isActive }) => <Icon style={{fontSize:'14px'}} className={styles.collapsePanelHeaderIcon} type="caret-right" rotate={isActive ? 90 : 0} />}
      >
        <Collapse.Panel
          key={'BOCAOffer'}
          className={styles.collapsePanelStyles}
          header={
            <Row gutter={24} className={styles.collapsePanelHeaderRow}>
              <Col span={10}>
                <span className={styles.collapsePanelHeaderTitle}>BOCA FEE</span>
              </Col>
              <Col span={8}>
                <span className={styles.collapsePanelHeaderStyles}></span>
              </Col>
              <Col span={3} className={styles.sumPriceCol}>
                {
                  companyType === '01' && (
                    <span className={styles.sumPriceSpan}>${Number(quantity*pricePax).toFixed(2)}</span>
                  )
                }
              </Col>
              <Col span={3}>
              </Col>
            </Row>
          }
        >
          <Row key={'package_orderInfo_1'} gutter={24} className={styles.contentRow}>
            <Col span={10} className={styles.titleCol}>
              <span className={styles.titleSpan}></span>
            </Col>
            <Col span={8} className={styles.dataCol}>
              <span className={styles.dataSpan}>Quantity x {quantity}</span>
            </Col>
            <Col span={3} className={styles.priceCol}>
              {
                companyType === '01' && (
                  <span className={styles.priceSpan}>${Number(pricePax).toFixed(2)}/pax</span>
                )
              }
            </Col>
          </Row>
          {
            companyType === '01' && (
              <Row gutter={24} className={styles.contentRowTwo} style={{margin:'0'}}>
                <Col span={11} className={styles.titleCol}>
                </Col>
                <Col span={10} className={styles.totalPriceCol}>
                  <span className={styles.totalPriceSpan}>TOTAL: ${Number(quantity*pricePax).toFixed(2)}</span>
                </Col>
              </Row>
            )
          }
        </Collapse.Panel>
      </Collapse>
    );

  }

}

export default OrderItemCollapse;
