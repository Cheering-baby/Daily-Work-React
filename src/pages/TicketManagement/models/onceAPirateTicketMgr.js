import router from "umi/router";
import {message} from "antd";
import {
  getAttractionProductList,
  getPluProductByRuleId,
  getVoucherProductList,
  getSumPriceOfOfferPaxOfferProfile,
  getPamsPriceRuleIdByOfferProfile
} from '../utils/ticketOfferInfoUtil';
import moment from "moment";

export default  {

  namespace: 'onceAPirateTicketMgr',

  state: {

    showPageLoading: false,
    orderIndex: null,
    showDetail: false,
    offerDetail: {},
    onceAPirateOrderData: [],
    diffMinutesLess: false,
    settingMethodType: '1',
    diningRemarkList: [],
    showCategory: "0",
    showCategoryLoading: false,
    queryInfo: null,

  },

  effects: {

    *initEditOnceAPirateOrder({ payload },{ put, select }) {

    },

    *addToCartSaveOrderData({ payload },{ put, select }) {

      const {
        orderIndex,
        onceAPirateOrder,
        diffMinutesLess,
        onceAPirateOrderData = [],
      } = payload;

      const {
        queryInfo,
      } = yield select(state => state.onceAPirateTicketMgr);

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
          number: 1,
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
        const validTimeFrom = moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD');
        offerOrderInfo.offerInfo.voucherProductList = getVoucherProductList(offerProfile,validTimeFrom);
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
        message.warn("The session time less than current 3 hour,No meals setting.");
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

    *orderToCheck({ payload },{ put, select, take }) {

      yield put({
        type: 'save',
        payload: {
          showPageLoading: true,
        },
      });

      const {
        orderIndex,
        settingMethodType,
        queryInfo,
        onceAPirateOrderData = []
      } = yield select(state => state.onceAPirateTicketMgr);

      const settingOnceAPirateOrderDataCallbackFn = {
        callbackFnCode: 1,
        setFnCode: function (callbackCode) {
          this.callbackFnCode = callbackCode;
        }
      };

      yield put({
        type: 'ticketOrderCartMgr/settingOnceAPirateOrderData',
        payload: {
          orderIndex,
          orderData: {
            queryInfo,
            voucherType: settingMethodType,
            orderOfferList: onceAPirateOrderData,
          },
          settingOnceAPirateOrderDataCallbackFn
        },
      });

      yield take('ticketOrderCartMgr/settingOnceAPirateOrderData/@@end');
      if (settingOnceAPirateOrderDataCallbackFn.callbackFnCode === 'done') {
        message.success('Order successfully!');
        router.push(`/TicketManagement/Ticketing/OrderCart/CheckOrder`);
      }
      yield put({
        type: 'save',
        payload: {
          showPageLoading: false,
        },
      });

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
        diningRemarkList: [],
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
        const attractionProductList = getAttractionProductList(offerProfile,requestParam.validTimeFrom);
        attractionProductList.forEach(productInfo=>{
          const pluProductList = getPluProductByRuleId(productInfo,null,requestParam.validTimeFrom);
          if (pluProductList && pluProductList.length>0) {
            const pluProduct = pluProductList[0];
            if (pluProduct.priceTimeFrom === activeGroupSelectData.sessionTime) {
              sessionTimeFix = true;
            }
          }
        });
        if (offerProfile && offerProfile.inventories && offerProfile.inventories.length) {
          for (let inventoriesIndex = 0; inventoriesIndex < offerProfile.inventories.length; inventoriesIndex+=1) {
            const inventorieObj = offerProfile.inventories[inventoriesIndex];
            if (inventorieObj.inventoryDate===requestParam.validTimeFrom) {
              offerMaxAvailable = inventorieObj.available === -1 ? 2147483647: inventorieObj.available;
            }
          }
        }
        const selectRuleId = getPamsPriceRuleIdByOfferProfile(offerProfile);
        offerSumPrice = getSumPriceOfOfferPaxOfferProfile(offerProfile,requestParam.validTimeFrom,selectRuleId);
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
            selectRuleId,
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
        queryInfo: {
          ...activeGroupSelectData,
          dateOfVisit: activeGroupSelectData.dateOfVisit ? activeGroupSelectData.dateOfVisit.format('x') : activeGroupSelectData.dateOfVisit
        },
      };

    },
  },

  subscriptions: {},

}
