import moment from "moment";
import {getAttractionProductList} from "@/pages/TicketManagement/utils/ticketOfferInfoUtil";

export function transOrderToOfferInfos(offerNo,themeParkCode,themeParkName,orderItem) {

  const offerInfos = [];

  const offerInstance = {
    offerNo: offerNo,
    offerInstanceAttribute: {
      "themeParkCode": themeParkCode,
      "themeParkName": themeParkName,
      "orderInfo": JSON.stringify(orderItem)
    },
    offerProducts: []
  };

  offerInfos.push(offerInstance);

  return offerInfos;

}

export function createOrderItemId(orderData) {

  let orderItemId = new Date().getTime();
  if (orderData && orderData.queryInfo.dateOfVisit) {
    orderItemId += orderData.queryInfo.sessionTime;
    orderItemId += orderData.queryInfo.numOfGuests;
  }
  return orderItemId;

}

export function demolitionOrder(orderItemId,orderData,orderOffer) {

  const {
    orderAll,
    indeterminate,
    voucherType,
    queryInfo,
  } = orderData;

  return {
    packageId: orderItemId,
    packageInfo: {
      orderAll,
      indeterminate,
      voucherType,
      queryInfo,
    },
    orderDetail: orderOffer
  }

}

export function mergeOapOrder(offerInstanceId,onceAPirateOrderData,orderInfo) {

  const existOrderData = onceAPirateOrderData.find(orderData=>orderData.packageId === orderInfo.packageId);

  if (onceAPirateOrderData.length===0 || !existOrderData) {
    const newOrderItem = {
      packageId: orderInfo.packageId,
      ...orderInfo.packageInfo,
      orderOfferList: [
        {
          offerInstanceId,
          ...orderInfo.orderDetail
        }
      ]
    };
    onceAPirateOrderData.push(newOrderItem);
  } else {
    existOrderData.orderOfferList.push({
      offerInstanceId,
      ...orderInfo.orderDetail
    });
  }

}

export function transGetOrderList(offerInstanceList) {

  const resultData = {
    packageOrderData: [],
    generalTicketOrderData: [],
    onceAPirateOrderData: [],
  };

  offerInstanceList.forEach(offerInstance=>{

    if (offerInstance.offerInstanceAttribute.themeParkCode === "package") {
      if (resultData.packageOrderData.length===0) {
        resultData.packageOrderData.push({
          "themeParkCode": "package",
          "themeParkName": "Attraction Package",
          "orderOfferList": [],
        });
      }
      resultData.packageOrderData[0].orderOfferList.push({
        offerInstanceId: offerInstance.offerInstanceId,
        ...JSON.parse(offerInstance.offerInstanceAttribute.orderInfo)
      });
    } else if (offerInstance.offerInstanceAttribute.themeParkCode === "OAP"){
      mergeOapOrder(offerInstance.offerInstanceId,resultData.onceAPirateOrderData,{
        ...JSON.parse(offerInstance.offerInstanceAttribute.orderInfo)
      });
    } else {
      let isNewOrder = true;
      resultData.generalTicketOrderData.forEach(orderDataItem => {
        if (offerInstance.offerInstanceAttribute.themeParkCode === orderDataItem.themeParkCode) {
          orderDataItem.orderOfferList.push({
            offerInstanceId: offerInstance.offerInstanceId,
            ...JSON.parse(offerInstance.offerInstanceAttribute.orderInfo)
          });
          isNewOrder = false;
        }
      });
      if (isNewOrder) {
        resultData.generalTicketOrderData.push({
          themeParkCode: offerInstance.offerInstanceAttribute.themeParkCode,
          themeParkName: offerInstance.offerInstanceAttribute.themeParkName,
          orderOfferList: [{
            offerInstanceId: offerInstance.offerInstanceId,
            ...JSON.parse(offerInstance.offerInstanceAttribute.orderInfo)
          }],
        });
      }
    }

  });

  return resultData;

}

