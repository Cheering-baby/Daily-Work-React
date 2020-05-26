import { accept, reject } from '../services/queryOrderService';
import { ERROR_CODE_SUCCESS } from '@/utils/commonResultCode';

export default {
  namespace: 'auditOrderMgr',
  state: {
    auditVisible: false,
    activityId: null,
    auditSelect: 'Approve',
    rejectReason: null,
  },

  effects: {
    *effectSave({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
    },
    *audit(_, { call, select }) {
      const { activityId, auditSelect, rejectReason } = yield select(state => state.auditOrderMgr);
      let response = null;
      if (auditSelect === 'Approve') {
        response = yield call(accept, { activityId });
      } else if (auditSelect === 'Reject') {
        response = yield call(reject, { activityId, reason: rejectReason.trim() });
      }
      if (!response) return false;
      let resultFlag = null;
      const { data: resultData, success, errorMsg } = response;
      if (success) {
        const { resultCode, resultMsg } = resultData;
        if (resultCode !== ERROR_CODE_SUCCESS) {
          throw resultMsg;
        }
        resultFlag = resultCode;
      } else throw errorMsg;
      return resultFlag;
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
        auditVisible: false,
        activityId: null,
        auditSelect: 'Approve',
        rejectReason: null,
      };
    },
  },

  subscriptions: {},
};
