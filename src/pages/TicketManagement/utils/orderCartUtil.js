import moment from 'moment';
import {
  getAttractionProductList,
  getVoucherProductList,
} from '@/pages/TicketManagement/utils/ticketOfferInfoUtil';

export function checkDateOfVisitForOutTime(dateOfVisit) {
  let checkPass = false;
  if (dateOfVisit) {
    const dateOfVisitTime = moment(dateOfVisit, 'x');
    const dateOfVisitTimeStr = dateOfVisitTime.format('YYYYMMDD');
    const nowTimeStr = moment().format('YYYYMMDD');
    if (Number.parseInt(dateOfVisitTimeStr, 10) < Number.parseInt(nowTimeStr, 10)) {
      checkPass = true;
    }
  }
  return checkPass;
}

export function transOrderToOfferInfos(
  orderType,
  offerNo,
  themeParkCode,
  themeParkName,
  orderItem
) {
  const offerInfos = [];

  const offerInstance = {
    offerNo,
    offerInstanceAttribute: {
      themeParkCode,
      themeParkName,
      orderType,
      orderInfo: JSON.stringify(orderItem),
    },
    offerProducts: [],
  };

  offerInfos.push(offerInstance);

  return offerInfos;
}

export function createOrderItemId() {
  const orderItemId = new Date().getTime();
  const s = [];
  const hexDigits = '123456789';
  for (let i = 0; i < 10; i += 1) {
    let str = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    if (i === 14) {
      str = '4';
    } else if (i === 19) {
      str = hexDigits.substr((str && 0x3) || 0x8, 1);
    } else if (i === 8 || i === 13 || i === 18 || i === 23) {
      str = '0';
    }
    s.push(str);
  }
  return orderItemId + s.join('');
}

export function demolitionOrder(orderItemId, orderData, orderOffer) {
  const { orderAll, indeterminate, voucherType, queryInfo } = orderData;

  return {
    packageId: orderItemId,
    packageInfo: {
      orderAll,
      indeterminate,
      voucherType,
      queryInfo,
    },
    orderDetail: orderOffer,
  };
}

export function demolitionBundleOrder(orderItemId, orderData, orderInfo) {
  const {
    orderAll,
    indeterminate,
    themeParkCode,
    themeParkName,
    orderType,
    queryInfo,
    bundleName,
    deliveryInfo,
  } = orderData;

  return {
    packageId: orderItemId,
    packageName: bundleName,
    packageInfo: {
      orderAll,
      indeterminate,
      themeParkCode,
      themeParkName,
      orderType,
      queryInfo,
      bundleName,
      deliveryInfo,
    },
    orderDetail: orderInfo,
  };
}

export function mergeBundleOrder(offerInstanceId, generalTicketOrderData, orderOfferItem) {
  let existOrderData = null;
  let existTicketOrderGroup = null;
  generalTicketOrderData.forEach(ticketOrderGroup => {
    if (ticketOrderGroup.themeParkCode === orderOfferItem.packageInfo.themeParkCode) {
      existTicketOrderGroup = ticketOrderGroup;
      ticketOrderGroup.orderOfferList.forEach(orderOffer => {
        if (orderOffer.packageId === orderOfferItem.packageId) {
          existOrderData = orderOffer;
        }
      });
    }
  });

  const { queryInfo } = orderOfferItem.packageInfo;
  const outTimeOffer = checkDateOfVisitForOutTime(queryInfo.dateOfVisit);

  orderOfferItem.orderDetail.orderCheck = !outTimeOffer;
  if (!existTicketOrderGroup) {
    const newOrderItem = {
      packageId: orderOfferItem.packageId,
      ...orderOfferItem.packageInfo,
      orderInfo: [
        {
          offerInstanceId,
          ...orderOfferItem.orderDetail,
          orderCheck: false,
        },
      ],
    };
    newOrderItem.orderAll = false;
    newOrderItem.orderDisabled = outTimeOffer;
    const newTicketOrderGroup = {
      themeParkCode: orderOfferItem.packageInfo.themeParkCode,
      themeParkName: orderOfferItem.packageInfo.themeParkName,
      orderOfferList: [newOrderItem],
    };
    generalTicketOrderData.push(newTicketOrderGroup);
  } else if (!existOrderData) {
    const newOrderItem = {
      packageId: orderOfferItem.packageId,
      ...orderOfferItem.packageInfo,
      orderInfo: [
        {
          offerInstanceId,
          ...orderOfferItem.orderDetail,
          orderCheck: false,
        },
      ],
    };
    newOrderItem.orderAll = false;
    newOrderItem.orderDisabled = outTimeOffer;
    existTicketOrderGroup.orderOfferList.push(newOrderItem);
  } else {
    existOrderData.orderAll = false;
    existOrderData.orderDisabled = outTimeOffer;
    existOrderData.orderInfo.push({
      offerInstanceId,
      ...orderOfferItem.orderDetail,
      orderCheck: false,
    });
  }
}

export function checkOutTimeDateOfVisit(dateOfVisit, sessionTime) {
  const dateOfVisitTime = moment(dateOfVisit, 'x');
  let dateOfVisitTimeStr = dateOfVisitTime.format('YYYY-MM-DD');
  dateOfVisitTimeStr = `${dateOfVisitTimeStr} ${sessionTime}`;
  const dateOfVisitTimeMoment = moment(dateOfVisitTimeStr, 'YYYY-MM-DD HH:mm:ss');
  const du = moment.duration(dateOfVisitTimeMoment - moment(), 'ms');
  const diffMinutes = du.asHours();
  if (diffMinutes < 3) {
    return true;
  }
  return false;
}

