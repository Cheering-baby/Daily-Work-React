import moment from 'moment';
import {
  getAttractionProductList,
  getVoucherProductList,
} from '@/pages/TicketManagement/utils/ticketOfferInfoUtil';

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
  const hexDigits = '0123456789abcdef';
  for (let i = 0; i < 10; i += 1) {
    let str = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    if (i === 14) {
      str = '4';
    } else if (i === 19) {
      str = hexDigits.substr((str && 0x3) || 0x8, 1);
    } else if (i === 8 || i === 13 || i === 18 || i === 23) {
      str = '-';
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

  if (!existTicketOrderGroup) {
    const newOrderItem = {
      packageId: orderOfferItem.packageId,
      ...orderOfferItem.packageInfo,
      orderInfo: [
        {
          offerInstanceId,
          ...orderOfferItem.orderDetail,
        },
      ],
    };
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
        },
      ],
    };
    existTicketOrderGroup.orderOfferList.push(newOrderItem);
  } else {
    existOrderData.orderInfo.push({
      offerInstanceId,
      ...orderOfferItem.orderDetail,
    });
  }
}

export function mergeOapOrder(offerInstanceId, onceAPirateOrderData, orderInfo) {
  const existOrderData = onceAPirateOrderData.find(
    orderData => orderData.packageId === orderInfo.packageId
  );

  if (onceAPirateOrderData.length === 0 || !existOrderData) {
    const newOrderItem = {
      packageId: orderInfo.packageId,
      ...orderInfo.packageInfo,
      orderOfferList: [
        {
          offerInstanceId,
          ...orderInfo.orderDetail,
        },
      ],
    };
    onceAPirateOrderData.push(newOrderItem);
  } else {
    existOrderData.orderOfferList.push({
      offerInstanceId,
      ...orderInfo.orderDetail,
    });
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
      resultData.generalTicketOrderData.forEach(orderDataItem => {
        if (offerInstance.offerInstanceAttribute.themeParkCode === orderDataItem.themeParkCode) {
          orderDataItem.orderOfferList.push({
            offerInstanceId: offerInstance.offerInstanceId,
            ...JSON.parse(offerInstance.offerInstanceAttribute.orderInfo),
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
              ...JSON.parse(offerInstance.offerInstanceAttribute.orderInfo),
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
  const orderList = JSON.parse(JSON.stringify(packageOrderData));
  packageOrderData.forEach((orderData, orderIndex) => {
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
      orderList[orderIndex].orderOfferList = newOrderOfferList;
    } else {
      orderList.splice(orderIndex, 1);
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

export function getCheckTicketAmount(
  packageOrderData,
  generalTicketOrderData,
  onceAPirateOrderData
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
        } else if (listIndex < 2 && orderOffer.orderInfo && orderOffer.orderType === 'offerFixed') {
          let offerTicketPax = 0;
          orderOffer.orderInfo.forEach(info => {
            if (info.orderCheck) {
              const needChoiceCount = info.productInfo.needChoiceCount || 1;
              offerTicketPax += 1 * needChoiceCount;
            }
          });
          ticketAmount += offerTicketPax * orderOffer.orderSummary.quantity;
        } else if (listIndex < 2 && orderOffer.orderInfo) {
          orderOffer.orderInfo.forEach(info => {
            if (info.orderCheck) {
              const needChoiceCount = info.productInfo.needChoiceCount || 1;
              ticketAmount += info.quantity * needChoiceCount;
            }
          });
        } else if (listIndex === 2) {
          if (orderOffer.orderCheck) {
            const needChoiceCount = 1;
            ticketAmount += orderOffer.orderInfo.orderQuantity * needChoiceCount;
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
    orderData.orderOfferList.forEach(orderOffer => {
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
          noOfPax: orderInfoItem.quantity,
        };
        attractionProducts.push(attractionProduct);
      });
      const submitCommonOffer = {
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
  orderInfoList.forEach(orderInfo => {
    const { productInfo } = orderInfo;
    const ifGroup = checkIfGroupTicketByProduct(productInfo);
    if (!ifGroup) {
      const attractionProduct = {
        productNo: productInfo.productNo,
        patronInfo: deliveryInfoData,
        numOfAttraction: orderInfo.quantity,
        visitDate: moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD'),
        noOfPax: null,
      };
      attractionProducts.push(attractionProduct);
    } else {
      const attractionProduct = {
        productNo: productInfo.productNo,
        patronInfo: deliveryInfoData,
        numOfAttraction: 1,
        visitDate: moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD'),
        noOfPax: orderInfo.quantity,
      };
      attractionProducts.push(attractionProduct);
    }
  });
}

export function putVoucherToAttraction(attractionProducts, queryInfo, offerInfo, deliveryInfoData) {
  const validTimeFrom = moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD');
  const voucherProductList = getVoucherProductList(offerInfo, validTimeFrom);
  if (voucherProductList) {
    voucherProductList.forEach(voucherProduct => {
      const attractionProduct = {
        productNo: voucherProduct.productNo,
        patronInfo: deliveryInfoData,
        numOfAttraction: 1,
        visitDate: validTimeFrom,
        noOfPax: null,
      };
      attractionProducts.push(attractionProduct);
    });
  }
}

export function putAttractionProductsByOfferBundle(
  attractionProducts,
  queryInfo,
  orderInfoItem,
  deliveryInfoData
) {
  const validTimeFrom = moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD');
  const { offerInfo, quantity } = orderInfoItem;
  const attractionProductList = getAttractionProductList(offerInfo, validTimeFrom);
  attractionProductList.forEach(productInfo => {
    const ifGroup = checkIfGroupTicketByProduct(productInfo);
    if (!ifGroup) {
      const attractionProduct = {
        productNo: productInfo.productNo,
        patronInfo: deliveryInfoData,
        numOfAttraction: 1,
        visitDate: validTimeFrom,
        noOfPax: null,
      };
      attractionProducts.push(attractionProduct);
    } else {
      const attractionProduct = {
        productNo: productInfo.productNo,
        patronInfo: deliveryInfoData,
        numOfAttraction: 1,
        visitDate: validTimeFrom,
        noOfPax: quantity,
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
  const { orderInfo, queryInfo, deliveryInfo = {} } = orderOffer;

  const deliveryInfoData = {
    referenceNo: deliveryInfo.taNo,
    contactNo: deliveryInfo.customerContactNo,
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
        deliveryInfoData
      );
      putVoucherToAttraction(attractionProducts, queryInfo, offerInfo, deliveryInfoData);
      const submitCommonOffer = {
        offerNo: offerInfo.offerNo,
        cartOfferId: offerInstanceId,
        priceRuleId: offerInfo.selectRuleId,
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
  const { offerInstanceId, queryInfo, offerInfo, deliveryInfo = {}, orderSummary } = orderOffer;

  const deliveryInfoData = {
    referenceNo: deliveryInfo.taNo,
    contactNo: deliveryInfo.customerContactNo,
    lastName: deliveryInfo.guestLastName,
    firstName: deliveryInfo.guestFirstName,
    country: deliveryInfo.country,
    email: deliveryInfo.customerEmailAddress,
    collectionDate: collectionDate ? moment(collectionDate, 'x').format('YYYY-MM-DD') : null,
    deliveryMode,
  };

  const attractionProducts = [];
  let ifGroupTicket = false;
  const validTimeFrom = moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD');
  const attractionProductList = getAttractionProductList(offerInfo, validTimeFrom);
  attractionProductList.forEach(productInfo => {
    ifGroupTicket = checkIfGroupTicketByProduct(productInfo);
    if (!ifGroupTicket) {
      const attractionProduct = {
        productNo: productInfo.productNo,
        patronInfo: deliveryInfoData,
        numOfAttraction: 1,
        visitDate: validTimeFrom,
        noOfPax: null,
      };
      attractionProducts.push(attractionProduct);
    } else {
      const attractionProduct = {
        productNo: productInfo.productNo,
        patronInfo: deliveryInfoData,
        numOfAttraction: 1,
        visitDate: validTimeFrom,
        noOfPax: orderSummary.quantity,
      };
      attractionProducts.push(attractionProduct);
    }
  });
  putVoucherToAttraction(attractionProducts, queryInfo, offerInfo, deliveryInfoData);

  const submitCommonOffer = {
    offerNo: offerInfo.offerNo,
    cartOfferId: offerInstanceId,
    priceRuleId: offerInfo.selectRuleId,
    offerCount: orderSummary.quantity,
    attractionProducts,
    totalPrice: orderSummary.totalPrice,
    patronInfo: null,
    deliveryInfo: deliveryInfoData,
  };
  commonOffers.push(submitCommonOffer);
}

export function putCommonOffersByOffer(commonOffers, orderOffer, collectionDate, deliveryMode) {
  const { offerInstanceId, queryInfo, offerInfo, orderInfo, deliveryInfo } = orderOffer;

  const deliveryInfoData = {
    referenceNo: deliveryInfo.taNo,
    contactNo: deliveryInfo.customerContactNo,
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
  putAttractionProductsByOffer(attractionProducts, orderInfo, queryInfo, deliveryInfoData);
  putVoucherToAttraction(attractionProducts, queryInfo, offerInfo, deliveryInfoData);

  const submitCommonOffer = {
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
    const { queryInfo } = orderData;
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
          accessibleSeat: queryInfo.accessibleSeat ? 'accessibleSeat' : null,
          noOfPax: null,
        };
        commonProducts.push(attractionProduct);
      });

      if (orderInfo.voucherType === '0') {
        const submitCommonOffer = {
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
        const attractionProducts = [...commonProducts];
        mealsProductList.forEach(mealsProduct => {
          const attractionProduct = {
            productNo: mealsProduct.meals,
            patronInfo,
            numOfAttraction: 1,
            visitDate: moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD'),
            comment: mealsProduct.remarks.join(','),
            accessibleSeat: queryInfo.accessibleSeat ? 'accessibleSeat' : null,
            noOfPax: null,
          };
          attractionProducts.push(attractionProduct);
          const submitCommonOffer = {
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
        const attractionProducts = [...commonProducts];
        mealsProductList.forEach(mealsProduct => {
          const attractionProduct = {
            productNo: mealsProduct.meals,
            patronInfo,
            numOfAttraction: mealsProduct.number,
            visitDate: moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD'),
            comment: mealsProduct.remarks.join(','),
            accessibleSeat: queryInfo.accessibleSeat ? 'accessibleSeat' : null,
            noOfPax: null,
          };
          attractionProducts.push(attractionProduct);
          const submitCommonOffer = {
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
      onceAPirateOrderData
    );
    totalPrice += ticketAmount * bocaFeePax;
  }
  return Number(totalPrice).toFixed(2);
}
