import React, { Component } from 'react';
import { Checkbox, Col, Collapse, Icon, Row } from 'antd';
import moment from 'moment';
import styles from './index.less';

class OrderItemCollapse extends Component {
  getTitleNameStr = orderOffer => {
    if (orderOffer && orderOffer.offerInfo && orderOffer.offerInfo.offerBasicInfo) {
      return orderOffer.offerInfo.offerBasicInfo.offerName;
    }
    return '-';
  };

  getBundleTitleNameStr = orderOffer => {
    if (orderOffer && orderOffer.bundleName) {
      return orderOffer.bundleName;
    }
    return '-';
  };

  getTitleNameByOrderInfo = orderInfo => {
    if (orderInfo && orderInfo.offerInfo && orderInfo.offerInfo.offerBasicInfo) {
      return orderInfo.offerInfo.offerBasicInfo.offerName;
    }
    return '-';
  };

  getOfferSumPrice = orderOffer => {
    let offerSumPrice = 0;
    if (orderOffer.orderInfo) {
      orderOffer.orderInfo.forEach(orderInfo => {
        offerSumPrice += orderInfo.pricePax * orderInfo.quantity;
      });
    }
    return `$${Number(offerSumPrice).toFixed(2)}`;
  };

  getOfferBundleSumPrice = orderOffer => {
    let offerSumPrice = 0;
    if (orderOffer.orderInfo) {
      orderOffer.orderInfo.forEach(orderInfo => {
        offerSumPrice += orderInfo.pricePax * orderInfo.quantity;
      });
    }
    return `$${Number(offerSumPrice).toFixed(2)}`;
  };

  getActiveKeyList = () => {
    const {
      orderIndex,
      orderData: { orderOfferList = [] },
    } = this.props;
    const activeKeyList = orderOfferList.map((orderOffer, offerIndex) => {
      return `package_${orderIndex}_${offerIndex}`;
    });
    return activeKeyList;
  };

  getOrderTime = orderOffer => {
    if (orderOffer.queryInfo && orderOffer.queryInfo.dateOfVisit) {
      const titleNameStr = moment(orderOffer.queryInfo.dateOfVisit, 'x').format('DD-MMM-YYYY');
      return titleNameStr;
    }
    return '-';
  };

  getOfferRender = (orderOffer, offerIndex) => {
    const { orderIndex, companyType } = this.props;

    return (
      <Collapse.Panel
        key={`package_${orderIndex}_${offerIndex}`}
        className={styles.collapsePanelStyles}
        header={
          <Row gutter={24} className={styles.collapsePanelHeaderRow}>
            <Col span={10}>
              <span className={styles.collapsePanelHeaderTitle}>
                {this.getTitleNameStr(orderOffer)}
              </span>
            </Col>
            <Col span={8}>
              <span className={styles.collapsePanelHeaderStyles}>
                {this.getOrderTime(orderOffer)}
              </span>
            </Col>
            <Col span={3} className={styles.sumPriceCol}>
              {companyType === '01' && (
                <span className={styles.sumPriceSpan}>{this.getOfferSumPrice(orderOffer)}</span>
              )}
            </Col>
            <Col span={3} />
          </Row>
        }
      >
        {orderOffer.orderInfo.map((orderInfo, infoIndex) => (
          // eslint-disable-next-line react/no-array-index-key
          <Row key={`package_orderInfo_${infoIndex}`} gutter={24} className={styles.contentRow}>
            <Col span={10} className={styles.titleCol}>
              <span className={styles.titleSpan}> </span>
            </Col>
            <Col span={8} className={styles.dataCol}>
              <span className={styles.dataSpan}>
                {orderInfo.ageGroup} x {orderInfo.quantity}
              </span>
            </Col>
            <Col span={3} className={styles.priceCol}>
              {companyType === '01' && (
                <span className={styles.priceSpan}>
                  ${Number(orderInfo.pricePax).toFixed(2)}/pax
                </span>
              )}
            </Col>
          </Row>
        ))}
        {companyType === '01' && (
          <Row gutter={24} className={styles.contentRowTwo} style={{ margin: '0' }}>
            <Col span={11} className={styles.titleCol} />
            <Col span={10} className={styles.totalPriceCol}>
              <span className={styles.totalPriceSpan}>
                TOTAL: {this.getOfferSumPrice(orderOffer)}
              </span>
            </Col>
          </Row>
        )}
      </Collapse.Panel>
    );
  };

