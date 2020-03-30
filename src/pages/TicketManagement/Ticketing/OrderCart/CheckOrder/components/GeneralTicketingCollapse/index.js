import React, { Component } from 'react';
import { Icon, Collapse, Form, message } from 'antd';
import { connect } from 'dva';
import styles from '../../index.less';
import OrderItemCollapse from './components/OrderItemCollapse';
import ToCart from '@/pages/TicketManagement/Ticketing/CreateOrder/components/AttractionToCart';
import BundleToCart from '@/pages/TicketManagement/Ticketing/CreateOrder/components/BundleToCart';
import {
  arrToString,
  calculateAllProductPrice,
  calculateTicketPrice,
} from '@/pages/TicketManagement/utils/utils';

@Form.create()
@connect(({ global, ticketOrderCartMgr }) => ({
  global,
  ticketOrderCartMgr,
}))
class GeneralTicketingCollapse extends Component {
  constructor(props) {
    super(props);
  }

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
          message.success('Delete successfully!');
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
            message.success('Delete successfully!');
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
        const deliverInfomation = { ...editOrderOffer.deliveryInfo };
        dispatch({
          type: 'ticketOrderCartMgr/save',
          payload: {
            showToCartModalType: 0,
            orderIndex,
            offerIndex,
            showBundleToCart: true,
            bundleOfferDetail,
            deliverInfomation,
          },
        });
      } else {
        const attractionProduct = [{ ...editOrderOffer.orderInfo[0].productInfo }];
        const deliverInfomation = { ...editOrderOffer.deliveryInfo };
        dispatch({
          type: 'ticketOrderCartMgr/save',
          payload: {
            showToCartModalType: 0,
            showToCartModal: true,
            orderIndex,
            offerIndex,
            editOrderOffer,
            attractionProduct,
            deliverInfomation,
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

  formatInputValue = (index, value, productInventory) => {
    const {
      ticketOrderCartMgr: { attractionProduct = [] },
    } = this.props;
    const originalValue = attractionProduct[index].ticketNumber;
    const testReg = /^[1-9]\d*$/;
    const testZero = /^0$/;
    if (
      value === '' ||
      testZero.test(value) ||
      (testReg.test(value) && value <= productInventory)
    ) {
      return value;
    }
    return originalValue;
  };

  changeTicketNumber = async (index, value, productPrice, productInventory) => {
    const {
      dispatch,
      ticketOrderCartMgr: { attractionProduct = [] },
    } = this.props;
    const originalValue = attractionProduct[index].ticketNumber;
    const attractionProductCopy = JSON.parse(JSON.stringify(attractionProduct));
    const testReg = /^[1-9]\d*$/;
    const testZero = /^0$/;
    if (
      value === '' ||
      testZero.test(value) ||
      (testReg.test(value) && value <= productInventory)
    ) {
      attractionProductCopy[index].ticketNumber = value;
      attractionProductCopy[index].price = calculateTicketPrice(value, productPrice);
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
      ticketOrderCartMgr: { deliverInfomation = {} },
    } = this.props;
    const deliverInfomationCopy = JSON.parse(JSON.stringify(deliverInfomation));
    deliverInfomationCopy[type] = value;
    dispatch({
      type: 'ticketOrderCartMgr/save',
      payload: {
        deliverInfomation: deliverInfomationCopy,
      },
    });
  };

  order = () => {
    const {
      dispatch,
      ticketOrderCartMgr: {
        orderIndex,
        offerIndex,
        deliverInfomation = {},
        attractionProduct = [],
        editOrderOffer,
      },
    } = this.props;
    const detail = editOrderOffer.offerInfo;
    const { dateOfVisit, numOfGuests } = detail;
    const { ticketNumber, price } = attractionProduct[0];
    const themeParkCode = attractionProduct[0].attractionProduct.themePark;
    const { themeParkName, ageGroup } = attractionProduct[0].attractionProduct;
    const orderInfo = [];
    orderInfo.push({
      ageGroup,
      quantity: ticketNumber,
      pricePax: price,
      productInfo: attractionProduct[0],
    });
    const orderData = {
      themeParkCode,
      themeParkName,
      queryInfo: {
        dateOfVisit,
        numOfGuests,
      },
      orderInfo,
      offerInfo: { ...detail },
      deliveryInfo: deliverInfomation,
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
        orderIndex,
        offerIndex,
        orderData,
      },
    });
    this.onClose();
  };

  changeBundleOfferNumber = async (index, value, productPrice) => {
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
      offersCopy[index].price = value * productPrice;
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

  render() {
    const {
      global: {
        userCompanyInfo: { companyType },
      },
      ticketOrderCartMgr: {
        countrys,
        showToCartModalType,
        showToCartModal = false,
        showBundleToCart = false,
        editOrderOffer = {},
        generalTicketOrderData = [],
        attractionProduct = [],
        deliverInfomation = {},
        bundleOfferDetail = {},
      },
      form,
    } = this.props;

    const activeKeyList = this.getActiveKeyList();

    const ticketTypeItems = [];
    const descriptionItems = [];
    let ticketType = '';
    let description = '';

    if (editOrderOffer && editOrderOffer.orderInfo) {
      attractionProduct.forEach(item => {
        ticketTypeItems.push(item.attractionProduct.ticketType);
        descriptionItems.push(item.attractionProduct.pluDesc);
      });
      ticketType = arrToString(ticketTypeItems);
      description = arrToString(descriptionItems);
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
        {generalTicketOrderData.map((orderData, orderIndex) => (
          <Collapse.Panel
            className={styles.collapsePanelStyles}
            key={`${orderData.themeParkCode}_${orderIndex}`}
            header={
              <span className={styles.collapsePanelHeaderStyles}>{orderData.themeParkName}</span>
            }
          >
            <OrderItemCollapse
              form={form}
              companyType={companyType}
              orderIndex={orderIndex}
              orderData={orderData}
              changeOrderCheck={(orderIndex, onceAPirateOrder) => {
                this.changeOrderCheck(orderIndex, onceAPirateOrder);
              }}
              operateButtonEvent={(opType, orderIndex, onceAPirateOrder) => {
                this.operateButtonEvent(opType, orderIndex, onceAPirateOrder);
              }}
            />
          </Collapse.Panel>
        ))}
        {showToCartModal && showToCartModalType === 0 && (
          <ToCart
            ticketType={ticketType}
            description={description}
            attractionProduct={attractionProduct}
            detail={editOrderOffer.offerInfo}
            onClose={this.onClose}
            changeTicketNumber={this.changeTicketNumber}
            formatInputValue={this.formatInputValue}
            priceRuleIndex={0}
            countrys={countrys}
            order={this.order}
            deliverInfomation={deliverInfomation}
            changeDeliveryInformation={(type, value) => this.changeDeliveryInformation(type, value)}
            initialAcceptTermsAndConditions
          />
        )}
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
      </Collapse>
    );
  }
}

export default GeneralTicketingCollapse;
