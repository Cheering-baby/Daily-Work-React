import { serialize } from '../utils/utils';
import { queryBookingDetail } from '@/pages/TicketManagement/Ticketing/QueryOrder/services/queryOrderService';

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
  },

  effects: {
    *effectSave({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
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
      const { offers = [] } = bookingDetail;
      for (let i = 0; i < offers.length; i += 1) {
        const vidList = [];
        const { attraction = [] } = offers[i];
        if (attraction) {
          for (let j = 0; j < attraction.length; j += 1) {
            vidList.push({
              vidNo: null,
              vidCode: attraction[j].visualID,
            });
            vidResultList.push({
              vidNo: null,
              vidCode: attraction[j].visualID,
              offerName: offers[i].offerName,
            });
          }
        }
        for (let j = 0; j < vidList.length; j += 1) {
          vidList[j].vidNo = (Array(3).join('0') + (j + 1)).slice(-3);
        }
        detailList.push({
          offerName: offers[i].offerName,
          vidList,
          delivery: offers[i].deliveryInfo,
        });
      }
      for (let i = 0; i < vidResultList.length; i += 1) {
        vidResultList[i].vidNo = (Array(3).join('0') + (i + 1)).slice(-3);
      }
      return {
        ...state,
        detailList,
        vidResultList,
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
      };
    },
  },

  subscriptions: {},
};
