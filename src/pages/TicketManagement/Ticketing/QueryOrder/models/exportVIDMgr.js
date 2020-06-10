import { formatMessage } from 'umi/locale';
import { message } from 'antd';
import serialize from '../utils/utils';
import {
  downloadETicket,
  queryBookingDetail,
  queryTask,
} from '@/pages/TicketManagement/Ticketing/QueryOrder/services/queryOrderService';

export default {
  namespace: 'exportVIDMgr',
  state: {
    exportVIDVisible: false,
    searchList: {
      bookingNo: null,
      isSubOrder: null,
    },
    vidList: [],
    downloadFileLoading: false,
  },

  effects: {
    *effectSave({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
    },
    *queryVIDList({ payload }, { call, put, select }) {
      const { searchList } = yield select(state => state.exportVIDMgr);
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
          type: 'saveVIDList',
          payload: {
            bookingDetail,
          },
        });
      } else throw resultMsg;
    },
    *downloadETicket({ payload }, { call, put, select }) {
      const paramList = serialize(payload);
      yield put({
        type: 'save',
        payload: {
          downloadFileLoading: true,
        },
      });
      const response = yield call(downloadETicket, paramList);
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        let taskStatus = 'processing';
        while (taskStatus === 'processing') {
          const { downloadFileLoading } = yield select(state => state.exportVIDMgr);
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
            if (queryTaskResult && queryTaskResult.status === 'success') {
              taskStatus = 'success';
              try {
                message.success(formatMessage({ id: 'EXPORTED_SUCCESSFULLY' }));
                window.open(queryTaskResult.result);
              } catch (e) {
                return formatMessage({ id: 'FAILED_TO_DOWNLOAD' });
              }
            }
            if (queryTaskResult && queryTaskResult.status === 'failed') {
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
        return resultMsg;
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
    saveVIDList(state, { payload }) {
      const { bookingDetail = {} } = payload;
      const vidList = [];
      const { offers = [] } = bookingDetail;
      for (let i = 0; i < offers.length; i += 1) {
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
                    key: null,
                    vidNo: null,
                    checked: false,
                    vidCode: itemPlu.visualId,
                    offerName: offers[i].offerName,
                    offerGroup: offers[i].offerGroup,
                    themePark: itemPlu.themeParkCode,
                    expiryDate: attraction[j].validDayTo,
                    status: attraction[j].visualIdStatus,
                    hadRefunded: attraction[j].hadRefunded,
                  });
                }
              });
              if (packageThemeparkList.length > 1) {
                vidList.push({
                  key: null,
                  vidNo: null,
                  checked: false,
                  vidCode: attraction[j].visualID,
                  offerName: offers[i].offerName,
                  offerGroup: offers[i].offerGroup,
                  themePark: attraction[j].themePark,
                  expiryDate: attraction[j].validDayTo,
                  status: attraction[j].visualIdStatus,
                  hadRefunded: attraction[j].hadRefunded,
                });
              }
            } else {
              vidList.push({
                key: null,
                vidNo: null,
                checked: false,
                vidCode: attraction[j].visualID,
                offerName: offers[i].offerName,
                offerGroup: offers[i].offerGroup,
                themePark: attraction[j].themePark,
                expiryDate: attraction[j].validDayTo,
                status: attraction[j].visualIdStatus,
                hadRefunded: attraction[j].hadRefunded,
              });
            }
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
        downloadFileLoading: false,
      };
    },
  },

  subscriptions: {},
};
