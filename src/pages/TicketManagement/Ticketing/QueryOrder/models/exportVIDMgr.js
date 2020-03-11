import serialize from '@/pages/TicketManagement/Ticketing/QueryOrder/utils/utils';
import {queryBookingDetail} from '@/pages/TicketManagement/Ticketing/QueryOrder/services/queryOrderService';

export default {
  namespace: 'exportVIDMgr',
  state: {
    exportVIDVisible: false,
    searchList: {
      bookingNo: null,
      isSubOrder: null,
    },
    vidList: [],
  },

  effects: {
    * queryVIDList({payload}, {call, put, select}) {
      const {searchList} = yield select(state => state.exportVIDMgr);
      const params = {...searchList, ...payload};
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
        data: {resultCode, resultMsg, result},
      } = response;
      if (resultCode === '0') {
        const {bookingDetail} = result;
        yield put({
          type: 'saveVIDList',
          payload: {
            bookingDetail,
          },
        });
      } else throw resultMsg;
    },
  },

  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
    saveVIDList(state, {payload}) {
      const {bookingDetail = {}} = payload;
      const vidList = [];
      const {offers = []} = bookingDetail;
      for (let i = 0; i < offers.length; i += 1) {
        const {attraction = []} = offers[i];
        if (attraction) {
          for (let j = 0; j < attraction.length; j += 1) {
            vidList.push({
              vidNo: null,
              vidCode: attraction[j].visualID,
              offerName: offers[i].offerName,
              status: attraction[j].visualIdStatus,
            });
          }
        }
      }
      for (let i = 0; i < vidList.length; i += 1) {
        vidList[i].vidNo = (Array(3).join('0') + (i + 1)).slice(-3);
      }
      return {
        ...state,
        vidList,
      };
    },
    resetData(state) {
      return {
        ...state,
        exportVIDVisible: false,
        searchList: {
          bookingNo: null,
          isSubOrder: null,
        },
        vidList: [],
      };
    },
  },

  subscriptions: {},
};
