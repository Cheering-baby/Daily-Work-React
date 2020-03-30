import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import { serialize } from '../utils/utils';
import { accept, downloadETicket, queryOrder } from '../services/queryOrderService';
import { ERROR_CODE_SUCCESS } from '@/utils/commonResultCode';

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
      agentId: null,
      agentName: null,
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
    *queryTransactions({ payload }, { call, put, select }) {
      const { searchConditions } = yield select(state => state.queryOrderMgr);
      const params = { ...searchConditions, ...payload };
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
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        const { totalSize = 0, bookings = [] } = result;
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
    *downloadETicket({ payload }, { call }) {
      const paramList = serialize(payload);
      const response = yield call(downloadETicket, paramList);
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        try {
          new Promise(resolve => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', result, true);
            xhr.responseType = 'blob';
            xhr.onload = () => {
              if (xhr.status === 200) {
                resolve(xhr.response);
              }
            };
            xhr.send();
          }).then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.id = 'exportFile';
            a.href = url;
            a.download = url;
            document.body.append(a);
            a.click();
            document.getElementById('exportFile').remove();
            window.URL.revokeObjectURL(url);
          });
        } catch (e) {
          return formatMessage({ id: 'FAILED_TO_DOWNLOAD' });
        }
      } else {
        return resultMsg;
      }
      return resultCode;
    },
    *approve({ payload }, { call, put }) {
      const { activityId } = payload;
      const response = yield call(accept, { activityId });
      if (!response) return false;
      const { data: resultData, success, errorMsg } = response;
      if (success) {
        const { resultCode, resultMsg } = resultData;
        if (resultCode !== ERROR_CODE_SUCCESS) {
          throw resultMsg;
        }
        message.success(resultMsg);
        yield put({ type: 'queryTransactions' });
      } else throw errorMsg;
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveSearchConditions(state, { payload }) {
      const { searchConditions } = state;
      return {
        ...state,
        searchConditions: {
          ...searchConditions,
          ...payload,
        },
      };
    },
    saveSelectBookings(state, { payload }) {
      const { transactionList } = state;
      const { selectedRowKeys } = payload;
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
    saveSubSelectBookings(state, { payload }) {
      const subSelectedBookings = [];
      const { subSelectedRowKeys, productInstances } = payload;
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
          agentId: null,
          agentName: null,
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
