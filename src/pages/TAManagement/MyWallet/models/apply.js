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
        uploadFiles: payload.uploadFiles,
        remarks: '',
      };
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(service.createActivity, params);
      if (resultCode === '0') {
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
