import serialize from '@/pages/TicketManagement/Ticketing/QueryOrder/utils/utils';
import {queryBookingDetail} from '@/pages/TicketManagement/Ticketing/QueryOrder/services/queryOrderService';

export default {
  namespace: 'orderDetailMgr',
  state: {
    orderDetailVisible: false,
    detailType: 'Revalidation',
    searchList: {
      bookingNo: null,
      isSubOrder: null,
    },
    vidList: [],
    deliveryInfo: {},
  },

  effects: {
    * queryOrderDetail({payload}, {call, put, select}) {
      const {searchList} = yield select(state => state.orderDetailMgr);
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
          type: 'saveOrderDetail',
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
    saveOrderDetail(state, {payload}) {
      const {bookingDetail = {}} = payload;
      const vidList = [];
      let delivery = {};
      const {offers = []} = bookingDetail;
      if (offers.length > 0) {
        delivery = offers[0].deliveryInfo;
      }
      for (let i = 0; i < offers.length; i += 1) {
        const {attraction = []} = offers[i];
        if (attraction) {
          for (let j = 0; j < attraction.length; j += 1) {
            vidList.push({
              vidNo: null,
              vidCode: attraction[j].visualID,
              offerName: offers[i].offerName,
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
        deliveryInfo: delivery,
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
        vidList: [],
        deliveryInfo: {},
      };
    },
  },

  subscriptions: {},
};
