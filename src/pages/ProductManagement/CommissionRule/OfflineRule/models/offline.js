import { isEmpty } from 'lodash';
import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import * as service from '../services/offline';

export default {
  namespace: 'offline',
  state: {
    filter: {
      likeParam: {},
    },
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    offlineList: [],
    detailVisible: false,
    type: '',
    drawerVisible: false,
    themeParkList: [],
    commissionList: [],
  },
  effects: {
    *fetchOfflineList(_, { call, put, select }) {
      const { filter, pagination } = yield select(state => state.offline);
      const { likeParam } = filter;
      let res;
      if (isEmpty(likeParam)) {
        res = yield call(service.queryCommodityCommissionTplList, pagination);
      } else {
        res = yield call(service.like, {
          ...likeParam,
          ...pagination,
        });
      }

      const {
        data: { resultCode, resultMsg, result },
      } = res;
      const {
        page: { currentPage, pageSize, totalSize },
        commodityList,
      } = result;
      if (resultCode === '0' || resultCode === 0) {
        if (commodityList && commodityList.length > 0) {
          commodityList.map(v => {
            Object.assign(v, { key: `offlineList${v.commoditySpecId}` });
            return v;
          });
        }
        yield put({
          type: 'save',
          payload: {
            currentPage,
            pageSize,
            totalSize,
            offlineList: commodityList,
          },
        });
      } else throw resultMsg;
    },
    *edit({ payload }, { call, put }) {
      const { params, taId } = payload;
      const reqParams = {
        ...params,
        taId,
      };
      const { success, errorMsg } = yield call(service.edit, reqParams);
      if (success) {
        message.success(formatMessage({ id: 'COMMON_EDITED_SUCCESSFULLY' }));
        // fresh list data
        yield put({
          type: 'fetchOfflineList',
        });
      } else throw errorMsg;
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
      });
    },
    *fetchSelectReset(_, { put }) {
      yield put({
        type: 'clear',
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
    clear(state) {
      return {
        ...state,
        filter: {},
        pagination: {
          currentPage: 1,
          pageSize: 10,
        },
        commissionRuleSetupList: [],
        detailVisible: false,
        type: '',
        drawerVisible: false,
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
