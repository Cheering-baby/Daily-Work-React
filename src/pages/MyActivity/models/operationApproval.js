import { router } from 'umi';
import { message } from 'antd';
import * as service from '../services/myActivity';
import { ERROR_CODE_SUCCESS } from '@/utils/commonResultCode';

export default {
  namespace: 'operationApproval',

  state: {
    bReroute: false,
    approvalStatus: undefined,
    rerouteList: [],
    allowRestart: false,
    operationVisible: false,
  },
  effects: {
    *approve({ payload }, { call, select, put }) {
      const { reason, approver, allowRestart, remarks } = payload;
      const { activityId } = yield select(state => state.activityDetail);
      const { bReroute, approvalStatus } = yield select(state => state.operationApproval);

      let result = {
        success: false,
        errorMsg: 'Please Reroute/Accept/Reject',
      };
      if (bReroute === true) {
        const targetList = [];
        approver.forEach(item => {
          const obj = {};
          obj.targetType = '03';
          obj.targetObj = item;
          targetList.push(obj);
        });
        result = yield call(service.reroute, {
          activityId,
          targetList,
        });
      } else if (approvalStatus === 'A') {
        result = yield call(service.accept, { activityId, remarks });
      } else if (approvalStatus === 'R') {
        result = yield call(service.reject, { activityId, reason, allowRestart });
      }

      const {
        data: { resultCode, resultMsg },
      } = result;

      if (resultCode !== ERROR_CODE_SUCCESS) {
        throw resultMsg;
      }

      yield put({
        type: 'doCleanAllData',
      });

      message.success(resultMsg);

      router.push({
        pathname: '/MyActivity',
      });
    },

    *queryRerouteList(_, { call, put }) {
      const res = yield call(service.queryRerouteList);
      const { resultCode, resultMsg, result } = res.data;
      if (resultCode === ERROR_CODE_SUCCESS) {
        const { userList } = result;
        if (userList && userList.length > 0) {
          userList.map(v => {
            Object.assign(v, { key: `${v.activityId}` });
            return v;
          });
        }
        yield put({
          type: 'save',
          payload: {
            rerouteList: userList,
          },
        });
      } else message.warn(resultMsg, 10);
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
        bReroute: false,
        approvalStatus: undefined,
        rerouteList: [],
        allowRestart: false,
        operationVisible: false,
      };
    },
  },
};
