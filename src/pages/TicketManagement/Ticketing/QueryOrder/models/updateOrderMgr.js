import { message } from 'antd';
import { accept, reject, secondUpdate } from '../services/queryOrderService';
import { ERROR_CODE_SUCCESS } from '@/utils/commonResultCode';

export default {
  namespace: 'updateOrderMgr',
  state: {
    updateVisible: false,
    activityId: null,
    updateType: null,
    revalidationSelected: 'Complete',
    galaxyOrderNo: null,
    revalidationRejectReason: null,
    refundSelected: 'Complete',
    rejectReason: null,
    bookingNo: null,
    status: null,
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
        revalidationSelected,
        revalidationRejectReason,
        galaxyOrderNo,
        bookingNo,
        status,
      } = yield select(state => state.updateOrderMgr);
      let response = null;
      if (updateType === 'Refund') {
        if (refundSelected === 'Complete') {
          response = yield call(accept, { activityId });
        } else if (refundSelected === 'Reject') {
          response = yield call(reject, { activityId, reason: rejectReason.trim() });
        }
      } else if(updateType === 'Revalidation') {
        if(revalidationSelected === 'Complete') {
          if (status === 'Confirmed') {
            response = yield call(accept, { activityId, remarks: galaxyOrderNo });
          } else if (status === 'Complete') {
            response = yield call(secondUpdate, {
              orderNo: bookingNo,
              galaxyNo: galaxyOrderNo === null ? '' : galaxyOrderNo
            });
            if (!response) return false;
            const { data: { resultCode, resultMsg }, } = response;
            if(resultCode !== '0'){
              message.error(resultMsg);
            }
            return resultCode;
          }
        } else if(revalidationSelected === 'Reject') {
          response = yield call(reject, { activityId, reason: revalidationRejectReason.trim() });
        }
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
        revalidationSelected: 'Complete',
        galaxyOrderNo: null,
        revalidationRejectReason: null,
        refundSelected: 'Complete',
        rejectReason: null,
        bookingNo: null,
        status: null,
      };
    },
  },

  subscriptions: {},
};
