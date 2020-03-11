import router from "umi/router";
import {message} from "antd";

export default  {

  namespace: 'onceAPirateTicketMgr',

  state: {

    orderIndex: null,
    showDetail: false,
    offerDetail: {},
    onceAPirateOrderData: [],
    diffMinutesLess: false,
    settingMethodType: '1',
    diningRemarkList: [
      {
        label: 'No Peanut'
      },
      {
        label: 'No Ice'
      }
    ],
    showCategory: "0",
    showCategoryLoading: false,
    queryInfo: null,

  },

  effects: {

    *initEditOnceAPirateOrder({ payload },{ put, select }) {

    },

    *addToCartSaveOrderData({ payload },{ put, take }) {

      const {
        orderIndex,
        onceAPirateOrder,
        diffMinutesLess,
        onceAPirateOrderData = [],
      } = payload;

      let newOnceAPirateOrderData = onceAPirateOrderData.map((item)=>{
        let offerOrderInfo = {
          orderInfo: {
            orderQuantity: item.orderQuantity,
            offerSumPrice: item.offerSumPrice,
            voucherType: '1',
            groupSettingList: [],
            individualSettingList: [],
          },
          offerInfo: {
            ...item
          }
        };
        offerOrderInfo.orderInfo.groupSettingList=[{
          meals: null,
          remarks: [],
          number: 0,
        }];
        offerOrderInfo.orderInfo.individualSettingList=[];
        for (let i=0; i<offerOrderInfo.orderInfo.orderQuantity;i++) {
          offerOrderInfo.orderInfo.individualSettingList.push({
            meals: null,
            remarks: [],
            number: 1,
          });
        }
        offerOrderInfo.offerInfo.voucherProductList = [];
        if (orderIndex!==null && onceAPirateOrder!==null) {
          onceAPirateOrder.orderOfferList.forEach(orderOffer=>{
            if (orderOffer.offerInfo.offerNo === item.offerNo) {
              offerOrderInfo.orderInfo.groupSettingList = orderOffer.orderInfo.groupSettingList;
              offerOrderInfo.orderInfo.individualSettingList = orderOffer.orderInfo.individualSettingList;
              offerOrderInfo.orderInfo.voucherType = orderOffer.orderInfo.voucherType;
            }
          });
        }
        if (offerOrderInfo.orderInfo.individualSettingList.length!==offerOrderInfo.orderInfo.orderQuantity) {
          let diffSum = 0;
          if (offerOrderInfo.orderInfo.individualSettingList.length>offerOrderInfo.orderInfo.orderQuantity) {
            diffSum = offerOrderInfo.orderInfo.individualSettingList.length-offerOrderInfo.orderInfo.orderQuantity;
            for (let i=0; i<diffSum;i++) {
              offerOrderInfo.orderInfo.individualSettingList.splice(offerOrderInfo.orderInfo.individualSettingList.length-1, 1);
            }
          } else {
            diffSum = offerOrderInfo.orderInfo.orderQuantity - offerOrderInfo.orderInfo.individualSettingList.length;
            for (let i=0; i<diffSum;i++) {
              offerOrderInfo.orderInfo.individualSettingList.push({
                meals: null,
                remarks: [],
                number: 1,
              });
            }
          }
        }
        const {offerProfile} = item;
        if (offerProfile.productGroup && offerProfile.productGroup.length>0) {
          for (let groupIndex = 0; groupIndex < offerProfile.productGroup.length; groupIndex += 1) {
            if (offerProfile.productGroup[groupIndex] && offerProfile.productGroup[groupIndex].productType==="Attraction") {
              const productGroups = offerProfile.productGroup[groupIndex].productGroup;
              for (let groupsIndex = 0; groupsIndex < productGroups.length; groupsIndex+=1) {
                offerOrderInfo.offerInfo.voucherProductList = productGroups[groupsIndex].products;
              }
            }
          }
        }
        return offerOrderInfo;
      });


      yield put({
        type: 'save',
        payload: {
          settingMethodType: onceAPirateOrder ? onceAPirateOrder.voucherType : '1',
          orderIndex,
          diffMinutesLess,
          onceAPirateOrderData: newOnceAPirateOrderData,
        },
      });

      if (diffMinutesLess) {
        message.warn("The session time less than current 3 hour.");
      }
      if (orderIndex!==null && orderIndex>-1) {
        router.push({
          pathname: '/TicketManagement/Ticketing/CreateOrder/OnceAPirateOrderCart',
          query: {
            operateType: 'editOnceAPirateOrder',
          },
        });
      } else {
        router.push(`/TicketManagement/Ticketing/CreateOrder/OnceAPirateOrderCart`);
      }

    },

    *orderToCheck({ payload },{ put, select }) {

      const {
        orderIndex,
        settingMethodType,
        queryInfo,
        onceAPirateOrderData = []
      } = yield select(state => state.onceAPirateTicketMgr);

      yield put({
        type: 'ticketOrderCartMgr/settingOnceAPirateOrderData',
        payload: {
          orderIndex,
          orderData: {
            queryInfo,
            voucherType: settingMethodType,
            orderOfferList: onceAPirateOrderData,
          }
        },
      });

      router.push(`/TicketManagement/Ticketing/OrderCart/CheckOrder`);

    },

  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
    resetData() {
      return {
        orderDataIndex: null,
        showDetail: false,
        offerDetail: {},
        onceAPirateOrderData: [],
        diffMinutesLess: false,
        settingMethodType: '1',
        diningRemarkList: [
          {
            label: 'No Peanut'
          },
          {
            label: 'No Ice'
          }
        ],
        showCategory: "0",
        showCategoryLoading: false,
        queryInfo: null,
      }
    },
    saveOfferData(state, { payload }) {

      const {
        orderIndex,
        onceAPirateOrder,
        offerList = [],
        requestParam,
        activeGroupSelectData,
      } = payload;
      const onceAPirateOfferData= [];

      for (let i = 0; i < offerList.length; i+=1) {
        const {offerProfile} = offerList[i];
        let offerSumPrice = 0;
        let offerMaxAvailable = 0;
        let offerProductMaxAvailable = 0;
        let sessionTimeFix = false;
        if (offerProfile && offerProfile.productGroup && offerProfile.productGroup.length>0) {
          for (let groupIndex = 0; groupIndex < offerProfile.productGroup.length; groupIndex+=1) {
            if (offerProfile.productGroup[groupIndex] && offerProfile.productGroup[groupIndex].productType==="Attraction") {
              const productGroups = offerProfile.productGroup[groupIndex].productGroup;
              for (let groupsIndex = 0; groupsIndex < productGroups.length; groupsIndex+=1) {
                const productsList = productGroups[groupsIndex].products;
                for (let productsIndex = 0; productsIndex < productsList.length; productsIndex+=1) {
                  const priceRuleList = productsList[productsIndex].priceRule;
                  for (let priceRuleIndex = 0; priceRuleIndex < priceRuleList.length; priceRuleIndex+=1) {
                    if (priceRuleList[priceRuleIndex].priceRuleName === "DefaultPrice") {
                      const productPriceList = priceRuleList[priceRuleIndex].productPrice;
                      for (let priceIndex = 0; priceIndex < productPriceList.length; priceIndex+=1) {
                        if (productPriceList[priceIndex].priceDate === requestParam.validTimeFrom) {
                          offerSumPrice += productPriceList[priceIndex].discountUnitPrice;
                          if (productPriceList[priceIndex].priceTimeFrom === activeGroupSelectData.sessionTime) {
                            sessionTimeFix = true;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (offerProfile && offerProfile.inventories && offerProfile.inventories.length) {
          for (let inventoriesIndex = 0; inventoriesIndex < offerProfile.inventories.length; inventoriesIndex+=1) {
            const inventorieObj = offerProfile.inventories[inventoriesIndex];
            if (inventorieObj.inventoryDate===requestParam.validTimeFrom) {
              offerMaxAvailable = inventorieObj.available === -1 ? 2147483647: inventorieObj.available;
            }
          }
        }
        if (sessionTimeFix && offerSumPrice>0 && offerMaxAvailable>0) {
          let orderQuantity = 0;
          if (orderIndex!==null && onceAPirateOrder!==null) {
            onceAPirateOrder.orderOfferList.forEach(orderOffer=>{
              if (orderOffer.offerInfo.offerNo === offerList[i].offerNo) {
                orderQuantity = orderOffer.orderInfo.orderQuantity;
              }
            });
          }
          onceAPirateOfferData.push(Object.assign(offerList[i],{
            offerSumPrice,
            showPrice: `$${offerSumPrice}`,
            orderQuantity,
            offerMaxAvailable,
            offerProductMaxAvailable
          }));
        }
      }

      let showCategory = "1";
      if (activeGroupSelectData && activeGroupSelectData.accessibleSeat) {
        showCategory = "1";
      }
      return {
        ...state,
        orderIndex,
        onceAPirateOrder,
        onceAPirateOfferData,
        showCategory,
        queryInfo: activeGroupSelectData,
      };

    },
  },

  subscriptions: {},

}
