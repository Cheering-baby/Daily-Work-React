import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Checkbox, Col, Collapse, message, Modal, Row, Tooltip } from 'antd';
import styles from './index.less';
import Voucher from '../../assets/Voucher.png';
import { toThousandsByRound } from '@/pages/TicketManagement/utils/orderCartUtil';
import { getProductLimitInventory } from '@/pages/TicketManagement/utils/utils';
import { sessionTimeToWholeDay, matchDictionaryName } from '../../../../utils/utils';
import { getAttractionProductList } from '@/pages/TicketManagement/utils/ticketOfferInfoUtil';

const { confirm } = Modal;

@connect(({ global, ticketOrderCartMgr, ticketMgr }) => ({
  global,
  ticketOrderCartMgr,
  languageEnum: ticketMgr.languageEnum,
}))
class OrderItemCollapse extends Component {
  getOfferName = (orderOfferItem, bookingCategory) => {
    let offerNameStr = '-';
    if (bookingCategory !== 'OAP') {
      if (orderOfferItem.orderType === 'offerBundle') {
        offerNameStr = this.getBundleTitleNameStr(orderOfferItem);
      } else {
        offerNameStr = this.getOfferTitleNameStr(orderOfferItem);
      }
    } else {
      offerNameStr = this.getOAPOfferTitleNameStr(orderOfferItem);
    }
    return offerNameStr;
  };

  getOAPOfferTitleNameStr = orderOffer => {
    if (
      orderOffer &&
      orderOffer.orderOfferList[0].offerInfo &&
      orderOffer.orderOfferList[0].offerInfo.offerName
    ) {
      return orderOffer.orderOfferList[0].offerInfo.offerName;
    }
    return '-';
  };

  getOfferTitleNameStr = orderOffer => {
    if (orderOffer && orderOffer.offerInfo && orderOffer.offerInfo.offerBasicInfo) {
      return orderOffer.offerInfo.offerBasicInfo.offerName;
    }
    return '-';
  };

  getBundleTitleNameStr = orderOffer => {
    if (orderOffer && orderOffer.bundleName) {
      return orderOffer.bundleName;
    }
    return '-';
  };

  getSessionTime = (orderOffer, bookingCategory) => {
    const sessionTimeList = [];
    if (bookingCategory !== 'OAP') {
      if (orderOffer.orderInfo) {
        orderOffer.orderInfo.forEach(orderInfoItem => {
          if (orderInfoItem.quantity > 0) {
            sessionTimeList.push(
              orderInfoItem.sessionTime ? sessionTimeToWholeDay(orderInfoItem.sessionTime) : '-'
            );
          }
        });
      }
    } else {
      const sessionTime = this.getOAPSessionTimeStr(orderOffer);
      sessionTimeList.push(sessionTimeToWholeDay(sessionTime));
    }
    return sessionTimeList;
  };

  getOAPOrderTimeStr = onceAPirateOrder => {
    if (onceAPirateOrder && onceAPirateOrder.queryInfo.dateOfVisit) {
      return moment(onceAPirateOrder.queryInfo.dateOfVisit, 'x').format('DD-MMM-YYYY');
    }
    return '-';
  };

  getOAPSessionTimeStr = onceAPirateOrder => {
    if (onceAPirateOrder && onceAPirateOrder.queryInfo.sessionTime) {
      return sessionTimeToWholeDay(onceAPirateOrder.queryInfo.sessionTime);
    }
    return '-';
  };

  getOrderTime = (orderOffer, bookingCategory) => {
    let titleNameStr = '-';
    if (bookingCategory !== 'OAP') {
      if (orderOffer.queryInfo && orderOffer.queryInfo.dateOfVisit) {
        titleNameStr = moment(orderOffer.queryInfo.dateOfVisit, 'x').format('DD-MMM-YYYY');
      }
    } else {
      titleNameStr = this.getOAPOrderTimeStr(orderOffer);
    }
    return titleNameStr;
  };

