import serialize from '@/pages/TicketManagement/Ticketing/QueryOrder/utils/utils';
import {queryBookingDetail} from '@/pages/TicketManagement/Ticketing/QueryOrder/services/queryOrderService';

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
      isSubOrder: null,
      vidCode: null,
      currentPage: 1,
      pageSize: 10,
    },
    selectedRowKeys: [],
    selectedVidList: [],
  },

  effects: {
    * queryBookingDetail({payload}, {call, put, select}) {
      const {searchList} = yield select(state => state.orderDetailMgr);
      const params = {...searchList, ...payload};
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
        data: {resultCode, resultMsg, result},
      } = response;
      const vidResultList = [];
      if (resultCode === '0') {
        const {
          bookingDetail: {offers = []},
        } = result;
        for (let i = 0; i < offers.length; i += 1) {
          const {attraction = []} = offers[i];
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
          },
        });
      } else throw resultMsg;
      return vidResultList;
    },
  },

  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
    saveSearchList(state, {payload}) {
      const {searchList} = state;
      return {
        ...state,
        searchList: {
          ...searchList,
          ...payload,
        },
      };
    },
    saveSearchVidList(state, {payload}) {
      const {currentPage, pageSize, vidCode, vidResultList} = payload;
      const {searchList} = state;
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
      };
    },
    saveSelectVid(state, {payload}) {
      const {vidList} = state;
      const {selectedRowKeys} = payload;
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
          isSubOrder: null,
          vidCode: null,
          currentPage: 1,
          pageSize: 10,
        },
        selectedRowKeys: [],
        selectedVidList: [],
      };
    },
  },

  subscriptions: {},
};
