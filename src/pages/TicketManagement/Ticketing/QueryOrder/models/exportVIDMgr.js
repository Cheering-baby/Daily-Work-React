import { formatMessage } from 'umi/locale';
import serialize from '../utils/utils';
import {
  downloadETicket,
  queryBookingDetail,
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
    *downloadETicket({ payload }, { call }) {
      const paramList = serialize(payload);
      const response = yield call(downloadETicket, paramList);
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        try {
          window.open(result);
        } catch (e) {
          return formatMessage({ id: 'FAILED_TO_DOWNLOAD' });
        }
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
      };
    },
  },

  subscriptions: {},
};