  getTicketType = (orderOfferItem, bookingCategory) => {
    const ticketTypeList = [];
    if (bookingCategory !== 'OAP') {
      if (orderOfferItem.orderType === 'offerBundle') {
        orderOfferItem.orderInfo.forEach(orderInfoItem => {
          if (orderInfoItem.quantity > 0) {
            let itemName = '-';
            if (orderInfoItem.offerInfo && orderInfoItem.offerInfo.offerBundle) {
              itemName = orderInfoItem.offerInfo.offerBundle[0].bundleLabel || 'General';
            }
            const ticketType = {
              itemName,
              itemQuantity: orderInfoItem.ageGroupQuantity || 1,
            };
            ticketTypeList.push(ticketType);
          }
        });
      } else {
        orderOfferItem.orderInfo.forEach(orderInfoItem => {
          const { quantity } = orderInfoItem;
          if (quantity > 0) {
            const ticketType = {
              itemName: orderInfoItem.ageGroup || 'General',
              itemQuantity: orderInfoItem.ageGroupQuantity || 1,
            };
            ticketTypeList.push(ticketType);
          }
        });
      }
    } else {
      // OAP no TicketType
      const ticketType = {
        itemName: 'Meals Voucher',
        itemQuantity: orderOfferItem.orderOfferList[0].orderInfo.orderQuantity,
      };
      ticketTypeList.push(ticketType);
    }
    return ticketTypeList;
  };

  getPricePax = (orderOfferItem, bookingCategory) => {
    const pricePaxList = [];
    if (bookingCategory !== 'OAP') {
      if (orderOfferItem.orderType === 'offerFixed') {
        const pricePax = Number(orderOfferItem.orderSummary.pricePax).toFixed(2);
        pricePaxList.push(`${toThousandsByRound(pricePax)}/Package`);
      } else {
        orderOfferItem.orderInfo.forEach(orderInfoItem => {
          const { productInfo } = orderInfoItem;
          const priceTag = productInfo && productInfo.onlyVoucher ? 'Voucher' : 'Ticket';
          if (orderInfoItem.quantity > 0) {
            const pricePax = Number(orderInfoItem.pricePax).toFixed(2);
            let pricePaxStr = '-';
            if (orderOfferItem.orderType === 'offerBundle') {
              pricePaxStr = `${toThousandsByRound(pricePax)}/Package`;
            } else {
              pricePaxStr = `${toThousandsByRound(pricePax)}/${priceTag}`;
            }
            pricePaxList.push(pricePaxStr);
          }
        });
      }
    } else {
      // OAP no TicketType
      const pricePax = Number(orderOfferItem.orderOfferList[0].orderInfo.pricePax).toFixed(2);
      pricePaxList.push(`${toThousandsByRound(pricePax)}/Package`);
    }
    return pricePaxList;
  };

  getQuantityPax = (orderOfferItem, bookingCategory) => {
    const quantityList = [];
    if (bookingCategory !== 'OAP') {
      if (orderOfferItem.orderType === 'offerFixed') {
        quantityList.push(orderOfferItem.orderSummary.quantity);
      } else {
        orderOfferItem.orderInfo.forEach(orderInfoItem => {
          if (orderInfoItem.quantity > 0) {
            quantityList.push(orderInfoItem.quantity);
          }
        });
      }
    } else {
      // OAP no TicketType
      quantityList.push(orderOfferItem.orderOfferList[0].orderInfo.orderQuantity);
    }
    return quantityList;
  };

  getSubTotal = (orderOfferItem, bookingCategory) => {
    const subTotalList = [];
    if (bookingCategory !== 'OAP') {
      if (orderOfferItem.orderType === 'offerFixed') {
        subTotalList.push(
          toThousandsByRound(Number(orderOfferItem.orderSummary.totalPrice).toFixed(2))
        );
      } else {
        orderOfferItem.orderInfo.forEach(orderInfoItem => {
          if (orderInfoItem.quantity > 0) {
            const priceTotal = Number(orderInfoItem.pricePax * orderInfoItem.quantity).toFixed(2);
            subTotalList.push(toThousandsByRound(priceTotal));
          }
        });
      }
    } else {
      // OAP no TicketType
      const offerSumPriceInfo = orderOfferItem.orderOfferList[0].orderInfo.pricePax;
      const orderQuantityInfo = orderOfferItem.orderOfferList[0].orderInfo.orderQuantity;
      const priceTotal = Number(offerSumPriceInfo * orderQuantityInfo).toFixed(2);
      subTotalList.push(toThousandsByRound(priceTotal));
    }
    return subTotalList;
  };

