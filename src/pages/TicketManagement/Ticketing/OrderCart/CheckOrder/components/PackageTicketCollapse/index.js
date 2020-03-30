import React, { Component } from 'react';
import { Icon, Collapse, Form, message } from 'antd';
import { connect } from 'dva';
import styles from '../../index.less';
import OrderItemCollapse from './components/OrderItemCollapse';
import ToCart from '@/pages/TicketManagement/Ticketing/CreateOrder/components/AttractionToCart';
import { arrToString, calculateTicketPrice } from '@/pages/TicketManagement/utils/utils';

@Form.create()
@connect(({ global, ticketOrderCartMgr }) => ({
  global,
  ticketOrderCartMgr,
}))
class PackageTicketingCollapse extends Component {
  constructor(props) {
    super(props);
  }

  operateButtonEvent = (opType, orderIndex, offerIndex) => {
    const {
      dispatch,
      ticketOrderCartMgr: { packageOrderData = [] },
    } = this.props;
    if (opType === 'delete' && offerIndex !== null) {
      const orderItem = packageOrderData[orderIndex].orderOfferList[offerIndex];
      const amount = packageOrderData[orderIndex].orderOfferList.length;
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
          if (amount === 1) {
            dispatch({
              type: 'ticketOrderCartMgr/save',
              payload: {
                packageOrderData: [],
              },
            });
          }
          message.success('Delete successfully!');
        }
      });
    } else if (opType === 'edit') {
      const editOrderOffer = packageOrderData[orderIndex].orderOfferList[offerIndex];
      const attractionProduct = editOrderOffer.orderInfo.map(orderInfo => {
        return Object.assign({}, orderInfo.productInfo);
      });
      const deliverInfomation = { ...editOrderOffer.deliveryInfo };
      dispatch({
        type: 'ticketOrderCartMgr/save',
        payload: {
          showToCartModalType: 1,
          showToCartModal: true,
          orderIndex: offerIndex,
          editOrderOffer,
          attractionProduct,
          deliverInfomation,
        },
      });
    }
  };

  changeOrderCheck = (orderIndex, orderData) => {
    const {
      dispatch,
      ticketOrderCartMgr: { packageOrderData = [] },
    } = this.props;
    Object.assign(packageOrderData, {
      [orderIndex]: {
        ...orderData,
      },
    });
    dispatch({
      type: 'ticketOrderCartMgr/ticketOrderCheckSave',
      payload: {
        packageOrderData,
      },
    });
  };

  onClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketOrderCartMgr/save',
      payload: {
        showToCartModal: false,
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
      type: 'ticketOrderCartMgr/settingPackAgeTicketOrderData',
      payload: {
        orderIndex,
        orderData,
      },
    });
    this.onClose();
  };

  render() {
    const {
      global: {
        userCompanyInfo: { companyType },
      },
      ticketOrderCartMgr: {
        showToCartModalType,
        countrys,
        showToCartModal = false,
        editOrderOffer = {},
        packageOrderData = [],
        attractionProduct = [],
        deliverInfomation = {},
      },
      form,
    } = this.props;

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
        defaultActiveKey={['PackageCollapsePanel']}
        expandIcon={({ isActive }) => (
          <Icon
            style={{ color: '#FFF', right: 15, textAlign: 'right' }}
            type="up"
            rotate={isActive ? 0 : 180}
          />
        )}
      >
        <Collapse.Panel
          className={styles.collapsePanelStyles}
          key="PackageCollapsePanel"
          header={<span className={styles.collapsePanelHeaderStyles}>Attraction Package</span>}
        >
          {packageOrderData.map((orderData, orderIndex) => (
            <OrderItemCollapse
              key={`PackageOrderItemCollapse_${orderIndex}`}
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
          ))}
        </Collapse.Panel>
        {showToCartModal && showToCartModalType === 1 && (
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
          />
        )}
      </Collapse>
    );
  }
}

export default PackageTicketingCollapse;
