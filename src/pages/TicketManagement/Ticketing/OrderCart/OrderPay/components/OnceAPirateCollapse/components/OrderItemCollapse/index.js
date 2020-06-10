import React, { Component } from 'react';
import { Col, Collapse, Icon, Row, Tooltip } from 'antd';
import moment from 'moment';
import styles from './index.less';
import AccessibleSeat from './assets/accessible_seat.png';

class OrderItemCollapse extends Component {
  getTitleNameStr = () => {
    const { onceAPirateOrder } = this.props;
    if (onceAPirateOrder && onceAPirateOrder.queryInfo.dateOfVisit) {
      let titleNameStr = moment(onceAPirateOrder.queryInfo.dateOfVisit, 'x').format('DD-MMM-YYYY');
      titleNameStr += ` ${onceAPirateOrder.queryInfo.sessionTime}`;
      return titleNameStr;
    }
    return '-';
  };

  getOrderSumPrice = () => {
    const { onceAPirateOrder } = this.props;
    let orderSumPrice = 0;
    if (onceAPirateOrder && onceAPirateOrder.orderOfferList) {
      onceAPirateOrder.orderOfferList.forEach(orderOffer => {
        orderSumPrice += orderOffer.orderInfo.offerSumPrice;
      });
    }
    return `$${Number(orderSumPrice).toFixed(2)}`;
  };

  getMealsAmount = orderOffer => {
    let offerMealsAmount = 0;
    if (orderOffer.orderInfo.voucherType && orderOffer.orderInfo.voucherType === '1') {
      orderOffer.orderInfo.groupSettingList.forEach(groupSetting => {
        offerMealsAmount += groupSetting.number;
      });
    } else {
      offerMealsAmount = orderOffer.orderInfo.individualSettingList.length;
    }
    return offerMealsAmount;
  };

  getOfferPricePax = orderOffer => {
    const offerPricePax = orderOffer.orderInfo.pricePax;
    return `$${Number(offerPricePax).toFixed(2)}`;
  };

  render() {
    const { companyType, orderIndex, onceAPirateOrder } = this.props;
    const offerNameColGrid = { xs: 14, sm: 14, md: 14, lg: 18, xl: 18, xxl: 18 };
    const priceColGrid = { xs: 6, sm: 6, md: 6, lg: 3, xl: 3, xxl: 3 };
    const totalAColGrid = { xs: 14, sm: 14, md: 14, lg: 11, xl: 11, xxl: 11 };
    const totalBColGrid = { xs: 7, sm: 7, md: 7, lg: 10, xl: 10, xxl: 10 };
    return (
      <Collapse
        bordered={false}
        defaultActiveKey={['OrderPanel', 'OrderPanel2']}
        expandIcon={({ isActive }) => (
          <Icon
            style={{ fontSize: '14px' }}
            className={styles.collapsePanelHeaderIcon}
            type="caret-right"
            rotate={isActive ? 90 : 0}
          />
        )}
      >
        <Collapse.Panel
          className={styles.collapsePanelStyles}
          key="OrderPanel"
          header={
            <Row gutter={24} className={styles.collapsePanelHeaderRow}>
              <Col {...offerNameColGrid}>
                <span className={styles.collapsePanelHeaderTitle}>{this.getTitleNameStr()}</span>
                {onceAPirateOrder.queryInfo.accessibleSeat && (
                  <Tooltip title="Accessible Seat">
                    <img
                      className={styles.collapsePanelHeaderSeat}
                      alt="accessible seat"
                      src={AccessibleSeat}
                    />
                  </Tooltip>
                )}
              </Col>
              <Col {...priceColGrid} className={styles.sumPriceCol}>
                {companyType === '01' && (
                  <span className={styles.sumPriceSpan}>{this.getOrderSumPrice()}</span>
                )}
              </Col>
              <Col span={3} />
            </Row>
          }
        >
          {onceAPirateOrder &&
            onceAPirateOrder.orderOfferList &&
            onceAPirateOrder.orderOfferList.map((orderOffer, offerIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={`order_${orderIndex}_${offerIndex}`}>
                <Row gutter={24} className={styles.contentRow}>
                  <Col span={10} className={styles.titleCol}>
                    <span className={styles.titleSpan}>{orderOffer.offerInfo.offerName}</span>
                  </Col>
                  <Col span={4} className={styles.dataCol}>
                    <span className={styles.dataSpan}>
                      Quantity {`x ${orderOffer.orderInfo.orderQuantity}`}
                    </span>
                  </Col>
                  <Col span={4} className={styles.dataCol}>
                    <span className={styles.dataSpan}>
                      Meals {`x ${this.getMealsAmount(orderOffer)}`}
                    </span>
                  </Col>
                  <Col span={3} className={styles.priceCol}>
                    {companyType === '01' && (
                      <span className={styles.priceSpan}>
                        {this.getOfferPricePax(orderOffer)}/pax
                      </span>
                    )}
                  </Col>
                </Row>
              </div>
            ))}
          {companyType === '01' && (
            <Row gutter={24} className={styles.contentRowTwo} style={{ margin: '0' }}>
              <Col {...totalAColGrid} className={styles.titleCol} />
              <Col {...totalBColGrid} className={styles.totalPriceCol}>
                <span className={styles.totalPriceSpan}>TOTAL: {this.getOrderSumPrice()}</span>
              </Col>
            </Row>
          )}
        </Collapse.Panel>
      </Collapse>
    );
  }
}

export default OrderItemCollapse;
