import * as service from '../services/myActivity';
import { ERROR_CODE_SUCCESS } from '@/utils/commonResultCode';

export default {
  namespace: 'activityDetail',

  state: {
    activityId: undefined,
    activityInfo: {},
    historyHandlers: [],
    pendingHandlers: [],
    isOperationApproval: undefined,
    businessId: undefined,
  },
  effects: {
    *queryActivityDetail({ payload }, { call, put }) {
      const { activityId } = payload;
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.queryActivityDetail, { activityId });

      if (resultCode !== ERROR_CODE_SUCCESS) {
        throw resultMsg;
      }

      const { activityInfo, historyHandlers, pendingHandlers } = result;
      yield put({
        type: 'save',
        payload: {
          activityId,
          activityInfo,
          historyHandlers,
          pendingHandlers,
          businessId: activityInfo.activityInfo,
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
    doCleanAllData(state, { payload }) {
      return {
        ...state,
        ...payload,
        activityId: undefined,
        bReroute: false,
        activityInfo: {},
        historyHandlers: [],
        pendingHandlers: [],
        approvalStatus: undefined,
        businessId: undefined,
      };
    },
  },
};
