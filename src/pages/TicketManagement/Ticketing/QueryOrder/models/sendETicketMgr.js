import { sendEmail } from '../services/queryOrderService';

export default {
  namespace: 'sendETicketMgr',
  state: {
    sendETicketVisible: false,
    bookingNo: null,
    email: null,
    emailCorrect: true,
  },

  effects: {
    *effectSave({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
    },
    *sendEmail({ payload }, { call }) {
      const response = yield call(sendEmail, payload);
      if (!response) return false;
      const {
        data: { resultCode, resultMsg },
      } = response;
      if (resultCode !== '0') {
        return resultMsg;
      }
      return resultCode;
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
        sendETicketVisible: false,
        bookingNo: null,
        email: null,
        emailCorrect: true,
      };
    },
  },

  subscriptions: {},
};
