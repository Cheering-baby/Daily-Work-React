import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import * as service from '../services/mapping';

export default {
  namespace: 'mappingDetails',
  state: {
    statusDetailList: [],
    type: '',
    queryMappingInfo: {},
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
      const { params } = payload;
      const { success, errorMsg } = yield call(service.endInvitation, params);
      if (success) {
        message.success(formatMessage({ id: 'COMMON_EDITED_SUCCESSFULLY' }));
        // fresh list data
        yield put({
          type: 'mapping/fetchMappingList',
        });
      } else throw errorMsg;
    },
    *addMappingList({ payload }, { call, put }) {
      const { params } = payload;
      const { success, errorMsg } = yield call(service.endInvitation, params);
      if (success) {
        message.success(formatMessage({ id: 'COMMON_ADDED_SUCCESSFULLY' }));

        // fresh list data
        yield put({
          type: 'mapping/fetchMappingList',
        });
      } else throw errorMsg;
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
      };
    },
  },
};
