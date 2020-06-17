import router from 'umi/router';
import { message } from 'antd';
import moment from 'moment';
import {
  getAttractionProductList,
  getPamsPriceRuleIdByOfferProfile,
  getPluProductByRuleId,
  getSumPriceOfOfferPaxOfferProfile,
  getVoucherProductList,
} from '../utils/ticketOfferInfoUtil';

export default {
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
    showCategory: '1',
    showCategoryLoading: false,
    queryInfo: null,
  },

  effects: {
    *initEditOnceAPirateOrder() {
      // console.log('initEditOnceAPirateOrder');
    },

    *addToCartByDiffMinutesLess({ payload }, { put }) {
      const { orderIndex, diffMinutesLess, onceAPirateOrderData = [] } = payload;

      const newOnceAPirateOrderData = onceAPirateOrderData.map(item => {
        const offerOrderInfo = {
          orderInfo: {
            quantity: item.orderQuantity,
            orderQuantity: item.orderQuantity,
            pricePax: item.offerPricePax,
            offerSumPrice: item.offerPricePax * item.orderQuantity,
            voucherType: '1',
            groupSettingList: [],
            individualSettingList: [],
          },
          offerInfo: {
            ...item,
          },
        };
        return offerOrderInfo;
      });

      yield put({
        type: 'save',
        payload: {
          settingMethodType: '0',
          orderIndex,
          diffMinutesLess,
          onceAPirateOrderData: newOnceAPirateOrderData,
        },
      });

      yield put({
        type: 'orderToCheck',
        payload: {},
      });
    },

    *addToCartSaveOrderData({ payload }, { put, select }) {
      const { orderIndex, onceAPirateOrder, diffMinutesLess, onceAPirateOrderData = [] } = payload;

      const { queryInfo } = yield select(state => state.onceAPirateTicketMgr);

      const newOnceAPirateOrderData = onceAPirateOrderData.map(item => {
        const offerOrderInfo = {
          orderInfo: {
            quantity: item.orderQuantity,
            orderQuantity: item.orderQuantity,
            pricePax: item.offerPricePax,
            offerSumPrice: item.offerPricePax * item.orderQuantity,
            voucherType: '1',
            groupSettingList: [],
            individualSettingList: [],
          },
          offerInfo: {
            ...item,
          },
        };
        offerOrderInfo.orderInfo.groupSettingList = [
          {
            meals: null,
            remarks: [],
            number: 1,
          },
        ];
        offerOrderInfo.orderInfo.individualSettingList = [];
        for (let i = 0; i < offerOrderInfo.orderInfo.orderQuantity; i += 1) {
          offerOrderInfo.orderInfo.individualSettingList.push({
            meals: null,
            remarks: [],
            number: 1,
          });
        }
        offerOrderInfo.offerInfo.voucherProductList = [];
        if (orderIndex !== null && onceAPirateOrder !== null) {
          onceAPirateOrder.orderOfferList.forEach(orderOffer => {
            if (orderOffer.offerInfo.offerNo === item.offerNo) {
              offerOrderInfo.orderInfo.groupSettingList = orderOffer.orderInfo.groupSettingList;
              offerOrderInfo.orderInfo.individualSettingList =
                orderOffer.orderInfo.individualSettingList;
              offerOrderInfo.orderInfo.voucherType = orderOffer.orderInfo.voucherType;
            }
          });
        }
        if (
          offerOrderInfo.orderInfo.individualSettingList.length !==
          offerOrderInfo.orderInfo.orderQuantity
        ) {
          let diffSum = 0;
          if (
            offerOrderInfo.orderInfo.individualSettingList.length >
            offerOrderInfo.orderInfo.orderQuantity
          ) {
            diffSum =
              offerOrderInfo.orderInfo.individualSettingList.length -
              offerOrderInfo.orderInfo.orderQuantity;
            for (let i = 0; i < diffSum; i += 1) {
              offerOrderInfo.orderInfo.individualSettingList.splice(
                offerOrderInfo.orderInfo.individualSettingList.length - 1,
                1
              );
            }
          } else {
            diffSum =
              offerOrderInfo.orderInfo.orderQuantity -
              offerOrderInfo.orderInfo.individualSettingList.length;
            for (let i = 0; i < diffSum; i += 1) {
              offerOrderInfo.orderInfo.individualSettingList.push({
                meals: null,
                remarks: [],
                number: 1,
              });
            }
          }
        }
        const { offerProfile } = item;
        const validTimeFrom = moment(queryInfo.dateOfVisit, 'x').format('YYYY-MM-DD');
        offerOrderInfo.offerInfo.voucherProductList = getVoucherProductList(
          offerProfile,
          validTimeFrom
        );
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
        message.warn('The session time less than current 3 hour,No meals setting.');
      }
      if (orderIndex !== null && orderIndex > -1) {
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

    *orderToCheck(_, { put, select, take }) {
      yield put({
        type: 'save',
        payload: {
          showPageLoading: true,
        },
      });

      const {
        diffMinutesLess,
        orderIndex,
        settingMethodType,
        queryInfo,
        onceAPirateOrderData = [],
      } = yield select(state => state.onceAPirateTicketMgr);

      const settingOnceAPirateOrderDataCallbackFn = {
        callbackFnCode: 1,
        setFnCode(callbackCode) {
          this.callbackFnCode = callbackCode;
        },
      };

      yield put({
        type: 'ticketOrderCartMgr/settingOnceAPirateOrderData',
        payload: {
          orderIndex,
          orderData: {
            queryInfo,
            voucherType: diffMinutesLess ? '0' : settingMethodType,
            orderOfferList: onceAPirateOrderData,
          },
          settingOnceAPirateOrderDataCallbackFn,
        },
      });

      yield take('ticketOrderCartMgr/settingOnceAPirateOrderData/@@end');
      if (settingOnceAPirateOrderDataCallbackFn.callbackFnCode === 'done') {
        message.success('Add to Orders Cart successfully.');
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
        ...payload,
      };
    },
    resetData() {
      return {
        showPageLoading: false,
        orderIndex: null,
        showDetail: false,
        offerDetail: {},
        onceAPirateOrderData: [],
        diffMinutesLess: false,
        settingMethodType: '1',
        diningRemarkList: [],
        showCategory: '1',
        showCategoryLoading: false,
        queryInfo: null,
      };
    },
    saveOfferData(state, { payload }) {
      const {
        orderIndex,
        onceAPirateOrder,
        offerList = [],
        requestParam,
        activeGroupSelectData,
      } = payload;
      const onceAPirateOfferData = [];

      let diffMinutesLess = false;
      const validTimeFrom = moment(activeGroupSelectData.dateOfVisit, 'x').format('YYYY-MM-DD');
      const dateOfVisitTime = moment(activeGroupSelectData.dateOfVisit, 'x');
      let dateOfVisitTimeStr = dateOfVisitTime.format('YYYY-MM-DD');
      if (activeGroupSelectData.sessionTime) {
        dateOfVisitTimeStr = `${dateOfVisitTimeStr} ${activeGroupSelectData.sessionTime}`;
        const dateOfVisitTimeMoment = moment(dateOfVisitTimeStr, 'YYYY-MM-DD HH:mm:ss');
        const du = moment.duration(dateOfVisitTimeMoment - moment(), 'ms');
        const diffMinutes = du.asHours();
        diffMinutesLess = diffMinutes < 3;
      }

      for (let i = 0; i < offerList.length; i += 1) {
        const { offerProfile } = offerList[i];

        const voucherProductList = getVoucherProductList(offerProfile, requestParam.validTimeFrom);
        if (diffMinutesLess && voucherProductList && voucherProductList.length !== 0) {
          // eslint-disable-next-line no-continue
          continue;
        } else if (!diffMinutesLess && voucherProductList && voucherProductList.length === 0) {
          // eslint-disable-next-line no-continue
          continue;
        }

        const selectRuleId = getPamsPriceRuleIdByOfferProfile(offerProfile);

        let offerMaxAvailable = 0;
        let offerMinQuantity = 0;
        let offerInventoryByDateOfVisit = 0;
        let productMaxAvailable = 0;
        let productInventoryByDateOfVisit = 0;
        let choiceConstrain = 'Fixed';
        let needChoiceCount = 1;

        if (offerProfile.offerBasicInfo && offerProfile.offerBasicInfo.offerMaxQuantity) {
          offerMaxAvailable = offerProfile.offerBasicInfo.offerMaxQuantity;
          offerMaxAvailable = offerMaxAvailable === -1 ? 2147483647 : offerMaxAvailable;
        }
        if (offerProfile.offerBasicInfo && offerProfile.offerBasicInfo.offerMinQuantity) {
          // eslint-disable-next-line prefer-destructuring
          offerMinQuantity = offerProfile.offerBasicInfo.offerMinQuantity;
        }

        if (offerProfile.productGroup) {
          offerProfile.productGroup.forEach(productGroupItem => {
            if (productGroupItem.productType === 'Attraction') {
              productGroupItem.productGroup.forEach(productGroupInfo => {
                // eslint-disable-next-line prefer-destructuring
                choiceConstrain = productGroupInfo.choiceConstrain;
                if (
                  productGroupInfo.groupName === 'Attraction' &&
                  productGroupInfo.choiceConstrain !== 'Fixed'
                ) {
                  productMaxAvailable = productGroupInfo.maxProductQuantity;
                  productMaxAvailable =
                    productMaxAvailable === -1 ? 2147483647 : productMaxAvailable;
                } else if (
                  productGroupInfo.groupName === 'Attraction' &&
                  productGroupInfo.choiceConstrain === 'Fixed'
                ) {
                  productMaxAvailable = 2147483647;
                }
              });
            }
          });
        }

        if (offerProfile && offerProfile.inventories) {
          for (
            let inventoriesIndex = 0;
            inventoriesIndex < offerProfile.inventories.length;
            inventoriesIndex += 1
          ) {
            const inventorieObj = offerProfile.inventories[inventoriesIndex];
            if (inventorieObj.inventoryDate === validTimeFrom) {
              offerInventoryByDateOfVisit =
                inventorieObj.available === -1 ? 2147483647 : inventorieObj.available;
            }
          }
        }

        const attractionProductList = getAttractionProductList(offerProfile, validTimeFrom);
        attractionProductList.forEach(attractionProduct => {
          if (choiceConstrain === 'Fixed') {
            needChoiceCount += attractionProduct.needChoiceCount;
          } else if (needChoiceCount < attractionProduct.needChoiceCount) {
            // eslint-disable-next-line prefer-destructuring
            needChoiceCount = attractionProduct.needChoiceCount;
          }
          const pluProductList = getPluProductByRuleId(
            attractionProduct,
            selectRuleId,
            validTimeFrom
          );
          let isEmpty = false;
          pluProductList.forEach(pluProduct => {
            if (pluProduct.priceTimeFrom === activeGroupSelectData.sessionTime) {
              if (pluProduct.productInventory === 0) {
                productInventoryByDateOfVisit = 0;
                isEmpty = true;
              } else if (productInventoryByDateOfVisit === 0 && !isEmpty) {
                productInventoryByDateOfVisit = pluProduct.productInventory;
              } else if (
                productInventoryByDateOfVisit !== 0 &&
                productInventoryByDateOfVisit > pluProduct.productInventory
              ) {
                productInventoryByDateOfVisit = pluProduct.productInventory;
              }
            }
          });
        });

        let offerMaxQuantity = offerMaxAvailable;
        offerInventoryByDateOfVisit /= needChoiceCount;
        if (offerMaxQuantity > offerInventoryByDateOfVisit) {
          offerMaxQuantity = offerInventoryByDateOfVisit;
        } else if (offerMaxQuantity > productMaxAvailable) {
          offerMaxQuantity = productMaxAvailable;
        } else if (offerMaxQuantity > productInventoryByDateOfVisit) {
          offerMaxQuantity = productInventoryByDateOfVisit;
        }

        let sessionTimeFix = false;
        attractionProductList.forEach(productInfo => {
          const pluProductList = getPluProductByRuleId(
            productInfo,
            null,
            requestParam.validTimeFrom
          );
          if (pluProductList && pluProductList.length > 0) {
            pluProductList.forEach(pluProduct => {
              if (pluProduct.priceTimeFrom === activeGroupSelectData.sessionTime) {
                sessionTimeFix = true;
              }
            });
          }
        });

        const offerPricePax = getSumPriceOfOfferPaxOfferProfile(
          offerProfile,
          requestParam.validTimeFrom,
          selectRuleId,
          activeGroupSelectData.sessionTime
        );

        if (sessionTimeFix && offerPricePax > 0 && offerMaxQuantity > 0) {
          let orderQuantity = 0;
          if (orderIndex !== null && onceAPirateOrder !== null) {
            onceAPirateOrder.orderOfferList.forEach(orderOffer => {
              if (orderOffer.offerInfo.offerNo === offerList[i].offerNo) {
                // eslint-disable-next-line prefer-destructuring
                orderQuantity = orderOffer.orderInfo.orderQuantity;
              }
            });
          }
          onceAPirateOfferData.push(
            Object.assign(offerList[i], {
              selectRuleId,
              offerPricePax,
              offerSumPrice: offerPricePax * orderQuantity,
              showPrice: `$${Number(offerPricePax).toFixed(2)}/package`,
              orderQuantity,
              offerMaxAvailable,
              offerInventoryByDateOfVisit,
              productMaxAvailable,
              productInventoryByDateOfVisit,
              offerMaxQuantity,
              offerMinQuantity,
            })
          );
        }
      }

      let showCategory = '1';
      if (activeGroupSelectData && activeGroupSelectData.accessibleSeat) {
        showCategory = '1';
      }
      return {
        ...state,
        orderIndex,
        onceAPirateOrder,
        onceAPirateOfferData,
        showCategory,
        queryInfo: {
          ...activeGroupSelectData,
        },
      };
    },
  },

  subscriptions: {},
};
