import { message } from 'antd';
import { forgetPassword, queryUsersByEmail } from '../services/forgetService';

export default {
  namespace: 'forgetMgr',
  state: {
    searchType: 'accountId',
    verifySuccess: false,
    userCodeList: [],
    email: null,
  },

  effects: {
    *forgetPassword({ payload }, { put, call }) {
      const response = yield call(forgetPassword, { ...payload });
      if (!response) return false;
      const {
        data: { resultCode, resultMsg },
      } = response;
      if (resultCode === '0') {
        yield put({
          type: 'save',
          payload: {
            verifySuccess: true,
          },
        });
      } else if (resultCode !== 'AppUser-130004') {
        message.error(resultMsg);
      }
      return resultCode;
    },
    *queryUsersByEmail({ payload }, { put, call }) {
      const { email } = payload;
      const response = yield call(queryUsersByEmail, email);
      if (!response) return false;
      const {
        data: { resultCode, resultData, resultMsg },
      } = response;
      if (resultCode === '0') {
        const { userCodes = [] } = resultData;
        yield put({
          type: 'save',
          payload: {
            email,
            userCodeList: userCodes,
          },
        });
        return userCodes.length;
      }
      message.error(resultMsg);
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
        searchType: 'accountId',
        verifySuccess: false,
        userCodeList: [],
        email: null,
      };
    },
  },
  subscriptions: {},
};
