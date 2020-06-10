import React, { Component } from 'react';
import { Checkbox, Col, Collapse, Icon, Modal, Row, Tooltip } from 'antd';
import moment from 'moment';
import styles from './index.less';

const { confirm } = Modal;

class OrderItemCollapse extends Component {
  allClickEvent = e => {
    e.stopPropagation();
  };

  editClickEvent = (e, offerIndex) => {
    e.stopPropagation();
    const { orderIndex, operateButtonEvent } = this.props;
    operateButtonEvent('edit', orderIndex, offerIndex);
  };

  deleteClickEvent = (e, offerIndex) => {
    e.stopPropagation();
    const { orderIndex, operateButtonEvent } = this.props;
    confirm({
      title: 'Are you sure to delete the item?',
      content: '',
      onOk() {
        operateButtonEvent('delete', orderIndex, offerIndex);
      },
      onCancel() {},
    });
  };

  getTitleNameStr = orderOffer => {
    if (orderOffer && orderOffer.offerInfo && orderOffer.offerInfo.offerBasicInfo) {
      return orderOffer.offerInfo.offerBasicInfo.offerName;
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

  getOfferFixedSumPrice = orderOffer => {
    let offerSumPrice = 0;
    if (orderOffer.orderSummary && orderOffer.orderSummary.totalPrice) {
      offerSumPrice = orderOffer.orderSummary.totalPrice;
    }
    return `$${Number(offerSumPrice).toFixed(2)}`;
  };

  checkOrderEvent = (e, offerIndex, orderOffer) => {
    e.stopPropagation();
    const { checked } = e.target;
    const { orderIndex, orderData, changeOrderCheck } = this.props;

    orderOffer.orderInfo.forEach(item => {
      item.orderCheck = checked;
    });

    orderData.orderOfferList[offerIndex] = Object.assign(
      {},
      {
        ...orderOffer,
        indeterminate: false,
        orderAll: checked,
      }
    );

    changeOrderCheck(orderIndex, orderData);
  };

  checkOfferEvent = (e, offerIndex, orderOffer, infoIndex, orderInfo) => {
    const { checked } = e.target;
    const { orderIndex, orderData, changeOrderCheck } = this.props;
    orderOffer.orderInfo[infoIndex] = Object.assign(orderInfo, {
      orderCheck: checked,
    });
    let orderAllChecked = false;
    let indeterminate = false;
    orderOffer.orderInfo.forEach(item => {
      if (item.orderCheck) {
        orderAllChecked = true;
      } else {
        indeterminate = true;
      }
    });
    if (!orderAllChecked && indeterminate) {
      indeterminate = false;
    }
    orderData.orderOfferList[offerIndex] = Object.assign(
      {},
      {
        ...orderOffer,
        indeterminate,
        orderAll: orderAllChecked,
      }
    );

    changeOrderCheck(orderIndex, orderData);
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
    let titleNameStr = '-';
    let sessionTime;

    if (orderOffer.queryInfo && orderOffer.queryInfo.dateOfVisit) {
      titleNameStr = moment(orderOffer.queryInfo.dateOfVisit, 'x').format('DD-MMM-YYYY');
    }

    if (orderOffer.orderInfo) {
      orderOffer.orderInfo.forEach(orderInfoItem => {
        // eslint-disable-next-line prefer-destructuring
        sessionTime = orderInfoItem.sessionTime;
      });
    }

    if (orderOffer.orderSummary && orderOffer.orderSummary.sessionTime) {
      // eslint-disable-next-line prefer-destructuring
      sessionTime = orderOffer.orderSummary.sessionTime;
    }

    if (sessionTime) {
      titleNameStr += ` ${sessionTime}`;
    }

    return titleNameStr;
  };

  getOfferRender = (orderOffer, offerIndex) => {
    const { orderIndex, companyType, functionActive } = this.props;
    const offerNameColGrid = { xs: 9, sm: 9, md: 9, lg: 10, xl: 10, xxl: 10 };
    const sessionColGrid = { xs: 5, sm: 5, md: 5, lg: 8, xl: 8, xxl: 8 };
    const priceColGrid = { xs: 6, sm: 6, md: 6, lg: 3, xl: 3, xxl: 3 };
    const operationColGrid = { xs: 4, sm: 4, md: 4, lg: 3, xl: 3, xxl: 3 };
    const totalAColGrid = { xs: 14, sm: 14, md: 14, lg: 11, xl: 11, xxl: 11 };
    const totalBColGrid = { xs: 7, sm: 7, md: 7, lg: 10, xl: 10, xxl: 10 };
    return (
      <Collapse.Panel
        key={`package_${orderIndex}_${offerIndex}`}
        className={styles.collapsePanelStyles}
        header={
          <Row gutter={24} className={styles.collapsePanelHeaderRow}>
            <Col {...offerNameColGrid}>
              <Checkbox
                value="ALL"
                checked={orderOffer.orderAll}
                indeterminate={orderOffer.indeterminate}
                onClick={this.allClickEvent}
                onChange={e => {
                  this.checkOrderEvent(e, offerIndex, orderOffer);
                }}
                disabled={orderOffer.orderDisabled}
              />
              <span className={styles.collapsePanelHeaderTitle}>
                {this.getTitleNameStr(orderOffer)}
              </span>
            </Col>
            <Col {...sessionColGrid}>
              <span className={styles.collapsePanelHeaderStyles}>
                {this.getOrderTime(orderOffer)}
              </span>
            </Col>
            <Col {...priceColGrid} className={styles.sumPriceCol}>
              {companyType === '01' && (
                <span className={styles.sumPriceSpan}>{this.getOfferSumPrice(orderOffer)}</span>
              )}
            </Col>
            <Col {...operationColGrid}>
              {functionActive && (
                <div>
                  <Tooltip title="Delete">
                    <Icon
                      className={styles.collapsePanelHeaderButton}
                      type="delete"
                      onClick={e => {
                        this.deleteClickEvent(e, offerIndex);
                      }}
                    />
                  </Tooltip>
                  {!orderOffer.orderDisabled && (
                    <Tooltip title="Edit">
                      <Icon
                        className={styles.collapsePanelHeaderButton}
                        type="edit"
                        onClick={e => {
                          this.editClickEvent(e, offerIndex);
                        }}
                      />
                    </Tooltip>
                  )}
                </div>
              )}
            </Col>
          </Row>
        }
      >
        {orderOffer.orderInfo.map((orderInfo, infoIndex) => {
          if (orderInfo.quantity > 0) {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Row key={`package_orderInfo_${infoIndex}`} gutter={24} className={styles.contentRow}>
                <Col {...offerNameColGrid} className={styles.titleCol}>
                  <span className={styles.titleSpan}> </span>
                </Col>
                <Col {...sessionColGrid} className={styles.dataCol}>
                  <span className={styles.dataSpan}>
                    {orderInfo.ageGroup} x {orderInfo.quantity}
                  </span>
                </Col>
                <Col {...priceColGrid} className={styles.priceCol}>
                  {companyType === '01' && (
                    <span className={styles.priceSpan}>
                      ${Number(orderInfo.pricePax).toFixed(2)}/pax
                    </span>
                  )}
                </Col>
              </Row>
            );
          }

          return null;
        })}
        {companyType === '01' && (
          <Row gutter={24} className={styles.contentRowTwo} style={{ margin: '0' }}>
            <Col {...totalAColGrid} className={styles.titleCol} />
            <Col {...totalBColGrid} className={styles.totalPriceCol}>
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
    const { orderIndex, companyType, functionActive } = this.props;
    const offerNameColGrid = { xs: 9, sm: 9, md: 9, lg: 10, xl: 10, xxl: 10 };
    const sessionColGrid = { xs: 5, sm: 5, md: 5, lg: 8, xl: 8, xxl: 8 };
    const priceColGrid = { xs: 6, sm: 6, md: 6, lg: 3, xl: 3, xxl: 3 };
    const operationColGrid = { xs: 4, sm: 4, md: 4, lg: 3, xl: 3, xxl: 3 };
    const totalAColGrid = { xs: 14, sm: 14, md: 14, lg: 11, xl: 11, xxl: 11 };
    const totalBColGrid = { xs: 7, sm: 7, md: 7, lg: 10, xl: 10, xxl: 10 };
    return (
      <Collapse.Panel
        key={`package_${orderIndex}_${offerIndex}`}
        className={styles.collapsePanelStyles}
        header={
          <Row gutter={24} className={styles.collapsePanelHeaderRow}>
            <Col {...offerNameColGrid}>
              <Checkbox
                value="ALL"
                checked={orderOffer.orderAll}
                indeterminate={orderOffer.indeterminate}
                onClick={this.allClickEvent}
                onChange={e => {
                  this.checkOrderEvent(e, offerIndex, orderOffer);
                }}
                disabled={orderOffer.orderDisabled}
              />
              <span className={styles.collapsePanelHeaderTitle}>
                {this.getTitleNameStr(orderOffer)}
              </span>
            </Col>
            <Col {...sessionColGrid}>
              <span className={styles.collapsePanelHeaderStyles}>
                {this.getOrderTime(orderOffer)}
              </span>
            </Col>
            <Col {...priceColGrid} className={styles.sumPriceCol}>
              {companyType === '01' && (
                <span className={styles.sumPriceSpan}>
                  {this.getOfferFixedSumPrice(orderOffer)}
                </span>
              )}
            </Col>
            <Col {...operationColGrid}>
              {functionActive && (
                <div>
                  <Tooltip title="Delete">
                    <Icon
                      className={styles.collapsePanelHeaderButton}
                      type="delete"
                      onClick={e => {
                        this.deleteClickEvent(e, offerIndex);
                      }}
                    />
                  </Tooltip>
                  {!orderOffer.orderDisabled && (
                    <Tooltip title="Edit">
                      <Icon
                        className={styles.collapsePanelHeaderButton}
                        type="edit"
                        onClick={e => {
                          this.editClickEvent(e, offerIndex);
                        }}
                      />
                    </Tooltip>
                  )}
                </div>
              )}
            </Col>
          </Row>
        }
      >
        <Row gutter={24} className={styles.contentRow}>
          <Col {...offerNameColGrid} className={styles.titleCol}>
            <span className={styles.titleSpan}>{this.getProductTypeByOfferFixed(orderOffer)}</span>
          </Col>
          <Col {...sessionColGrid} className={styles.dataCol}>
            <span className={styles.dataSpan}>Quantity x {orderOffer.orderSummary.quantity}</span>
          </Col>
          <Col {...priceColGrid} className={styles.priceCol}>
            {companyType === '01' && (
              <span className={styles.priceSpan}>{this.getOfferFixedPricePax(orderOffer)}/pax</span>
            )}
          </Col>
        </Row>
        {companyType === '01' && (
          <Row gutter={24} className={styles.contentRowTwo} style={{ margin: '0' }}>
            <Col {...totalAColGrid} className={styles.titleCol} />
            <Col {...totalBColGrid} className={styles.totalPriceCol}>
              <span className={styles.totalPriceSpan}>
                TOTAL: {this.getOfferFixedSumPrice(orderOffer)}
              </span>
            </Col>
          </Row>
        )}
      </Collapse.Panel>
    );
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
      const ageGroups = orderOffer.orderInfo.map(orderInfoItem => orderInfoItem.ageGroup || '-');
      productType = ageGroups.join(';');
    }
    return productType;
  };

  getBundleTitleNameStr = orderOffer => {
    if (orderOffer && orderOffer.bundleName) {
      return orderOffer.bundleName;
    }
    return '-';
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

  getTitleNameByOrderInfo = orderInfo => {
    if (orderInfo && orderInfo.offerInfo && orderInfo.offerInfo.offerBundle) {
      return orderInfo.offerInfo.offerBundle[0].bundleLabel;
    }
    return '-';
  };

  getOfferBundleRender = (orderOffer, offerIndex) => {
    const { orderIndex, companyType, functionActive } = this.props;
    const offerNameColGrid = { xs: 9, sm: 9, md: 9, lg: 10, xl: 10, xxl: 10 };
    const sessionColGrid = { xs: 5, sm: 5, md: 5, lg: 8, xl: 8, xxl: 8 };
    const priceColGrid = { xs: 6, sm: 6, md: 6, lg: 3, xl: 3, xxl: 3 };
    const operationColGrid = { xs: 4, sm: 4, md: 4, lg: 3, xl: 3, xxl: 3 };
    const totalAColGrid = { xs: 14, sm: 14, md: 14, lg: 11, xl: 11, xxl: 11 };
    const totalBColGrid = { xs: 7, sm: 7, md: 7, lg: 10, xl: 10, xxl: 10 };
    return (
      <Collapse.Panel
        key={`package_${orderIndex}_${offerIndex}`}
        className={styles.collapsePanelStyles}
        header={
          <Row gutter={24} className={styles.collapsePanelHeaderRow}>
            <Col {...offerNameColGrid}>
              <Checkbox
                value="ALL"
                checked={orderOffer.orderAll}
                indeterminate={orderOffer.indeterminate}
                onClick={this.allClickEvent}
                onChange={e => {
                  this.checkOrderEvent(e, offerIndex, orderOffer);
                }}
                disabled={orderOffer.orderDisabled}
              />
              <span className={styles.collapsePanelHeaderTitle}>
                {this.getBundleTitleNameStr(orderOffer)}
              </span>
            </Col>
            <Col {...sessionColGrid}>
              <span className={styles.collapsePanelHeaderStyles}>
                {this.getOrderTime(orderOffer)}
              </span>
            </Col>
            <Col {...priceColGrid} className={styles.sumPriceCol}>
              {companyType === '01' && (
                <span className={styles.sumPriceSpan}>
                  {this.getOfferBundleSumPrice(orderOffer)}
                </span>
              )}
            </Col>
            <Col {...operationColGrid}>
              {functionActive && (
                <div>
                  <Tooltip title="Delete">
                    <Icon
                      className={styles.collapsePanelHeaderButton}
                      type="delete"
                      onClick={e => {
                        this.deleteClickEvent(e, offerIndex);
                      }}
                    />
                  </Tooltip>
                  {!orderOffer.orderDisabled && (
                    <Tooltip title="Edit">
                      <Icon
                        className={styles.collapsePanelHeaderButton}
                        type="edit"
                        onClick={e => {
                          this.editClickEvent(e, offerIndex);
                        }}
                      />
                    </Tooltip>
                  )}
                </div>
              )}
            </Col>
          </Row>
        }
      >
        {orderOffer.orderInfo.map((orderInfo, infoIndex) => {
          if (orderInfo.quantity > 0) {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Row key={`package_orderInfo_${infoIndex}`} gutter={24} className={styles.contentRow}>
                <Col {...offerNameColGrid} className={styles.titleCol}>
                  <span className={styles.titleSpan}>
                    {this.getTitleNameByOrderInfo(orderInfo)}
                  </span>
                </Col>
                <Col {...sessionColGrid} className={styles.dataCol}>
                  <span className={styles.dataSpan}>Quantity x {orderInfo.quantity}</span>
                </Col>
                <Col {...priceColGrid} className={styles.priceCol}>
                  {companyType === '01' && (
                    <span className={styles.priceSpan}>
                      ${Number(orderInfo.pricePax).toFixed(2)}/pax
                    </span>
                  )}
                </Col>
              </Row>
            );
          }
          return null;
        })}
        {companyType === '01' && (
          <Row gutter={24} className={styles.contentRowTwo} style={{ margin: '0' }}>
            <Col {...totalAColGrid} className={styles.titleCol} />
            <Col {...totalBColGrid} className={styles.totalPriceCol}>
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
