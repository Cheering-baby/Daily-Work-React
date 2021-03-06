import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { isNullOrUndefined } from 'util';
import { Button, Icon, List, Table, Tabs, Tooltip, Form, Select, message } from 'antd';
import {
  calculateAllProductPrice,
  calculateProductPrice,
  getVoucherProducts,
  getOfferConstrain,
  getProductLimitInventory,
  calculateProductPriceGst,
  calculateAllProductPriceGst,
  sessionTimeToWholeDay,
  matchDictionaryName,
  sortArray,
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
@Form.create()
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
    const { dispatch, form } = this.props;
    const {
      tag,
      index,
      themeParkName,
      bundleName,
      offers = [],
      attractionProduct = [],
      detail,
      language,
      themeParkCode,
    } = record;
    const validFields = [];
    const { numOfGuests } = detail;
    const [minProductQuantity, maxProductQuantity] = getProductLimitInventory(detail);
    attractionProduct.forEach(item => {
      item.minProductQuantity = minProductQuantity;
      item.maxProductQuantity = maxProductQuantity;
    });
    let attractionProductCopy = [];
    let bundleOfferDetail = {};
    if (!isNullOrUndefined(bundleName)) {
      const offerFilter = offers.filter(offerItem => {
        const { offerSessions = [], sessionTime } = offerItem;
        const isSessionOffer = !(offerSessions.length === 1 && offerSessions[0] === null);
        if (isSessionOffer) {
          return !isNullOrUndefined(sessionTime);
        }
        return true;
      });
      if (offerFilter.length > 0) {
        bundleOfferDetail = {
          bundleName,
          language,
          offers: offerFilter,
          dateOfVisit: offerFilter[0].detail.dateOfVisit,
          numOfGuests: offerFilter[0].detail.numOfGuests,
        };
      } else {
        message.warning('Please select one session at least.');
        return false;
      }
    } else {
      const offerConstrain = getOfferConstrain(detail);
      if (offerConstrain === 'Fixed') {
        attractionProduct.forEach(itemProduct => {
          const { productNo } = itemProduct;
          const label = `${themeParkCode}_${tag}_${index}_${productNo}`;
          validFields.push(label);
        });
        attractionProductCopy = JSON.parse(JSON.stringify(attractionProduct));
      } else {
        attractionProductCopy = attractionProduct.filter(itemProduct => {
          const { sessionOptions = [], sessionTime } = itemProduct;
          const isSessionProduct = sessionOptions.length > 0;
          if (isSessionProduct) {
            return !isNullOrUndefined(sessionTime);
          }
          return true;
        });
        if (attractionProductCopy.length === 0) {
          message.warning('Please select one session at lease.');
          return false;
        }
      }
    }
    const detailCopy = JSON.parse(JSON.stringify(detail));
    form.validateFields(validFields, errs => {
      if (!errs) {
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
      }
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
        detail: { dateOfVisit, numOfGuests, priceRuleId, offerQuantity, language },
        themeParkCode,
        themeParkName,
      },
    } = this.props;
    const orderInfo = [];
    attractionProduct.forEach(item => {
      orderInfo.push({
        language,
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
    this.onClose();
  };

  order = () => {
    const {
      dispatch,
      ticketMgr: {
        deliverInformation = {},
        attractionProduct = [],
        detail,
        detail: { dateOfVisit, numOfGuests, priceRuleId, productGroup = [], language },
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
        language,
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
    this.onClose();
  };

  bundleOrder = () => {
    const {
      dispatch,
      ticketMgr: {
        deliverInformation = {},
        bundleOfferDetail: { offers = [], dateOfVisit, numOfGuests, bundleName, language },
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
        language,
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
      language,
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
      width: '32%',
      paddingRight: '5px',
    };
    const ticketTypeStyle = {
      width: '40%',
      padding: '0 3px',
      whiteSpace: 'normal',
      wordBreak: 'normal',
      wordWrap: 'break-word',
    };
    const priceStyle = { width: '28%', textAlign: 'right', minWidth: '115px' };
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

  productPrice = (isSessionProduct, product, priceRuleId, session) => {
    const { onlyVoucher } = product;
    const priceTag = onlyVoucher ? 'Voucher' : 'Ticket';
    if (isSessionProduct) {
      // product.sessionTime = session;
      return session
        ? `${toThousands(
            calculateProductPrice(product, priceRuleId, session).toFixed(2)
          )}/${priceTag}`
        : `-/${priceTag}`;
    }
    return `${toThousands(
      calculateProductPrice(product, priceRuleId, null).toFixed(2)
    )}/${priceTag}`;
  };

  fixedOfferPrice = record => {
    const {
      form: { getFieldValue },
    } = this.props;
    const {
      themeParkCode,
      tag,
      index,
      attractionProduct,
      detail: { priceRuleId },
    } = record;
    const includeSessionProduct = attractionProduct.find(
      ({ sessionOptions = [] }) => sessionOptions.length > 0
    );
    if (includeSessionProduct) {
      const validValues = [];
      attractionProduct.forEach(itemProduct => {
        const { sessionOptions, productNo } = itemProduct;
        if (sessionOptions.length > 0) {
          const label = `${themeParkCode}_${tag}_${index}_${productNo}`;
          // itemProduct.sessionTime = getFieldValue(label);
          validValues.push(getFieldValue(label));
        }
      });
      return validValues.includes(undefined)
        ? '-/Package'
        : `${toThousands(
            calculateAllProductPrice(attractionProduct, priceRuleId, null, record.detail)
          )}
      /Package`;
    }
    return `${toThousands(
      calculateAllProductPrice(attractionProduct, priceRuleId, null, record.detail)
    )}
    /Package`;
  };

  bundleOfferPrice = (record, offer) => {
    const {
      form: { getFieldValue },
    } = this.props;
    const { themeParkCode, tag, index } = record;
    const {
      offerSessions,
      attractionProduct,
      detail,
      detail: {
        offerBasicInfo: { offerNo },
        priceRuleId,
      },
    } = offer;
    const isSessionOffer = !(offerSessions.length === 1 && offerSessions[0] === null);
    const label = `${themeParkCode}_${tag}_${index}_${offerNo}`;
    if (isSessionOffer) {
      // offer.sessionTime = getFieldValue(label);
      return getFieldValue(label)
        ? `${toThousands(
            calculateAllProductPrice(attractionProduct, priceRuleId, getFieldValue(label), detail)
          )}/Package`
        : `-/Package`;
    }

    return `${toThousands(
      calculateAllProductPrice(attractionProduct, priceRuleId, null, detail)
    )}/Package`;
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
        languageEnum = [],
      },
      userCompanyInfo: { companyType },
      form: { getFieldDecorator },
    } = this.props;
    const { clientHeight } = this.state;
    const columns = [
      {
        title: () => <div style={{ minWidth: '122px' }}>Offer Name</div>,
        key: 'name',
        width: '30%',
        render: (_, record) => {
          const {
            bundleName,
            offers = [],
            language: offerLanguage,
            detail: {
              language,
              isIncludeLanguage,
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
              {(offerLanguage || isIncludeLanguage) && (
                <div>Language: {matchDictionaryName(languageEnum, offerLanguage || language)}</div>
              )}
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
        width: '55%',
        render: (_, record) => {
          const {
            themeParkCode,
            tag,
            index,
            bundleName,
            offers = [],
            detail: { priceRuleId },
          } = record;
          const {
            form: { getFieldValue },
          } = this.props;
          offers.map(item => {
            const {
              detail: { offerBundle = [{}] },
            } = item;
            item.onlySort = offerBundle[0].bundleLabel || 'General';
            return item;
          });
          sortArray(offers, ['onlySort']);
          if (isNullOrUndefined(bundleName)) {
            const offerConstrain = getOfferConstrain(record.detail);
            record.attractionProduct.map(item => {
              item.onlySort = item.attractionProduct.ageGroup || 'General';
              return item;
            });
            sortArray(record.attractionProduct, ['onlySort']);
            return (
              <div className={styles.sessionContainer}>
                {record.attractionProduct.map((item, attractionProductIndex) => {
                  const { sessionTime, productNo, needChoiceCount, sessionOptions = [] } = item;
                  const { ageGroup } = item.attractionProduct;
                  const isSessionProduct = sessionOptions.length > 0;
                  const label = `${themeParkCode}_${tag}_${index}_${productNo}`;
                  return (
                    <div key={label} className={styles.productPrice}>
                      <div style={this.generateStyle(companyType).sessionStyle}>
                        {isSessionProduct ? (
                          <Form.Item>
                            {getFieldDecorator(label, {
                              initialValue: sessionTime,
                              rules: [
                                {
                                  required: offerConstrain === 'Fixed',
                                  message: 'Required',
                                },
                              ],
                            })(
                              sessionOptions.length === 1 && sessionOptions[0] === '03:00:00' ? (
                                <div className={styles.wholeDay}>Whole Day</div>
                              ) : (
                                <Select
                                  placeholder="Please Select"
                                  allowClear
                                  getPopupContainer={() =>
                                    document.getElementById('Ticketing-Create-Order')
                                  }
                                  dropdownClassName={styles.selectSession}
                                  onChange={value => {
                                    item.sessionTime = value;
                                  }}
                                >
                                  {sessionOptions.map(itemSession => (
                                    <Select.Option value={itemSession} key={itemSession}>
                                      {sessionTimeToWholeDay(itemSession)}
                                    </Select.Option>
                                  ))}
                                </Select>
                              )
                            )}
                          </Form.Item>
                        ) : (
                          '-'
                        )}
                      </div>
                      <div
                        style={{
                          ...this.generateStyle(companyType).ticketTypeStyle,
                          paddingTop: isSessionProduct ? '4px' : null,
                        }}
                      >
                        {ageGroup || 'General'} * {needChoiceCount}
                      </div>
                      <div
                        style={{
                          ...this.generateStyle(companyType).priceStyle,
                          paddingTop: isSessionProduct ? '4px' : null,
                        }}
                      >
                        {offerConstrain === 'Fixed' ? (
                          <div style={{ display: attractionProductIndex === 0 ? null : 'none' }}>
                            {this.fixedOfferPrice(record)}
                          </div>
                        ) : (
                          <div>
                            {this.productPrice(
                              isSessionProduct,
                              item,
                              priceRuleId,
                              getFieldValue(label)
                            )}
                          </div>
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
                  offerSessions = [],
                  detail: {
                    offerBasicInfo: { offerNo },
                    offerBundle = [{}],
                  },
                } = offerItem;
                const isSessionOffer = !(offerSessions.length === 1 && offerSessions[0] === null);
                const label = `${themeParkCode}_${tag}_${index}_${offerNo}`;
                return (
                  <div key={offerNo} className={styles.productPrice}>
                    <div style={this.generateStyle(companyType).sessionStyle}>
                      {isSessionOffer ? (
                        <Form.Item>
                          {getFieldDecorator(label, {
                            initialValue: sessionTime || undefined,
                            rules: [
                              {
                                required: false,
                                message: 'Required',
                              },
                            ],
                          })(
                            offerSessions.length === 1 && offerSessions[0] === '03:00:00' ? (
                              <div className={styles.wholeDay}>Whole Day</div>
                            ) : (
                              <Select
                                placeholder="Please Select"
                                allowClear
                                onChange={value => {
                                  offerItem.sessionTime = value;
                                }}
                              >
                                {offerSessions.map(itemSession => (
                                  <Select.Option value={itemSession} key={itemSession}>
                                    {sessionTimeToWholeDay(itemSession)}
                                  </Select.Option>
                                ))}
                              </Select>
                            )
                          )}
                        </Form.Item>
                      ) : (
                        '-'
                      )}
                    </div>
                    <div
                      className={styles.categoryShow}
                      style={{
                        ...this.generateStyle(companyType).ticketTypeStyle,
                        paddingTop: isSessionOffer ? '4px' : null,
                      }}
                    >
                      {offerBundle[0].bundleLabel || 'General'} * 1
                    </div>
                    <div
                      style={{
                        ...this.generateStyle(companyType).priceStyle,
                        paddingTop: isSessionOffer ? '4px' : null,
                      }}
                    >
                      {this.bundleOfferPrice(record, offerItem)}
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
        dataIndex: 'empty',
        width: '10px',
        render: () => {
          return <div />;
        },
      },
      {
        title: '',
        key: 'Operation',
        className: styles.option,
        width: '130px',
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
                        <Form>
                          <Table
                            className={styles.table}
                            columns={columns}
                            dataSource={products}
                            pagination={false}
                            rowKey={record => record.id}
                            size="small"
                            bordered={false}
                          />
                        </Form>
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