export function getOapOrderProductList(queryInfo,orderOffer,attractionProductList,voucherProductList,validTimeFrom) {

  const orderProductList = [];

  // attraction
  attractionProductList.forEach(attractionProduct=>{
    orderProductList.push({
      productNo: attractionProduct.productNo,
      numOfAttraction: 1,
      visitDate: validTimeFrom,
    });
  });
  // meals voucher
  let mealProductList = [];
  if (orderOffer.orderInfo.voucherType === "1") {
    mealProductList = orderOffer.orderInfo.groupSettingList;
  } else {
    mealProductList = orderOffer.orderInfo.individualSettingList;
  }
  mealProductList.forEach(mealProduct=>{
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
  packageOrderData.forEach((orderData,orderIndex) => {
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

  const orderList = JSON.parse(JSON.stringify(onceAPirateOrderData));
  onceAPirateOrderData.forEach((orderData,orderIndex) => {
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
      orderList[orderIndex].orderOfferList = newOrderOfferList;
    } else {
      orderList.splice(orderIndex, 1);
    }

  });

  return orderList;

}

export function getCheckTicketAmount(packageOrderData,generalTicketOrderData,onceAPirateOrderData) {

  const orderArray = [packageOrderData, generalTicketOrderData, onceAPirateOrderData];
  let ticketAmount = 0;
  orderArray.forEach((orderList, listIndex) => {
    orderList.forEach((orderData) => {
      orderData.orderOfferList.forEach(orderOffer => {
        if (listIndex < 2 && orderOffer.orderInfo) {
          orderOffer.orderInfo.forEach(info => {
            if (info.orderCheck) {
              let needChoiceCount = info.productInfo.needChoiceCount || 1;
              ticketAmount += info.quantity * needChoiceCount;
            }
          });
        } else if (listIndex === 2) {
          if (orderOffer.orderCheck) {
            // orderOffer.offerInfo.offerProfile
            let needChoiceCount = 1;
            ticketAmount += orderOffer.orderInfo.orderQuantity * needChoiceCount;
          }
        }
      });
    });
  });

  return ticketAmount;

}

export function transPackageCommonOffers(ticketOrderData,collectionDate,deliveryMode) {

  const commonOffers = [];

  ticketOrderData.forEach(orderData=>{
    orderData.orderOfferList.forEach(orderOffer=>{
      const {
        offerInstanceId,
        queryInfo,
        offerInfo,
        orderInfo,
        deliveryInfo,
      } = orderOffer;
      let totalPrice = 0;
      const attractionProducts = [];
      orderInfo.forEach(orderInfo => {
        const {
          productInfo,
          pricePax,
          quantity
        } = orderInfo;
        totalPrice += pricePax * quantity;
        let needChoiceCount = productInfo.needChoiceCount || 1;
        const attractionProduct = {
          productNo: productInfo.productNo,
          numOfAttraction: 1 * needChoiceCount,
          visitDate: moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD'),
          noOfPax: orderInfo.quantity,
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
        deliveryInfo: {
          referenceNo: deliveryInfo.taNo,
          contactNo: deliveryInfo.customerContactNo,
          lastName: deliveryInfo.guestLastName,
          firstName: deliveryInfo.guestFirstName,
          country: deliveryInfo.country,
          email: deliveryInfo.customerEmail,
          collectionDate: collectionDate ? moment(collectionDate, 'x').format('YYYY-MM-DD') : null,
          deliveryMode,
        },
      };
      commonOffers.push(submitCommonOffer);
    })
  });

  return commonOffers;

}

export function transBookingCommonOffers(ticketOrderData,collectionDate,deliveryMode) {

  const commonOffers = [];

  ticketOrderData.forEach(orderData=>{
    orderData.orderOfferList.forEach(orderOffer=>{
      const {
        offerInstanceId,
        queryInfo,
        offerInfo,
        orderInfo,
        deliveryInfo,
      } = orderOffer;
      let totalPrice = 0;
      const ifGroup = checkIfGroupByOfferInfo(offerInfo);
      const attractionProducts = [];
      orderInfo.forEach(orderInfo => {
        const {
          productInfo,
          pricePax,
          quantity
        } = orderInfo;
        totalPrice += pricePax * quantity;
        let needChoiceCount = productInfo.needChoiceCount || 1;
        if (!ifGroup) {
          const attractionProduct = {
            productNo: productInfo.productNo,
            numOfAttraction: orderInfo.quantity * needChoiceCount,
            visitDate: moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD'),
            noOfPax: null,
          };
          attractionProducts.push(attractionProduct);
        } else {
          const attractionProduct = {
            productNo: productInfo.productNo,
            numOfAttraction: 1 * needChoiceCount,
            visitDate: moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD'),
            noOfPax: orderInfo.quantity,
          };
          attractionProducts.push(attractionProduct);
        }
      });
      const submitCommonOffer = {
        offerNo: offerInfo.offerNo,
        cartOfferId: offerInstanceId,
        priceRuleId: offerInfo.selectRuleId,
        offerCount: 1,
        attractionProducts,
        totalPrice,
        patronInfo: null,
        deliveryInfo: {
          referenceNo: deliveryInfo.taNo,
          contactNo: deliveryInfo.customerContactNo,
          lastName: deliveryInfo.guestLastName,
          firstName: deliveryInfo.guestFirstName,
          country: deliveryInfo.country,
          email: deliveryInfo.customerEmail,
          collectionDate: collectionDate ? moment(collectionDate, 'x').format('YYYY-MM-DD') : null,
          deliveryMode,
        },
      };
      commonOffers.push(submitCommonOffer);
    })
  });

  return commonOffers;

}

export function transOapCommonOffers(onceAPirateOrderData,collectionDate,deliveryMode) {

  const commonOffers = [];

  onceAPirateOrderData.forEach(orderData=>{
    const {
      queryInfo,
    } = orderData;
    orderData.orderOfferList.forEach(orderOffer=>{
      const {
        offerInstanceId,
        offerInfo,
        orderInfo,
      } = orderOffer;
      let totalPrice = orderInfo.offerSumPrice;
      let mealsProductList = [];
      if (orderInfo.voucherType==='1') {
        mealsProductList = orderInfo.groupSettingList;
      } else {
        mealsProductList = orderInfo.individualSettingList;
      }
      const attractionProducts = [];
      mealsProductList.forEach(mealsProduct=>{
        const attractionProduct = {
          productNo: mealsProduct.meals,
          numOfAttraction: mealsProduct.number,
          visitDate: moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD'),
          comment: mealsProduct.remarks.join(","),
          accessibleSeat: queryInfo.accessibleSeat ? 'accessibleSeat' : null,
          noOfPax: null,
        };
        attractionProducts.push(attractionProduct);
      });
      const attractionProductList = getAttractionProductList(orderOffer.offerInfo.offerProfile,moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD'));
      attractionProductList.forEach(product => {
        const attractionProduct = {
          productNo: product.productNo,
          numOfAttraction: 1,
          visitDate: moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD'),
          accessibleSeat: queryInfo.accessibleSeat ? 'accessibleSeat' : null,
          noOfPax: null,
        };
        attractionProducts.push(attractionProduct);
      });
      const submitCommonOffer = {
        offerNo: offerInfo.offerNo,
        cartOfferId: offerInstanceId,
        priceRuleId: offerInfo.selectRuleId,
        offerCount: orderInfo.orderQuantity,
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
          collectionDate: collectionDate ? moment(collectionDate, 'x').format('YYYY-MM-DD') : null,
          deliveryMode,
        },
      };
      commonOffers.push(submitCommonOffer);
    })
  });

  return commonOffers;

}

export function transBookingOffersTotalPrice(packageOrderData,generalTicketOrderData,onceAPirateOrderData) {

  let totalPrice = 0;

  const ticketOrderData = [...packageOrderData,...generalTicketOrderData];
  ticketOrderData.forEach(orderData=>{
    orderData.orderOfferList.forEach(orderOffer=>{
      const {
        orderInfo,
      } = orderOffer;
      orderInfo.forEach(orderInfo => {
        totalPrice += orderInfo.pricePax * orderInfo.quantity;
      });
    })
  });

  onceAPirateOrderData.forEach(orderData=>{
    orderData.orderOfferList.forEach(orderOffer=>{
      const {
        orderInfo,
      } = orderOffer;
      totalPrice += orderInfo.offerSumPrice;
    })
  });

  return totalPrice;

}

export function getOfferTagByOfferInfo(offerInfo) {
  return offerInfo.offerTagList || offerInfo.offerProfile.offerTagList;
}

export function checkIfGroupByOfferInfo(offerInfo) {
  let result = false;
  const offerTagList = getOfferTagByOfferInfo(offerInfo);
  if (offerTagList && offerTagList.length>0) {
    offerTagList.forEach(offerTag=>{
      if (offerTag.tagName === "group" || offerTag.tagName === "Group") {
        result = true;
      }
    })
  }
  return result;
}
