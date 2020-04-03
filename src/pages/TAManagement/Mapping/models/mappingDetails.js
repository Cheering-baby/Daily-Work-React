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
      const { resultCode, resultMsg } = yield call(service.endInvitation, reqParams);
      if (resultCode === '0' || resultCode === 0) {
        message.success(formatMessage({ id: 'COMMON_EDITED_SUCCESSFULLY' }));
        // fresh list data
        yield put({
          type: 'mapping/fetchMappingList',
        });
      } else message.warn(resultMsg, 10);
    },
    *addMappingList({ payload }, { call, put }) {
      const { params, taId } = payload;
      const reqParams = {
        ...params,
        taId,
      };
      const { resultCode, resultMsg } = yield call(service.endInvitation, reqParams);
      if (resultCode === '0' || resultCode === 0) {
        message.success(formatMessage({ id: 'COMMON_ADDED_SUCCESSFULLY' }));

        // fresh list data
        yield put({
          type: 'mapping/fetchMappingList',
        });
      } else message.warn(resultMsg, 10);
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
