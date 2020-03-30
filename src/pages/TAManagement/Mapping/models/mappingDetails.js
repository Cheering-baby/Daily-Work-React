import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import { isEmpty } from 'lodash';
import * as service from '../services/mapping';

export default {
  namespace: 'mappingDetails',
  state: {
    statusDetailList: [],
    type: '',
    queryMappingInfo: {},
    userProfiles: [],
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
      const { success, errorMsg } = yield call(service.endInvitation, reqParams);
      if (success) {
        message.success(formatMessage({ id: 'COMMON_EDITED_SUCCESSFULLY' }));
        // fresh list data
        yield put({
          type: 'mapping/fetchMappingList',
        });
      } else throw errorMsg;
    },
    *addMappingList({ payload }, { call, put }) {
      const { params, taId } = payload;
      const reqParams = {
        ...params,
        taId,
      };
      const { success, errorMsg } = yield call(service.endInvitation, reqParams);
      if (success) {
        message.success(formatMessage({ id: 'COMMON_ADDED_SUCCESSFULLY' }));

        // fresh list data
        yield put({
          type: 'mapping/fetchMappingList',
        });
      } else throw errorMsg;
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
