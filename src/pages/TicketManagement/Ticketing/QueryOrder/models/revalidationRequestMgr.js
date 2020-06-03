import moment from 'moment';
import serialize from '../utils/utils';
import {
  queryBookingDetail,
  revalidationTicket,
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
    selectedRowKeys: [],
    selectedVidList: [],
    orderCreateTime: null,
    bookingDetail: null,
    disabledKeyList: [],
    disabledVidList: [],
  },

  effects: {
    *queryBookingDetail({ payload }, { call, put, select }) {
      const { searchList } = yield select(state => state.revalidationRequestMgr);
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
      const vidResultList = [];
      if (resultCode === '0') {
        const {
          bookingDetail,
          bookingDetail: { offers = [], createTime },
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
              if (attraction[j].visualIdStatus === 'false' && attraction[j].hadRefunded !== 'Yes') {
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
                        vidCode: itemPlu.visualId,
                        offerName: offers[i].offerName,
                        offerGroup: offers[i].offerGroup,
                        expiryDate: ticketExpiryDate,
                        status: attraction[j].visualIdStatus,
                        hadRefunded: attraction[j].hadRefunded,
                      });
                    }
                  });
                  if (packageThemeparkList.length > 1) {
                    vidResultList.push({
                      key: null,
                      vidNo: null,
                      vidCode: attraction[j].visualID,
                      offerName: offers[i].offerName,
                      offerGroup: offers[i].offerGroup,
                      expiryDate: attraction[j].validDayTo,
                      status: attraction[j].visualIdStatus,
                      hadRefunded: attraction[j].hadRefunded,
                    });
                  }
                } else {
                  vidResultList.push({
                    key: null,
                    vidNo: null,
                    vidCode: attraction[j].visualID,
                    offerName: offers[i].offerName,
                    offerGroup: offers[i].offerGroup,
                    expiryDate: attraction[j].validDayTo,
                    status: attraction[j].visualIdStatus,
                    hadRefunded: attraction[j].hadRefunded,
                  });
                }
              } else {
                disabledKeyList.push(offers[i].offerGroup);
              }
            }
          }
        }
        for (let i = 0; i < vidResultList.length; i += 1) {
          vidResultList[i].vidNo = (Array(3).join('0') + (i + 1)).slice(-3);
          vidResultList[i].key = i;
        }
        yield put({
          type: 'save',
          payload: {
            vidResultList,
            orderCreateTime: createTime,
            bookingDetail,
            disabledKeyList,
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
            selectedRowKeys: [],
            selectedVidList: [],
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
            data[headers[j]] = temp[j];
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
      const { searchList } = state;
      let vidSearchList = vidResultList;
      if (vidCode !== null) {
        vidSearchList = vidResultList.filter(array => array.vidCode.match(vidCode));
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
        selectedRowKeys: [],
        selectedVidList: [],
        searchList: {
          ...searchList,
          vidCode,
          currentPage,
          pageSize,
        },
        disabledVidList,
      };
    },
    settingSelectVid(state, { payload }) {
      const { selected, record } = payload;
      const { selectedRowKeys, vidList, vidResultList } = state;
      const selectedVidList = [];
      let selectedRowKeysNew = [];
      if (selected) {
        selectedRowKeysNew = [...selectedRowKeys];
        selectedRowKeysNew.push(record.key);
        for (let i = 0; i < vidList.length; i += 1) {
          for (let j = 0; j < selectedRowKeysNew.length; j += 1) {
            if (selectedRowKeysNew[j] === vidList[i].key) {
              selectedVidList.push(vidList[i]);
            }
          }
        }
        const addSelectedVidList = [];
        selectedVidList.forEach(selectedVid => {
          const { offerGroup } = selectedVid;
          const findResultList = [];
          vidResultList.forEach(vidResult => {
            if (vidResult.offerGroup === offerGroup) {
              findResultList.push({
                ...vidResult,
              });
            }
          });
          findResultList.forEach(findResult => {
            const keyIndex = selectedVidList.findIndex(
              selectedVidItem => selectedVidItem.key === findResult.key
            );
            if (keyIndex < 0) {
              addSelectedVidList.push({
                ...findResult,
              });
            }
          });
        });
        selectedRowKeysNew = [...selectedVidList, ...addSelectedVidList].map(
          selectedVid => selectedVid.key
        );
      } else {
        const selectedVidListOld = [];
        let deleteOfferGroup = null;
        for (let i = 0; i < vidList.length; i += 1) {
          for (let j = 0; j < selectedRowKeys.length; j += 1) {
            if (selectedRowKeys[j] === vidList[i].key) {
              selectedVidListOld.push(vidList[i]);
            }
          }
          if (record.key === vidList[i].key) {
            deleteOfferGroup = vidList[i].offerGroup;
          }
        }
        selectedVidListOld.forEach(selectedVid => {
          if (selectedVid.offerGroup !== deleteOfferGroup) {
            selectedVidList.push({ ...selectedVid });
            selectedRowKeysNew.push(selectedVid.key);
          }
        });
      }

      return {
        ...state,
        selectedRowKeys: selectedRowKeysNew,
        selectedVidList,
      };
    },
    saveSelectVid(state, { payload }) {
      const { vidList, vidResultList } = state;
      const { selectedRowKeys } = payload;
      const selectedVidList = [];
      for (let i = 0; i < vidList.length; i += 1) {
        for (let j = 0; j < selectedRowKeys.length; j += 1) {
          if (selectedRowKeys[j] === vidList[i].key) {
            selectedVidList.push(vidList[i]);
          }
        }
      }
      const addSelectedVidList = [];
      selectedVidList.forEach(selectedVid => {
        const { offerGroup } = selectedVid;
        const findResultList = [];
        vidResultList.forEach(vidResult => {
          if (vidResult.offerGroup === offerGroup) {
            findResultList.push({
              ...vidResult,
            });
          }
        });
        findResultList.forEach(findResult => {
          const keyIndex = selectedVidList.findIndex(
            selectedVidItem => selectedVidItem.key === findResult.key
          );
          if (keyIndex < 0) {
            addSelectedVidList.push({
              ...findResult,
            });
          }
        });
      });
      const selectedRowKeysNew = [...selectedVidList, ...addSelectedVidList].map(
        selectedVid => selectedVid.key
      );
      return {
        ...state,
        selectedRowKeys: selectedRowKeysNew,
        selectedVidList,
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
        selectedRowKeys: [],
        selectedVidList: [],
        orderCreateTime: null,
        bookingDetail: null,
        disabledKeyList: [],
        disabledVidList: [],
      };
    },
  },

  subscriptions: {},
};