export function mergeOapOrder(offerInstanceId, onceAPirateOrderData, orderInfo) {
  const existOrderData = onceAPirateOrderData.find(
    orderData => orderData.packageId === orderInfo.packageId
  );

  const { voucherType, queryInfo } = orderInfo.packageInfo;
  let outTimeOffer = false;
  if (queryInfo.dateOfVisit) {
    outTimeOffer = checkDateOfVisitForOutTime(queryInfo.dateOfVisit);
    if (!outTimeOffer && voucherType !== '0') {
      const dateOfVisitTime = moment(queryInfo.dateOfVisit, 'x');
      let dateOfVisitTimeStr = dateOfVisitTime.format('YYYY-MM-DD');
      dateOfVisitTimeStr = `${dateOfVisitTimeStr} ${queryInfo.sessionTime}`;
      const dateOfVisitTimeMoment = moment(dateOfVisitTimeStr, 'YYYY-MM-DD HH:mm:ss');
      const du = moment.duration(dateOfVisitTimeMoment - moment(), 'ms');
      const diffMinutes = du.asHours();
      if (diffMinutes < 3) {
        outTimeOffer = true;
      }
    }
  }
  orderInfo.orderDetail.orderCheck = !outTimeOffer;
  if (onceAPirateOrderData.length === 0 || !existOrderData) {
    const newOrderItem = {
      packageId: orderInfo.packageId,
      ...orderInfo.packageInfo,
      orderOfferList: [
        {
          offerInstanceId,
          ...orderInfo.orderDetail,
          orderCheck: false,
        },
      ],
    };
    newOrderItem.orderAll = false;
    newOrderItem.orderDisabled = outTimeOffer;
    onceAPirateOrderData.push(newOrderItem);
  } else {
    existOrderData.orderOfferList.push({
      offerInstanceId,
      ...orderInfo.orderDetail,
      orderCheck: false,
    });
    existOrderData.orderAll = false;
    existOrderData.orderDisabled = outTimeOffer;
  }
}

export function transGetOrderList(offerInstanceList) {
  const resultData = {
    packageOrderData: [],
    generalTicketOrderData: [],
    onceAPirateOrderData: [],
  };

  offerInstanceList.forEach(offerInstance => {
    if (offerInstance.offerInstanceAttribute.themeParkCode === 'package') {
      if (resultData.packageOrderData.length === 0) {
        resultData.packageOrderData.push({
          themeParkCode: 'package',
          themeParkName: 'Attraction Package',
          orderOfferList: [],
        });
      }
      resultData.packageOrderData[0].orderOfferList.push({
        offerInstanceId: offerInstance.offerInstanceId,
        ...JSON.parse(offerInstance.offerInstanceAttribute.orderInfo),
      });
    } else if (offerInstance.offerInstanceAttribute.themeParkCode === 'OAP') {
      mergeOapOrder(offerInstance.offerInstanceId, resultData.onceAPirateOrderData, {
        ...JSON.parse(offerInstance.offerInstanceAttribute.orderInfo),
      });
    } else if (offerInstance.offerInstanceAttribute.orderType === 'offerBundle') {
      mergeBundleOrder(offerInstance.offerInstanceId, resultData.generalTicketOrderData, {
        ...JSON.parse(offerInstance.offerInstanceAttribute.orderInfo),
      });
    } else {
      let isNewOrder = true;
      const orderInfo = JSON.parse(offerInstance.offerInstanceAttribute.orderInfo);
      const { queryInfo } = orderInfo;
      const outTimeOffer = checkDateOfVisitForOutTime(queryInfo.dateOfVisit);
      orderInfo.orderAll = false;
      orderInfo.orderDisabled = outTimeOffer;
      orderInfo.orderInfo.forEach(orderInfoItem => {
        orderInfoItem.orderCheck = false;
      });
      resultData.generalTicketOrderData.forEach(orderDataItem => {
        if (offerInstance.offerInstanceAttribute.themeParkCode === orderDataItem.themeParkCode) {
          orderDataItem.orderOfferList.push({
            offerInstanceId: offerInstance.offerInstanceId,
            ...orderInfo,
          });
          isNewOrder = false;
        }
      });
      if (isNewOrder) {
        resultData.generalTicketOrderData.push({
          themeParkCode: offerInstance.offerInstanceAttribute.themeParkCode,
          themeParkName: offerInstance.offerInstanceAttribute.themeParkName,
          orderOfferList: [
            {
              offerInstanceId: offerInstance.offerInstanceId,
              ...orderInfo,
            },
          ],
        });
      }
    }
  });

  console.log(resultData);
  return resultData;
}

export function getOapOrderProductList(
  queryInfo,
  orderOffer,
  attractionProductList,
  voucherProductList,
  validTimeFrom
) {
  const orderProductList = [];

  // attraction
  attractionProductList.forEach(attractionProduct => {
    orderProductList.push({
      productNo: attractionProduct.productNo,
      numOfAttraction: 1,
      visitDate: validTimeFrom,
    });
  });
  // meals voucher
  let mealProductList = [];
  if (orderOffer.orderInfo.voucherType === '1') {
    mealProductList = orderOffer.orderInfo.groupSettingList;
  } else {
    mealProductList = orderOffer.orderInfo.individualSettingList;
  }
  mealProductList.forEach(mealProduct => {
    orderProductList.push({
      productNo: mealProduct.meals,
      numOfAttraction: mealProduct.number,
      visitDate: validTimeFrom,
    });
  });

  return orderProductList;
}

