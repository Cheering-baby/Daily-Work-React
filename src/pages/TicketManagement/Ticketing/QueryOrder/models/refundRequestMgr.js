import {cloneDeep} from "lodash";
import { message } from 'antd';
import moment from 'moment';
import serialize from '../utils/utils';
import {
  queryBookingDetail,
  refundTicket,
} from '@/pages/TicketManagement/Ticketing/QueryOrder/services/queryOrderService';
import { queryPluAttribute } from '@/pages/TicketManagement/services/orderCart';

export default {
  namespace: 'refundRequestMgr',
  state: {
    vidResultList: [],
    vidList: [],
    total: 0,
    searchList: {
      bookingNo: null,
      vidCode: null,
      currentPage: 1,
      pageSize: 10,
    },
    bookingDetail: null,
    disabledKeyList: [],
    themeParkRefundList: [],
    disabledVidList: [],
    wholeVidList: [],
  },

  effects: {
    *queryThemeParkRefundList({ payload }, { call, put }) {
      const params = {
        attributeItem: 'Refund_ThemePark',
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryPluAttribute, params);
      if (resultCode !== '0' && resultCode !== 0) {
        message.warn(resultMsg);
        return;
      }
      if (!result.items || result.items.length === 0) {
        // eslint-disable-next-line no-throw-literal
        message.warn(`${payload.attributeItem} config is null`);
        return;
      }
      const themeParkRefundList = [];
      result.items.forEach(item => {
        if (item.item) {
          themeParkRefundList.push(item.itemValue);
        }
      });
      yield put({
        type: 'save',
        payload: {
          themeParkRefundList,
        },
      });
    },
    *fetchPendToUpOnBookingNo({ payload }, { call }) {
      const params = {
        bookingNo: payload.bookingNo,
        vidCode: null,
        currentPage: 1,
        pageSize: 10,
      };
      const paramList = serialize(params);
      const response = yield call(queryBookingDetail, paramList);
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') {
        const { bookingDetail } = result;
        if (bookingDetail && bookingDetail.status === 'PendingTopup') {
          message.warn(
            'Refund cannot proceed due to there’s no enough balance to return back the commission.'
          );
        }
      } else {
        message.error(resultMsg);
      }
    },
    *queryBookingDetail({ payload }, { call, put, select }) {
      const { searchList } = yield select(state => state.refundRequestMgr);
      const params = { ...searchList, ...payload };
      yield put({
        type: 'save',
        payload: {
          searchList: params,
        },
      });
      const { vidCode } = params;
      const paramList = serialize(params);
      const response = yield call(queryBookingDetail, paramList);
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      const vidResultList = [];
      if (resultCode === '0') {
        const {
          bookingDetail,
          bookingDetail: { offers = [] },
        } = result;
        const disabledKeyList = [];
        for (let i = 0; i < offers.length; i += 1) {
          if (offers[i].bundleName && offers[i].bundleName !== '') {
            offers[i].offerName = offers[i].bundleLabel;
          } else {
            // eslint-disable-next-line operator-assignment
            offers[i].offerGroup = offers[i].offerGroup + i;
          }
        }
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
                    let ticketExpiryDate = null;
                    if (attraction[j].ticketNumOfPax) {
                      const ticketNumOfPaxList = JSON.parse(attraction[j].ticketNumOfPax);
                      if (ticketNumOfPaxList) {
                        ticketNumOfPaxList.forEach(ticketNumOfPax => {
                          if (
                            itemPlu.visualId === ticketNumOfPax.visualID &&
                            ticketNumOfPax.validTo
                          ) {
                            ticketExpiryDate = moment(ticketNumOfPax.validTo, 'x').format(
                              'YYYY-MM-DD'
                            );
                          }
                        });
                      }
                    }
                    vidResultList.push({
                      key: null,
                      vidNo: null,
                      checked: false,
                      vidCode: itemPlu.visualId,
                      offerName: offers[i].offerName,
                      offerGroup: offers[i].offerGroup,
                      themePark: itemPlu.themeParkCode,
                      expiryDate: ticketExpiryDate,
                      status: attraction[j].visualIdStatus,
                      hadRefunded: attraction[j].hadRefunded,
                      vidGroup: attraction[j].vidGroup,
                      selected: false,
                      prodId: attraction[j].prodId,
                      netAmt: attraction[j].netAmt,
                      disabled: !(attraction[j].visualIdStatus === 'false' && attraction[j].hadRefunded !== 'Yes'),
                    });
                  }
                });
                if (packageThemeparkList.length > 1) {
                  vidResultList.push({
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
                    vidGroup: attraction[j].vidGroup,
                    prodId: attraction[j].prodId,
                    netAmt: attraction[j].netAmt,
                    selected: false,
                    disabled: !(attraction[j].visualIdStatus === 'false' && attraction[j].hadRefunded !== 'Yes'),
                  });
                }
              } else {
                vidResultList.push({
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
                  vidGroup: attraction[j].vidGroup,
                  prodId: attraction[j].prodId,
                  netAmt: attraction[j].netAmt,
                  selected: false,
                  disabled: !(attraction[j].visualIdStatus === 'false' && attraction[j].hadRefunded !== 'Yes'),
                });
              }
            }
          }
        }
        const groupList = vidResultList.filter(item => item.disabled === true);
        vidResultList.forEach(item => {
          groupList.forEach(e => {
            if (e.vidGroup === item.vidGroup) {
              item.disabled = true;
            }
          })
        });
        vidResultList.sort((a,b) => a.vidGroup - b.vidGroup);
        for (let i = 0; i < vidResultList.length; i += 1) {
          vidResultList[i].vidNo = (Array(3).join('0') + (i + 1)).slice(-3);
          vidResultList[i].key = i;
        }
        yield put({
          type: 'save',
          payload: {
            wholeVidList: cloneDeep(vidResultList),
            bookingDetail,
            disabledKeyList,
          },
        });
        yield put({
          type: 'saveSearchVidList',
          payload: {
            vidResultList,
            currentPage: 1,
            pageSize: 10,
            vidCode,
          },
        });
      } else {
        message.error(resultMsg);
      }
      return vidResultList;
    },
    *refundTicket({ payload }, { call, put }) {
      const response = yield call(refundTicket, payload);
      if (!response) return false;
      const {
        data: { resultCode, resultMsg },
      } = response;
      if (resultCode === '0') {
        yield put({
          type: 'queryBookingDetail',
        });
      } else {
        message.error(resultMsg);
      }
      return resultCode;
    },
    *uploadFile({ payload }, { put, select }) {
      const { vidResultList } = yield select(state => state.refundRequestMgr);
      const { uploadVidList, pageSize } = payload;
      const csvList = uploadVidList !== undefined ? uploadVidList.split('\r\n') : [];
      if (csvList.length > 0) {
        const vidData = [];
        const headers = csvList[0].split(',');
        for (let i = 1; i < csvList.length; i += 1) {
          const data = {};
          const temp = csvList[i].split(',');
          for (let j = 0; j < temp.length; j += 1) {
            data[headers[j].trim()] = temp[j].trim();
          }
          vidData.push(data);
        }
        const newVidList = [];
        for (let i = 0; i < vidResultList.length; i += 1) {
          for (let j = 0; j < vidData.length; j += 1) {
            if (vidResultList[i].vidCode === vidData[j]['VID Code']) {
              newVidList.push(vidResultList[i]);
            }
          }
        }
        if (newVidList.length === 0) {
          return false;
        }
        for (let i = 0; i < newVidList.length; i += 1) {
          newVidList[i].vidNo = (Array(3).join('0') + (i + 1)).slice(-3);
          newVidList[i].key = i;
        }
        const disabledVidList = [];
        newVidList.forEach(newVid => {
          const vidOfferGroupList = [];
          vidResultList.forEach(vidResult => {
            if (vidResult.offerGroup === newVid.offerGroup) {
              vidOfferGroupList.push({ ...vidResult });
            }
          });
          let isAll = true;
          vidOfferGroupList.forEach(vidOfferGroup => {
            if (isAll) {
              const vidCodeIndex = newVidList.findIndex(
                newVidObj => newVidObj.vidCode === vidOfferGroup.vidCode
              );
              if (vidCodeIndex < 0) {
                isAll = false;
              }
            }
          });
          if (!isAll) {
            disabledVidList.push({ ...newVid });
          }
        });
        newVidList.forEach(item => {
          if(!item.disabled){
            item.selected = true;
          }
        });
        yield put({
          type: 'saveSearchVidList',
          payload: {
            currentPage: 1,
            pageSize,
            vidCode: null,
            vidResultList: newVidList,
            disabledVidList,
          },
        });
        return true;
      }
      return false;
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveSearchList(state, { payload }) {
      const { searchList } = state;
      return {
        ...state,
        searchList: {
          ...searchList,
          ...payload,
        },
      };
    },
    saveSearchVidList(state, { payload }) {
      const { currentPage, pageSize, vidCode, vidResultList, disabledVidList } = payload;
      const vidResultListCopy = cloneDeep(vidResultList);
      const { searchList } = state;
      let vidSearchList = vidResultListCopy;
      if (vidCode !== null) {
        vidSearchList = vidResultListCopy.filter(array => array.vidCode.match(vidCode));
      }
      const vidList = [];
      if (currentPage * pageSize > vidSearchList.length) {
        for (let i = (currentPage - 1) * pageSize; i < vidSearchList.length; i += 1) {
          vidList.push(vidSearchList[i]);
        }
      } else {
        for (let i = (currentPage - 1) * pageSize; i < currentPage * pageSize; i += 1) {
          vidList.push(vidSearchList[i]);
        }
      }
      return {
        ...state,
        vidList,
        total: vidSearchList.length,
        searchList: {
          ...searchList,
          vidCode,
          currentPage,
          pageSize,
        },
        vidResultList: vidResultListCopy,
        disabledVidList,
      };
    },
    resetData(state) {
      return {
        ...state,
        vidResultList: [],
        vidList: [],
        total: 0,
        searchList: {
          bookingNo: null,
          vidCode: null,
          currentPage: 1,
          pageSize: 10,
        },
        bookingDetail: null,
        disabledKeyList: [],
        themeParkRefundList: [],
        disabledVidList: [],
        wholeVidList: [],
      };
    },
  },

  subscriptions: {},
};