  getOfferFixedRender = (orderOffer, offerIndex) => {
    const { orderIndex, companyType } = this.props;

    return (
      <Collapse.Panel
        key={`package_${orderIndex}_${offerIndex}`}
        className={styles.collapsePanelStyles}
        header={
          <Row gutter={24} className={styles.collapsePanelHeaderRow}>
            <Col span={10}>
              <Checkbox
                value="ALL"
                checked={orderOffer.orderAll}
                indeterminate={orderOffer.indeterminate}
                onClick={this.allClickEvent}
                onChange={e => {
                  this.checkOrderEvent(e, offerIndex, orderOffer);
                }}
              />
              <span className={styles.collapsePanelHeaderTitle}>
                {this.getTitleNameStr(orderOffer)}
              </span>
            </Col>
            <Col span={8}>
              <span className={styles.collapsePanelHeaderStyles}>
                {this.getOrderTime(orderOffer)}
              </span>
            </Col>
            <Col span={3} className={styles.sumPriceCol}>
              {companyType === '01' && (
                <span className={styles.sumPriceSpan}>
                  {this.getOfferFixedSumPrice(orderOffer)}
                </span>
              )}
            </Col>
            <Col span={3} />
          </Row>
        }
      >
        <Row gutter={24} className={styles.contentRow}>
          <Col span={10} className={styles.titleCol}>
            <span className={styles.titleSpan}>{this.getProductTypeByOfferFixed(orderOffer)}</span>
          </Col>
          <Col span={8} className={styles.dataCol}>
            <span className={styles.dataSpan}>Quantity x {orderOffer.orderSummary.quantity}</span>
          </Col>
          <Col span={3} className={styles.priceCol}>
            {companyType === '01' && (
              <span className={styles.priceSpan}>{this.getOfferFixedPricePax(orderOffer)}/pax</span>
            )}
          </Col>
        </Row>
        {companyType === '01' && (
          <Row gutter={24} className={styles.contentRowTwo} style={{ margin: '0' }}>
            <Col span={11} className={styles.titleCol} />
            <Col span={10} className={styles.totalPriceCol}>
              <span className={styles.totalPriceSpan}>
                TOTAL: {this.getOfferFixedSumPrice(orderOffer)}
              </span>
            </Col>
          </Row>
        )}
      </Collapse.Panel>
    );
  };

  getOfferFixedSumPrice = orderOffer => {
    let offerSumPrice = 0;
    if (orderOffer.orderSummary && orderOffer.orderSummary.totalPrice) {
      offerSumPrice = orderOffer.orderSummary.totalPrice;
    }
    return `$${Number(offerSumPrice).toFixed(2)}`;
  };

  getOfferFixedPricePax = orderOffer => {
    let offerSumPrice = 0;
    if (orderOffer.orderSummary && orderOffer.orderSummary.pricePax) {
      offerSumPrice = orderOffer.orderSummary.pricePax;
    }
    return `$${Number(offerSumPrice).toFixed(2)}`;
  };

  getProductTypeByOfferFixed = orderOffer => {
    let productType = '';
    if (orderOffer.orderInfo) {
      const ageGroups = orderOffer.orderInfo.map(orderInfoItem => orderInfoItem.ageGroup);
      productType = ageGroups.join(',');
    }
    return productType;
  };

  getOfferBundleRender = (orderOffer, offerIndex) => {
    const { orderIndex, companyType } = this.props;

    return (
      <Collapse.Panel
        key={`package_${orderIndex}_${offerIndex}`}
        className={styles.collapsePanelStyles}
        header={
          <Row gutter={24} className={styles.collapsePanelHeaderRow}>
            <Col span={10}>
              <span className={styles.collapsePanelHeaderTitle}>
                {this.getBundleTitleNameStr(orderOffer)}
              </span>
            </Col>
            <Col span={8}>
              <span className={styles.collapsePanelHeaderStyles}>
                {this.getOrderTime(orderOffer)}
              </span>
            </Col>
            <Col span={3} className={styles.sumPriceCol}>
              {companyType === '01' && (
                <span className={styles.sumPriceSpan}>
                  {this.getOfferBundleSumPrice(orderOffer)}
                </span>
              )}
            </Col>
            <Col span={3} />
          </Row>
        }
      >
        {orderOffer.orderInfo.map((orderInfo, infoIndex) => (
          // eslint-disable-next-line react/no-array-index-key
          <Row key={`package_orderInfo_${infoIndex}`} gutter={24} className={styles.contentRow}>
            <Col span={10} className={styles.titleCol}>
              <span className={styles.titleSpan}>{this.getTitleNameByOrderInfo(orderInfo)}</span>
            </Col>
            <Col span={8} className={styles.dataCol}>
              <span className={styles.dataSpan}>Quantity x {orderInfo.quantity}</span>
            </Col>
            <Col span={3} className={styles.priceCol}>
              {companyType === '01' && (
                <span className={styles.priceSpan}>
                  ${Number(orderInfo.pricePax).toFixed(2)}/pax
                </span>
              )}
            </Col>
          </Row>
        ))}
        {companyType === '01' && (
          <Row gutter={24} className={styles.contentRowTwo} style={{ margin: '0' }}>
            <Col span={11} className={styles.titleCol} />
            <Col span={10} className={styles.totalPriceCol}>
              <span className={styles.totalPriceSpan}>
                TOTAL: {this.getOfferSumPrice(orderOffer)}
              </span>
            </Col>
          </Row>
        )}
      </Collapse.Panel>
    );
  };

  render() {
    const { orderData } = this.props;
    const { orderOfferList = [] } = orderData;
    const activeKeyList = this.getActiveKeyList();

    return (
      <Collapse
        bordered={false}
        defaultActiveKey={activeKeyList}
        expandIcon={({ isActive }) => (
          <Icon
            style={{ fontSize: '14px' }}
            className={styles.collapsePanelHeaderIcon}
            type="caret-right"
            rotate={isActive ? 90 : 0}
          />
        )}
      >
        {orderOfferList.map((orderOffer, offerIndex) => {
          let offerRender = null;
          if (orderOffer.orderType && orderOffer.orderType === 'offerBundle') {
            offerRender = this.getOfferBundleRender(orderOffer, offerIndex);
          } else if (orderOffer.orderType && orderOffer.orderType === 'offerFixed') {
            offerRender = this.getOfferFixedRender(orderOffer, offerIndex);
          } else {
            offerRender = this.getOfferRender(orderOffer, offerIndex);
          }
          return offerRender;
        })}
      </Collapse>
    );
  }
}

export default OrderItemCollapse;