export function getCheckPackageOrderData(packageOrderData) {
  const orderList = [];
  packageOrderData.forEach(orderData => {
    const newOrderOfferList = [];
    orderData.orderOfferList.forEach(orderOffer => {
      if (orderOffer.orderInfo) {
        let orderCheckExist = false;
        const orderInfo = [];
        orderOffer.orderInfo.forEach(info => {
          if (info.orderCheck) {
            orderCheckExist = true;
            orderInfo.push(
              Object.assign(
                {},
                {
                  ...info,
                }
              )
            );
          }
        });
        if (orderCheckExist) {
          newOrderOfferList.push(
            Object.assign(
              {},
              {
                ...orderOffer,
                orderInfo,
              }
            )
          );
        }
      }
    });

    if (newOrderOfferList.length > 0) {
      orderList.push(
        Object.assign(
          {},
          {
            ...orderData,
            orderOfferList: newOrderOfferList,
          }
        )
      );
    }
  });

  return orderList;
}

export function getCheckOapOrderData(onceAPirateOrderData) {
  const orderList = [];
  onceAPirateOrderData.forEach(orderData => {
    const newOrderOfferList = [];
    orderData.orderOfferList.forEach(orderOffer => {
      if (orderOffer.orderCheck) {
        newOrderOfferList.push(
          Object.assign(
            {},
            {
              ...orderOffer,
            }
          )
        );
      }
    });
    if (newOrderOfferList.length > 0) {
      orderList.push(
        Object.assign(
          {},
          {
            ...orderData,
            orderOfferList: newOrderOfferList,
          }
        )
      );
    }
  });

  return orderList;
}


