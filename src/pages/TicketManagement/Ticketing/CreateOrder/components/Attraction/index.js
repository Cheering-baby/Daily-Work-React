import React, { Component } from 'react';
import { connect } from 'dva';
import { isNullOrUndefined } from 'util';
import { Button, Icon, Table, Tabs, Tooltip } from 'antd';
import { calculateAllProductPrice, calculateProductPrice } from '../../../../utils/utils';
import styles from './index.less';
import Detail from '../Detail';
import ToCart from '../AttractionToCart';
import BundleToCart from '../BundleToCart';
import BundleDetail from '../Detail/bundleDetail';

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
    const {
      bundleName,
      offers = [],
      attractionProduct = [],
      detail,
      themeParkCode,
      themeParkName,
    } = record;
    const { numOfGuests } = detail;
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
        detail: {
          ...detailCopy,
          offerQuantity: numOfGuests,
        },
        showToCartModal: isNullOrUndefined(bundleName),
        showBundleToCart: !isNullOrUndefined(bundleName),
        bundleOfferDetail,
        themeParkCode,
        themeParkName,
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
        showDetailModal: isNullOrUndefined(bundleName),
        showBundleDetailModal: !isNullOrUndefined(bundleName),
        bundleOfferDetail,
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
        showBundleDetailModal: false,
        deliverInformation: {},
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

  changeFixedOfferNumbers = value => {
    const {
      dispatch,
      ticketMgr: { detail },
    } = this.props;
    const detailCopy = JSON.parse(JSON.stringify(detail));
    detailCopy.offerQuantity = value;
    dispatch({
      type: 'ticketMgr/save',
      payload: {
        detail: detailCopy,
      },
    });
  };

  changeBundleOfferNumber = async (index, value) => {
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
        themeParkCode,
        themeParkName,
      },
    } = this.props;
    const orderInfo = [];
    attractionProduct.forEach(item => {
      orderInfo.push({
        ageGroup: item.attractionProduct.ageGroup,
        quantity: offerQuantity,
        pricePax: calculateProductPrice(item, priceRuleId),
        productInfo: item,
      });
    });
    const orderData = {
      themeParkCode,
      themeParkName,
      orderType: 'offerFixed',
      orderSummary: {
        quantity: offerQuantity,
        pricePax: calculateAllProductPrice(attractionProduct, priceRuleId, null, detail),
        totalPrice:
          offerQuantity * calculateAllProductPrice(attractionProduct, priceRuleId, null, detail),
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
        themeParkCode,
        themeParkName,
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
        ageGroup: item.attractionProduct.ageGroup,
        quantity: ticketNumber || 0,
        pricePax: ticketNumber ? calculateProductPrice(item, priceRuleId) : 0,
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
      deliveryInfo: deliverInformation,
    };
    console.log(orderData);
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

  bundleOrder = () => {
    const {
      dispatch,
      ticketMgr: {
        deliverInformation = {},
        bundleOfferDetail: { offers = [], dateOfVisit, numOfGuests, bundleName },
        themeParkCode,
        themeParkName,
      },
    } = this.props;
    const orderInfo = offers.map(item => {
      const {
        ticketNumber,
        detail,
        detail: { priceRuleId },
        attractionProduct = [],
      } = item;
      return {
        quantity: ticketNumber || 0,
        pricePax: calculateAllProductPrice(attractionProduct, priceRuleId, null, detail),
        offerInfo: {
          ...detail,
          selectRuleId: priceRuleId,
        },
      };
    });
    const orderData = {
      themeParkCode,
      themeParkName,
      orderType: 'offerBundle',
      bundleName,
      queryInfo: {
        dateOfVisit,
        numOfGuests,
      },
      orderInfo,
      deliveryInfo: deliverInformation,
    };
    console.log(orderData);
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
        deliverInformation = {},
        showBundleToCart,
        bundleOfferDetail = {},
        showBundleDetailModal,
        functionActive,
      },
      global: {
        userCompanyInfo: { companyType },
      },
    } = this.props;
    const { clientHeight } = this.state;
    const columns = [
      {
        title: 'Offer Name',
        key: 'name',
        width: '30%',
        render: record => {
          const {
            bundleName,
            detail: {
              offerBasicInfo: { offerName },
            },
          } = record;
          return (
            <Tooltip
              title={bundleName || offerName}
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
        width: '35%',
        render: record => {
          const {
            bundleName,
            offers = [],
            detail: { priceRuleId, productGroup = [] },
          } = record;
          if (!isNullOrUndefined(bundleName)) {
            return (
              <div>
                {offers.map(offerItem => {
                  const {
                    attractionProduct: attractionProductItems = [],
                    detail: {
                      offerBasicInfo: { offerNo },
                      priceRuleId: offerPriceRuleId,
                      offerBundle = [{}],
                    },
                  } = offerItem;
                  return (
                    <div key={offerNo} className={styles.productPrice}>
                      <div style={{ marginRight: '10px' }}>{offerBundle[0].bundleLabel}</div>
                      <div>
                        From ${' '}
                        {calculateAllProductPrice(
                          attractionProductItems,
                          offerPriceRuleId,
                          null,
                          offerItem.detail
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }
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
                <div>
                  From ${' '}
                  {calculateAllProductPrice(
                    record.attractionProduct,
                    priceRuleId,
                    null,
                    record.detail
                  )}
                </div>
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
                    <div style={{ marginRight: '10px' }}>{ageGroup || '-'}</div>
                    <div>From ${` ${calculateProductPrice(item, priceRuleId).toFixed(2)}`}</div>
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
    const columns2 = columns.filter(({ title }) => title === 'Offer Name' || title === 'Operation');
    return (
      <div className={styles.container} style={{ minHeight: clientHeight }}>
        {showBundleDetailModal ? (
          <BundleDetail bundleOfferDetail={bundleOfferDetail} onClose={this.onClose} />
        ) : null}
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
            deliverInformation={deliverInformation}
            changeDeliveryInformation={(type, value) => this.changeDeliveryInformation(type, value)}
            changeFixedOfferNumbers={this.changeFixedOfferNumbers}
            modify={false}
          />
        ) : null}
        {showBundleToCart ? (
          <BundleToCart
            {...bundleOfferDetail}
            onClose={this.onClose}
            order={this.bundleOrder}
            changeTicketNumber={this.changeBundleOfferNumber}
            deliverInformation={deliverInformation}
            changeDeliveryInformation={(type, value) => this.changeDeliveryInformation(type, value)}
            modify={false}
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
                          columns={companyType === '02' ? columns2 : columns}
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
