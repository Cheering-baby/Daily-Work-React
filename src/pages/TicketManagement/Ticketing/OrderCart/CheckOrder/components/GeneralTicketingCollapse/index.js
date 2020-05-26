import React, { Component } from 'react';
import { Collapse, Form, Icon, message } from 'antd';
import { connect } from 'dva';
import styles from '../../index.less';
import OrderItemCollapse from './components/OrderItemCollapse';
import ToCart from '@/pages/TicketManagement/Ticketing/CreateOrder/components/AttractionToCart';
import BundleToCart from '@/pages/TicketManagement/Ticketing/CreateOrder/components/BundleToCart';
import {
  calculateAllProductPrice,
  calculateProductPrice,
  isSessionProduct,
} from '@/pages/TicketManagement/utils/utils';

@Form.create()
@connect(({ global, ticketOrderCartMgr }) => ({
  global,
  ticketOrderCartMgr,
}))
class GeneralTicketingCollapse extends Component {
  operateButtonEvent = (opType, orderIndex, offerIndex) => {
    const {
      dispatch,
      ticketOrderCartMgr: { generalTicketOrderData = [] },
    } = this.props;
    if (opType === 'delete' && offerIndex !== null) {
      const orderItem = generalTicketOrderData[orderIndex].orderOfferList[offerIndex];
      if (orderItem.orderType === 'offerBundle') {
        const { orderInfo } = orderItem;
        let handleResult = 0;
        orderInfo.forEach(orderInfoItem => {
          if (handleResult === 0) {
            dispatch({
              type: 'ticketOrderCartMgr/removeShoppingCart',
              payload: {
                offerInstances: [
                  {
                    offerNo: orderInfoItem.offerInfo.offerNo,
                    offerInstanceId: orderInfoItem.offerInstanceId,
                  },
                ],
                callbackFn: null,
              },
            }).then(resultCode => {
              if (resultCode !== '0') {
                handleResult = -1;
              }
            });
          }
        });
        if (handleResult === 0) {
          message.success('Deleted successfully.');
        }
      } else {
        dispatch({
          type: 'ticketOrderCartMgr/removeShoppingCart',
          payload: {
            offerInstances: [
              {
                offerNo: orderItem.offerInfo.offerNo,
                offerInstanceId: orderItem.offerInstanceId,
              },
            ],
            callbackFn: null,
          },
        }).then(resultCode => {
          if (resultCode === '0') {
            message.success('Deleted successfully.');
          }
        });
      }
    } else if (opType === 'edit') {
      const editOrderOffer = generalTicketOrderData[orderIndex].orderOfferList[offerIndex];
      if (editOrderOffer.orderType === 'offerBundle') {
        const { bundleName, queryInfo, orderInfo } = editOrderOffer;
        const offers = [];
        orderInfo.forEach(orderInfoItem => {
          let attractionProduct;
          orderInfoItem.offerInfo.productGroup.forEach(item => {
            const { productType } = item;
            if (productType === 'Attraction') {
              item.productGroup.forEach(item2 => {
                if (item2.groupName === 'Attraction') {
                  attractionProduct = item2.products;
                }
              });
            }
          });
          offers.push(
            Object.assign(
              {},
              {
                ticketNumber: orderInfoItem.quantity,
                attractionProduct,
                detail: orderInfoItem.offerInfo,
              }
            )
          );
        });
        const bundleOfferDetail = {
          bundleName,
          offers,
          dateOfVisit: queryInfo.dateOfVisit,
          numOfGuests: queryInfo.numOfGuests,
        };
        const deliverInformation = { ...editOrderOffer.deliveryInfo };
        dispatch({
          type: 'ticketOrderCartMgr/save',
          payload: {
            showToCartModalType: 0,
            orderIndex,
            offerIndex,
            showBundleToCart: true,
            bundleOfferDetail,
            deliverInformation,
          },
        });
      } else {
        let attractionProduct = [];
        if (editOrderOffer.orderInfo) {
          editOrderOffer.orderInfo.forEach(orderInfoItem => {
            attractionProduct = [...attractionProduct, { ...orderInfoItem.productInfo }];
          });
        }
        const deliverInformation = { ...editOrderOffer.deliveryInfo };
        dispatch({
          type: 'ticketOrderCartMgr/save',
          payload: {
            showToCartModalType: 0,
            showToCartModal: true,
            orderIndex,
            offerIndex,
            editOrderOffer,
            attractionProduct,
            deliverInformation,
          },
        });
      }
    }
  };

