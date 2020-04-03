import React, { Component } from 'react';
import { Icon, Row, Col, Collapse, Tooltip } from 'antd';
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
              <Col span={18}>
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
              <Col span={3} className={styles.sumPriceCol}>
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
              <Col span={11} className={styles.titleCol} />
              <Col span={10} className={styles.totalPriceCol}>
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
