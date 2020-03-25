import React, { Component } from 'react';
import { connect } from 'dva';
import { isNullOrUndefined } from 'util';
import { Tabs, Table, Button, Tooltip, Icon, message } from 'antd';
import {
  arrToString,
  calculateAllProductPrice,
  calculateProductPrice,
} from '../../../../utils/utils';
import styles from './index.less';
import Detail from '../Detail';
import ToCart from '../AttractionToCart';
import BundleToCart from '../BundleToCart';

const { TabPane } = Tabs;
@connect(({ ticketMgr, global }) => ({
  ticketMgr,
  global,
}))
class Attraction extends Component {
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
    const { bundleName, offers = [], attractionProduct = [], detail } = record;
    const attractionProductCopy = JSON.parse(JSON.stringify(attractionProduct));
    const detailCopy = JSON.parse(JSON.stringify(detail));
    let bundleOfferDetail = {};
    if (!isNullOrUndefined(bundleName)) {
      bundleOfferDetail = {
        bundleName,
        offers,
        dateOfVisit: offers[0].detail.dateOfVisit,
        numOfGuests: offers[0].detail.numOfGuests,
      };
    }

    dispatch({
      type: 'ticketMgr/save',
      payload: {
        attractionProduct: attractionProductCopy,
        detail: detailCopy,
        showToCartModal: isNullOrUndefined(bundleName),
        showBundleToCart: !isNullOrUndefined(bundleName),
        bundleOfferDetail,
      },
    });
  };

  detailToCart = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketMgr/save',
      payload: {
        showDetailModal: false,
        showToCartModal: true,
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

  showDetail = (index, index2, showDetail) => {
    const {
      dispatch,
      ticketMgr: { themeParkListByCode = [] },
    } = this.props;
    const themeParkListByCodeCopy = JSON.parse(JSON.stringify(themeParkListByCode));
    themeParkListByCodeCopy[index].categories[index2].showDetail = !showDetail;
    dispatch({
      type: 'ticketMgr/save',
      payload: {
        themeParkListByCode: themeParkListByCodeCopy,
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
        showBundleToCart: false,
        deliverInfomation: {},
      },
    });
  };

  formatInputValue = (index, value, type) => {
    const {
      ticketMgr: {
        attractionProduct = [],
        bundleOfferDetail: { offers = [] },
      },
    } = this.props;
    let originalValue;
    if (type === 'Bundle') {
      originalValue = offers[index].ticketNumber;
    } else {
      originalValue = attractionProduct[index].ticketNumber;
    }
    const testReg = /^[1-9]\d*$/;
    const testZero = /^0$/;
    if (value === '' || testZero.test(value) || testReg.test(value)) {
      return value;
    }
    return originalValue;
  };

  changeTicketNumber = async (index, value, productPrice) => {
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
      attractionProductCopy[index].price = value * productPrice;
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

  changeBundleOfferNumber = async (index, value, productPrice) => {
    const {
      dispatch,
      ticketMgr: {
        bundleOfferDetail,
        bundleOfferDetail: { offers = [] },
      },
    } = this.props;
    const originalValue = offers[index].ticketNumber;
    const offersCopy = JSON.parse(JSON.stringify(offers));
    const testReg = /^[1-9]\d*$/;
    const testZero = /^0$/;
    if (value === '' || testZero.test(value) || testReg.test(value)) {
      offersCopy[index].ticketNumber = value;
      offersCopy[index].price = value * productPrice;
      dispatch({
        type: 'ticketMgr/save',
        payload: {
          bundleOfferDetail: {
            ...bundleOfferDetail,
            offers: offersCopy,
          },
        },
      });
      return value;
    }
    return originalValue;
  };

  changeDeliveryInformation = (type, value) => {
    const {
      dispatch,
      ticketMgr: { deliverInfomation = {} },
    } = this.props;
    const deliverInfomationCopy = JSON.parse(JSON.stringify(deliverInfomation));
    deliverInfomationCopy[type] = value;
    dispatch({
      type: 'ticketMgr/save',
      payload: {
        deliverInfomation: deliverInfomationCopy,
      },
    });
  };

  order = () => {
    const {
      dispatch,
      ticketMgr: {
        deliverInfomation = {},
        attractionProduct = [],
        detail,
        detail: { dateOfVisit, numOfGuests, priceRuleId },
      },
    } = this.props;
    if (attractionProduct.length === 1) {
      const { ticketNumber, price } = attractionProduct[0];
      const themeParkCode = attractionProduct[0].attractionProduct.themePark;
      const { themeParkName, ageGroup } = attractionProduct[0].attractionProduct;
      const orderInfo = [];
      orderInfo.push({
        ageGroup,
        quantity: ticketNumber,
        pricePax: price / ticketNumber,
        productInfo: attractionProduct[0],
      });
      const orderData = {
        themeParkCode,
        themeParkName,
        orderType: 'offer',
        queryInfo: {
          dateOfVisit,
          numOfGuests,
        },
        orderInfo,
        offerInfo: { ...detail, selectRuleId: priceRuleId },
        deliveryInfo: deliverInfomation,
      };
      dispatch({
        type: 'ticketOrderCartMgr/settingGeneralTicketOrderData',
        payload: {
          orderIndex: null,
          orderData,
        },
      });
    } else {
      const orderInfo = [];
      const { themeParkName, themePark: themeParkCode } = attractionProduct[0].attractionProduct;
      attractionProduct.forEach(item => {
        const { ticketNumber, price } = item;
        orderInfo.push({
          ageGroup: item.attractionProduct.ageGroup,
          quantity: ticketNumber,
          pricePax: price,
          productInfo: item,
        });
      });
      const orderData = {
        themeParkCode,
        themeParkName,
        orderType: 'offer',
        queryInfo: {
          dateOfVisit,
          numOfGuests,
        },
        orderInfo,
        offerInfo: { ...detail, selectRuleId: priceRuleId },
        deliveryInfo: deliverInfomation,
      };
      dispatch({
        type: 'ticketOrderCartMgr/settingPackAgeTicketOrderData',
        payload: {
          orderIndex: null,
          orderData,
        },
      });
    }
    this.onClose();
  };

  bundleOrder = () => {
    const {
      dispatch,
      ticketMgr: {
        deliverInfomation = {},
        bundleOfferDetail: { offers = [], dateOfVisit, numOfGuests, bundleName },
      },
    } = this.props;
    const orderInfo = offers.map(item => {
      const {
        ticketNumber: quantity,
        detail,
        detail: { priceRuleId },
        attractionProduct = [],
      } = item;
      return {
        quantity,
        pricePax: calculateAllProductPrice(attractionProduct, priceRuleId),
        offerInfo: {
          ...detail,
        },
      };
    });
    const orderData = {
      themeParkCode: offers[0].attractionProduct[0].attractionProduct.themePark,
      themeParkName: offers[0].attractionProduct[0].attractionProduct.themeParkName,
      orderType: 'offerBundle',
      bundleName,
      queryInfo: {
        dateOfVisit,
        numOfGuests,
      },
      orderInfo,
      deliveryInfo: deliverInfomation,
    };
    dispatch({
      type: 'ticketOrderCartMgr/settingPackAgeTicketOrderData',
      payload: {
        orderIndex: null,
        orderData,
      },
    });
    this.onClose();
  };

  render() {
    const {
      ticketMgr: {
        themeParkListByCode = [],
        showDetailModal,
        attractionProduct = [],
        detail,
        showToCartModal,
        countrys,
        deliverInfomation = {},
        showBundleToCart,
        bundleOfferDetail = {},
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
    const { clientHeight } = this.state;
    const columns = [
      {
        title: 'Offer Name',
        key: 'name',
        width: '40%',
        render: record => {
          const {
            bundleName,
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
              <span style={{ whiteSpace: 'pre' }}>{bundleName || offerName}</span>
            </Tooltip>
          );
        },
      },
      {
        title: 'Price',
        key: 'Price',
        align: 'right',
        render: record => {
          const {
            bundleName,
            offers = [],
            detail: { priceRuleId },
          } = record;
          if (!isNullOrUndefined(bundleName)) {
            return (
              <div>
                {offers.map(offerItem => {
                  const {
                    attractionProduct: attractionProductItems = [],
                    detail: {
                      offerBasicInfo: { offerName, offerNo },
                      priceRuleId: offerPriceRuleId,
                    },
                  } = offerItem;
                  return (
                    <div key={offerNo} className={styles.productPrice}>
                      <div>{offerName}</div>
                      <div>
                        From $ {calculateAllProductPrice(attractionProductItems, offerPriceRuleId)}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }
          return (
            <div>
              {record.attractionProduct.map(item => {
                const { productNo } = item;
                const { ageGroup } = item.attractionProduct;
                return (
                  <div key={productNo} className={styles.productPrice}>
                    <div>{ageGroup}</div>
                    <div>From ${calculateProductPrice(item, priceRuleId)}</div>
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
        width: '5%',
        render: () => {
          return <div />;
        },
      },
      {
        title: 'Operation',
        key: 'Operation',
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
              >
                Add to Cart
              </Button>
            </div>
          );
        },
      },
    ];
    return (
      <div className={styles.container} style={{ minHeight: clientHeight }}>
        {showDetailModal ? (
          <Detail
            attractionProduct={attractionProduct}
            detail={detail}
            onClose={this.onClose}
            showToCart={this.detailToCart}
          />
        ) : null}
        {showToCartModal ? (
          <ToCart
            ticketType={ticketType}
            description={description}
            attractionProduct={attractionProduct}
            detail={detail}
            onClose={this.onClose}
            changeTicketNumber={this.changeTicketNumber}
            formatInputValue={this.formatInputValue}
            priceRuleIndex={0}
            countrys={countrys}
            order={this.order}
            deliverInfomation={deliverInfomation}
            changeDeliveryInformation={(type, value) => this.changeDeliveryInformation(type, value)}
          />
        ) : null}
        {showBundleToCart ? (
          <BundleToCart
            {...bundleOfferDetail}
            onClose={this.onClose}
            countrys={countrys}
            order={this.bundleOrder}
            formatInputValue={this.formatInputValue}
            changeTicketNumber={this.changeBundleOfferNumber}
            deliverInfomation={deliverInfomation}
            changeDeliveryInformation={(type, value) => this.changeDeliveryInformation(type, value)}
          />
        ) : null}
        <Tabs>
          {themeParkListByCode.map((item, index) => {
            const { themeparkName, themeparkCode, categories = [] } = item;
            return (
              <TabPane tab={themeparkName} key={themeparkCode} style={{ color: '#171b21' }}>
                {categories.map((item2, index2) => {
                  const { tag, showDetail, products = [] } = item2;
                  return (
                    <div key={tag} className={styles.categoryItem}>
                      <div className={styles.category}>
                        {showDetail ? (
                          <Icon
                            type="caret-down"
                            style={{ color: '#666666', fontSize: '16px', margin: '0 8px 0 12px' }}
                            onClick={() => this.showDetail(index, index2, showDetail)}
                          />
                        ) : (
                          <Icon
                            type="caret-right"
                            style={{ color: '#666666', fontSize: '16px', margin: '0 8px 0 12px' }}
                            onClick={() => this.showDetail(index, index2, showDetail)}
                          />
                        )}
                        <span>{tag}</span>
                      </div>
                      {showDetail ? (
                        <Table
                          className={styles.table}
                          columns={columns}
                          dataSource={products}
                          pagination={false}
                          rowKey={record => record.id}
                          size="small"
                          bordered={false}
                        />
                      ) : null}
                    </div>
                  );
                })}
              </TabPane>
            );
          })}
        </Tabs>
      </div>
    );
  }
}

export default Attraction;