function getVoucherTicketQuantity(orderOffer) {
  let voucherTicketQuantity = 0;
  const dateOfVisit = moment(orderOffer.queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD')
  if (orderOffer.orderType === 'offerBundle') {
    orderOffer.orderInfo.forEach(orderInfoItem => {
      if (orderInfoItem.quantity > 0) {
        const voucherProductList = getVoucherProductList(
          orderInfoItem.offerInfo,
          dateOfVisit
        );
        const itemQuantity = getAttractionProductList(
          orderInfoItem.offerInfo,
          dateOfVisit
        ).reduce((total,i) => total + i.needChoiceCount, 0);
        voucherProductList.forEach(item => {
          const {
            attractionProduct: { voucherQtyType },
            needChoiceCount,
          } = item;
          if (voucherQtyType === 'By Package') {
            voucherTicketQuantity += orderInfoItem.quantity * needChoiceCount;
          } else if (voucherQtyType === 'By Ticket') {
            voucherTicketQuantity += itemQuantity * orderInfoItem.quantity * needChoiceCount;
          } else {
            voucherTicketQuantity += 1;
          }
        });
      }
    });
  } else {
    const voucherProductList = getVoucherProductList(
      orderOffer.offerInfo,
      dateOfVisit
    );
    let fixedProductTickets = 0;
    if(orderOffer.orderType === 'offerFixed'){
      orderOffer.orderInfo.forEach(info => {
        if (info.orderCheck) {
          const needChoiceCount = info.productInfo.needChoiceCount || 1;
          fixedProductTickets += 1 * needChoiceCount;
        }
      });
    }
    voucherProductList.forEach(item => {
      const {
        attractionProduct: { voucherQtyType },
        needChoiceCount,
      } = item;
      if (voucherQtyType === 'By Package') {
        if (orderOffer.orderType === 'offerFixed') {
          voucherTicketQuantity += orderOffer.orderSummary.quantity * needChoiceCount;
        } else {
          voucherTicketQuantity += 1 * needChoiceCount;
        }
      } else if (voucherQtyType === 'By Ticket') {
        if (orderOffer.orderType === 'offerFixed') {
          voucherTicketQuantity += fixedProductTickets * orderOffer.orderSummary.quantity * needChoiceCount;
        } else {
          let ticketAmount = 0;
          orderOffer.orderInfo.forEach(info => {
            if (info.orderCheck) {
              const needChoiceCountProduct = info.productInfo.needChoiceCount || 1;
              ticketAmount += info.quantity * needChoiceCountProduct;
            }
          });
          voucherTicketQuantity += ticketAmount * needChoiceCount;
        }
      } else {
        voucherTicketQuantity += 1;
      }
    });
  }
  return voucherTicketQuantity;
}


export function getCheckTicketAmount(
  packageOrderData,
  generalTicketOrderData,
  onceAPirateOrderData,
  includeVouchers,
) {
  const orderArray = [packageOrderData, generalTicketOrderData, onceAPirateOrderData];
  let ticketAmount = 0;
  orderArray.forEach((orderList, listIndex) => {
    orderList.forEach(orderData => {
      orderData.orderOfferList.forEach(orderOffer => {
        if (listIndex < 2 && orderOffer.orderInfo && orderOffer.orderType === 'offerBundle') {
          orderOffer.orderInfo.forEach(orderInfoItem => {
            if (orderInfoItem.orderCheck) {
              const { quantity, offerInfo } = orderInfoItem;
              const { queryInfo } = orderOffer;
              const validTimeFrom = moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD');
              const attractionProductList = getAttractionProductList(offerInfo, validTimeFrom);
              attractionProductList.forEach(attractionProduct => {
                ticketAmount += quantity * attractionProduct.needChoiceCount;
              });
            }
          });
          if(includeVouchers && orderOffer.orderAll) {
            ticketAmount += getVoucherTicketQuantity(orderOffer);
          }
        } else if (listIndex < 2 && orderOffer.orderInfo && orderOffer.orderType === 'offerFixed') {
          let offerTicketPax = 0;
          orderOffer.orderInfo.forEach(info => {
            if (info.orderCheck) {
              const needChoiceCount = info.productInfo.needChoiceCount || 1;
              offerTicketPax += 1 * needChoiceCount;
            }
          });
          ticketAmount += offerTicketPax * orderOffer.orderSummary.quantity;
          if(includeVouchers && orderOffer.orderAll) {
            ticketAmount += getVoucherTicketQuantity(orderOffer);
          }
        } else if (listIndex < 2 && orderOffer.orderInfo) {
          orderOffer.orderInfo.forEach(info => {
            if (info.orderCheck) {
              const needChoiceCount = info.productInfo.needChoiceCount || 1;
              ticketAmount += info.quantity * needChoiceCount;
            }
          });
          if(includeVouchers && orderOffer.orderAll) {
            ticketAmount += getVoucherTicketQuantity(orderOffer);
          }
        } else if (listIndex === 2) {
          if (orderOffer.orderCheck) {
            const needChoiceCount = 1;
            ticketAmount += orderOffer.orderInfo.orderQuantity * needChoiceCount;
            if(includeVouchers && orderOffer.orderCheck) {
              ticketAmount += 1;
            }
          }
        }
      });
    });
  });

  return ticketAmount;
}

export function transPackageCommonOffers(ticketOrderData, collectionDate, deliveryMode) {
  const commonOffers = [];

  ticketOrderData.forEach(orderData => {
    const { packageId, orderOfferList } = orderData;
    orderOfferList.forEach(orderOffer => {
      const { offerInstanceId, queryInfo, offerInfo, orderInfo, deliveryInfo } = orderOffer;
      const deliveryInfoData = {
        referenceNo: deliveryInfo.taNo,
        contactNo: deliveryInfo.customerContactNo,
        lastName: deliveryInfo.guestLastName,
        firstName: deliveryInfo.guestFirstName,
        country: deliveryInfo.country,
        email: deliveryInfo.customerEmail,
        collectionDate: collectionDate ? moment(collectionDate, 'x').format('YYYY-MM-DD') : null,
        deliveryMode,
      };
      let totalPrice = 0;
      const attractionProducts = [];
      orderInfo.forEach(orderInfoItem => {
        const { productInfo, pricePax, quantity } = orderInfoItem;
        totalPrice += pricePax * quantity;
        const needChoiceCount = productInfo.needChoiceCount || 1;
        const attractionProduct = {
          productNo: productInfo.productNo,
          patronInfo: deliveryInfo,
          numOfAttraction: 1 * needChoiceCount,
          visitDate: moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD'),
          numOfPax: orderInfoItem.quantity,
          cardDisplayName: null,
        };
        attractionProducts.push(attractionProduct);
      });
      const submitCommonOffer = {
        offerGroup: packageId,
        offerNo: offerInfo.offerNo,
        cartOfferId: offerInstanceId,
        priceRuleId: offerInfo.selectRuleId,
        offerCount: 1,
        attractionProducts,
        totalPrice,
        patronInfo: null,
        deliveryInfo: deliveryInfoData,
      };
      commonOffers.push(submitCommonOffer);
    });
  });

  return commonOffers;
}

export function checkIfGroupTicketByProduct(productInfo) {
  let result = false;
  if (productInfo && productInfo.attractionProduct && productInfo.attractionProduct.isGroupTicket) {
    if (
      productInfo.attractionProduct.isGroupTicket === 'Yes' ||
      productInfo.attractionProduct.isGroupTicket === 'true'
    ) {
      result = true;
    }
  }
  return result;
}

export function putAttractionProductsByOffer(
  attractionProducts,
  orderInfoList,
  queryInfo,
  deliveryInfoData
) {
  const patronInfoData = {
    lastName: deliveryInfoData.guestLastName,
    firstName: deliveryInfoData.guestFirstName,
    phoneNo: deliveryInfoData.customerContactNo
      ? `${deliveryInfoData.customerContactNoCountry}${deliveryInfoData.customerContactNo}`
      : null,
    nationality: deliveryInfoData.country,
    countryCode: deliveryInfoData.country,
    email: deliveryInfoData.customerEmailAddress,
    birth: deliveryInfoData.birth,
    address: deliveryInfoData.address,
    gender: deliveryInfoData.gender,
  };

  orderInfoList.forEach(orderInfo => {
    let timingStr = null;
    if (orderInfo.sessionTime) {
      const dateOfVisitTime = moment(queryInfo.dateOfVisit, 'x');
      let dateOfVisitTimeStr = dateOfVisitTime.format('YYYY-MM-DD');
      dateOfVisitTimeStr = `${dateOfVisitTimeStr} ${orderInfo.sessionTime}`;
      const dateOfVisitTimeMoment = moment(dateOfVisitTimeStr, 'YYYY-MM-DD HH:mm:ss');
      timingStr = dateOfVisitTimeMoment.format('HH:mm');
    }
    if (orderInfo.quantity && orderInfo.quantity > 0) {
      const { productInfo } = orderInfo;
      const ifGroup = checkIfGroupTicketByProduct(productInfo);
      if (!ifGroup) {
        const attractionProduct = {
          productNo: productInfo.productNo,
          patronInfo: patronInfoData,
          numOfAttraction: orderInfo.quantity,
          visitDate: moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD'),
          timing: timingStr,
          numOfPax: null,
          cardDisplayName: deliveryInfoData.cardDisplayName,
        };
        attractionProducts.push(attractionProduct);
      } else {
        const attractionProduct = {
          productNo: productInfo.productNo,
          patronInfo: patronInfoData,
          numOfAttraction: orderInfo.quantity,
          visitDate: moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD'),
          timing: timingStr,
          numOfPax: orderInfo.quantity,
          cardDisplayName: deliveryInfoData.cardDisplayName,
        };
        attractionProducts.push(attractionProduct);
      }
    }
  });
}

export function putVoucherToAttraction(attractionProducts, queryInfo, offerInfo, deliveryInfoData) {
  const patronInfoData = {
    lastName: deliveryInfoData.guestLastName,
    firstName: deliveryInfoData.guestFirstName,
    phoneNo: deliveryInfoData.customerContactNo,
    nationality: deliveryInfoData.country,
    countryCode: deliveryInfoData.country,
    email: deliveryInfoData.customerEmailAddress,
    birth: deliveryInfoData.birth,
    address: deliveryInfoData.address,
    gender: deliveryInfoData.gender,
  };
  const validTimeFrom = moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD');
  const voucherProductList = getVoucherProductList(offerInfo, validTimeFrom);
  if (voucherProductList) {
    voucherProductList.forEach(voucherProduct => {
      if (
        voucherProduct.attractionProduct.voucherQtyType &&
        voucherProduct.attractionProduct.voucherQtyType === 'By Package'
      ) {
        const attractionProduct = {
          productNo: voucherProduct.productNo,
          patronInfo: patronInfoData,
          numOfAttraction: 1,
          visitDate: validTimeFrom,
          numOfPax: null,
          cardDisplayName: deliveryInfoData.cardDisplayName,
        };
        attractionProducts.push(attractionProduct);
      }
    });
  }
}

export function putAttractionProductsByOfferBundle(
  attractionProducts,
  queryInfo,
  orderInfoItem,
  deliveryInfoData,
  quantity
) {
  const patronInfoData = {
    lastName: deliveryInfoData.guestLastName,
    firstName: deliveryInfoData.guestFirstName,
    phoneNo: deliveryInfoData.customerContactNo
      ? `${deliveryInfoData.customerContactNoCountry}${deliveryInfoData.customerContactNo}`
      : null,
    nationality: deliveryInfoData.country,
    countryCode: deliveryInfoData.country,
    email: deliveryInfoData.customerEmailAddress,
    birth: deliveryInfoData.birth,
    address: deliveryInfoData.address,
    gender: deliveryInfoData.gender,
  };
  const validTimeFrom = moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD');
  const { offerInfo, sessionTime } = orderInfoItem;
  let timingStr = null;
  if (sessionTime) {
    const dateOfVisitTime = moment(queryInfo.dateOfVisit, 'x');
    let dateOfVisitTimeStr = dateOfVisitTime.format('YYYY-MM-DD');
    dateOfVisitTimeStr = `${dateOfVisitTimeStr} ${sessionTime}`;
    const dateOfVisitTimeMoment = moment(dateOfVisitTimeStr, 'YYYY-MM-DD HH:mm:ss');
    timingStr = dateOfVisitTimeMoment.format('HH:mm');
  }
  const attractionProductList = getAttractionProductList(offerInfo, validTimeFrom);
  attractionProductList.forEach(productInfo => {
    const ifGroup = checkIfGroupTicketByProduct(productInfo);
    if (!ifGroup) {
      const attractionProduct = {
        productNo: productInfo.productNo,
        patronInfo: patronInfoData,
        timing: timingStr,
        numOfAttraction: 1,
        visitDate: validTimeFrom,
        numOfPax: null,
        cardDisplayName: deliveryInfoData.cardDisplayName,
      };
      attractionProducts.push(attractionProduct);
    } else {
      const attractionProduct = {
        productNo: productInfo.productNo,
        patronInfo: patronInfoData,
        timing: timingStr,
        numOfAttraction: 1,
        visitDate: validTimeFrom,
        numOfPax: quantity,
        cardDisplayName: deliveryInfoData.cardDisplayName,
      };
      attractionProducts.push(attractionProduct);
    }
  });
}

export function putCommonOffersByOfferBundle(
  commonOffers,
  orderOffer,
  collectionDate,
  deliveryMode
) {
  const { packageId, orderInfo, queryInfo, deliveryInfo = {} } = orderOffer;

  const deliveryInfoData = {
    referenceNo: deliveryInfo.taNo,
    contactNo: deliveryInfo.customerContactNo
      ? `${deliveryInfo.customerContactNoCountry}${deliveryInfo.customerContactNo}`
      : null,
    lastName: deliveryInfo.guestLastName,
    firstName: deliveryInfo.guestFirstName,
    country: deliveryInfo.country,
    email: deliveryInfo.customerEmailAddress,
    collectionDate: collectionDate ? moment(collectionDate, 'x').format('YYYY-MM-DD') : null,
    deliveryMode,
  };

  orderInfo.forEach(orderInfoItem => {
    const { offerInstanceId, offerInfo, pricePax, quantity } = orderInfoItem;
    if (quantity > 0) {
      const totalPrice = pricePax * quantity;
      const attractionProducts = [];
      putAttractionProductsByOfferBundle(
        attractionProducts,
        queryInfo,
        orderInfoItem,
        deliveryInfo,
        quantity
      );
      // putVoucherToAttraction(attractionProducts, queryInfo, offerInfo, deliveryInfo);
      const submitCommonOffer = {
        offerGroup: packageId,
        offerNo: offerInfo.offerNo,
        cartOfferId: offerInstanceId,
        priceRuleId: offerInfo.selectRuleId || offerInfo.priceRuleId,
        offerCount: quantity,
        attractionProducts,
        totalPrice,
        patronInfo: null,
        deliveryInfo: deliveryInfoData,
      };
      commonOffers.push(submitCommonOffer);
    }
  });
}

export function putCommonOffersByOfferFixed(
  commonOffers,
  orderOffer,
  collectionDate,
  deliveryMode
) {
  const {
    packageId,
    offerInstanceId,
    queryInfo,
    offerInfo,
    deliveryInfo = {},
    orderSummary,
    orderInfo,
  } = orderOffer;

  const deliveryInfoData = {
    referenceNo: deliveryInfo.taNo,
    contactNo: deliveryInfo.customerContactNo
      ? `${deliveryInfo.customerContactNoCountry}${deliveryInfo.customerContactNo}`
      : null,
    lastName: deliveryInfo.guestLastName,
    firstName: deliveryInfo.guestFirstName,
    country: deliveryInfo.country,
    email: deliveryInfo.customerEmailAddress,
    collectionDate: collectionDate ? moment(collectionDate, 'x').format('YYYY-MM-DD') : null,
    deliveryMode,
  };

  const patronInfoData = {
    lastName: deliveryInfo.guestLastName,
    firstName: deliveryInfo.guestFirstName,
    phoneNo: deliveryInfo.customerContactNo
      ? `${deliveryInfo.customerContactNoCountry}${deliveryInfo.customerContactNo}`
      : null,
    nationality: deliveryInfo.country,
    countryCode: deliveryInfo.country,
    email: deliveryInfo.customerEmailAddress,
    birth: deliveryInfo.birth,
    address: deliveryInfo.address,
    gender: deliveryInfo.gender,
  };

  const attractionProducts = [];
  let ifGroupTicket = false;
  const validTimeFrom = moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD');
  const attractionProductList = getAttractionProductList(offerInfo, validTimeFrom);

  attractionProductList.forEach(productInfo => {
    let timingStr = null;
    if (orderSummary.sessionTime) {
      const dateOfVisitTime = moment(queryInfo.dateOfVisit, 'x');
      let dateOfVisitTimeStr = dateOfVisitTime.format('YYYY-MM-DD');
      dateOfVisitTimeStr = `${dateOfVisitTimeStr} ${orderSummary.sessionTime}`;
      const dateOfVisitTimeMoment = moment(dateOfVisitTimeStr, 'YYYY-MM-DD HH:mm:ss');
      timingStr = dateOfVisitTimeMoment.format('HH:mm');
    }
    if (orderInfo) {
      orderInfo.forEach(orderInfoItem => {
        if (
          orderInfoItem.sessionTime &&
          orderInfoItem.productInfo &&
          orderInfoItem.productInfo.productNo === productInfo.productNo
        ) {
          const dateOfVisitTime = moment(queryInfo.dateOfVisit, 'x');
          let dateOfVisitTimeStr = dateOfVisitTime.format('YYYY-MM-DD');
          dateOfVisitTimeStr = `${dateOfVisitTimeStr} ${orderInfoItem.sessionTime}`;
          const dateOfVisitTimeMoment = moment(dateOfVisitTimeStr, 'YYYY-MM-DD HH:mm:ss');
          timingStr = dateOfVisitTimeMoment.format('HH:mm');
        }
      });
    }
    ifGroupTicket = checkIfGroupTicketByProduct(productInfo);
    if (!ifGroupTicket) {
      const attractionProduct = {
        productNo: productInfo.productNo,
        patronInfo: patronInfoData,
        timing: timingStr,
        numOfAttraction: 1,
        visitDate: validTimeFrom,
        numOfPax: null,
        cardDisplayName: deliveryInfo.cardDisplayName,
      };
      attractionProducts.push(attractionProduct);
    } else {
      const attractionProduct = {
        productNo: productInfo.productNo,
        patronInfo: patronInfoData,
        timing: timingStr,
        numOfAttraction: 1,
        visitDate: validTimeFrom,
        numOfPax: orderSummary.quantity,
        cardDisplayName: deliveryInfo.cardDisplayName,
      };
      attractionProducts.push(attractionProduct);
    }
  });
  // putVoucherToAttraction(attractionProducts, queryInfo, offerInfo, deliveryInfo);

  const submitCommonOffer = {
    offerGroup: packageId,
    offerNo: offerInfo.offerNo,
    cartOfferId: offerInstanceId,
    priceRuleId: offerInfo.selectRuleId || offerInfo.priceRuleId,
    offerCount: orderSummary.quantity,
    attractionProducts,
    totalPrice: orderSummary.totalPrice,
    patronInfo: null,
    deliveryInfo: deliveryInfoData,
  };
  commonOffers.push(submitCommonOffer);
}

export function putCommonOffersByOffer(commonOffers, orderOffer, collectionDate, deliveryMode) {
  const { packageId, offerInstanceId, queryInfo, offerInfo, orderInfo, deliveryInfo } = orderOffer;

  const deliveryInfoData = {
    referenceNo: deliveryInfo.taNo,
    contactNo: deliveryInfo.customerContactNo
      ? `${deliveryInfo.customerContactNoCountry}${deliveryInfo.customerContactNo}`
      : null,
    lastName: deliveryInfo.guestLastName,
    firstName: deliveryInfo.guestFirstName,
    country: deliveryInfo.country,
    email: deliveryInfo.customerEmailAddress,
    collectionDate: collectionDate ? moment(collectionDate, 'x').format('YYYY-MM-DD') : null,
    deliveryMode,
  };

  let totalPrice = 0;
  orderInfo.forEach(orderInfoItem => {
    const { pricePax, quantity } = orderInfoItem;
    totalPrice += pricePax * quantity;
  });

  const attractionProducts = [];
  putAttractionProductsByOffer(attractionProducts, orderInfo, queryInfo, deliveryInfo);
  // putVoucherToAttraction(attractionProducts, queryInfo, offerInfo, deliveryInfo);

  const submitCommonOffer = {
    offerGroup: packageId,
    offerNo: offerInfo.offerNo,
    cartOfferId: offerInstanceId,
    priceRuleId: offerInfo.selectRuleId || offerInfo.priceRuleId,
    offerCount: 1,
    attractionProducts,
    totalPrice,
    patronInfo: null,
    deliveryInfo: deliveryInfoData,
  };
  commonOffers.push(submitCommonOffer);
}

export function transBookingCommonOffers(ticketOrderData, collectionDate, deliveryMode) {
  const commonOffers = [];

  ticketOrderData.forEach(orderData => {
    orderData.orderOfferList.forEach(orderOffer => {
      const { orderType } = orderOffer;
      if (orderType === 'offerBundle') {
        putCommonOffersByOfferBundle(commonOffers, orderOffer, collectionDate, deliveryMode);
      } else if (orderType === 'offerFixed') {
        putCommonOffersByOfferFixed(commonOffers, orderOffer, collectionDate, deliveryMode);
      } else {
        putCommonOffersByOffer(commonOffers, orderOffer, collectionDate, deliveryMode);
      }
    });
  });

  return commonOffers;
}

export function transOapCommonOffers(
  onceAPirateOrderData,
  collectionDate,
  deliveryMode,
  patronInfo
) {
  const commonOffers = [];

  onceAPirateOrderData.forEach(orderData => {
    const { queryInfo, packageId } = orderData;
    const dateOfVisitTime = moment(queryInfo.dateOfVisit, 'x');
    let dateOfVisitTimeStr = dateOfVisitTime.format('YYYY-MM-DD');
    dateOfVisitTimeStr = `${dateOfVisitTimeStr} ${queryInfo.sessionTime}`;
    const dateOfVisitTimeMoment = moment(dateOfVisitTimeStr, 'YYYY-MM-DD HH:mm:ss');
    const timingStr = dateOfVisitTimeMoment.format('HH:mm');
    orderData.orderOfferList.forEach(orderOffer => {
      const { offerInstanceId, offerInfo, orderInfo } = orderOffer;
      const totalPrice = orderInfo.offerSumPrice;
      let mealsProductList = [];
      const commonProducts = [];
      const attractionProductList = getAttractionProductList(
        orderOffer.offerInfo.offerProfile,
        moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD')
      );
      attractionProductList.forEach(product => {
        const attractionProduct = {
          productNo: product.productNo,
          patronInfo,
          numOfAttraction: 1,
          visitDate: moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD'),
          timing: timingStr,
          accessibleSeat: queryInfo.accessibleSeat ? 'accessibleSeat' : null,
          numOfPax: null,
          cardDisplayName: null,
        };
        commonProducts.push(attractionProduct);
      });

      if (orderInfo.voucherType === '0') {
        const submitCommonOffer = {
          offerGroup: packageId,
          offerNo: offerInfo.offerNo,
          cartOfferId: offerInstanceId,
          priceRuleId: offerInfo.selectRuleId,
          offerCount: orderInfo.orderQuantity,
          attractionProducts: [...commonProducts],
          totalPrice,
          patronInfo: null,
          deliveryInfo: {
            referenceNo: null,
            contactNo: null,
            lastName: null,
            firstName: null,
            country: null,
            email: null,
            collectionDate: collectionDate
              ? moment(collectionDate, 'x').format('YYYY-MM-DD')
              : null,
            deliveryMode,
          },
        };
        commonOffers.push(submitCommonOffer);
      } else if (orderInfo.voucherType === '1') {
        mealsProductList = orderInfo.groupSettingList;
        mealsProductList.forEach(mealsProduct => {
          const attractionProducts = [...commonProducts];
          const attractionProduct = {
            productNo: mealsProduct.meals,
            patronInfo,
            numOfAttraction: 1,
            visitDate: moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD'),
            timing: null,
            comment: mealsProduct.remarks.join(','),
            accessibleSeat: queryInfo.accessibleSeat ? 'accessibleSeat' : null,
            numOfPax: null,
            cardDisplayName: null,
          };
          attractionProducts.push(attractionProduct);
          const submitCommonOffer = {
            offerGroup: packageId,
            offerNo: offerInfo.offerNo,
            cartOfferId: offerInstanceId,
            priceRuleId: offerInfo.selectRuleId,
            offerCount: mealsProduct.number,
            attractionProducts,
            totalPrice,
            patronInfo: null,
            deliveryInfo: {
              referenceNo: null,
              contactNo: null,
              lastName: null,
              firstName: null,
              country: null,
              email: null,
              collectionDate: collectionDate
                ? moment(collectionDate, 'x').format('YYYY-MM-DD')
                : null,
              deliveryMode,
            },
          };
          commonOffers.push(submitCommonOffer);
        });
      } else {
        mealsProductList = orderInfo.individualSettingList;
        mealsProductList.forEach(mealsProduct => {
          const attractionProducts = [...commonProducts];
          const attractionProduct = {
            productNo: mealsProduct.meals,
            patronInfo,
            numOfAttraction: mealsProduct.number,
            visitDate: moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD'),
            timing: null,
            comment: mealsProduct.remarks.join(','),
            accessibleSeat: queryInfo.accessibleSeat ? 'accessibleSeat' : null,
            numOfPax: null,
            cardDisplayName: null,
          };
          attractionProducts.push(attractionProduct);
          const submitCommonOffer = {
            offerGroup: packageId,
            offerNo: offerInfo.offerNo,
            cartOfferId: offerInstanceId,
            priceRuleId: offerInfo.selectRuleId,
            offerCount: 1,
            attractionProducts,
            totalPrice,
            patronInfo: null,
            deliveryInfo: {
              referenceNo: null,
              contactNo: null,
              lastName: null,
              firstName: null,
              country: null,
              email: null,
              collectionDate: collectionDate
                ? moment(collectionDate, 'x').format('YYYY-MM-DD')
                : null,
              deliveryMode,
            },
          };
          commonOffers.push(submitCommonOffer);
        });
      }
    });
  });

  return commonOffers;
}

export function transBookingOffersTotalPrice(
  packageOrderData,
  generalTicketOrderData,
  onceAPirateOrderData
) {
  let totalPrice = 0;

  const ticketOrderData = [...packageOrderData, ...generalTicketOrderData];
  ticketOrderData.forEach(orderData => {
    orderData.orderOfferList.forEach(orderOffer => {
      const { orderType, orderInfo } = orderOffer;
      if (orderType === 'offerFixed') {
        totalPrice += orderOffer.orderSummary.totalPrice;
      } else {
        orderInfo.forEach(orderInfoItem => {
          totalPrice += orderInfoItem.pricePax * orderInfoItem.quantity;
        });
      }
    });
  });

  onceAPirateOrderData.forEach(orderData => {
    orderData.orderOfferList.forEach(orderOffer => {
      const { orderInfo } = orderOffer;
      totalPrice += orderInfo.offerSumPrice;
    });
  });

  return totalPrice;
}

export function transBookingToPayTotalPrice(
  packageOrderData,
  generalTicketOrderData,
  onceAPirateOrderData,
  bocaFeePax
) {
  let totalPrice = transBookingOffersTotalPrice(
    packageOrderData,
    generalTicketOrderData,
    onceAPirateOrderData
  );
  if (bocaFeePax) {
    const ticketAmount = getCheckTicketAmount(
      packageOrderData,
      generalTicketOrderData,
      onceAPirateOrderData,
      true
    );
    totalPrice += ticketAmount * bocaFeePax;
  }
  return Number(totalPrice).toFixed(2);
}

export function toThousandsByRound(numberParam) {
  if (!numberParam || numberParam === 0) {
    return '0.00';
  }
  if (numberParam < 1000) {
    return Number(numberParam).toFixed(2);
  }
  const numberStr = String(numberParam);
  const numberLeftArray = numberStr
    .split('.')[0]
    .split('')
    .reverse();
  let numberRight = numberStr.split('.')[1];
  numberRight = numberRight || '00';
  let tempStr = '';
  for (let i = 0; i < numberLeftArray.length; i += 1) {
    tempStr +=
      numberLeftArray[i] + ((i + 1) % 3 === 0 && i + 1 !== numberLeftArray.length ? ',' : '');
  }
  return `${tempStr
    .split('')
    .reverse()
    .join('')}.${numberRight}`;
}

export function getProductTaxByFixed(orderOfferItem) {
  const productTax =
    (orderOfferItem.orderSummary.gstAmountPax || 0) * orderOfferItem.orderSummary.quantity;
  return productTax;
}

export function getProductTaxByMultiple(offerProfile, orderOfferItem) {
  let productTax = 0;
  orderOfferItem.orderInfo.forEach(orderInfoItem => {
    if (orderInfoItem.quantity > 0) {
      productTax += (orderInfoItem.gstAmountPax || 0) * orderInfoItem.quantity;
    }
  });
  return productTax;
}

export function getProductTaxByBundle(quantity, gstAmountPax) {
  let productTax = 0;
  if (quantity > 0) {
    productTax = (gstAmountPax || 0) * quantity;
  }
  return productTax;
}

export function getOrderProductServiceTax(generalTicketOrderData, onceAPirateOrderData) {
  let serviceTax = 0;
  generalTicketOrderData.forEach(orderItem => {
    orderItem.orderOfferList.forEach(orderOfferItem => {
      if (orderOfferItem.orderType === 'offerBundle') {
        orderOfferItem.orderInfo.forEach(orderInfoItem => {
          serviceTax += getProductTaxByBundle(orderInfoItem.quantity, orderInfoItem.gstAmountPax);
        });
      } else if (orderOfferItem.orderType === 'offerFixed') {
        serviceTax += getProductTaxByFixed(orderOfferItem);
      } else {
        const offerProfile = orderOfferItem.offerInfo;
        serviceTax += getProductTaxByMultiple(offerProfile, orderOfferItem);
      }
    });
  });
  onceAPirateOrderData.forEach(onceAPirateOrder => {
    onceAPirateOrder.orderOfferList.forEach(orderOfferItem => {
      serviceTax += getProductTaxByBundle(
        orderOfferItem.orderInfo.orderQuantity,
        orderOfferItem.orderInfo.gstAmountPax
      );
    });
  });
  return serviceTax;
}
