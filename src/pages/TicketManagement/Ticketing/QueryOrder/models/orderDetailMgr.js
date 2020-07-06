import serialize from '../utils/utils';
import {
  queryBookingDetail,
  queryPluAttribute,
  queryRevalidationVids,
} from '@/pages/TicketManagement/Ticketing/QueryOrder/services/queryOrderService';

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
      } else throw resultMsg;
    },
    *queryThemePark(_, { call, put }) {
      const response = yield call(queryPluAttribute, { attributeItem: 'THEME_PARK' });
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        yield put({ type: 'save', payload: { themeParkList: result.items } });
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
              const packageThemeparkList = [];
              itemPluList.forEach(itemPlu => {
                if (itemPlu.ticketType !== 'Voucher' && itemPlu.themeParkCode) {
                  const themeParkIndex = packageThemeparkList.findIndex(
                    item => item === itemPlu.themeParkCode
                  );
                  if (themeParkIndex < 0) {
                    packageThemeparkList.push(itemPlu.themeParkCode);
                  }
                }
              });
              itemPluList.forEach(itemPlu => {
                if (itemPlu.ticketType === 'Voucher' || packageThemeparkList.length < 2) {
                  vidList.push({
                    vidNo: null,
                    vidCode: itemPlu.visualId,
                    themePark: itemPlu.themeParkCode,
                    ticketGroup: itemPlu.ageGroup,
                    ticketType: itemPlu.ticketType,
                  });
                  vidResultList.push({
                    vidNo: null,
                    vidCode: itemPlu.visualId,
                    offerName: offers[i].offerName,
                    themePark: itemPlu.themeParkCode,
                    ticketGroup: itemPlu.ageGroup,
                    ticketType: itemPlu.ticketType,
                  });
                }
              });
              if (packageThemeparkList.length > 1) {
                vidList.push({
                  vidNo: null,
                  vidCode: attraction[j].visualID,
                  themePark: attraction[j].themePark,
                  ticketGroup: attraction[j].ticketGroup,
                  ticketType: attraction[j].ticketType,
                });
                vidResultList.push({
                  vidNo: null,
                  vidCode: attraction[j].visualID,
                  themePark: attraction[j].themePark,
                  offerName: offers[i].offerName,
                  ticketGroup: attraction[j].ticketGroup,
                  ticketType: attraction[j].ticketType,
                });
              }
            } else {
              vidList.push({
                vidNo: null,
                vidCode: attraction[j].visualID,
                themePark: attraction[j].themePark,
                ticketGroup: attraction[j].ticketGroup,
                ticketType: attraction[j].ticketType,
              });
              vidResultList.push({
                vidNo: null,
                vidCode: attraction[j].visualID,
                themePark: attraction[j].themePark,
                offerName: offers[i].offerName,
                ticketGroup: attraction[j].ticketGroup,
                ticketType: attraction[j].ticketType,
              });
            }
          }
        }
        detailList.push({
          offerName: offers[i].offerName,
          bundleName: offers[i].bundleName,
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
      };
    },
  },

  subscriptions: {},
};
