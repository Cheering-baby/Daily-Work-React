import serialize from '../utils/utils';
import {
  queryBookingDetail,
  queryOfferBookingCategory,
  queryRevalidationVids,
} from '@/pages/TicketManagement/Ticketing/QueryOrder/services/queryOrderService';
import { getNumOfPaxInPackage } from '@/pages/TicketManagement/Ticketing/QueryOrder/utils/utils';

export default {
  namespace: 'orderDetailMgr',
  state: {
    orderDetailVisible: false,
    detailType: 'Revalidation',
    searchList: {
      bookingNo: null,
      isSubOrder: null,
    },
    detailList: [],
    vidResultList: [],
    patronInfo: {},
    themeParkList: [],
    netAmt: 0,
    refundSuccessFlag: false,
    status: null,
    revalidationVidListVisible: false,
    revalidationVidList: [],
    bookingDetail: null,
    orderQuantityList: [],
  },

  effects: {
    *effectSave({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
    },
    *queryVid({ payload }, { call, put }) {
      const response = yield call(queryRevalidationVids, serialize(payload));
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        const { vidInfos } = result;
        if (vidInfos) {
          for (let i = 0; i < vidInfos.length; i += 1) {
            vidInfos[i].vidNo = (Array(3).join('0') + (i + 1)).slice(-3);
          }
          yield put({
            type: 'save',
            payload: {
              revalidationVidList: vidInfos,
            },
          });
        } else {
          yield put({
            type: 'save',
            payload: {
              revalidationVidList: [],
            },
          });
        }
      } else throw resultMsg;
    },
    *queryOrderDetail({ payload }, { call, put, select }) {
      const { searchList } = yield select(state => state.orderDetailMgr);
      const params = { ...searchList, ...payload };
      yield put({
        type: 'save',
        payload: {
          searchList: params,
        },
      });
      const paramList = serialize(params);
      const response = yield call(queryBookingDetail, paramList);
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        const { bookingDetail } = result;
        yield put({
          type: 'saveOrderDetail',
          payload: {
            bookingDetail,
          },
        });
        yield put({
          type: 'saveOrderQuantity',
          payload: {
            bookingDetail,
          },
        });
      } else throw resultMsg;
    },
    *queryThemePark(_, { call, put }) {
      const response = yield call(queryOfferBookingCategory, {});
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        yield put({ type: 'save', payload: { themeParkList: result.offerBookingCategoryList } });
      } else throw resultMsg;
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveOrderQuantity(state, { payload }) {
      const { themeParkList = [] } = state;
      const { bookingDetail = {} } = payload;
      const { offers = [] } = bookingDetail;
      const offerGroupList = [];
      offers.forEach(offerInfo => {
        const offerGroupInfo = offerGroupList.find(
          offerGroupItem => offerInfo.offerGroup === offerGroupItem.offerGroup
        );
        if (!offerGroupInfo) {
          offerGroupList.push({
            offerGroup: offerInfo.offerGroup,
            offerList: [
              {
                ...offerInfo,
              },
            ],
          });
        } else {
          offerGroupInfo.offerList.push({
            ...offerInfo,
          });
        }
      });
      const orderQuantityList = [];
      offerGroupList.forEach(offerGroupItem => {
        const offerOrderQuantityItem = {
          offerGroup: offerGroupItem.offerGroup,
          itemList: [],
          quantityTotal: 0,
        };
        offerGroupItem.offerList.forEach(offerItem => {
          if (offerItem.bundleName) {
            const findQuantityItem = offerOrderQuantityItem.itemList.find(
              itemInfo => itemInfo.itemName === offerItem.bundleLabel
            );
            if (findQuantityItem) {
              findQuantityItem.itemQuantity += 1;
            } else {
              offerOrderQuantityItem.itemList.push({
                itemName: offerItem.bundleLabel,
                itemQuantity: 1,
                configQuantity: 1,
                numOfPax: null,
              });
            }
          } else {
            const { attraction = [], attractionGroupType, voucherOnly } = offerItem;
            if (attractionGroupType === 'Fixed' && attraction.length !== 1) {
              if (offerOrderQuantityItem.itemList.length > 0) {
                offerOrderQuantityItem.itemList[0].itemQuantity += 1;
              } else {
                const showName = [];
                const productNoList = [];
                attraction.forEach(attractionItem => {
                  if (attractionItem.ticketType !== 'Voucher') {
                    const productNoFind = productNoList.find(
                      productNoItem => productNoItem === attractionItem.prodNo
                    );
                    if (!productNoFind) {
                      productNoList.push(attractionItem.prodNo);
                      showName.push(attractionItem.ticketGroup || 'General');
                    }
                  }
                });
                offerOrderQuantityItem.itemList.push({
                  itemName: showName.join(','),
                  itemQuantity: 1,
                  configQuantity: 1,
                  numOfPax: null,
                });
              }
            } else {
              attraction.forEach(attractionItem => {
                if (voucherOnly === 'Yes' && attractionItem.ticketType === 'Voucher') {
                  const themeParkObj = themeParkList.find(
                    themeParkInfo => themeParkInfo.bookingCategoryCode === attractionItem.themePark
                  );
                  let showName = 'General';
                  if (themeParkObj) {
                    showName = themeParkObj.itemName;
                  }
                  const itemInfoFind = offerOrderQuantityItem.itemList.find(
                    itemInfo => itemInfo.prodNo === attractionItem.prodNo
                  );
                  if (itemInfoFind) {
                    itemInfoFind.itemQuantity += 1;
                  } else {
                    offerOrderQuantityItem.itemList.push({
                      itemName: showName,
                      itemQuantity: 1,
                      configQuantity: attractionItem.configQuantity,
                      prodNo: attractionItem.prodNo,
                      numOfPax: attractionItem.numOfPax,
                    });
                  }
                } else if (voucherOnly !== 'Yes' && attractionItem.ticketType !== 'Voucher') {
                  const itemInfoFind = offerOrderQuantityItem.itemList.find(
                    itemInfo => itemInfo.prodNo === attractionItem.prodNo
                  );
                  if (itemInfoFind) {
                    itemInfoFind.itemQuantity += 1;
                  } else {
                    // attractionItem.configQuantity
                    offerOrderQuantityItem.itemList.push({
                      itemName: attractionItem.ticketGroup || 'General',
                      itemQuantity: 1,
                      configQuantity: attractionItem.configQuantity,
                      prodNo: attractionItem.prodNo,
                      numOfPax: attractionItem.numOfPax,
                    });
                  }
                }
              });
            }
          }
        });
        offerOrderQuantityItem.itemList.forEach(itemInfo => {
          if (itemInfo.numOfPax) {
            itemInfo.itemQuantity = itemInfo.numOfPax;
          } else {
            itemInfo.itemQuantity /= itemInfo.configQuantity || 1;
          }
        });
        offerOrderQuantityItem.itemList.forEach(itemInfo => {
          offerOrderQuantityItem.quantityTotal += itemInfo.itemQuantity;
        });
        orderQuantityList.push(offerOrderQuantityItem);
      });
      // console.log(orderQuantityList);
      return {
        ...state,
        orderQuantityList,
      };
    },
    saveOrderDetail(state, { payload }) {
      const { bookingDetail = {} } = payload;
      const detailList = [];
      const vidResultList = [];
      const {
        offers = [],
        patronInfo = {},
        netAmt,
        refundSuccessFlag = false,
        status,
      } = bookingDetail;
      for (let i = 0; i < offers.length; i += 1) {
        const vidList = [];
        const { attraction = [] } = offers[i];
        if (attraction) {
          for (let j = 0; j < attraction.length; j += 1) {
            let isPackage = false;
            if (attraction[j].packageSpec) {
              isPackage = true;
            }
            if (isPackage) {
              const packageSpecObj = JSON.parse(attraction[j].packageSpec);
              const itemPluList = packageSpecObj.packageSpecAttributes || [];
              console.log(itemPluList)
              if (attraction[j].ticketType === 'MPP') {
                vidList.push({
                  vidNo: null,
                  vidCode: attraction[j].visualID,
                  themePark: attraction[j].themePark,
                  themeParks: attraction[j].themeParks,
                  ticketGroup: attraction[j].ticketGroup,
                  ticketType: attraction[j].ticketType,
                  numOfPax: getNumOfPaxInPackage(attraction[j]),
                });
                vidResultList.push({
                  vidNo: null,
                  vidCode: attraction[j].visualID,
                  themePark: attraction[j].themePark,
                  themeParks: attraction[j].themeParks,
                  offerName: offers[i].offerName,
                  ticketGroup: attraction[j].ticketGroup,
                  ticketType: attraction[j].ticketType,
                  numOfPax: getNumOfPaxInPackage(attraction[j]),
                });
                itemPluList.forEach(itemPlu => {
                  if (itemPlu.ticketType === 'Voucher') {
                    vidList.push({
                      vidNo: null,
                      vidCode: itemPlu.visualId,
                      themePark: itemPlu.themeParkCode,
                      ticketGroup: '',
                      ticketType: itemPlu.ticketType,
                      numOfPax: getNumOfPaxInPackage(attraction[j]),
                    });
                    vidResultList.push({
                      vidNo: null,
                      vidCode: itemPlu.visualId,
                      offerName: offers[i].offerName,
                      themePark: itemPlu.themeParkCode,
                      ticketGroup: '',
                      ticketType: itemPlu.ticketType,
                      numOfPax: getNumOfPaxInPackage(attraction[j]),
                    });
                  }
                });
              } else {
                itemPluList.forEach(itemPlu => {
                  vidList.push({
                    vidNo: null,
                    vidCode: itemPlu.visualId,
                    themePark: itemPlu.themeParkCode,
                    themeParks: attraction[j].themeParks,
                    ticketGroup: itemPlu.ageGroup,
                    ticketType: itemPlu.ticketType,
                    numOfPax: getNumOfPaxInPackage(attraction[j]),
                  });
                  vidResultList.push({
                    vidNo: null,
                    vidCode: itemPlu.visualId,
                    offerName: offers[i].offerName,
                    themePark: itemPlu.themeParkCode,
                    themeParks: attraction[j].themeParks,
                    ticketGroup: itemPlu.ageGroup,
                    ticketType: itemPlu.ticketType,
                    numOfPax: getNumOfPaxInPackage(attraction[j]),
                  });
                });
              }
            } else {
              vidList.push({
                vidNo: null,
                vidCode: attraction[j].visualID,
                themePark: attraction[j].themePark,
                themeParks: attraction[j].themeParks,
                ticketGroup: attraction[j].ticketGroup,
                ticketType: attraction[j].ticketType,
                numOfPax: getNumOfPaxInPackage(attraction[j]),
              });
              vidResultList.push({
                vidNo: null,
                vidCode: attraction[j].visualID,
                themePark: attraction[j].themePark,
                themeParks: attraction[j].themeParks,
                offerName: offers[i].offerName,
                ticketGroup: attraction[j].ticketGroup,
                ticketType: attraction[j].ticketType,
                numOfPax: getNumOfPaxInPackage(attraction[j]),
              });
            }
          }
        }
        detailList.push({
          offerName: offers[i].offerName,
          bundleName: offers[i].bundleName,
          visitDate: offers[i].visitDate,
          vidList,
          delivery: offers[i].deliveryInfo,
          offerGroup: offers[i].offerGroup,
        });
      }
      for (let i = 0; i < vidResultList.length; i += 1) {
        vidResultList[i].vidNo = (Array(3).join('0') + (i + 1)).slice(-3);
      }
      return {
        ...state,
        detailList,
        vidResultList,
        patronInfo,
        netAmt,
        refundSuccessFlag,
        status,
        bookingDetail,
      };
    },
    resetData(state) {
      return {
        ...state,
        orderDetailVisible: false,
        detailType: 'Revalidation',
        searchList: {
          bookingNo: null,
          isSubOrder: null,
        },
        detailList: [],
        vidResultList: [],
        patronInfo: {},
        themeParkList: [],
        netAmt: 0,
        refundSuccessFlag: false,
        status: null,
        revalidationVidListVisible: false,
        revalidationVidList: [],
        bookingDetail: null,
        orderQuantityList: [],
      };
    },
  },

  subscriptions: {},
};
