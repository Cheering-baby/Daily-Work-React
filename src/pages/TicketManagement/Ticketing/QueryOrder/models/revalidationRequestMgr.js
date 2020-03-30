import { serialize } from '../utils/utils';
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
          bookingDetail: { offers = [], createTime },
        } = result;
        for (let i = 0; i < offers.length; i += 1) {
          const { attraction = [] } = offers[i];
          if (attraction) {
            for (let j = 0; j < attraction.length; j += 1) {
              vidResultList.push({
                key: null,
                vidNo: null,
                vidCode: attraction[j].visualID,
                offerName: offers[i].offerName,
                expiryDate: attraction[j].validDayTo,
                status: attraction[j].visualIdStatus,
              });
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
      let uploadStatus = false;
      if (csvList.length > 0) {
        uploadStatus = true;
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
        for (let i = 0; i < newVidList.length; i += 1) {
          newVidList[i].vidNo = (Array(3).join('0') + (i + 1)).slice(-3);
          newVidList[i].key = i;
        }
        yield put({
          type: 'saveSearchVidList',
          payload: {
            currentPage: 1,
            pageSize,
            vidCode: null,
            vidResultList: newVidList,
          },
        });
      }
      return uploadStatus;
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
        vidResultList,
        total: vidSearchList.length,
        selectedRowKeys: [],
        selectedVidList: [],
        searchList: {
          ...searchList,
          vidCode,
          currentPage,
          pageSize,
        },
      };
    },
    saveSelectVid(state, { payload }) {
      const { vidList } = state;
      const { selectedRowKeys } = payload;
      const selectedVidList = [];
      for (let i = 0; i < vidList.length; i += 1) {
        for (let j = 0; j < selectedRowKeys.length; j += 1) {
          if (selectedRowKeys[j] === vidList[i].key) {
            selectedVidList.push(vidList[i]);
          }
        }
      }
      return {
        ...state,
        selectedRowKeys,
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
      };
    },
  },

  subscriptions: {},
};
