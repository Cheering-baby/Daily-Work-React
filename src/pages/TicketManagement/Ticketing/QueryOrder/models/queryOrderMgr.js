import { formatMessage } from 'umi/locale';
import { message } from 'antd';
import serialize from '../utils/utils';
import {
  attractionTaConfirm,
  downloadETicket,
  downloadInvoice,
  queryOrder,
} from '../services/queryOrderService';

export default {
  namespace: 'queryOrderMgr',
  state: {
    transactionList: [],
    searchConditions: {
      deliveryLastName: null,
      deliveryFirstName: null,
      confirmationNumber: null,
      bookingId: null,
      taReferenceNo: null,
      status: null,
      orderType: null,
      createTimeFrom: null,
      createTimeTo: null,
      agentType: 'agentId',
      agentValue: null,
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
      let paramsStatus = params.status;
      let paramsOrderType = params.orderType;
      if (params.status === 'Confirmed') {
        paramsStatus = 'Complete';
      }
      if (
        params.status === 'PendingOrderNo' &&
        (params.orderType === null || params.orderType.search('Revalidation') !== -1)
      ) {
        paramsOrderType = 'Revalidation';
        paramsStatus = 'Confirmed';
      }
      if (
        params.status === 'PendingRefund' &&
        (params.orderType === null || params.orderType.search('Refund') !== -1)
      ) {
        paramsOrderType = 'Refund';
        paramsStatus = 'Confirmed';
      }
      if (params.agentValue !== null) {
        params.agentValue = params.agentValue.trim();
      }
      const paramList = {
        ...params,
        deliveryLastName: params.deliveryLastName !== null ? params.deliveryLastName.trim() : null,
        deliveryFirstName:
          params.deliveryFirstName !== null ? params.deliveryFirstName.trim() : null,
        confirmationNumber:
          params.confirmationNumber !== null ? params.confirmationNumber.trim() : null,
        bookingId: params.bookingId !== null ? params.bookingId.trim() : null,
        taReferenceNo: params.taReferenceNo !== null ? params.taReferenceNo.trim() : null,
        orderType: paramsOrderType,
        status: paramsStatus,
        agentId: params.agentType === 'agentId' ? params.agentValue : null,
        agentName: params.agentType === 'agentName' ? params.agentValue : null,
      };
      delete paramList.agentType;
      delete paramList.agentValue;
      const response = yield call(queryOrder, serialize(paramList));
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
      } else {
        message.error(resultMsg);
      }
    },
    *download({ payload }, { call }) {
      const { ifReprint = false } = payload;
      delete payload.ifReprint;
      const paramList = serialize(payload);
      let response = null;
      if (ifReprint) {
        response = yield call(downloadInvoice, paramList);
      } else {
        response = yield call(downloadETicket, paramList);
      }
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        try {
          window.open(result);
        } catch (e) {
          if (ifReprint) {
            return formatMessage({ id: 'FAILED_TO_REPRINT' });
          }
          return formatMessage({ id: 'FAILED_TO_DOWNLOAD' });
        }
      } else {
        return resultMsg;
      }
      return resultCode;
    },
    *resubmit({ payload }, { call, put }) {
      const response = yield call(attractionTaConfirm, payload);
      if (!response) return false;
      const {
        data: { resultCode, resultMsg },
      } = response;
      if (resultCode === '0') {
        yield put({ type: 'queryTransactions' });
      } else {
        message.error(resultMsg);
      }
      return resultCode;
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
          deliveryLastName: null,
          deliveryFirstName: null,
          confirmationNumber: null,
          bookingId: null,
          taReferenceNo: null,
          status: null,
          orderType: null,
          createTimeFrom: null,
          createTimeTo: null,
          agentType: 'agentId',
          agentValue: null,
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
