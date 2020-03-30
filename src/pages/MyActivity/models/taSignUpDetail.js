import { message } from 'antd';
import * as service from '../services/myActivity';

export default {
  namespace: 'taSignUpDetail',

  state: {
    customerInfo: {},
    otherInfo: {},
  },
  effects: {
    *queryTaInfo({ payload }, { call, put }) {
      const { taId } = payload;
      const res = yield call(service.queryTaInfo, taId);
      const { resultCode, resultMsg, result } = res.data;
      if (resultCode === '0' || resultCode === 0) {
        yield put({
          type: 'save',
          payload: {
            customerInfo: result.customerInfo,
            otherInfo: result.otherInfo,
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
        customerInfo: {},
        otherInfo: {},
      };
    },
  },
};
