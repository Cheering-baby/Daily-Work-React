import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import * as service from '../services/mapping';

export default {
  namespace: 'mappingDetails',
  state: {
    statusDetailList: [],
    type: '',
    queryMappingInfo: {},
    userProfiles: [],
    time: [],
    createTeamList: [],
    lintNum: '10',
  },
  effects: {
    *queryMappingDetail({ payload }, { call, put }) {
      const { taId } = payload;
      const res = yield call(service.queryMappingDetail, taId);
      const { resultCode, resultMsg, result } = res.data;
      if (resultCode === '0' || resultCode === 0) {
        yield put({
          type: 'save',
          payload: {
            queryMappingInfo: result,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *editMappingList({ payload }, { call, put }) {
      const { params, taId } = payload;
      const reqParams = {
        ...params,
        taId,
      };
      const {
        data: { resultCode, resultMsg },
      } = yield call(service.endInvitation, reqParams);
      if (resultCode === '0' || resultCode === 0) {
        message.success(formatMessage({ id: 'COMMON_EDITED_SUCCESSFULLY' }));
        // fresh list data
        yield put({
          type: 'mapping/fetchMappingList',
        });
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *addMappingList({ payload }, { call, put }) {
      const { params, taId } = payload;
      const reqParams = {
        ...params,
        taId,
      };
      const {
        data: { resultCode, resultMsg },
      } = yield call(service.endInvitation, reqParams);
      if (resultCode === '0' || resultCode === 0) {
        message.success(formatMessage({ id: 'COMMON_MAPPING_SUCCESSFULLY' }));
        // fresh list data
        yield put({
          type: 'mapping/fetchMappingList',
        });
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *querySalePerson(_, { call, put }) {
      const res = yield call(service.querySalePerson);
      const { resultCode, resultMsg, resultData } = res.data;
      if (resultCode === '0' || resultCode === 0) {
        const { userProfiles } = resultData;
        yield put({
          type: 'save',
          payload: {
            userProfiles,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *fetchqueryDictionary(_, { call, put }) {
      const params = {
        dictType: '10',
        dictSubType: '1005',
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.queryDictionary, { ...params });
      if (resultCode === '0' || resultCode === 0) {
        yield put({ type: 'save', payload: { time: result || [] } });
      } else message.warn(resultMsg, 10);
    },
    *fetchQueryLintNum(_, { call, put }) {
      const params = {
        dictType: '10',
        dictSubType: '1011',
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.queryDictionary, { ...params });
      if (resultCode === '0' || resultCode === 0) {
        if (result && result.length > 0) {
          const lintNum = result[0].dictName;
          yield put({ type: 'save', payload: { lintNum: lintNum || '10' } });
        }
      } else message.warn(resultMsg, 10);
    },
    *fetchQueryCreateTeam(_, { call, put }) {
      const params = {
        dictType: '10',
        dictSubType: '1012',
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.queryDictionary, { ...params });
      if (resultCode === '0' || resultCode === 0) {
        yield put({ type: 'save', payload: { createTeamList: result || [] } });
      } else message.warn(resultMsg, 10);
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear(state, { payload }) {
      return {
        ...state,
        ...payload,
        statusDetailList: [],
        type: '',
        queryMappingInfo: {},
        time: [],
        createTeamList: [],
        lintNum: '10',
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname !== '/TAManagement/Mapping') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