  getVoucherList = (orderOfferItem, bookingCategory) => {
    const voucherList = [];
    if (bookingCategory !== 'OAP') {
      if (orderOfferItem.orderType === 'offerBundle') {
        orderOfferItem.orderInfo.forEach(orderInfoItem => {
          const offerProfile = orderInfoItem.offerInfo;
          this.setVoucherByOfferProfile(offerProfile, orderOfferItem, bookingCategory, voucherList);
        });
      } else if (orderOfferItem.orderType === 'offerFixed') {
        const offerProfile = orderOfferItem.offerInfo;
        this.setVoucherByOfferProfile(offerProfile, orderOfferItem, bookingCategory, voucherList);
      } else {
        const offerProfile = orderOfferItem.offerInfo;
        this.setVoucherByOfferProfile(offerProfile, orderOfferItem, bookingCategory, voucherList);
      }
    }
    return voucherList;
  };

  setVoucherByOfferProfile = (offerProfile, orderOfferItem, bookingCategory, voucherList) => {
    if (!offerProfile || !offerProfile.productGroup) {
      return null;
    }
    offerProfile.productGroup.forEach(productGroupInfo => {
      if (productGroupInfo.productType === 'Attraction') {
        productGroupInfo.productGroup.forEach(productGroupItem => {
          if (productGroupItem.groupName === 'Voucher') {
            productGroupItem.products.forEach(productObj => {
              const showDataItem = {
                voucherName: productObj.productName,
                visitDate: this.getOrderTime(orderOfferItem, bookingCategory),
                session: '-',
                ticketType: `Voucher(${productObj.attractionProduct.voucherQtyType})`,
                price: '0.00/Voucher',
                quantity: this.getVoucherTicketQuantity(
                  offerProfile.offerNo,
                  productObj.needChoiceCount,
                  orderOfferItem,
                  bookingCategory,
                  productObj.attractionProduct.voucherQtyType
                ),
                subTotal: '0.00',
              };
              voucherList.push(showDataItem);
            });
          }
        });
      }
    });
  };