  changeOrderCheck = (orderIndex, orderData) => {
    const {
      dispatch,
      ticketOrderCartMgr: { generalTicketOrderData = [] },
    } = this.props;
    Object.assign(generalTicketOrderData, {
      [orderIndex]: {
        ...orderData,
      },
    });
    dispatch({
      type: 'ticketOrderCartMgr/ticketOrderCheckSave',
      payload: {
        generalTicketOrderData,
      },
    });
  };

  getActiveKeyList = () => {
    const {
      ticketOrderCartMgr: { generalTicketOrderData = [] },
    } = this.props;
    const activeKeyList = generalTicketOrderData.map((orderData, orderIndex) => {
      return `${orderData.themeParkCode}_${orderIndex}`;
    });
    return activeKeyList;
  };

  onClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketOrderCartMgr/save',
      payload: {
        showToCartModal: false,
        showBundleToCart: false,
      },
    });
  };

  changeTicketNumber = async (index, value) => {
    const {
      dispatch,
      ticketOrderCartMgr: { attractionProduct = [] },
    } = this.props;
    const originalValue = attractionProduct[index].ticketNumber;
    const attractionProductCopy = JSON.parse(JSON.stringify(attractionProduct));
    const testReg = /^[1-9]\d*$/;
    const testZero = /^0$/;
    if (value === '' || testZero.test(value) || testReg.test(value)) {
      attractionProductCopy[index].ticketNumber = value;
      dispatch({
        type: 'ticketOrderCartMgr/save',
        payload: {
          attractionProduct: attractionProductCopy,
        },
      });
      return value;
    }
    return originalValue;
  };

  changeDeliveryInformation = (type, value) => {
    const {
      dispatch,
      ticketOrderCartMgr: { deliverInformation = {} },
    } = this.props;
    const deliverInformationCopy = JSON.parse(JSON.stringify(deliverInformation));
    deliverInformationCopy[type] = value;
    dispatch({
      type: 'ticketOrderCartMgr/save',
      payload: {
        deliverInformation: deliverInformationCopy,
      },
    });
  };

  orderDolOffer = () => {
    const {
      dispatch,
      ticketOrderCartMgr: {
        orderIndex,
        offerIndex,
        deliverInformation = {},
        attractionProduct = [],
        editOrderOffer,
        generalTicketOrderData,
      },
    } = this.props;

    const orderDataGroup = generalTicketOrderData[orderIndex];
    const { themeParkCode, themeParkName } = orderDataGroup;

    const detail = editOrderOffer.offerInfo;
    let offerConstrain = 'offer';
    editOrderOffer.offerInfo.productGroup.forEach(item => {
      if (item.productType === 'Attraction') {
        item.productGroup.forEach(item2 => {
          if (item2.groupName === 'Attraction') {
            offerConstrain = item2.choiceConstrain;
          }
        });
      }
    });
    if (offerConstrain === 'Fixed') {
      this.orderDolOfferFixed();
      return true;
    }
    const { dateOfVisit, numOfGuests, priceRuleId } = detail;
    const { sessionTime } = editOrderOffer.orderInfo[0];
    const orderInfoList = [];
    attractionProduct.forEach(item => {
      const { ticketNumber, numOfPax } = item;
      orderInfoList.push({
        numOfPax,
        sessionTime: isSessionProduct(priceRuleId, item) ? sessionTime : undefined,
        ageGroup: item.attractionProduct.ageGroup,
        quantity: ticketNumber || 0,
        pricePax: calculateProductPrice(item, priceRuleId, sessionTime),
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
      orderInfo: orderInfoList,
      offerInfo: { ...detail, selectRuleId: priceRuleId },
      deliveryInfo: deliverInformation,
    };
    dispatch({
      type: 'ticketOrderCartMgr/settingPackAgeTicketOrderData',
      payload: {
        orderIndex,
        offerIndex,
        orderData,
      },
    });

    this.onClose();
  };

  orderDolOfferFixed = () => {
    const {
      dispatch,
      ticketOrderCartMgr: {
        orderIndex,
        offerIndex,
        deliverInformation = {},
        attractionProduct = [],
        editOrderOffer,
        generalTicketOrderData,
      },
    } = this.props;
    const orderDataGroup = generalTicketOrderData[orderIndex];
    const { themeParkCode, themeParkName } = orderDataGroup;
    const detail = editOrderOffer.offerInfo;
    const { dateOfVisit, numOfGuests } = detail;
    const { offerQuantity } = editOrderOffer.offerInfo;
    const priceRuleId = editOrderOffer.orderSummary.selectPriceRuleId;
    const { sessionTime } = editOrderOffer.orderInfo[0];
    const orderInfoList = [];
    attractionProduct.forEach(item => {
      orderInfoList.push({
        numOfPax: item.numOfPax,
        sessionTime: isSessionProduct(priceRuleId, item) ? sessionTime : undefined,
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
      orderInfo: orderInfoList,
      offerInfo: { ...detail },
      deliveryInfo: deliverInformation,
    };
    dispatch({
      type: 'ticketOrderCartMgr/settingGeneralTicketOrderData',
      payload: {
        orderIndex,
        offerIndex,
        orderData,
      },
    });
    this.onClose();
  };

  order = () => {
    const {
      dispatch,
      ticketOrderCartMgr: {
        orderIndex,
        offerIndex,
        deliverInformation = {},
        attractionProduct = [],
        editOrderOffer,
        generalTicketOrderData,
      },
    } = this.props;

    const orderDataGroup = generalTicketOrderData[orderIndex];
    const { themeParkCode, themeParkName } = orderDataGroup;
    if (themeParkCode === 'DOL') {
      this.orderDolOffer();
      return;
    }

    const detail = editOrderOffer.offerInfo;
    let offerConstrain = 'offer';
    editOrderOffer.offerInfo.productGroup.forEach(item => {
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
    const { dateOfVisit, numOfGuests, priceRuleId } = detail;
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
    const type =
      attractionProduct.length === 1
        ? 'ticketOrderCartMgr/settingGeneralTicketOrderData'
        : 'ticketOrderCartMgr/settingPackAgeTicketOrderData';
    dispatch({
      type,
      payload: {
        orderIndex,
        offerIndex,
        orderData,
      },
    });

    this.onClose();
  };

  orderFixedOffer = () => {
    const {
      dispatch,
      ticketOrderCartMgr: {
        orderIndex,
        offerIndex,
        deliverInformation = {},
        attractionProduct = [],
        editOrderOffer,
        generalTicketOrderData,
      },
    } = this.props;
    const orderDataGroup = generalTicketOrderData[orderIndex];
    const { themeParkCode, themeParkName } = orderDataGroup;
    const detail = editOrderOffer.offerInfo;
    const { dateOfVisit, numOfGuests } = detail;
    const { offerQuantity } = editOrderOffer.offerInfo;
    const priceRuleId = editOrderOffer.orderSummary.selectPriceRuleId;
    const orderInfo = [];
    attractionProduct.forEach(item => {
      orderInfo.push({
        numOfPax: item.numOfPax,
        ageGroup: item.attractionProduct.ageGroup,
        quantity: 1,
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
      offerInfo: { ...detail },
      deliveryInfo: deliverInformation,
    };
    dispatch({
      type: 'ticketOrderCartMgr/settingGeneralTicketOrderData',
      payload: {
        orderIndex,
        offerIndex,
        orderData,
      },
    });
    this.onClose();
  };

  bundleOrder = () => {
    const {
      dispatch,
      ticketOrderCartMgr: {
        orderIndex,
        offerIndex,
        deliverInformation = {},
        bundleOfferDetail: { offers = [], dateOfVisit, numOfGuests, bundleName },
        generalTicketOrderData,
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
        pricePax: calculateAllProductPrice(attractionProduct, priceRuleId, null, detail),
        offerInfo: {
          ...detail,
        },
      };
    });
    const orderDataGroup = generalTicketOrderData[orderIndex];
    const { themeParkCode, themeParkName } = orderDataGroup;
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
        orderIndex,
        offerIndex,
        orderData,
      },
    });
    this.onClose();
  };

  changeBundleOfferNumber = async (index, value) => {
    const {
      dispatch,
      ticketOrderCartMgr: {
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
        type: 'ticketOrderCartMgr/save',
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

  changeFixedOfferNumbers = value => {
    const {
      dispatch,
      ticketOrderCartMgr: { editOrderOffer },
    } = this.props;
    const editOrderOfferNew = JSON.parse(JSON.stringify(editOrderOffer));
    editOrderOfferNew.offerInfo.offerQuantity = value;
    dispatch({
      type: 'ticketOrderCartMgr/save',
      payload: {
        editOrderOffer: editOrderOfferNew,
      },
    });
  };

  render() {
    const {
      global: {
        userCompanyInfo: { companyType },
      },
      ticketOrderCartMgr: {
        showToCartModalType,
        showToCartModal = false,
        showBundleToCart = false,
        editOrderOffer = {},
        generalTicketOrderData = [],
        attractionProduct = [],
        deliverInformation = {},
        bundleOfferDetail = {},
        functionActive,
      },
      form,
    } = this.props;
    const activeKeyList = this.getActiveKeyList();
    let eventSession = null;
    if (editOrderOffer && editOrderOffer.orderInfo) {
      eventSession = editOrderOffer.orderInfo[0].sessionTime;
    }

    return (
      <Collapse
        bordered={false}
        defaultActiveKey={activeKeyList}
        expandIcon={({ isActive }) => (
          <Icon
            style={{ color: '#FFF', right: 15, textAlign: 'right' }}
            type="up"
            rotate={isActive ? 0 : 180}
          />
        )}
      >
        {generalTicketOrderData.map((orderData, orderIndex) => {
          const keyV = `${orderData.themeParkCode}_${orderIndex}`;
          return (
            <Collapse.Panel
              className={styles.collapsePanelStyles}
              key={keyV}
              header={
                <span className={styles.collapsePanelHeaderStyles}>{orderData.themeParkName}</span>
              }
            >
              <OrderItemCollapse
                form={form}
                functionActive={functionActive}
                companyType={companyType}
                orderIndex={orderIndex}
                orderData={orderData}
                changeOrderCheck={(orderIndexParam, onceAPirateOrder) => {
                  this.changeOrderCheck(orderIndexParam, onceAPirateOrder);
                }}
                operateButtonEvent={(opType, orderIndexParam, onceAPirateOrder) => {
                  this.operateButtonEvent(opType, orderIndexParam, onceAPirateOrder);
                }}
              />
            </Collapse.Panel>
          );
        })}
        {showToCartModal && showToCartModalType === 0 && (
          <ToCart
            eventSession={eventSession}
            attractionProduct={attractionProduct}
            detail={editOrderOffer.offerInfo}
            onClose={this.onClose}
            changeTicketNumber={this.changeTicketNumber}
            order={this.order}
            deliverInformation={deliverInformation}
            changeDeliveryInformation={(type, value) => this.changeDeliveryInformation(type, value)}
            changeFixedOfferNumbers={this.changeFixedOfferNumbers}
            modify
          />
        )}
        {showBundleToCart ? (
          <BundleToCart
            {...bundleOfferDetail}
            onClose={this.onClose}
            order={this.bundleOrder}
            changeTicketNumber={this.changeBundleOfferNumber}
            deliverInformation={deliverInformation}
            changeDeliveryInformation={(type, value) => this.changeDeliveryInformation(type, value)}
            modify
          />
        ) : null}
      </Collapse>
    );
  }
}

export default GeneralTicketingCollapse;
