import React, { Component } from 'react';
import { connect } from 'dva';
import { Checkbox, Col, Row } from 'antd';
import styles from './index.less';
import ToCart from '@/pages/TicketManagement/Ticketing/CreateOrder/components/AttractionToCart';
import BundleToCart from '@/pages/TicketManagement/Ticketing/CreateOrder/components/BundleToCart';
import {
  calculateAllProductPrice,
  calculateProductPrice,
  calculateProductPriceGst,
  calculateAllProductPriceGst,
} from '@/pages/TicketManagement/utils/utils';
import OrderItemCollapse from './components/OrderItemCollapse';

@connect(({ global, ticketOrderCartMgr, ticketBookingAndPayMgr }) => ({
  global,
  ticketOrderCartMgr,
  ticketBookingAndPayMgr,
}))
class ShoppingCartOffer extends Component {
  getOrderData = () => {
    let orderData = [];
    const { editModal } = this.props;
    if (editModal) {
      const {
        ticketOrderCartMgr: { generalTicketOrderData = [], onceAPirateOrderData = [] },
      } = this.props;
      orderData = [...generalTicketOrderData];
      if (onceAPirateOrderData && onceAPirateOrderData.length > 0) {
        const oapData = {
          themePark: 'OAP',
          themeParkName: 'Once A Pirate',
          orderOfferList: [...onceAPirateOrderData],
        };
        orderData.push(oapData);
      }
    } else {
      const {
        ticketBookingAndPayMgr: { generalTicketOrderData = [], onceAPirateOrderData = [] },
      } = this.props;
      orderData = [...generalTicketOrderData];
      if (onceAPirateOrderData && onceAPirateOrderData.length > 0) {
        const oapData = {
          themePark: 'OAP',
          themeParkName: 'Once A Pirate',
          orderOfferList: [...onceAPirateOrderData],
        };
        orderData.push(oapData);
      }
    }

    return orderData;
  };

  clickSelectAll = e => {
    const { checked } = e.target;
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketOrderCartMgr/changeSelectAllOrder',
      payload: {
        selectAllOrder: checked,
        selectAllIndeterminate: false,
      },
    });
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
        sessionTime: item.sessionTime,
        ageGroup: item.attractionProduct.ageGroup,
        quantity: ticketNumber || 0,
        pricePax: ticketNumber ? calculateProductPrice(item, priceRuleId, item.sessionTime) : 0,
        gstAmountPax: ticketNumber ? calculateProductPriceGst(item, priceRuleId, item.sessionTime) : 0,
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
    console.log(orderData);
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
        sessionTime: item.sessionTime,
        numOfPax: item.numOfPax,
        ageGroup: item.attractionProduct.ageGroup,
        quantity: 1,
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
    console.log(orderData);
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
        sessionTime,
        ticketNumber: quantity,
        detail,
        detail: { priceRuleId },
        attractionProduct = [],
      } = item;
      return {
        sessionTime,
        quantity,
        pricePax: calculateAllProductPrice(attractionProduct, priceRuleId, sessionTime, detail),
        gstAmountPax: calculateAllProductPriceGst(attractionProduct, priceRuleId, sessionTime, detail),
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
    console.log(orderData);
    this.onClose();
  };

  render() {
    const {
      global: {
        userCompanyInfo: { companyType },
      },
      ticketOrderCartMgr: {
        selectAllOrder,
        selectAllIndeterminate,
        showToCartModalType,
        showToCartModal = false,
        showBundleToCart = false,
        editOrderOffer = {},
        attractionProduct = [],
        deliverInformation = {},
        bundleOfferDetail = {},
      },
      editModal,
    } = this.props;
    const orderData = this.getOrderData();
    return (
      <div className={companyType === '01' ? styles.cartOfferDiv : styles.cartOfferDiv2}>
        <Row className={styles.cartOfferTableRow}>
          <Col span={1} className={styles.checkboxCol}>
            {editModal && (
              <Checkbox
                value="SelectAll"
                onChange={this.clickSelectAll}
                checked={selectAllOrder}
                indeterminate={selectAllIndeterminate}
              />
            )}
          </Col>

          <Col span={4}>
            <span className={styles.titleSpan}>Offer Name</span>
          </Col>
          <Col span={3} className={styles.dateCol}>
            <span className={styles.titleSpan}>Visit Date</span>
          </Col>
          <Col span={2}>
            <span className={styles.titleSpan}>Session</span>
          </Col>
          <Col span={companyType === '01' ? 3 : 5}>
            <span className={styles.titleSpan}>Ticket Type</span>
          </Col>
          {companyType === '01' && (
            <Col span={3} className={styles.priceCol}>
              <span className={styles.titleSpan}>Price (SGD)</span>
            </Col>
          )}
          <Col span={companyType === '01' ? 2 : 4} className={styles.dateCol}>
            <span className={styles.titleSpan}>Quantity</span>
          </Col>
          {companyType === '01' && (
            <Col span={3} className={styles.priceCol}>
              <span className={styles.titleSpan}>Sub-Total (SGD)</span>
            </Col>
          )}
          {editModal && (
            <Col span={2} className={styles.operateCol}>
              <span className={styles.titleSpan}>Operation</span>
            </Col>
          )}
        </Row>
        {orderData &&
          orderData.map((orderDataItem, orderDataItemIndex) => {
            const indexS = `${orderDataItem.themePark}${orderDataItemIndex}`;
            return (
              <OrderItemCollapse
                key={indexS}
                bookingCategory={orderDataItem.themePark}
                orderDataItemIndex={orderDataItemIndex}
                orderData={orderDataItem}
                editModal={editModal}
              />
            );
          })}
        {showToCartModal && showToCartModalType === 0 && (
          <ToCart
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
      </div>
    );
  }
}

export default ShoppingCartOffer;
