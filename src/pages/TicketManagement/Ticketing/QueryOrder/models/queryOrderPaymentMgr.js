import { cloneDeep } from 'lodash';
import { message, Modal } from 'antd';
import {
  accountTopUp,
  invoiceDownload,
  paymentOrder,
  queryBookingStatus,
  sendTransactionPaymentOrder,
  ticketDownload,
} from '@/pages/TicketManagement/services/bookingAndPay';
import { queryAccount, queryTaInfo } from '@/pages/TicketManagement/services/taMgrService';

export default {
  namespace: 'queryOrderPaymentMgr',
  state: {
    downloadFileLoading: false,
    paymentPromptVisible: false,
    paymentModalVisible: false,
    payPageLoading: false,
    bookingNo: null,
    selectedBooking: null,
    bookDetail: {
      totalPrice: 0,
    },
    payModeList: [
      {
        value: 1,
        label: 'eWallet',
        key: 'eWallet',
        check: true,
      },
      {
        value: 2,
        label: 'Credit Card',
        key: 'CREDIT_CARD',
        check: false,
      },
      {
        value: 3,
        label: 'AR',
        key: 'AR',
        check: false,
      },
    ],
    taDetailInfo: null,
    accountInfo: null,
  },

  effects: {
    *effectSave({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
    },

    *initPage(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          payPageLoading: true,
        },
      });
      yield put({
        type: 'fetchAccountDetail',
        payload: {},
      });
      yield put({
        type: 'fetchQueryTaDetail',
        payload: {},
      });
    },

    *fetchAccountDetail(_, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          payPageLoading: true,
        },
      });
      const {
        userCompanyInfo: { companyId = '' },
      } = yield select(state => state.global);
      const params = { taId: companyId };
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(queryAccount, params);
      yield put({
        type: 'save',
        payload: {
          payPageLoading: false,
        },
      });
      if (resultCode === '0') {
        if (!result.accountProfileBean) return;
        const bean = cloneDeep(result.accountProfileBean);
        bean.accountBookBeanList.forEach(item => {
          if (item.accountBookType === 'E_WALLET') {
            bean.eWallet = cloneDeep(item);
          }
          if (item.accountBookType === 'AR_CREDIT') {
            bean.ar = cloneDeep(item);
          }
          if (item.accountBookType === 'CREDIT_CARD') {
            bean.cc = cloneDeep(item);
          }
        });
        yield put({
          type: 'save',
          payload: {
            accountInfo: bean,
          },
        });
      } else {
        message.error(resultMsg);
      }
    },

    *fetchQueryTaDetail(_, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          payPageLoading: true,
        },
      });
      const {
        userCompanyInfo: { companyId = '' },
      } = yield select(state => state.global);
      const params = { taId: companyId };
      const queryTaInfoResponse = yield call(queryTaInfo, params);
      // console.log(queryTaInfoResponse);
      if (!queryTaInfoResponse || !queryTaInfoResponse.data) {
        message.error('Query ta info service error!');
        return;
      }
      const {
        data: { resultCode, resultMsg, result = {} },
      } = queryTaInfoResponse;
      yield put({
        type: 'save',
        payload: {
          payPageLoading: false,
        },
      });
      if (resultCode === '0') {
        yield put({
          type: 'save',
          payload: {
            taDetailInfo: result,
          },
        });
      } else {
        message.error(resultMsg);
      }
    },

    *fetchAccountTopUp({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          payPageLoading: true,
        },
      });
      const params = { topupAmount: payload.topupAmount };
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(accountTopUp, params);
      yield put({
        type: 'save',
        payload: {
          payPageLoading: false,
        },
      });
      if (resultCode === '0') {
        return result;
      }
      message.error(resultMsg);
    },

    *sendTransactionPaymentOrder(_, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          payPageLoading: true,
        },
      });

      const {
        bookDetail: { totalPrice },
      } = yield select(state => state.queryOrderPaymentMgr);

      if (Number.parseFloat(totalPrice) === Number.parseFloat(0)) {
        yield put({
          type: 'queryBookingStatus',
          payload: {},
        });
        message.success('Confirmed successfully.');
        return null;
      }

      const { bookingNo, taDetailInfo } = yield select(state => state.queryOrderPaymentMgr);

      let emailNo = '';
      if (taDetailInfo && taDetailInfo.otherInfo && taDetailInfo.otherInfo.billingInfo) {
        emailNo = taDetailInfo.otherInfo.billingInfo.email;
      }
      const params = {
        orderNo: bookingNo,
        emailNo,
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(sendTransactionPaymentOrder, params);

      yield put({
        type: 'save',
        payload: {
          payPageLoading: false,
        },
      });

      if (resultCode === '0') {
        yield put({
          type: 'queryBookingStatus',
          payload: {},
        });
        message.success('Confirmed successfully.');
        return result;
      }

      message.error(resultMsg);
    },

    *confirmEvent(_, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          payPageLoading: true,
        },
      });

      const {
        bookDetail: { totalPrice },
      } = yield select(state => state.queryOrderPaymentMgr);

      if (Number.parseFloat(totalPrice) === Number.parseFloat(0)) {
        yield put({
          type: 'queryBookingStatus',
          payload: {},
        });
        return null;
      }

      const { bookingNo, payModeList } = yield select(state => state.queryOrderPaymentMgr);

      const payMode = payModeList.filter(payModeItem => payModeItem.check);
      const params = {
        orderNo: bookingNo,
        paymentMode: payMode[0].key,
      };
      const {
        data: { resultCode, resultMsg },
      } = yield call(paymentOrder, params);
      yield put({
        type: 'save',
        payload: {
          payPageLoading: false,
        },
      });
      if (resultCode === '0') {
        yield put({
          type: 'queryBookingStatus',
          payload: {},
        });
      } else {
        message.error(resultMsg);
      }
    },

    *queryBookingStatus(_, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          payPageLoading: true,
        },
      });

      const { bookingNo } = yield select(state => state.queryOrderPaymentMgr);
      let status = 'WaitingForPaying';
      let statusResult = {};
      while (status === 'WaitingForPaying' || status === 'Paying' || status === 'Archiving') {
        const { data: statusData = {} } = yield call(queryBookingStatus, { bookingNo });
        const { bookingNo: bookingNoNew } = yield select(state => state.queryOrderPaymentMgr);
        if (!bookingNoNew || bookingNo !== bookingNoNew) {
          return;
        }
        const { resultCode: statusResultCode, result: newResult = {} } = statusData;
        if (statusResultCode === '0') {
          const { transStatus } = newResult;
          status = transStatus;
          statusResult = newResult;
        } else {
          status = 'Failed';
        }
        if (status === 'WaitingForPaying' || status === 'Paying' || status === 'Archiving') {
          // if status is still WaitingForPaying, suspend 5 second.
          yield call(
            () =>
              new Promise(resolve => {
                setTimeout(() => resolve(), 5000);
              })
          );
        }
      }
      yield put({
        type: 'save',
        payload: {
          payPageLoading: false,
        },
      });
      if (status === 'Complete') {
        yield put({
          type: 'save',
          payload: {
            payPageLoading: false,
            paymentModalVisible: false,
            paymentPromptVisible: true,
          },
        });
        yield put({
          type: 'queryOrderMgr/queryTransactions',
          payload: {},
        });
        yield put({
          type: 'fetchInvoiceDownload',
          payload: {},
        });
      } else {
        const { failedReason } = statusResult;
        Modal.error({
          title: 'Confirm failed',
          content: failedReason,
        });
      }
    },

    *fetchTicketDownload(_, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          downloadFileLoading: true,
        },
      });
      const { bookingNo } = yield select(state => state.queryOrderPaymentMgr);
      const params = {
        forderNo: bookingNo,
      };
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(ticketDownload, params);
      yield put({
        type: 'save',
        payload: {
          downloadFileLoading: false,
        },
      });
      if (resultCode === '0') {
        return result;
      }
      message.error(resultMsg);
    },

    *fetchInvoiceDownload(_, { call, select }) {
      const { bookingNo } = yield select(state => state.queryOrderPaymentMgr);
      const params = {
        forderNo: bookingNo,
      };
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(invoiceDownload, params);

      if (resultCode === '0') {
        const openWindow = window.open('about:blank');
        if (openWindow) {
          openWindow.location.href = result;
        } else {
          message.error('Confirmation receipt download error!');
        }
        return result;
      }
      message.error(resultMsg);
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
        downloadFileLoading: false,
        paymentPromptVisible: false,
        paymentModalVisible: false,
        payPageLoading: false,
        bookingNo: null,
        selectedBooking: null,
        bookDetail: {
          totalPrice: 0,
        },
        payModeList: [
          {
            value: 1,
            label: 'eWallet',
            key: 'eWallet',
            check: true,
          },
          {
            value: 2,
            label: 'Credit Card',
            key: 'CREDIT_CARD',
            check: false,
          },
          {
            value: 3,
            label: 'AR',
            key: 'AR',
            check: false,
          },
        ],
        taDetailInfo: null,
        accountInfo: null,
      };
    },
  },

  subscriptions: {},
};
