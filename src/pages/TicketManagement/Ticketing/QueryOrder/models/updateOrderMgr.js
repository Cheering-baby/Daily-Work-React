import { message } from 'antd';
import { accept, reject } from '../services/queryOrderService';
import { ERROR_CODE_SUCCESS } from '@/utils/commonResultCode';

export default {
  namespace: 'updateOrderMgr',
  state: {
    updateVisible: false,
    activityId: null,
    updateType: null,
    galaxyOrderNo: null,
    refundSelected: 'Complete',
    rejectReason: null,
    bookingNo: null,
  },

  effects: {
    *effectSave({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
    },
    *update(_, { call, select, put }) {
      const {
        activityId,
        refundSelected,
        rejectReason,
        updateType,
        galaxyOrderNo,
        bookingNo,
      } = yield select(state => state.updateOrderMgr);
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
      let resultFlag = null;
      if (success) {
        const { resultCode, resultMsg } = resultData;
        if (resultCode !== ERROR_CODE_SUCCESS) {
          message.error(resultMsg);
        }
        resultFlag = resultCode;
        if (updateType === 'Refund' && refundSelected === 'Complete') {
          yield put({
            type: 'refundRequestMgr/fetchPendToUpOnBookingNo',
            payload: {
              bookingNo,
            },
          });
        }
      } else {
        message.error(errorMsg);
      }
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
        updateVisible: false,
        updateType: null,
        galaxyOrderNo: null,
        refundSelected: 'Complete',
        rejectReason: null,
      };
    },
  },

  subscriptions: {},
};
