import { message } from 'antd';
import * as service from '../services/myActivity';

export default {
  namespace: 'subTaSignUpDetail',

  state: {
    countryList: [],
    subTaInfo: {},
  },

  effects: {
    *querySubTaInfo({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { subTaInfoLoadingFlag: true } });
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.querySubTaInfo, { ...payload });
      if (resultCode === '0' || resultCode === 0) {
        yield put({
          type: 'save',
          payload: {
            subTaInfo: result,
          },
        });
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
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
        countryList: [],
        subTaInfo: {},
      };
    },
  },
};
