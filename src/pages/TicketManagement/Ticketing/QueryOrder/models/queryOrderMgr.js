import { formatMessage } from 'umi/locale';
import { message } from 'antd';
import serialize from '../utils/utils';
import moment from 'moment';
import {
  attractionTaConfirm,
  downloadETicket,
  downloadInvoice,
  queryOrder,
  queryTask,
} from '../services/queryOrderService';

export default {
  namespace: 'queryOrderMgr',
  state: {
    isQueryExpand: true,
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
    downloadFileLoading: false,
    expandTableKeys: [],
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
        checkInDateTo: params.checkInDateFrom ? moment(params.checkInDateFrom).add('d', 1).format('YYYY-MM-DD') : null,
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
        sortType: 1,
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
            expandTableKeys: [],
          },
        });
      } else {
        message.error(resultMsg);
      }
    },
    *download({ payload }, { call, put, select }) {
      const { ifReprint = false } = payload;
      delete payload.ifReprint;
      yield put({
        type: 'save',
        payload: {
          downloadFileLoading: true,
        },
      });
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
      if (resultCode === '0' || resultCode === 'AppTransaction-120042') {
        if (resultCode === 'AppTransaction-120042') {
          message.warn(resultMsg);
        }
        if (!ifReprint) {
          let taskStatus = 'processing';
          while (taskStatus === 'processing') {
            const { downloadFileLoading } = yield select(state => state.queryOrderMgr);
            if (!downloadFileLoading) {
              return;
            }
            const queryTaskParams = {
              taskId: result,
            };
            const responseDetail = yield call(queryTask, queryTaskParams);
            const {
              data: {
                resultCode: queryTaskResultCode,
                resultMsg: queryTaskResultMsg,
                result: queryTaskResult,
              },
            } = responseDetail;
            if (!responseDetail || !responseDetail.success) {
              message.error('queryTask error.');
              return;
            }
            if (queryTaskResultCode === '0') {
              if (queryTaskResult && queryTaskResult.status === 2) {
                taskStatus = 'success';
                try {
                  window.open(queryTaskResult.result);
                  message.success(formatMessage({ id: 'DOWNLOADED_SUCCESSFULLY' }));
                } catch (e) {
                  message.error(formatMessage({ id: 'FAILED_TO_DOWNLOAD' }));
                }
              }
              if (queryTaskResult && queryTaskResult.status === 3) {
                taskStatus = 'failed';
              }
              if (queryTaskResult && queryTaskResult.reason) {
                message.warn(queryTaskResult.reason);
              }
            } else {
              taskStatus = 'failed';
              message.error(queryTaskResultMsg);
            }
            yield call(
              () =>
                new Promise(resolve => {
                  setTimeout(() => resolve(), 5000);
                })
            );
          }
          if (resultCode === 'AppTransaction-120042') {
            message.warn(resultMsg);
          }
          yield put({
            type: 'save',
            payload: {
              downloadFileLoading: false,
            },
          });
        } else {
          try {
            window.open(result);
            message.success(formatMessage({ id: 'DOWNLOADED_SUCCESSFULLY' }));
          } catch (e) {
            if (ifReprint) {
              message.error(formatMessage({ id: 'FAILED_TO_REPRINT' }));
            }
            message.error(formatMessage({ id: 'FAILED_TO_DOWNLOAD' }));
          }
        }
      } else {
        return resultMsg;
      }
      yield put({
        type: 'save',
        payload: {
          downloadFileLoading: false,
        },
      });
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
        isQueryExpand: true,
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
        downloadFileLoading: false,
        expandTableKeys: [],
      };
    },
  },

  subscriptions: {},
};
