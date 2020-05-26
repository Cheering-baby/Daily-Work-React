import { message } from 'antd';
import * as service from '../services/offline';
import { objDeepCopy } from '../../../utils/tools';

export default {
  namespace: 'offline',
  state: {
    searchCondition: {
      commonSearchText: null,
      themeParkCode: null,
      usageScope: 'Offline',
      currentPage: 1,
      pageSize: 10,
    },
    totalSize: 0,
    offlineList: [],

    modifyParams: {
      tplId: null,
      usageScope: 'Offline',
      commissionType: 'Fixed',
      commissionScheme: 'Amount',
      commissionValue: null,
      commissionValueAmount: null,
      commissionValuePercent: null,
    },

    detailVisible: false,
    type: '',
    drawerVisible: false,
    themeParkList: [],
    commissionList: [],
  },
  effects: {
    *queryThemeParks(_, { call, put }) {
      const response = yield call(service.queryPluAttribute, { attributeItem: 'THEME_PARK' });
      if (!response) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = response;
      if (resultCode === '0' || resultCode === 0) {
        yield put({ type: 'save', payload: { themeParkList: result.items } });
      } else throw resultMsg;
    },
    *fetchOfflineList({ payload }, { call, put, select }) {
      const { searchCondition } = yield select(state => state.offline);
      const params = { ...searchCondition, ...payload };
      yield put({
        type: 'save',
        payload: {
          searchCondition: params,
        },
      });
      const res = yield call(service.queryCommodityCommissionTplList, params);
      if (!res) return false;
      const {
        data: { resultCode, resultMsg, result },
      } = res;
      const {
        page: { totalSize, currentPage, pageSize },
        commodityList,
      } = result;
      if (resultCode === '0' || resultCode === 0) {
        if (commodityList && commodityList.length > 0) {
          commodityList.map((v, index) => {
            Object.assign(v, {
              key: v.commoditySpecId,
              no: (currentPage - 1) * pageSize + index + 1,
              children: objDeepCopy(v.subCommodityList),
            });
            return v;
          });
        }
        yield put({
          type: 'save',
          payload: {
            totalSize,
            offlineList: commodityList,
          },
        });
      } else throw resultMsg;
    },
    *edit({ payload }, { call }) {
      const res = yield call(service.edit, payload);
      if (!res) return false;
      const {
        data: { resultCode, resultMsg },
      } = res;
      if (resultCode !== '0') {
        throw resultMsg;
      }
      return resultCode;
    },
    *detail({ payload }, { call, put }) {
      const { commoditySpecType, commoditySpecId } = payload;
      const requestData = {
        commoditySpecType,
        commoditySpecId,
      };
      const res = yield call(service.detail, requestData);
      const { resultCode, resultMsg, result } = res.data;
      if (resultCode === '0' || resultCode === 0) {
        yield put({
          type: 'save',
          payload: {
            commissionList: result.commissionList,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *search({ payload }, { put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'save',
        payload,
      });
      yield put({
        type: 'fetchOfflineList',
        payload,
      });
    },
    *fetchSelectReset({ payload }, { put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'fetchOfflineList',
        payload,
      });
    },
    *tableChanged({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });

      yield put({
        type: 'fetchOfflineList',
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    saveModifyParams(state, { payload }) {
      const { modifyParams } = state;
      return {
        ...state,
        modifyParams: {
          ...modifyParams,
          ...payload,
        },
      };
    },
    clear(state) {
      return {
        ...state,
        searchCondition: {
          commonSearchText: null,
          themeParkCode: null,
          usageScope: 'Offline',
          currentPage: 1,
          pageSize: 10,
        },
        totalSize: 0,
        offlineList: [],

        modifyParams: {
          tplId: null,
          usageScope: 'Offline',
          commissionType: 'Fixed',
          commissionScheme: 'Amount',
          commissionValue: null,
          commissionValueAmount: null,
          commissionValuePercent: null,
        },

        detailVisible: false,
        type: '',
        drawerVisible: false,
        themeParkList: [],
        commissionList: [],
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname !== '/ProductManagement/CommissionRule/OfflineRule') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
