import { message } from 'antd';
import * as service from '../services/mainTAManagement';

export default {
  namespace: 'uploadContractHistory',
  state: {
    searchContractForm: {
      uploadedStartTime: null,
      uploadedEndTime: null,
    },
    searchContractList: {
      total: 0,
      currentPage: 1,
      pageSize: 10,
    },
    contractList: [],
    qryContractHistoryLoading: false,
  },
  effects: {
    *fetchQryContractHistoryList({ payload }, { call, put, select }) {
      const { searchContractList } = yield select(state => state.uploadContractHistory);
      const reqParam = {
        pageInfo: {
          ...searchContractList,
        },
        ...payload,
      };
      yield put({ type: 'save', payload: { qryContractHistoryLoading: true } });
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.queryContractHistoryList, { ...reqParam });
      yield put({ type: 'save', payload: { qryContractHistoryLoading: false } });
      if (resultCode === '0' || resultCode === 0) {
        const { pageInfo, contractHisList } = result;
        yield put({
          type: 'save',
          payload: {
            contractList: contractHisList || [],
            searchContractList: {
              total: Number(pageInfo.totalSize || '0'),
              currentPage: Number(pageInfo.currentPage || '1'),
              pageSize: Number(pageInfo.pageSize || '10'),
            },
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *removeContractHistoryFiles({ payload }, { call }) {
      const response = yield call(service.removeContractHistoryFiles, { ...payload });
      if(!response) return false;
      const { data: { resultCode, resultMsg } } = response;
      if (resultCode === '0' || resultCode === 0) {
        message.success("Deleted successfully.");
      } else message.warning(resultMsg);
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
          searchContractForm: {
            uploadedStartTime: null,
            uploadedEndTime: null,
          },
          searchContractList: {
            total: 0,
            currentPage: 1,
            pageSize: 10,
          },
          contractList: [],
          qryContractHistoryLoading: false,
        },
        ...payload,
      };
    },
  },
};
