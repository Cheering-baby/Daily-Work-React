import { message } from 'antd';
import * as service from '../services/subTAManagement';

export default {
  namespace: 'subTAStateChangeHistory',
  state: {
    searchStateForm: {},
    searchStateList: {
      total: 0,
      currentPage: 1,
      pageSize: 10,
    },
    historyList: [],
    qryStateHistoryLoading: false,
  },
  effects: {
    *fetchQryProfileStatusHistoryList({ payload }, { call, put, select }) {
      const { searchStateList } = yield select(state => state.subTAStateChangeHistory);
      const reqParam = {
        pageInfo: {
          ...searchStateList,
        },
        ...payload,
      };
      yield put({ type: 'save', payload: { qryStateHistoryLoading: true } });
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.queryProfileStatusHistoryList, { ...reqParam });
      yield put({ type: 'save', payload: { qryStateHistoryLoading: false } });
      if (resultCode === '0' || resultCode === 0) {
        const { pageInfo, historyList } = result;
        yield put({
          type: 'save',
          payload: {
            historyList: historyList || [],
            searchStateList: {
              total: Number(pageInfo.totalSize || '0'),
              currentPage: Number(pageInfo.currentPage || '1'),
              pageSize: Number(pageInfo.pageSize || '10'),
            },
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *doSaveData({ payload }, { put }) {
      yield put({ type: 'save', payload });
    },
    *doCleanData({ payload }, { put }) {
      yield put({ type: 'clean', payload });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clean(state, { payload }) {
      return {
        ...state,
        ...{
          searchStateForm: {},
          searchStateList: {
            total: 0,
            currentPage: 1,
            pageSize: 10,
          },
          historyList: [],
          qryStateHistoryLoading: false,
        },
        ...payload,
      };
    },
  },
};
