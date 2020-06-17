import { message } from 'antd';
import * as service from '../services/myActivity';

export default {
  namespace: 'commissionFee',

  state: {
    feeDetailList: [],
  },
  effects: {
    *queryCommissionDeatil({ payload }, { call, put }) {
      const { feeId } = payload;
      const res = yield call(service.queryCommission, feeId);
      const { resultCode, resultMsg, result } = res.data;
      if (+resultCode === 0) {
        yield put({
          type: 'save',
          payload: {
            feeDetailList: result,
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
    clear(state) {
      return {
        ...state,
        feeDetailList: [],
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
