import { message } from 'antd';
import { accept, reject } from '../services/queryOrderService';
import { ERROR_CODE_SUCCESS } from '@/utils/commonResultCode';

export default {
  namespace: 'updateOrderMgr',
  state: {
    updateVisible: false,
    activityId: null,
    updateType: 'Revalidation',
    galaxyOrderNo: null,
    refundSelected: 'Complete',
    rejectReason: null,
  },

  effects: {
    *effectSave({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
    },
    *update(_, { call, put, select }) {
      const { activityId, refundSelected, rejectReason, updateType, galaxyOrderNo } = yield select(
        state => state.updateOrderMgr
      );
      let response = null;
      if (updateType === 'Refund') {
        if (refundSelected === 'Complete') {
          response = yield call(accept, { activityId });
        } else if (refundSelected === 'Reject') {
          response = yield call(reject, { activityId, reason: rejectReason.trim() });
        }
      } else if (updateType === 'Revalidation') {
        response = yield call(accept, { activityId, remarks: galaxyOrderNo });
      }
      if (!response) return false;
      const { data: resultData, success, errorMsg } = response;
      if (success) {
        const { resultCode, resultMsg } = resultData;
        if (resultCode !== ERROR_CODE_SUCCESS) {
          throw resultMsg;
        }
        message.success(resultMsg);
        yield put({ type: 'resetData' });
        yield put({ type: 'queryOrderMgr/queryTransactions' });
      } else throw errorMsg;
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
        updateVisible: false,
        updateType: 'Revalidation',
        galaxyOrderNo: null,
        refundSelected: 'Complete',
        rejectReason: null,
      };
    },
  },

  subscriptions: {},
};
