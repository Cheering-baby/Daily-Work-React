import {queryOrder} from '../services/queryOrderService';
import serialize from '../utils/utils';

export default {
  namespace: 'queryOrderMgr',
  state: {
    transactionList: [],
    searchConditions: {
      lastName: null,
      firstName: null,
      confirmationNumber: null,
      bookingId: null,
      taReferenceNo: null,
      status: null,
      orderType: null,
      createTimeFrom: null,
      createTimeTo: null,
      currentPage: 1,
      pageSize: 10,
    },
    totalSize: 0,
    selectedRowKeys: [],
    selectedBookings: [],
    subSelectedRowKeys: [],
    subSelectedBookings: [],
  },

  effects: {
    * queryTransactions({payload}, {call, put, select}) {
      const {searchConditions} = yield select(state => state.queryOrderMgr);
      const params = {...searchConditions, ...payload};
      yield put({
        type: 'save',
        payload: {
          searchConditions: params,
        },
      });
      const paramList = serialize(params);
      const response = yield call(queryOrder, paramList);
      if (!response) return false;
      const {
        data: {resultCode, resultMsg, result},
      } = response;
      if (resultCode === '0') {
        const {totalSize = 0, bookings = []} = result;
        bookings.map((e, index) => {
          Object.assign(e, {
            key: index,
          });
          return e;
        });
        yield put({
          type: 'save',
          payload: {
            transactionList: bookings,
            totalSize,
            selectedRowKeys: [],
            selectedBookings: [],
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
    saveSearchConditions(state, {payload}) {
      const {searchConditions} = state;
      return {
        ...state,
        searchConditions: {
          ...searchConditions,
          ...payload,
        },
      };
    },
    saveSelectBookings(state, {payload}) {
      const {transactionList} = state;
      const {selectedRowKeys} = payload;
      const selectedBookings = [];
      for (let i = 0; i < transactionList.length; i += 1) {
        for (let j = 0; j < selectedRowKeys.length; j += 1) {
          if (selectedRowKeys[j] === transactionList[i].key) {
            selectedBookings.push(transactionList[i]);
          }
        }
      }
      return {
        ...state,
        selectedRowKeys,
        selectedBookings,
      };
    },
    saveSubSelectBookings(state, {payload}) {
      const subSelectedBookings = [];
      const {subSelectedRowKeys, productInstances} = payload;
      for (let i = 0; i < productInstances.length; i += 1) {
        for (let j = 0; j < subSelectedRowKeys.length; j += 1) {
          if (subSelectedRowKeys[j] === productInstances[i].key) {
            subSelectedBookings.push(productInstances[i]);
          }
        }
      }
      return {
        ...state,
        subSelectedRowKeys,
        subSelectedBookings,
      };
    },
    resetData() {
      return {
        transactionList: [],
        searchConditions: {
          lastName: null,
          firstName: null,
          confirmationNumber: null,
          bookingId: null,
          taReferenceNo: null,
          status: null,
          orderType: null,
          createTimeFrom: null,
          createTimeTo: null,
          currentPage: 1,
          pageSize: 10,
        },
        totalSize: 0,
        selectedRowKeys: [],
        selectedBookings: [],
        subSelectedRowKeys: [],
        subSelectedBookings: [],
      };
    },
  },

  subscriptions: {},
};
