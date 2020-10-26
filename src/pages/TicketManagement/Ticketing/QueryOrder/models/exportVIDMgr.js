import { formatMessage } from 'umi/locale';
import { message } from 'antd';
import serialize from '../utils/utils';
import {
  downloadETicket,
  queryBookingDetail,
  queryOfferBookingCategory,
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
    themeParkList: [],
  },

  effects: {
    *effectSave({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
    },
    *queryThemePark(_, { call, put }) {
      const response = yield call(queryOfferBookingCategory, {});
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        yield put({ type: 'save', payload: { themeParkList: result.offerBookingCategoryList } });
      } else throw resultMsg;
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
            if (queryTaskResult && queryTaskResult.status === 2) {
              taskStatus = 'success';
              try {
                message.success(formatMessage({ id: 'EXPORTED_SUCCESSFULLY' }));
                window.open(queryTaskResult.result);
              } catch (e) {
                return formatMessage({ id: 'FAILED_TO_DOWNLOAD' });
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
        const { attraction = [], blackOutDays, blackOutWeekly } = offers[i];
        let blackOutDay = [];
        if (blackOutWeekly) {
          blackOutDay = blackOutDay.concat(blackOutWeekly.split(';'));
        }
        if (blackOutDays) {
          blackOutDay = blackOutDay.concat(blackOutDays.split(';'));
        }
        if (attraction) {
          for (let j = 0; j < attraction.length; j += 1) {
            let isPackage = false;
            if (attraction[j].packageSpec) {
              isPackage = true;
            }
            if (isPackage) {
              const packageSpecObj = JSON.parse(attraction[j].packageSpec);
              const itemPluList = packageSpecObj.packageSpecAttributes || [];
              if (attraction[j].ticketType === 'MPP') {
                vidList.push({
                  key: null,
                  vidNo: null,
                  checked: false,
                  vidCode: attraction[j].visualID,
                  offerName:
                    offers[i].bundleName !== null ? offers[i].bundleName : offers[i].offerName,
                  themePark: attraction[j].themePark,
                  themeParks: attraction[j].themeParks,
                  status: attraction[j].visualIdStatus,
                  hadRefunded: attraction[j].hadRefunded,
                  ticketGroup: attraction[j].ticketGroup,
                  ticketType: attraction[j].ticketType,
                  blackOutDay,
                });
                itemPluList.forEach(itemPlu => {
                  if (itemPlu.ticketType === 'Voucher') {
                    vidList.push({
                      key: null,
                      vidNo: null,
                      checked: false,
                      vidCode: itemPlu.visualId,
                      offerName:
                        offers[i].bundleName !== null ? offers[i].bundleName : offers[i].offerName,
                      themePark: itemPlu.themeParkCode,
                      themeParks: itemPlu.themeParks,
                      status: attraction[j].visualIdStatus,
                      hadRefunded: attraction[j].hadRefunded,
                      ticketGroup: itemPlu.ageGroup,
                      ticketType: itemPlu.ticketType,
                      blackOutDay,
                    });
                  }
                });
              } else {
                itemPluList.forEach(itemPlu => {
                  vidList.push({
                    key: null,
                    vidNo: null,
                    checked: false,
                    vidCode: itemPlu.visualId,
                    offerName:
                      offers[i].bundleName !== null ? offers[i].bundleName : offers[i].offerName,
                    themePark: itemPlu.themeParkCode,
                    themeParks: itemPlu.themeParks,
                    status: attraction[j].visualIdStatus,
                    hadRefunded: attraction[j].hadRefunded,
                    ticketGroup: itemPlu.ageGroup,
                    ticketType: itemPlu.ticketType,
                    blackOutDay,
                  });
                });
              }
            } else {
              vidList.push({
                key: null,
                vidNo: null,
                checked: false,
                vidCode: attraction[j].visualID,
                offerName:
                  offers[i].bundleName !== null ? offers[i].bundleName : offers[i].offerName,
                themePark: attraction[j].themePark,
                themeParks: attraction[j].themeParks,
                status: attraction[j].visualIdStatus,
                hadRefunded: attraction[j].hadRefunded,
                ticketGroup: attraction[j].ticketGroup,
                ticketType: attraction[j].ticketType,
                blackOutDay,
              });
            }
          }
        }
      }
      for (let i = 0; i < vidList.length; i += 1) {
        vidList[i].key = i;
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
        themeParkList: [],
      };
    },
  },

  subscriptions: {},
};
