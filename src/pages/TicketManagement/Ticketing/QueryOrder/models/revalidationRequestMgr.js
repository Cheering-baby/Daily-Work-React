import { cloneDeep } from 'lodash';
import moment from 'moment';
import serialize from '../utils/utils';
import {
  queryBookingDetail,
  revalidationTicket,
  queryPluAttribute,
} from '@/pages/TicketManagement/Ticketing/QueryOrder/services/queryOrderService';

export default {
  namespace: 'revalidationRequestMgr',
  state: {
    deliveryMode: null,
    collectionDate: null,
    vidResultList: [],
    vidList: [],
    total: 0,
    searchList: {
      bookingNo: null,
      vidCode: null,
      currentPage: 1,
      pageSize: 10,
    },
    selectedVidList: [],
    orderCreateTime: null,
    bookingDetail: null,
    wholeVidList: [],
    submitVidList: [],
  },

  effects: {
    *queryPluAttribute(_, { call, put } ) {
      const response = yield call(queryPluAttribute, {
        attributeItem: 'REVALIDATION_CONFIG'
      });
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0') { 
        const { items = [] } = result;
        if(Array.isArray(items) && items.length > 0) {
          yield put({
            type: 'save',
            payload: {
              revalidationFee: items[0].itemValue,
            },
          })
        }
      } else throw resultMsg;
    },
    *queryBookingDetail({ payload }, { call, put, select }) {
      const { searchList } = yield select(state => state.revalidationRequestMgr);
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
          bookingDetail: { offers = [], createTime },
        } = result;
        const submitVidList = [];
        for (let i = 0; i < offers.length; i += 1) {
          if (offers[i].bundleName && offers[i].bundleName !== '') {
            offers[i].offerName = offers[i].bundleLabel;
          }
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
                itemPluList.forEach(itemPlu => {
                  submitVidList.push({
                    vidCode: itemPlu.visualId,
                    vidGroup: attraction[j].vidGroup,
                  });
                });
              } else {
                submitVidList.push({
                  vidCode: attraction[j].visualID,
                  vidGroup: attraction[j].vidGroup,
                });
              }
            }
          }
        }
        for (let i = 0; i < offers.length; i += 1) {
          const { attraction = [] } = offers[i];
          if (attraction) {
            let existVidUsedForPackage = false;

            for (let j = 0; j < attraction.length; j += 1) {
              let isPackage = false;
              if (attraction[j].packageSpec) {
                isPackage = true;
              }
              const existUsed = !(
                attraction[j].visualIdStatus === 'false' && attraction[j].hadRefunded !== 'Yes'
              );
              if (existUsed && isPackage) {
                existVidUsedForPackage = true;
                break;
              }
            }

            for (let j = 0; j < attraction.length; j += 1) {
              let isPackage = false;
              if (attraction[j].packageSpec) {
                isPackage = true;
              }
              if (isPackage) {
                const packageSpecObj = JSON.parse(attraction[j].packageSpec);
                const itemPluList = packageSpecObj.packageSpecAttributes || [];
                if (attraction[j].ticketType === 'MPP') {
                  vidResultList.push({
                    key: null,
                    vidNo: null,
                    vidCode: attraction[j].visualID,
                    offerName: offers[i].offerName,
                    expiryDate: attraction[j].validDayTo,
                    status: attraction[j].visualIdStatus,
                    hadRefunded: attraction[j].hadRefunded,
                    vidGroup: attraction[j].vidGroup,
                    selected: false,
                    disabled:
                      existVidUsedForPackage ||
                      !(
                        attraction[j].visualIdStatus === 'false' &&
                        attraction[j].hadRefunded !== 'Yes'
                      ),
                  });
                  itemPluList.forEach(itemPlu => {
                    if (itemPlu.ticketType === 'Voucher') {
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
                        vidCode: itemPlu.visualId,
                        offerName: offers[i].offerName,
                        expiryDate: ticketExpiryDate,
                        status: attraction[j].visualIdStatus,
                        hadRefunded: attraction[j].hadRefunded,
                        vidGroup: attraction[j].vidGroup,
                        selected: false,
                        disabled:
                          existVidUsedForPackage ||
                          !(
                            attraction[j].visualIdStatus === 'false' &&
                            attraction[j].hadRefunded !== 'Yes'
                          ),
                      });
                    }
                  });
                } else {
                  itemPluList.forEach(itemPlu => {
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
                      vidCode: itemPlu.visualId,
                      offerName: offers[i].offerName,
                      expiryDate: ticketExpiryDate,
                      status: attraction[j].visualIdStatus,
                      hadRefunded: attraction[j].hadRefunded,
                      vidGroup: attraction[j].vidGroup,
                      selected: false,
                      disabled:
                        existVidUsedForPackage ||
                        !(
                          attraction[j].visualIdStatus === 'false' &&
                          attraction[j].hadRefunded !== 'Yes'
                        ),
                    });
                  });
                }
              } else {
                vidResultList.push({
                  key: null,
                  vidNo: null,
                  vidCode: attraction[j].visualID,
                  offerName: offers[i].offerName,
                  expiryDate: attraction[j].validDayTo,
                  status: attraction[j].visualIdStatus,
                  hadRefunded: attraction[j].hadRefunded,
                  vidGroup: attraction[j].vidGroup,
                  selected: false,
                  disabled:
                    existVidUsedForPackage ||
                    !(
                      attraction[j].visualIdStatus === 'false' &&
                      attraction[j].hadRefunded !== 'Yes'
                    ),
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
          });
        });
        vidResultList.sort((a, b) => a.vidGroup - b.vidGroup);
        for (let i = 0; i < vidResultList.length; i += 1) {
          vidResultList[i].vidNo = (Array(3).join('0') + (i + 1)).slice(-3);
          vidResultList[i].key = i;
        }
        yield put({
          type: 'save',
          payload: {
            wholeVidList: cloneDeep(vidResultList),
            orderCreateTime: createTime,
            bookingDetail,
            submitVidList,
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
      } else throw resultMsg;
      return vidResultList;
    },
    *revalidationTicket({ payload }, { call, put }) {
      const response = yield call(revalidationTicket, payload);
      if (!response) return false;
      const {
        data: { resultCode, resultMsg },
      } = response;
      if (resultCode === '0') {
        yield put({
          type: 'queryBookingDetail',
        });
        yield put({
          type: 'save',
          payload: {
            deliveryMode: null,
            collectionDate: null,
          },
        });
      } else {
        return resultMsg;
      }
      return resultCode;
    },
    *uploadFile({ payload }, { put, select }) {
      const { vidResultList } = yield select(state => state.revalidationRequestMgr);
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
        newVidList.forEach(item => {
          if (!item.disabled) {
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
      const { currentPage, pageSize, vidCode, vidResultList } = payload;
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
      };
    },
    resetData(state) {
      return {
        ...state,
        deliveryMode: null,
        collectionDate: null,
        vidResultList: [],
        vidList: [],
        total: 0,
        searchList: {
          bookingNo: null,
          vidCode: null,
          currentPage: 1,
          pageSize: 10,
        },
        orderCreateTime: null,
        bookingDetail: null,
        wholeVidList: [],
      };
    },
  },

  subscriptions: {},
};
