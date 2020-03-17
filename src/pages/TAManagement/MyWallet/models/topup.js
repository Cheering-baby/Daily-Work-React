import * as service from '../services/myWallet';

const TopupModel = {
  namespace: 'topup',
  state: {},
  effects: {
    *featchTopup({ payload, callback }, { call }) {
      const params = { topupAmount: payload.topupAmount };
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(service.topup, params);
      if (resultCode === '0') {
        if (callback && typeof callback === 'function') {
          callback(result);
        }
      } else throw resultMsg;
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    clear(state) {
      return {
        ...state,
        profile: {},
        descriptionsData: {},
        details: {},
        paymentInstructions: {},
      };
    },
    toggleModal(state, { payload }) {
      const { key, val } = payload;
      return {
        ...state,
        [key]: val,
      };
    },
  },
};
export default TopupModel;