  getVoucherTicketQuantity = (
    offerNo,
    needChoiceCount,
    orderOfferItem,
    bookingCategory,
    voucherQtyType
  ) => {
    let quantitySum = 0;
    let voucherTicketQuantity = 0;
    if (bookingCategory !== 'OAP') {
      let quantityList = this.getQuantityPax(orderOfferItem, bookingCategory);
      if (orderOfferItem.orderType === 'offerBundle') {
        const matchOffer = orderOfferItem.orderInfo.filter(i => i.offerInfo.offerNo === offerNo);
        quantityList = this.getQuantityPax(
          { ...orderOfferItem, orderInfo: matchOffer },
          bookingCategory
        );
        if (voucherQtyType === 'By Package') {
          quantityList.forEach(quantityV => {
            quantitySum += quantityV;
          });
          voucherTicketQuantity = quantitySum * needChoiceCount;
        } else if (voucherQtyType === 'By Ticket') {
          const ticketTypeList = [];
          orderOfferItem.orderInfo.forEach(orderInfoItem => {
            if (orderInfoItem.quantity > 0) {
              const itemQuantity = getAttractionProductList(
                orderInfoItem.offerInfo,
                moment(orderOfferItem.queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD')
              ).reduce((total, i) => total + i.needChoiceCount, 0);
              const ticketType = {
                itemQuantity: itemQuantity || 1,
              };
              ticketTypeList.push(ticketType);
            }
          });
          quantityList.forEach((quantityV, index) => {
            quantitySum += quantityV * ticketTypeList[index].itemQuantity;
          });
          voucherTicketQuantity = quantitySum * needChoiceCount;
        } else {
          voucherTicketQuantity = 1;
        }
      } else if (orderOfferItem.orderType !== 'offerBundle') {
        if (voucherQtyType === 'By Package') {
          if (orderOfferItem.orderType === 'offerFixed') {
            quantityList.forEach(quantityV => {
              quantitySum += quantityV;
            });
          } else {
            quantitySum = 1;
          }
          voucherTicketQuantity = quantitySum * needChoiceCount;
        } else if (voucherQtyType === 'By Ticket') {
          if (orderOfferItem.orderType === 'offerFixed') {
            const ticketTypeList = [];
            orderOfferItem.orderInfo.forEach(orderInfoItem => {
              if (orderInfoItem.quantity > 0) {
                const ticketType = {
                  itemQuantity: orderInfoItem.ageGroupQuantity || 1,
                };
                ticketTypeList.push(ticketType);
              }
            });
            let sumTicket = 0;
            ticketTypeList.forEach(ticketType => {
              sumTicket += ticketType.itemQuantity;
            });
            quantityList.forEach(quantityV => {
              quantitySum += quantityV * sumTicket;
            });
            voucherTicketQuantity = quantitySum * needChoiceCount;
          } else {
            const ticketTypeList = [];
            orderOfferItem.orderInfo.forEach(orderInfoItem => {
              if (orderInfoItem.quantity > 0) {
                const ticketType = {
                  itemQuantity: orderInfoItem.ageGroupQuantity || 1,
                };
                ticketTypeList.push(ticketType);
              }
            });
            quantityList.forEach((quantityV, index) => {
              quantitySum += quantityV * ticketTypeList[index].itemQuantity;
            });
            voucherTicketQuantity = quantitySum * needChoiceCount;
          }
        } else {
          voucherTicketQuantity = 1;
        }
      }
    }
    return voucherTicketQuantity;
  };

  getOAPOfferList = (orderOfferItem, bookingCategory) => {
    const oapOfferList = [];
    if (bookingCategory === 'OAP') {
      orderOfferItem.orderOfferList.forEach((orderOffer, index) => {
        if (index > 0) {
          const pricePax = Number(orderOffer.orderInfo.pricePax).toFixed(2);
          const offerSumPriceInfo = orderOffer.orderInfo.pricePax;
          const orderQuantityInfo = orderOffer.orderInfo.orderQuantity;
          const priceTotal = Number(offerSumPriceInfo * orderQuantityInfo).toFixed(2);
          const showDataItem = {
            offerName: orderOffer.offerInfo.offerName,
            visitDate: this.getOrderTime(orderOfferItem, bookingCategory),
            session: this.getSessionTime(orderOfferItem, bookingCategory),
            ticketType: `-`,
            price: `${toThousandsByRound(pricePax)}/Package`,
            quantity: orderOffer.orderInfo.orderQuantity,
            subTotal: toThousandsByRound(priceTotal),
          };
          oapOfferList.push(showDataItem);
        }
      });
    }
    return oapOfferList;
  };

  getLanguage = (orderOfferItem) => {
    if(orderOfferItem.orderType === 'offerBundle'){
      return orderOfferItem.language;
    }

    if(orderOfferItem.offerInfo) {
      return orderOfferItem.offerInfo.language;
    }

    return null;
  }

  transOfferDataToShowData = () => {
    const { orderDataItemIndex, bookingCategory, orderData } = this.props;
    if (!orderData || orderData.orderOfferList.length < 1) {
      return [];
    }
    const showDataList = [];
    
    orderData.orderOfferList.forEach((orderOfferItem, orderOfferItemIndex) => {
      const showDataItem = {
        orderDataItemIndex,
        orderOfferItemIndex,
        orderDisabled: orderOfferItem.orderDisabled,
        offerNo: 0,
        language: this.getLanguage(orderOfferItem),
        offerName: this.getOfferName(orderOfferItem, bookingCategory),
        visitDate: this.getOrderTime(orderOfferItem, bookingCategory),
        session: this.getSessionTime(orderOfferItem, bookingCategory),
        ticketType: this.getTicketType(orderOfferItem, bookingCategory),
        price: this.getPricePax(orderOfferItem, bookingCategory),
        quantity: this.getQuantityPax(orderOfferItem, bookingCategory),
        subTotal: this.getSubTotal(orderOfferItem, bookingCategory),
        orderOffer: orderOfferItem,
        voucherList: this.getVoucherList(orderOfferItem, bookingCategory),
        oapOfferList: this.getOAPOfferList(orderOfferItem, bookingCategory),
      };
      showDataList.push(showDataItem);
    });
    return showDataList;
  };

  allClickEvent = e => {
    e.stopPropagation();
  };

  deleteClickEvent = (e, offerIndex) => {
    e.stopPropagation();
    const { orderDataItemIndex, bookingCategory } = this.props;
    confirm({
      title: 'Are you sure you want to delete this item?',
      content: '',
      onOk: () => {
        if (bookingCategory !== 'OAP') {
          this.operateButtonEvent('delete', orderDataItemIndex, offerIndex);
        } else {
          this.operateOAPButtonEvent('delete', offerIndex, null);
        }
      },
      onCancel() {},
    });
  };

  editClickEvent = (e, offerIndex, orderOffer) => {
    e.stopPropagation();
    const { orderDataItemIndex, bookingCategory } = this.props;
    if (bookingCategory !== 'OAP') {
      this.operateButtonEvent('edit', orderDataItemIndex, offerIndex);
    } else {
      this.operateOAPButtonEvent('edit', offerIndex, orderOffer);
    }
  };

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
        const { bundleName, queryInfo, orderInfo, language } = editOrderOffer;
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
                sessionTime: orderInfoItem.sessionTime,
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
          language,
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
        const [minProductQuantity, maxProductQuantity] = getProductLimitInventory(
          editOrderOffer.offerInfo
        );
        attractionProduct.forEach(item => {
          item.minProductQuantity = minProductQuantity;
          item.maxProductQuantity = maxProductQuantity;
        });
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

  checkOrderEvent = (e, offerIndex, orderOffer) => {
    e.stopPropagation();
    const { checked } = e.target;
    const { orderDataItemIndex, orderData, bookingCategory } = this.props;
    if (bookingCategory !== 'OAP') {
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
      this.changeOrderCheck(orderDataItemIndex, orderData);
    } else {
      this.checkOAPOrderEvent(e, offerIndex, orderOffer);
    }
  };

  checkOAPOrderEvent = (e, offerIndex, orderOffer) => {
    e.stopPropagation();
    const { checked } = e.target;
    const onceAPirateOrder = orderOffer;
    onceAPirateOrder.orderOfferList.forEach(item => {
      item.orderCheck = checked;
    });
    const newOrderData = Object.assign(
      {},
      {
        ...onceAPirateOrder,
        indeterminate: false,
        orderAll: checked,
      }
    );
    this.changeOAPOrderCheck(offerIndex, newOrderData);
  };

  operateOAPButtonEvent = (opType, orderIndex, onceAPirateOrder) => {
    const {
      dispatch,
      ticketOrderCartMgr: { onceAPirateOrderData = [] },
    } = this.props;
    if (opType === 'delete' && orderIndex !== null) {
      const orderItem = onceAPirateOrderData[orderIndex];
      const removeOfferInstanceList = [];
      for (
        let orderOfferIndex = 0;
        orderOfferIndex < orderItem.orderOfferList.length;
        orderOfferIndex += 1
      ) {
        const offerDetail = orderItem.orderOfferList[orderOfferIndex];
        removeOfferInstanceList.push({
          offerNo: offerDetail.offerInfo.offerNo,
          offerInstanceId: offerDetail.offerInstanceId,
        });
      }
      dispatch({
        type: 'ticketOrderCartMgr/removeShoppingCart',
        payload: {
          offerInstances: removeOfferInstanceList,
          callbackFn: null,
        },
      }).then(resultCode => {
        if (resultCode === '0') {
          message.success('Deleted successfully.');
        }
      });
    } else if (opType === 'edit') {
      dispatch({
        type: 'ticketMgr/save',
        payload: {
          orderIndex,
          onceAPirateOrder,
        },
      });
      router.push({
        pathname: '/TicketManagement/Ticketing/CreateOrder',
        query: {
          operateType: 'editOnceAPirateOrder',
        },
      });
    }
  };

  changeOAPOrderCheck = (orderIndex, onceAPirateOrder) => {
    const {
      dispatch,
      ticketOrderCartMgr: { onceAPirateOrderData = [] },
    } = this.props;
    Object.assign(onceAPirateOrderData, {
      [orderIndex]: {
        ...onceAPirateOrder,
      },
    });
    dispatch({
      type: 'ticketOrderCartMgr/ticketOrderCheckSave',
      payload: {
        onceAPirateOrderData,
      },
    });
  };

  getOrderItemClassName = (itemIndex, orderCheck) => {
    if (itemIndex !== 0) {
      if (orderCheck) {
        return styles.orderItemTopDiv;
      }
      return styles.orderItemTopDiv2;
    }
    if (itemIndex === 0) {
      if (orderCheck) {
        return styles.orderItemDiv;
      }
      return styles.orderItemDiv2;
    }
  };

  render() {
    const {
      orderData,
      global: {
        userCompanyInfo: { companyType },
      },
      ticketOrderCartMgr: { functionActive },
      editModal,
      languageEnum = [],
    } = this.props;
    const showDataList = this.transOfferDataToShowData();

    return (
      <Row>
        <Col span={24} className={styles.collapseCol}>
          <Collapse bordered={false} defaultActiveKey={['uss']}>
            <Collapse.Panel
              key="uss"
              showArrow={false}
              header={
                <div className={styles.collapseTitleDiv}>
                  <span className={styles.collapseTitleSpan}>{orderData.themeParkName}</span>
                </div>
              }
            >
              {showDataList &&
                showDataList.map((showItem, itemIndex) => {
                  return (
                    <div
                      key={showItem.orderOfferItemIndex}
                      className={this.getOrderItemClassName(
                        itemIndex,
                        showItem.orderOffer.orderAll
                      )}
                    >
                      <Row className={styles.orderItemRow}>
                        <Col span={1} className={styles.checkboxCol}>
                          {editModal && !showItem.orderDisabled && (
                            <Checkbox
                              checked={showItem.orderOffer.orderAll}
                              indeterminate={showItem.orderOffer.indeterminate}
                              onClick={this.allClickEvent}
                              onChange={e => {
                                this.checkOrderEvent(
                                  e,
                                  showItem.orderOfferItemIndex,
                                  showItem.orderOffer
                                );
                              }}
                              disabled={showItem.orderDisabled}
                            />
                          )}
                          {editModal && showItem.orderDisabled && (
                            <Tooltip title="Visit Date is expired.">
                              <Checkbox disabled={showItem.orderDisabled} />
                            </Tooltip>
                          )}
                        </Col>
                        <Col span={4}>
                          <div className={styles.offerSpan}>{showItem.offerName}</div>
                          {showItem.language && (
                            <div className={styles.ticketSpan}>
                              Language:{' '}
                              {matchDictionaryName(
                                languageEnum,
                                showItem.language
                              )}
                            </div>
                          )}
                        </Col>
                        <Col span={3} className={styles.dateCol}>
                          <span className={styles.titleSpan}>{showItem.visitDate}</span>
                        </Col>
                        <Col span={2}>
                          {showItem.session &&
                            showItem.session.length > 0 &&
                            showItem.session.map((sessionItem, indexV) => {
                              const indexS = `session${itemIndex}${indexV}`;
                              return (
                                <p key={indexS} className={styles.ticketSpan}>
                                  {sessionTimeToWholeDay(sessionItem)}
                                </p>
                              );
                            })}
                          {showItem.session && showItem.session.length < 1 && '-'}
                        </Col>
                        <Col span={companyType === '01' ? 3 : 5}>
                          {showItem.ticketType &&
                            showItem.ticketType.length > 0 &&
                            showItem.ticketType.map((ticketTypeItem, indexV) => {
                              const indexS = `ticketType${itemIndex}${indexV}`;
                              return (
                                <p key={indexS} className={styles.ticketSpan}>
                                  {ticketTypeItem.itemName} * {ticketTypeItem.itemQuantity}
                                </p>
                              );
                            })}
                          {showItem.ticketType && showItem.ticketType.length < 1 && '-'}
                        </Col>
                        {companyType === '01' && (
                          <Col span={3} className={styles.priceCol}>
                            {showItem.price &&
                              showItem.price.length > 0 &&
                              showItem.price.map((priceItem, indexV) => {
                                const indexS = `price${itemIndex}${indexV}`;
                                return (
                                  <p key={indexS} className={styles.ticketSpan}>
                                    {priceItem}
                                  </p>
                                );
                              })}
                            {showItem.price && showItem.price.length < 1 && '-'}
                          </Col>
                        )}
                        <Col span={companyType === '01' ? 2 : 4} className={styles.dateCol}>
                          {showItem.quantity &&
                            showItem.quantity.length > 0 &&
                            showItem.quantity.map((quantityItem, indexV) => {
                              const indexS = `quantity${itemIndex}${indexV}`;
                              return (
                                // eslint-disable-next-line react/no-array-index-key
                                <p key={indexS} className={styles.ticketSpan}>
                                  {quantityItem}
                                </p>
                              );
                            })}
                          {showItem.quantity && showItem.quantity.length < 1 && '-'}
                        </Col>
                        {companyType === '01' && (
                          <Col span={3} className={styles.priceCol}>
                            {showItem.subTotal &&
                              showItem.subTotal.length > 0 &&
                              showItem.subTotal.map((subTotalItem, indexV) => {
                                const indexS = `subTotal${itemIndex}${indexV}`;
                                return (
                                  <p key={indexS} className={styles.ticketSpan}>
                                    {subTotalItem}
                                  </p>
                                );
                              })}
                            {showItem.subTotal && showItem.subTotal.length < 1 && '-'}
                          </Col>
                        )}
                        <Col span={2} className={styles.operateCol}>
                          {editModal && functionActive && (
                            <div>
                              {!showItem.orderDisabled && (
                                <Button
                                  className={styles.modifyButton}
                                  onClick={e => {
                                    this.editClickEvent(
                                      e,
                                      showItem.orderOfferItemIndex,
                                      showItem.orderOffer
                                    );
                                  }}
                                >
                                  Modify
                                </Button>
                              )}
                              <div>
                                <Button
                                  className={
                                    showItem.orderDisabled
                                      ? styles.deleteButton2
                                      : styles.deleteButton
                                  }
                                  onClick={e => {
                                    this.deleteClickEvent(e, showItem.orderOfferItemIndex);
                                  }}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          )}
                        </Col>
                      </Row>
                      {showItem.oapOfferList &&
                        showItem.oapOfferList.map((oapOffer, indexV) => {
                          const indexS = `oapOffer${itemIndex}${indexV}`;
                          return (
                            <Row
                              key={indexS}
                              className={styles.orderItemRow}
                              style={{ borderTop: '1px solid #d9d9d9' }}
                            >
                              <Col span={1} className={styles.checkboxCol} />
                              <Col span={4}>
                                <span className={styles.offerSpan}>{oapOffer.offerName}</span>
                              </Col>
                              <Col span={3} className={styles.dateCol}>
                                <span className={styles.titleSpan}>{oapOffer.visitDate}</span>
                              </Col>
                              <Col span={2}>
                                <span className={styles.titleSpan}>
                                  {sessionTimeToWholeDay(oapOffer.session)}
                                </span>
                              </Col>
                              <Col span={companyType === '01' ? 3 : 5}>
                                Meals Voucher * {oapOffer.quantity}
                              </Col>
                              {companyType === '01' && (
                                <Col span={3} className={styles.priceCol}>
                                  {oapOffer.price || '-'}
                                </Col>
                              )}
                              <Col span={companyType === '01' ? 2 : 4} className={styles.dateCol}>
                                {oapOffer.quantity || '-'}
                              </Col>
                              {companyType === '01' && (
                                <Col span={3} className={styles.priceCol}>
                                  {oapOffer.subTotal || '-'}
                                </Col>
                              )}
                              <Col span={2} className={styles.operateCol} />
                            </Row>
                          );
                        })}
                      {showItem.voucherList &&
                        showItem.voucherList.map((voucherInfo, indexV) => {
                          const indexS = `voucher${itemIndex}${indexV}`;
                          return (
                            <Row
                              key={indexS}
                              className={styles.orderItemRow}
                              style={{ borderTop: '1px solid #d9d9d9' }}
                            >
                              <Col span={1} className={styles.checkboxCol}>
                                <Tooltip title="Voucher">
                                  <img className={styles.voucherImg} src={Voucher} alt="Voucher" />
                                </Tooltip>
                              </Col>
                              <Col span={4}>
                                <span className={styles.offerSpan}>
                                  {voucherInfo.voucherName || '-'}
                                </span>
                              </Col>
                              <Col span={3} className={styles.dateCol}>
                                <span className={styles.titleSpan}>
                                  {voucherInfo.visitDate || '-'}
                                </span>
                              </Col>
                              <Col span={2}>
                                <span className={styles.titleSpan}>
                                  {sessionTimeToWholeDay(voucherInfo.session) || '-'}
                                </span>
                              </Col>
                              <Col span={companyType === '01' ? 3 : 5}>
                                <p className={styles.ticketSpan}>{voucherInfo.ticketType || '-'}</p>
                              </Col>
                              {companyType === '01' && (
                                <Col span={3} className={styles.priceCol}>
                                  <span className={styles.titleSpan}>
                                    {voucherInfo.price || '-'}
                                  </span>
                                </Col>
                              )}
                              <Col span={companyType === '01' ? 2 : 4} className={styles.dateCol}>
                                <span className={styles.titleSpan}>
                                  {voucherInfo.quantity || '-'}
                                </span>
                              </Col>
                              {companyType === '01' && (
                                <Col span={3} className={styles.priceCol}>
                                  <span className={styles.priceSpan}>0.00</span>
                                </Col>
                              )}
                            </Row>
                          );
                        })}
                    </div>
                  );
                })}
            </Collapse.Panel>
          </Collapse>
        </Col>
      </Row>
    );
  }
}

export default OrderItemCollapse;
