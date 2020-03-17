
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


