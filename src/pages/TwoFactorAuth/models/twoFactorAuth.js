import { message } from 'antd';
import { generateCode, validateCode } from '../services/twoFactorAuthServices';

export default {
  namespace: 'twoFactorAuth',

  state: {
    expireTime: 0,
    retrieveCaptchaAvailable: true,
    countDown: 0,
    timeChange: 0,
  },

  effects: {
    *sendCode(_, { call, put, select }) {
      const {
        data: { resultCode, resultMessage },
      } = yield call(generateCode);
      if (resultCode === '0') {
        yield put({
          type: 'save',
          payload: {
            countDown: 60,
            retrieveCaptchaAvailable: true,
          },
        });
        message.success(resultMessage);
      } else {
        message.error(resultMessage);
      }
      const { retrieveCaptchaAvailable = false, countDown = 0 } = yield select(
        states => states.twoFactorAuth
      );
      return { reSend: retrieveCaptchaAvailable, countDown };
    },

    *validation({ payload }, { call, put }) {
      const { validationCode } = payload;
      const {
        data: { resultCode, resultMessage },
      } = yield call(validateCode, validationCode);
      if (resultCode === '0') {
        yield put({
          type: 'global/logged',
          payload: {
            from: 'Login',
          },
        });
      } else {
        message.error(resultMessage);
      }
    },

    *updateCountDown({ payload }, { put }) {
      const { countDown, retrieveCaptchaAvailable } = payload;
      yield put({
        type: 'save',
        payload: {
          countDown,
          retrieveCaptchaAvailable,
        },
      });
    },

    *saveData({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: {
          ...payload,
        },
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    resetData(state) {
      return {
        ...state,
        expireTime: 0,
        retrieveCaptchaAvailable: true,
        countDown: 0,
        timeChange: 0,
      };
    },
  },
};
