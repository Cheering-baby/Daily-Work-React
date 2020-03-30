import { isEmpty } from 'lodash';
import * as service from '../services/commissionRuleSetup';

export default {
  namespace: 'commissionRuleSetup',
  state: {
    filter: {},
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    commissionList: [],
    detailVisible: false,
    selectedRowKeys: [],
    selectedOffer: [],
  },
  effects: {
    *fetchCommissionRuleSetupList(_, { call, put, select }) {
      const { filter, pagination } = yield select(state => state.commissionRuleSetup);
      const { likeParam } = filter;
      let res;
      if (isEmpty(likeParam)) {
        res = yield call(service.commissionRuleSetupList, pagination);
      } else {
        res = yield call(service.commissionRuleSetupList, { ...likeParam, ...pagination });
      }
      const {
        data: { resultCode, resultMsg, result },
      } = res;
      if (resultCode === '0' || resultCode === 0) {
        const {
          page: { currentPage, pageSize, totalSize },
          commissionList,
        } = result;
        if (commissionList && commissionList.length > 0) {
          commissionList.map(v => {
            Object.assign(v, { key: `commissionList${v.tplId}` });
            return v;
          });
        }
        yield put({
          type: 'save',
          payload: {
            currentPage,
            pageSize,
            totalSize,
            commissionList,
            selectedRowKeys: [],
            selectedOffer: [],
          },
        });
      } else throw resultMsg;
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
        type: 'fetchCommissionRuleSetupList',
      });
    },
    *reset(_, { put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'fetchCommissionRuleSetupList',
      });
    },
    *tableChanged({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });

      yield put({
        type: 'fetchCommissionRuleSetupList',
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
        selectedRowKeys: [],
        selectedOffer: [],
      };
    },
    toggleModal(state, { payload }) {
      const { key, val } = payload;
      return {
        ...state,
        [key]: val,
      };
    },
    saveSelectOffer(state, { payload }) {
      const { commissionList } = state;
      const { selectedRowKeys } = payload;
      const selectedOffer = [];
      for (let i = 0; i < commissionList.length; i += 1) {
        for (let j = 0; j < commissionList.length; j += 1) {
          if (commissionList[j] === commissionList[i].key) {
            commissionList.push(commissionList[i]);
          }
        }
      }
      return {
        ...state,
        selectedRowKeys,
        selectedOffer,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname !== '/ProductManagement/CommissionRule/OnlineRule') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
