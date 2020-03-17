import { message } from 'antd';
import * as service from '../services/myWallet';

/* eslint-disable */
const ApplyModel = {
  namespace: 'apply',
  state: {},
  subscriptions: {
    setup({ dispatch }) {},
  },
  effects: {
    *feathArActitivy({ payload, callback }, { call, put, select }) {
      const {
        userCompanyInfo: { companyId = '' },
      } = yield select(state => state.global);
      const params = {
        activityCode: 'ACCOUNT_AR_APPLY',
        content: JSON.stringify({ uploadFiles: payload.uploadFiles }),
        remarks: '',
        businessId: companyId,
        scope: 'pams',
      };
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(service.createActivity, params);
      if (resultCode === '00') {
        if (callback && typeof callback === 'function') {
          callback(resultCode, resultMsg, result);
        }
      } else message.warn(resultMsg, 10);
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    clear(state) {
      return {
        ...state,
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
export default ApplyModel;
