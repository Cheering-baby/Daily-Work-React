import { message } from 'antd';
import * as service from '../services/myActivity';

export default {
  namespace: 'taSignUpDetails',

  state: {
    queryMappingInfo: [],
    contractInfo: [],
  },
  effects: {
    *queryMappingDetail({ payload }, { call, put }) {
      const { taId } = payload;
      const res = yield call(service.queryMappingDetail, taId);
      const { resultCode, resultMsg, result } = res.data;
      if (resultCode === '0' || resultCode === 0) {
        if (result && result.length > 0) {
          result.map(v => {
            Object.assign(v, { key: `${v.taId}` });
            return v;
          });
        }
        yield put({
          type: 'save',
          payload: {
            queryMappingInfo: result,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *taInfo({ payload }, { call, put }) {
      const { taId } = payload;
      const res = yield call(service.taInfo, taId);
      const { resultCode, resultMsg, result } = res.data;
      if (resultCode === '0' || resultCode === 0) {
        yield put({
          type: 'save',
          payload: {
            TaContractInfoBean: result,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *queryContractInfo({ payload }, { call, put }) {
      const { taId } = payload;
      const res = yield call(service.queryContractInfo, taId);
      const { resultCode, resultMsg, result } = res.data;
      if (resultCode === '0' || resultCode === 0) {
        yield put({
          type: 'save',
          payload: {
            contractInfo: result,
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
    reset(state, { payload }) {
      return {
        ...state,
        ...payload,
        queryMappingInfo: [],
      };
    },
    clear(state) {
      return {
        ...state,
        queryMappingInfo: [],
        contractInfo: [],
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname !== '/MyActivity') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
