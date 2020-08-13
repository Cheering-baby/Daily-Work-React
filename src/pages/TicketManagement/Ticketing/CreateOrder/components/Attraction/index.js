import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { isNullOrUndefined } from 'util';
import { Button, Icon, List, Table, Tabs, Tooltip } from 'antd';
import {
  calculateAllProductPrice,
  calculateProductPrice,
  getVoucherProducts,
  getOfferConstrain,
  getProductLimitInventory,
  calculateProductPriceGst,
  calculateAllProductPriceGst,
  sessionTimeToWholeDay,
} from '../../../../utils/utils';
import { ticketTypes } from '../../../../utils/constants';
import { toThousands } from '@/utils/utils';
import styles from './index.less';
import Detail from '../Detail';
import ToCart from '../AttractionToCart';
import BundleToCart from '../BundleToCart';
import BundleDetail from '../Detail/bundleDetail';
import BookingVoucher from '@/assets/image/booking-voucher.jpg';

const { TabPane } = Tabs;
@connect(({ ticketMgr, global }) => ({
  ticketMgr,
  userCompanyInfo: global.userCompanyInfo,
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
    const [minProductQuantity, maxProductQuantity] = getProductLimitInventory(detail);
    attractionProduct.forEach(item => {
      item.minProductQuantity = minProductQuantity;
      item.maxProductQuantity = maxProductQuantity;
    });
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
        sessionTime: item.sessionTime,
        ageGroup: item.attractionProduct.ageGroup,
        ageGroupQuantity: item.needChoiceCount,
        quantity: offerQuantity,
        pricePax: calculateProductPrice(item, priceRuleId, item.sessionTime),
        gstAmountPax: calculateProductPriceGst(item, priceRuleId, item.sessionTime),
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
        gstAmountPax: calculateAllProductPriceGst(attractionProduct, priceRuleId, null, detail),
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
    console.log(orderData);
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
        sessionTime: item.sessionTime,
        ageGroup: item.attractionProduct.ageGroup,
        ageGroupQuantity: item.needChoiceCount,
        quantity: ticketNumber || 0,
        pricePax: ticketNumber ? calculateProductPrice(item, priceRuleId, item.sessionTime) : 0,
        gstAmountPax: ticketNumber
          ? calculateProductPriceGst(item, priceRuleId, item.sessionTime)
          : 0,
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
    console.log(orderData);
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
        sessionTime,
        ticketNumber,
        detail,
        detail: { priceRuleId },
        attractionProduct = [],
      } = item;
      return {
        sessionTime,
        quantity: ticketNumber || 0,
        pricePax: calculateAllProductPrice(attractionProduct, priceRuleId, sessionTime, detail),
        gstAmountPax: calculateAllProductPriceGst(
          attractionProduct,
          priceRuleId,
          sessionTime,
          detail
        ),
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
    dispatch({
      type: 'ticketOrderCartMgr/settingPackAgeTicketOrderData',
      payload: {
        orderIndex: null,
        orderData,
      },
    });
    console.log(orderData);
    this.onClose();
  };

  generateTicketTypeTooltip = () => (
    <div>
      {ticketTypes.map(({ text }) => (
        <div>{text}</div>
      ))}
    </div>
  );

  generateStyle = companyType => {
    const sessionStyle = {
      width: '25%',
    };
    const ticketTypeStyle = {
      width: '40%',
      padding: '0 3px',
      whiteSpace: 'normal',
      wordBreak: 'normal',
      wordWrap: 'break-word',
    };
    const priceStyle = { width: '35%', textAlign: 'right', minWidth: '115px' };
    if (companyType === '02') {
      sessionStyle.width = '40%';
      ticketTypeStyle.width = '60%';
      priceStyle.display = 'none';
    }
    return {
      sessionStyle,
      ticketTypeStyle,
      priceStyle,
    };
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
      userCompanyInfo: { companyType },
    } = this.props;
    const { clientHeight } = this.state;
    const columns = [
      {
        title: () => <div style={{ minWidth: '122px' }}>Offer Name</div>,
        key: 'name',
        width: '30%',
        render: record => {
          const {
            bundleName,
            offers = [],
            detail: {
              offerBasicInfo: { offerName },
            },
          } = record;
          let includesVoucher = false;
          if (getVoucherProducts(record.detail).length > 0) {
            includesVoucher = true;
          }
          offers.forEach(itemOffer => {
            if (getVoucherProducts(itemOffer.detail).length > 0) {
              includesVoucher = true;
            }
          });
          return (
            <div>
              <div className={styles.offerName}>{bundleName || offerName}</div>
              {includesVoucher ? (
                <div className={styles.includesVoucher}>
                  <img src={BookingVoucher} alt="" width={16} height={16} />
                  <div style={{ marginLeft: '3px', marginTop: '-3px' }}>
                    {' '}
                    The package includes voucher
                  </div>
                </div>
              ) : null}
            </div>
          );
        },
      },
      {
        title: () => (
          <div className={styles.session}>
            <div style={this.generateStyle(companyType).sessionStyle}>Session</div>
            <div
              className={styles.ticketType}
              style={this.generateStyle(companyType).ticketTypeStyle}
            >
              <span>Ticket Type</span>
              <Tooltip title={this.generateTicketTypeTooltip()}>
                <Icon
                  type="question-circle"
                  style={{ fontSize: '13px', margin: '1px 0 0 5px', color: 'rgb(133, 133, 133)' }}
                />
              </Tooltip>
            </div>
            <div style={this.generateStyle(companyType).priceStyle}>Price (SGD)</div>
          </div>
        ),
        key: 'Session',
        width: '50%',
        render: record => {
          const {
            bundleName,
            offers = [],
            detail: { priceRuleId },
          } = record;
          if (isNullOrUndefined(bundleName)) {
            const offerConstrain = getOfferConstrain(record.detail);
            return (
              <div className={styles.sessionContainer}>
                {record.attractionProduct.map((item, index) => {
                  const { sessionTime, productNo, needChoiceCount } = item;
                  const { ageGroup } = item.attractionProduct;
                  return (
                    <div key={productNo} className={styles.productPrice}>
                      <div style={this.generateStyle(companyType).sessionStyle}>
                        {sessionTime ? sessionTimeToWholeDay(sessionTime) : '-'}
                      </div>
                      <div style={this.generateStyle(companyType).ticketTypeStyle}>
                        {ageGroup || 'General'} * {needChoiceCount}
                      </div>
                      <div style={this.generateStyle(companyType).priceStyle}>
                        {offerConstrain === 'Fixed' ? (
                          <div style={{ display: index === 0 ? null : 'none' }}>
                            {`${toThousands(
                              calculateAllProductPrice(
                                record.attractionProduct,
                                priceRuleId,
                                null,
                                record.detail
                              )
                            )}
                            /Package`}
                          </div>
                        ) : (
                          `${toThousands(
                            calculateProductPrice(item, priceRuleId, sessionTime).toFixed(2)
                          )}/Ticket`
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }
          return (
            <div>
              {offers.map(offerItem => {
                const {
                  sessionTime,
                  attractionProduct: attractionProductItems = [],
                  detail: {
                    offerBasicInfo: { offerNo },
                    priceRuleId: offerPriceRuleId,
                    offerBundle = [{}],
                  },
                } = offerItem;
                return (
                  <div key={offerNo} className={styles.productPrice}>
                    <div style={this.generateStyle(companyType).sessionStyle}>
                      {sessionTimeToWholeDay(sessionTime) || '-'}
                    </div>
                    <div
                      className={styles.categoryShow}
                      style={this.generateStyle(companyType).ticketTypeStyle}
                    >
                      {offerBundle[0].bundleLabel || 'General'} * 1
                    </div>
                    <div style={this.generateStyle(companyType).priceStyle}>
                      {toThousands(
                        calculateAllProductPrice(
                          attractionProductItems,
                          offerPriceRuleId,
                          sessionTime,
                          offerItem.detail
                        )
                      )}
                      {'/Package'}
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
        width: '5%',
        render: () => {
          return <div />;
        },
      },
      {
        title: '',
        key: 'Operation',
        className: styles.option,
        width: '15%',
        render: (_, record) => {
          return (
            <div className={styles.operation}>
              <Button
                type="primary"
                style={{ width: '106px', marginTop: '3px' }}
                onClick={e => {
                  e.stopPropagation();
                  this.showToCart(record);
                }}
                disabled={!functionActive}
              >
                Add to Cart
              </Button>
              <Button
                style={{ width: '106px', marginTop: '8px' }}
                onClick={e => {
                  e.stopPropagation();
                  this.viewDetail(record);
                }}
                disabled={!functionActive}
              >
                Details
              </Button>
            </div>
          );
        },
      },
    ];
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
                {categories.length === 0 ? (
                  <div style={{ minHeight: 500 }}>
                    <List style={{ marginTop: 100 }} />
                    <div className={styles.emptyListFont}>
                      {formatMessage({ id: 'EMPTY_PRODUCT_TIP' })}
                    </div>
                  </div>
                ) : null}
                {categories.map((item2, index2) => {
                  const { tag, showDetail, products = [] } = item2;
                  return (
                    <div key={tag} className={styles.categoryItem}>
                      <div
                        className={styles.category}
                        onClick={() => this.showDetail(index, index2, showDetail)}
                      >
                        {showDetail ? (
                          <Icon
                            type="caret-down"
                            style={{ color: '#666666', fontSize: '16px', margin: '0 8px 0 12px' }}
                          />
                        ) : (
                          <Icon
                            type="caret-right"
                            style={{ color: '#666666', fontSize: '16px', margin: '0 8px 0 12px' }}
                          />
                        )}
                        <span style={{ fontSize: '15px' }}>
                          {tag} ({products.length} {products.length > 1 ? 'items' : 'item'})
                        </span>
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
