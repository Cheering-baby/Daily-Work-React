import { message, Modal } from 'antd';
import router from 'umi/router';
import { cloneDeep } from 'lodash';
import {
  accountTopUp,
  invoiceDownload,
  paymentOrder,
  queryBookingDetail,
  queryBookingStatus,
  queryTask,
  sendTransactionPaymentOrder,
  ticketDownload,
  createBooking,
} from '@/pages/TicketManagement/services/bookingAndPay';

import {
  queryAccount,
  queryAccountInfo,
  queryInfoWithNoId,
  queryTaInfo,
} from '@/pages/TicketManagement/services/taMgrService';
import UAAService from '@/uaa-npm';
import {
  transBookingCommonOffers,
  transBookingToPayTotalPrice,
  transOapCommonOffers,
  transPackageCommonOffers,
} from '@/pages/TicketManagement/utils/orderCartUtil';

export default {
  namespace: 'ticketBookingAndPayMgr',

  state: {
    payPageLoading: false,
    deliveryMode: undefined,
    payModeList: [
      {
        value: 1,
        label: 'e-Wallet',
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
    collectionDate: null,
    ticketAmount: 0,
    bocaFeePax: 0.0,
    bocaFeeGst: 0.0,
    bookingOrderData: [],
    packageOrderData: [],
    generalTicketOrderData: [],
    onceAPirateOrderData: [],
    payModelShow: false,
    bookingNo: null,
    taDetailInfo: null,
    accountInfo: null,
    bookDetail: {
      totalPrice: null,
    },
    downloadFileLoading: false,
    paymentResultLoading: false,
  },

  effects: {
    *initPage(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          payPageLoading: true,
        },
      });
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

    *fetchTicketDownload(_, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          downloadFileLoading: true,
        },
      });
      const { bookingNo } = yield select(state => state.ticketBookingAndPayMgr);
      const params = {
        forderNo: bookingNo,
      };
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(ticketDownload, params);

      if (resultCode === '0' || resultCode === 'AppTransaction-120042') {
        if (resultCode === 'AppTransaction-120042') {
          message.warn(resultMsg);
        }
        let taskStatus = 'processing';
        while (taskStatus === 'processing') {
          const { downloadFileLoading } = yield select(state => state.ticketBookingAndPayMgr);
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
            yield put({
              type: 'save',
              payload: {
                downloadFileLoading: false,
              },
            });
            return;
          }
          if (queryTaskResultCode === '0') {
            if (queryTaskResult && queryTaskResult.status === 2) {
              taskStatus = 'success';
              yield put({
                type: 'save',
                payload: {
                  downloadFileLoading: false,
                },
              });
              return queryTaskResult.result;
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
        yield put({
          type: 'save',
          payload: {
            downloadFileLoading: false,
          },
        });
        return null;
      }
      yield put({
        type: 'save',
        payload: {
          downloadFileLoading: false,
        },
      });
      message.error(resultMsg);
      return null;
    },

    *fetchInvoiceDownload(_, { call, select }) {
      const { bookingNo } = yield select(state => state.ticketBookingAndPayMgr);
      const params = {
        forderNo: bookingNo,
      };
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(invoiceDownload, params);

      if (resultCode === '0') {
        const openWindow = window.open('about:blank');
        if (openWindow) {
          // openWindow.pamsLocation.href = result;
          openWindow.location.href = result;
        } else {
          message.error('Confirmation receipt download error!');
        }
        return result;
      }
      message.error(resultMsg);
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

    *sendTransactionPaymentOrder(_, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          payPageLoading: true,
        },
      });

      const {
        bookDetail: { totalPrice },
      } = yield select(state => state.ticketBookingAndPayMgr);

      if (Number.parseFloat(totalPrice) === Number.parseFloat(0)) {
        yield put({
          type: 'queryBookingStatus',
          payload: {},
        });
        message.success('Confirmed successfully.');
        return null;
      }

      const { bookingNo, taDetailInfo } = yield select(state => state.ticketBookingAndPayMgr);

      let emailNo = '';
      if (taDetailInfo && taDetailInfo.otherInfo && taDetailInfo.otherInfo.billingInfo) {
        emailNo = taDetailInfo.otherInfo.billingInfo.email;
      }
      const paymentResponseUrl = `${UAAService.defaults.uaaPath}/#/TicketManagement/Ticketing/OrderCart/PaymentResult?orderNo=${bookingNo}`;
      const params = {
        orderNo: bookingNo,
        emailNo,
        paymentResponseUrl,
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

    *orderBooking(_, { call, put, select, take }) {
      yield put({
        type: 'save',
        payload: {
          payPageLoading: true,
        },
      });

      const {
        deliveryMode,
        collectionDate,
        ticketAmount,
        bocaFeePax,
        bocaFeeGst,
        generalTicketOrderData = [],
        packageOrderData = [],
        onceAPirateOrderData = [],
      } = yield select(
        state => state.ticketBookingAndPayMgr
      );

      const { cartId, taDetailInfo, subTaDetailInfo, countrys } = yield select(
        state => state.ticketOrderCartMgr
      );

      const {
        userCompanyInfo: { companyType },
      } = yield select(state => state.global);

      let patronInfo = null;

      if (companyType === '02') {
        if (subTaDetailInfo) {
          patronInfo = {
            firstName: subTaDetailInfo.fullName,
            lastName: null,
            phoneNo: null,
            email: subTaDetailInfo.email,
            countryCode: subTaDetailInfo.country,
          };
        }
      } else if (
        taDetailInfo &&
        taDetailInfo.customerInfo &&
        taDetailInfo.customerInfo.companyInfo
      ) {
        const { contactInfo, companyInfo } = taDetailInfo.customerInfo;
        patronInfo = {
          firstName: contactInfo.firstName,
          lastName: contactInfo.lastName,
          phoneNo: contactInfo.phone,
          email: contactInfo.email,
          countryCode: companyInfo.country,
        };
      }

      const countryInfo = countrys.find(
        countryItem => countryItem.dictId === patronInfo.countryCode
      );
      if (countryInfo) {
        patronInfo.countryCode = countryInfo.dictName;
      } else {
        patronInfo.countryCode = 'Singapore';
      }

      const bookingParam = {
        customerId: '',
        commonOffers: [],
        patronInfo,
        totalPrice: 0,
        identificationNo: null,
        identificationType: null,
        voucherNos: [],
        cartId,
      };

      const packageCommonOffers = transPackageCommonOffers(
        packageOrderData,
        collectionDate,
        deliveryMode
      );
      const bookingCommonOffers = transBookingCommonOffers(
        generalTicketOrderData,
        collectionDate,
        deliveryMode
      );
      const oapCommonOffers = transOapCommonOffers(
        onceAPirateOrderData,
        collectionDate,
        deliveryMode,
        patronInfo
      );
      bookingParam.commonOffers = [
        ...packageCommonOffers,
        ...bookingCommonOffers,
        ...oapCommonOffers,
      ];
      if (deliveryMode && deliveryMode === 'BOCA') {
        bookingParam.totalPrice = transBookingToPayTotalPrice(
          packageOrderData,
          generalTicketOrderData,
          onceAPirateOrderData,
          bocaFeePax
        );
      } else {
        bookingParam.totalPrice = transBookingToPayTotalPrice(
          packageOrderData,
          generalTicketOrderData,
          onceAPirateOrderData,
          null
        );
      }

      const { data } = yield call(createBooking, bookingParam);
      if (data) {
        const { resultCode, resultMsg, result = {} } = data;
        if (resultCode === '0') {
          const { bookingNo } = result;
          yield put({
            type: 'ticketBookingAndPayMgr/save',
            payload: {
              bookingNo,
            },
          });
          return '0';
        } else {
          yield put({
            type: 'save',
            payload: {
              payPageLoading: false,
            },
          });
          message.error(resultMsg);
        }
      } else {
        yield put({
          type: 'save',
          payload: {
            payPageLoading: false,
          },
        });
        message.error('createBooking error');
      }
    },

    *queryBookingStatusNext(_, { call, put, select }) {
      const { bookingNo } = yield select(state => state.ticketBookingAndPayMgr);
      let status = 'Creating';
      let statusResult = {};

      while (status === 'Creating') {
        const { data: statusData = {} } = yield call(queryBookingStatus, { bookingNo });
        

        const { resultCode: statusResultCode, result: newResult = {} } = statusData;
        if (statusResultCode === '0') {
          const { transStatus } = newResult;
          status = transStatus;
          statusResult = newResult;
        } else {
          status = 'Failed';
        }
        if (status === 'Creating') {
          // if status is still Creating, suspend 5 second.
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
      // status: WaitingForPaying
      if (
        status === 'WaitingForPaying' ||
        status === 'PendingApproval' ||
        status === 'Paying' ||
        status === 'Archiving'
      ) {
        return status;
      }
      // status: Failed
      if (status === 'Failed') {
        const { failedReason } = statusResult;
        yield put({
          type: 'save',
          payload: {
            checkOutLoading: false,
            type: 'BookingFailed',
            resultMsg: failedReason,
          },
        });
        Modal.error({
          title: 'Failed to check out.',
          content: failedReason,
        });
      } else {
        message.error('Check out error!');
      }
      return status;
    },

    *confirmEvent(_, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          payPageLoading: true,
        },
      });
      const {
        userCompanyInfo: { companyType },
      } = yield select(state => state.global);
      const {
        bookingNo,
        bookDetail: { totalPrice },
      } = yield select(state => state.ticketBookingAndPayMgr);
      if (Number.parseFloat(totalPrice) === Number.parseFloat(0)) {
        if (companyType === '02') {
          message.success('Confirmed successfully.');
        } else {
          router.push(`/TicketManagement/Ticketing/OrderCart/PaymentResult?orderNo=${bookingNo}`);
        }
      } else {
        const { payModeList } = yield select(state => state.ticketBookingAndPayMgr);
        const payMode = payModeList.filter(payModeObj => payModeObj.check);
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
          if (companyType === '02') {
            message.success('Confirmed successfully.');
          } else {
            router.push(`/TicketManagement/Ticketing/OrderCart/PaymentResult?orderNo=${bookingNo}`);
          }
        } else {
          message.error(resultMsg);
        }
      }
    },

    *queryBookingStatus(_, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          payPageLoading: true,
        },
      });

      const { bookingNo } = yield select(state => state.ticketBookingAndPayMgr);
      let status = 'WaitingForPaying';
      let statusResult = {};
      while (status === 'WaitingForPaying' || status === 'Paying' || status === 'Archiving') {
        const { data: statusData = {} } = yield call(queryBookingStatus, { bookingNo });
        const { bookingNo: bookingNoNew } = yield select(state => state.ticketBookingAndPayMgr);
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
            payModelShow: true,
          },
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

    *queryTaDetailInfo(_, { call, put }) {
      const response = yield call(queryInfoWithNoId);
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        // console.log(result);
        yield put({
          type: 'save',
          payload: {
            taDetailInfo: result,
          },
        });
        yield put({
          type: 'queryAccountInfo',
          payload: {
            taId: result.taId,
          },
        });
      } else {
        message.error(resultMsg);
      }
    },

    *queryAccountInfo({ payload }, { call, put }) {
      const param = { taId: payload.taId };
      const response = yield call(queryAccountInfo, param);
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      yield put({
        type: 'save',
        payload: {
          payPageLoading: false,
        },
      });
      if (resultCode === '0') {
        // console.log(result);
        yield put({
          type: 'save',
          payload: {
            taAccountInfo: result,
          },
        });
      } else {
        message.error(resultMsg);
      }
    },

    *orderCheckOut({ payload }, { put }) {
      const {
        generalTicketOrderData = [],
        packageOrderData = [],
        onceAPirateOrderData = [],
      } = payload;

      yield put({
        type: 'save',
        payload: {
          packageOrderData,
          generalTicketOrderData,
          onceAPirateOrderData,
        },
      });
    },

    *fetchQueryOrderDetail({ payload }, { call, put }) {
      const { orderNo } = payload;

      const param = { bookingNo: orderNo };
      const response = yield call(queryBookingDetail, param);
      if (!response || !response.success) {
        message.error(response.message);
      } else {
        const {
          data: { resultCode, resultMsg, result },
        } = response;
        if (resultCode === '0') {
          yield put({
            type: 'save',
            payload: {
              bookDetail: result.bookingDetail,
            },
          });
          return result.bookingDetail;
        }
        message.error(resultMsg);
      }

      return null;
    },

    *getInitData(_, { select }) {
      const {
        userCompanyInfo: { companyType },
      } = yield select(state => state.global);
      return { companyType };
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
        payPageLoading: false,
        deliveryMode: undefined,
        payModeList: [
          {
            value: 1,
            label: 'e-Wallet',
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
        collectionDate: null,
        ticketAmount: 0,
        bocaFeePax: 0.0,
        bocaFeeGst: 0.0,
        bookingOrderData: [],
        packageOrderData: [],
        generalTicketOrderData: [],
        onceAPirateOrderData: [],
        payModelShow: false,
        bookingNo: null,
        taDetailInfo: null,
        accountInfo: null,
        bookDetail: {
          totalPrice: null,
        },
        downloadFileLoading: false,
        paymentResultLoading: false,
      };
    },
  },

  subscriptions: {
    setup({ history, dispatch }) {
      history.listen(async location => {
        const { pathname } = location;

        if (pathname === '/TicketManagement/Ticketing/OrderCart/OrderPay') {
          const { companyType } = await dispatch({
            type: 'getInitData',
          });

          if (companyType === '01') {
            dispatch({
              type: 'initPage',
            });
            dispatch({
              type: 'fetchAccountDetail',
            });
            dispatch({
              type: 'fetchQueryTaDetail',
            });
          }
        } else {
          dispatch({
            type: 'resetData',
          });
        }
      });
    },
  },
};
