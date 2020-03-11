import { message } from 'antd';
import * as service from '../services/subTAManagement';

export default {
  namespace: 'subTAManagement',
  state: {
    selectSubTaId: null,
    searchList: {
      total: 0,
      currentPage: 1,
      pageSize: 10,
    },
    searchForm: {
      companyName: null,
      applyStartDate: null,
      applyEndDate: null,
    },
    subTaList: [],
    qrySubTaTableLoading: false,
    isDetail: false,
    isEdit: false,
    operationVisible: false,
    hisVisible: false,
    viewId: 'subTaView',
  },
  effects: {
    *fetchQrySubTAList({ payload }, { call, put, select }) {
      const { searchList } = yield select(state => state.subTAManagement);
      const reqParam = {
        pageInfo: {
          ...searchList,
        },
        ...payload,
      };
      yield put({ type: 'save', payload: { qrySubTaTableLoading: true } });
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.querySubTAList, { ...reqParam });
      yield put({ type: 'save', payload: { qrySubTaTableLoading: false } });
      if (resultCode === '0' || resultCode === 0) {
        const { pageInfo, subTaList } = result;
        yield put({
          type: 'save',
          payload: {
            subTaList: subTaList || [],
            searchList: {
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
      yield put({ type: 'subTAStateChangeHistory/clean', payload });
    },
    *doCleanCommonData({ payload }, { put }) {
      yield put({ type: 'subTaMgr/clean', payload });
      yield put({ type: 'subTAStateChangeHistory/clean', payload });
    },
    *doCleanAllDate({ payload }, { put }) {
      yield put({ type: 'clean', payload });
      yield put({ type: 'subTaMgr/clean', payload });
      yield put({ type: 'subTAStateChangeHistory/clean', payload });
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
          searchList: {
            total: 0,
            currentPage: 1,
            pageSize: 10,
          },
          searchForm: {
            companyName: null,
            applyStartDate: null,
            applyEndDate: null,
          },
          subTaList: [],
          qrySubTaTableLoading: false,
          isDetail: false,
          isEdit: false,
          operationVisible: false,
          hisVisible: false,
          viewId: 'subTaView',
        },
        ...payload,
      };
    },
  },
};
