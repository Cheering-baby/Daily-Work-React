import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Button, Icon, List, Table, Tooltip } from 'antd';
import Detail from '../Detail';
import ToCart from '../AttractionToCart';
import {
  arrToString,
  calculateAllProductPrice,
  calculateProductPrice,
  filterSessionProduct,
  isSessionProduct,
} from '../../../../utils/utils';
import styles from './index.less';

@connect(({ ticketMgr, global }) => ({
  ticketMgr,
  global,
}))
class DolphinIslandOffer extends Component {
  constructor(props) {
    super(props);
    const clientHeight =
      document.getElementsByClassName('main-layout-content ant-layout-content')[0].clientHeight -
      50;
    this.state = {
      clientHeight,
    };
  }

  showToCart = record => {
    const { dispatch } = this.props;
    const {
      attractionProduct = [],
      detail,
      detail: { priceRuleId, numOfGuests },
      session: { priceTimeFrom },
    } = record;
    const attractionProductCopy = JSON.parse(
      JSON.stringify(filterSessionProduct(priceRuleId, priceTimeFrom, attractionProduct))
    );
    const detailCopy = JSON.parse(JSON.stringify(detail));
    const { priceRule } = attractionProduct[0];
    let dolphinSessionIndex;
    priceRule.forEach(item => {
      const { productPrice, priceRuleName } = item;
      if (priceRuleName === 'DefaultPrice') {
        productPrice.forEach((item2, index2) => {
          if (item2.priceTimeFrom === priceTimeFrom) {
            dolphinSessionIndex = index2;
          }
        });
      }
    });
    dispatch({
      type: 'ticketMgr/save',
      payload: {
        attractionProduct: attractionProductCopy,
        detail: { ...detailCopy, offerQuantity: numOfGuests },
        showToCartModal: true,
        dolphinSessionIndex,
        eventSession: priceTimeFrom,
      },
    });
  };

  viewDetail = record => {
    const { dispatch } = this.props;
    const { attractionProduct = [], detail } = record;
    const attractionProductCopy = JSON.parse(JSON.stringify(attractionProduct));
    const detailCopy = JSON.parse(JSON.stringify(detail));
    dispatch({
      type: 'ticketMgr/save',
      payload: {
        attractionProduct: attractionProductCopy,
        detail: detailCopy,
        showDetailModal: true,
      },
    });
  };

  changeTicketNumber = async (index, value) => {
    const {
      dispatch,
      ticketMgr: { attractionProduct = [] },
    } = this.props;
    const originalValue = attractionProduct[index].ticketNumber;
    const attractionProductCopy = JSON.parse(JSON.stringify(attractionProduct));
    const testReg = /^[1-9]\d*$/;
    const testZero = /^0$/;
    if (value === '' || testZero.test(value) || testReg.test(value)) {
      attractionProductCopy[index].ticketNumber = value;
      dispatch({
        type: 'ticketMgr/save',
        payload: {
          attractionProduct: attractionProductCopy,
        },
      });
      return value;
    }
    return originalValue;
  };

  showDetail = (index, showDetail) => {
    const {
      dispatch,
      ticketMgr: { dolphinIslandOfferList = [] },
    } = this.props;
    const dolphinIslandOfferListCopy = JSON.parse(JSON.stringify(dolphinIslandOfferList));
    dolphinIslandOfferListCopy[index].showDetail = !showDetail;
    dispatch({
      type: 'ticketMgr/save',
      payload: {
        dolphinIslandOfferList: dolphinIslandOfferListCopy,
      },
    });
  };

  onClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketMgr/save',
      payload: {
        showDetailModal: false,
        showToCartModal: false,
        deliverInformation: {},
      },
    });
  };

  changeDeliveryInformation = (type, value) => {
    const {
      dispatch,
      ticketMgr: { deliverInformation = {} },
    } = this.props;
    const deliverInformationCopy = JSON.parse(JSON.stringify(deliverInformation));
    deliverInformationCopy[type] = value;
    dispatch({
      type: 'ticketMgr/save',
      payload: {
        deliverInformation: deliverInformationCopy,
      },
    });
  };

  orderFixedOffer = () => {
    const {
      dispatch,
      ticketMgr: {
        deliverInformation = {},
        attractionProduct = [],
        detail,
        detail: { dateOfVisit, numOfGuests, priceRuleId, offerQuantity },
        eventSession: sessionTime,
      },
    } = this.props;
    const orderInfo = [];
    attractionProduct.forEach(item => {
      orderInfo.push({
        sessionTime: isSessionProduct(priceRuleId, item) ? sessionTime : undefined,
        ageGroup: item.attractionProduct.ageGroup,
        quantity: offerQuantity,
        pricePax: calculateProductPrice(item, priceRuleId),
        productInfo: item,
      });
    });
    const orderData = {
      sessionTime,
      themeParkCode: 'DOL',
      themeParkName: 'Dolphin Island',
      orderType: 'offerFixed',
      orderSummary: {
        sessionTime,
        quantity: offerQuantity,
        pricePax: calculateAllProductPrice(attractionProduct, priceRuleId, sessionTime, detail),
        totalPrice:
          offerQuantity *
          calculateAllProductPrice(attractionProduct, priceRuleId, sessionTime, detail),
        selectPriceRuleId: priceRuleId,
      },
      queryInfo: {
        dateOfVisit,
        numOfGuests,
      },
      orderInfo,
      offerInfo: { ...detail, selectRuleId: priceRuleId },
      deliveryInfo: deliverInformation,
    };
    dispatch({
      type: 'ticketOrderCartMgr/settingGeneralTicketOrderData',
      payload: {
        orderIndex: null,
        orderData,
      },
    });
    this.onClose();
  };

  order = () => {
    const {
      dispatch,
      ticketMgr: {
        deliverInformation = {},
        attractionProduct = [],
        detail,
        detail: { dateOfVisit, numOfGuests, priceRuleId, productGroup = [] },
        eventSession: sessionTime,
      },
    } = this.props;
    let offerConstrain;
    productGroup.forEach(item => {
      if (item.productType === 'Attraction') {
        item.productGroup.forEach(item2 => {
          if (item2.groupName === 'Attraction') {
            offerConstrain = item2.choiceConstrain;
          }
        });
      }
    });
    if (offerConstrain === 'Fixed') {
      this.orderFixedOffer();
      return true;
    }
    const orderInfo = [];
    attractionProduct.forEach(item => {
      const { ticketNumber } = item;
      orderInfo.push({
        sessionTime: isSessionProduct(priceRuleId, item) ? sessionTime : undefined,
        ageGroup: item.attractionProduct.ageGroup,
        quantity: ticketNumber || 0,
        pricePax: calculateProductPrice(item, priceRuleId, sessionTime),
        productInfo: item,
      });
    });
    const orderData = {
      sessionTime,
      themeParkCode: 'DOL',
      themeParkName: 'Dolphin Island',
      queryInfo: {
        dateOfVisit,
        numOfGuests,
      },
      orderType: 'offer',
      orderInfo,
      offerInfo: { ...detail },
      deliveryInfo: deliverInformation,
    };
    const type =
      attractionProduct.length === 1
        ? 'ticketOrderCartMgr/settingGeneralTicketOrderData'
        : 'ticketOrderCartMgr/settingPackAgeTicketOrderData';
    dispatch({
      type,
      payload: {
        orderIndex: null,
        orderData,
      },
    });
    this.onClose();
  };

  render() {
    const { clientHeight } = this.state;
    const {
      ticketMgr: {
        showDetailModal,
        attractionProduct = [],
        detail,
        showToCartModal,
        dolphinIslandOfferList = [],
        eventSession,
        deliverInformation = {},
        functionActive,
      },
      global: {
        userCompanyInfo: { companyType },
      },
    } = this.props;
    const ticketTypeItems = [];
    const descriptionItems = [];
    attractionProduct.forEach(item => {
      ticketTypeItems.push(item.attractionProduct.ticketType);
      descriptionItems.push(item.attractionProduct.pluDesc);
    });
    const ticketType = arrToString(ticketTypeItems);
    const description = arrToString(descriptionItems);
    const columns = [
      {
        title: 'Offer Name',
        key: 'name',
        width: '25%',
        render: record => {
          const {
            detail: {
              offerBasicInfo: { offerName },
            },
          } = record;
          return (
            <Tooltip
              title={offerName}
              placement="topLeft"
              overlayStyle={{ whiteSpace: 'pre-wrap' }}
            >
              <span style={{ whiteSpace: 'pre' }}>{offerName}</span>
            </Tooltip>
          );
        },
      },
      {
        title: 'Session',
        key: 'Session',
        width: '15%',
        render: record => {
          const {
            session: { priceTimeFrom },
          } = record;
          return <div>{priceTimeFrom || '-'}</div>;
        },
      },
      {
        title: 'Category',
        key: 'Category',
        width: '15%',
        render: record => {
          const {
            detail: { priceRuleId, productGroup },
            session: { priceTimeFrom },
          } = record;
          const filterProducts = filterSessionProduct(
            priceRuleId,
            priceTimeFrom,
            record.attractionProduct
          );
          let offerConstrain;
          const ageGroups = [];
          productGroup.forEach(item => {
            if (item.productType === 'Attraction') {
              item.productGroup.forEach(item2 => {
                if (item2.groupName === 'Attraction') {
                  offerConstrain = item2.choiceConstrain;
                }
              });
            }
          });
          if (offerConstrain === 'Fixed') {
            record.attractionProduct.forEach(item => {
              if (item.attractionProduct.ageGroup) {
                ageGroups.push(`${item.attractionProduct.ageGroup}`);
              } else {
                ageGroups.push(`-`);
              }
            });
            return (
              <div className={styles.productPrice}>
                <div style={{ marginRight: '10px' }}>{ageGroups.join('; ')}</div>
              </div>
            );
          }
          return (
            <div>
              {filterProducts.map(item => {
                const {
                  attractionProduct: { ageGroup },
                } = item;
                return (
                  <div className={styles.productPrice}>
                    <div style={{ marginRight: '10px' }}>{ageGroup || '-'}</div>
                  </div>
                );
              })}
            </div>
          );
        },
      },
      {
        title: 'Price',
        key: 'Price',
        width: '15%',
        align: 'right',
        render: record => {
          const {
            detail: { priceRuleId, productGroup },
            session: { priceTimeFrom },
          } = record;
          const filterProducts = filterSessionProduct(
            priceRuleId,
            priceTimeFrom,
            record.attractionProduct
          );
          let offerConstrain;
          productGroup.forEach(item => {
            if (item.productType === 'Attraction') {
              item.productGroup.forEach(item2 => {
                if (item2.groupName === 'Attraction') {
                  offerConstrain = item2.choiceConstrain;
                }
              });
            }
          });
          if (offerConstrain === 'Fixed') {
            return (
              <div className={styles.productPrice}>
                <div style={{ marginRight: '10px' }}> </div>
                <div>
                  ${' '}
                  {calculateAllProductPrice(
                    record.attractionProduct,
                    priceRuleId,
                    priceTimeFrom,
                    record.detail
                  )}
                </div>
              </div>
            );
          }
          return (
            <div>
              {filterProducts.map(item => {
                return (
                  <div className={styles.productPrice}>
                    <div style={{ marginRight: '10px' }}> </div>
                    <div>
                      ${' '}
                      {calculateProductPrice(
                        item,
                        priceRuleId,
                        isSessionProduct(priceRuleId, item) ? priceTimeFrom : null
                      ).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        },
      },
      {
        title: '',
        key: 'empty',
        width: '3%',
        render: () => {
          return <div />;
        },
      },
      {
        title: 'Operation',
        key: 'Operation',
        className: styles.option,
        width: '30%',
        render: (_, record) => {
          return (
            <div className={styles.operation}>
              <Tooltip title="Detail">
                <Icon
                  type="eye"
                  onClick={e => {
                    e.stopPropagation();
                    this.viewDetail(record);
                  }}
                  style={{ marginRight: '10px' }}
                />
              </Tooltip>
              <Button
                type="primary"
                onClick={e => {
                  e.stopPropagation();
                  this.showToCart(record);
                }}
                disabled={!functionActive}
              >
                Add to Cart
              </Button>
            </div>
          );
        },
      },
    ];
    const columns2 = columns.filter(
      ({ title }) => title === 'Offer Name' || title === 'Operation' || title === 'Session'
    );
    return (
      <div className={styles.container} style={{ minHeight: clientHeight }}>
        {showDetailModal ? (
          <Detail attractionProduct={attractionProduct} detail={detail} onClose={this.onClose} />
        ) : null}
        {showToCartModal ? (
          <ToCart
            attractionProduct={attractionProduct}
            detail={detail}
            onClose={this.onClose}
            changeTicketNumber={this.changeTicketNumber}
            order={this.order}
            ticketType={ticketType}
            description={description}
            eventSession={eventSession}
            deliverInformation={deliverInformation}
            changeDeliveryInformation={(type, value) => this.changeDeliveryInformation(type, value)}
          />
        ) : null}
        {dolphinIslandOfferList.length === 0 ? (
          <div style={{ minHeight: 500 }}>
            <List style={{ marginTop: 100 }} />
            <div className={styles.emptyListFont}>{formatMessage({ id: 'EMPTY_PRODUCT_TIP' })}</div>
          </div>
        ) : (
          <div>
            {dolphinIslandOfferList.map((item, index) => {
              const { tag, offer = [], showDetail } = item;
              return (
                <div key={tag} className={styles.categoryItem}>
                  <div className={styles.category}>
                    {showDetail ? (
                      <Icon
                        type="caret-down"
                        style={{ color: '#666666', fontSize: '16px', margin: '0 8px 0 12px' }}
                        onClick={() => this.showDetail(index, showDetail)}
                      />
                    ) : (
                      <Icon
                        type="caret-right"
                        style={{ color: '#666666', fontSize: '16px', margin: '0 8px 0 12px' }}
                        onClick={() => this.showDetail(index, showDetail)}
                      />
                    )}
                    <span>{tag}</span>
                  </div>
                  {showDetail ? (
                    <Table
                      className={styles.table}
                      columns={companyType === '02' ? columns2 : columns}
                      dataSource={offer}
                      pagination={false}
                      rowKey={record => record.id}
                      size="small"
                      bordered={false}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default DolphinIslandOffer;
