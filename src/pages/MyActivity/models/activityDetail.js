import { router } from 'umi';
import { message } from 'antd';
import * as service from '../services/myActivity';
import { ERROR_CODE_SUCCESS } from '@/utils/commonResultCode';

export default {
  namespace: 'activityDetail',

  state: {
    activityId: undefined,
    bReroute: false,
    activityInfo: {},
    historyHandlers: [],
    pendingHandlers: [],
    approvalStatus: undefined,
    rerouteList: [],
    allowRestart: false,
  },
  effects: {
    *queryDetail({ payload }, { call, put }) {
      const { activityId } = payload;
      const result = yield call(service.queryDetail, { activityId });

      const { data: resultData, success, errorMsg } = result;

      if (success) {
        const {
          resultCode,
          resultMsg,
          result: { activityInfo, historyHandlers, pendingHandlers },
        } = resultData;

        if (resultCode !== ERROR_CODE_SUCCESS) {
          throw resultMsg;
        }

        yield put({
          type: 'save',
          payload: {
            activityId,
            activityInfo,
            historyHandlers,
            pendingHandlers,
          },
        });
      } else throw errorMsg;
    },
    *approve({ payload }, { call, select }) {
      const { reason, approver, allowRestart } = payload;
      const { activityId, bReroute, approvalStatus } = yield select(state => state.activityDetail);

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
        result = yield call(service.accept, { activityId });
      } else if (approvalStatus === 'R') {
        result = yield call(service.reject, { activityId, reason, allowRestart });
      }

      const { data: resultData, success, errorMsg } = result;

      if (success) {
        const { resultCode, resultMsg } = resultData;

        if (resultCode !== ERROR_CODE_SUCCESS) {
          throw resultMsg;
        }

        message.success(resultMsg);

        router.push({
          pathname: '/MyActivity',
        });
      } else throw errorMsg;
    },
    *queryMappingDetail({ payload }, { call, put }) {
      const { content } = payload;
      const { taId } = JSON.parse(content);
      const res = yield call(service.queryMappingDetail, taId);
      const { resultCode, resultMsg, result } = res.data;
      if (resultCode === '0' || resultCode === 0) {
        yield put({
          type: 'save',
          payload: {
            queryMappingInfo: result,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *queryRerouteList(_, { call, put }) {
      const res = yield call(service.queryRerouteList);
      const { resultCode, resultMsg, result } = res.data;
      if (resultCode === '00' || resultCode === 0) {
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
    reset(state, { payload }) {
      return {
        ...state,
        ...payload,
        activityId: undefined,
        bReroute: false,
        activityInfo: {},
        historyHandlers: [],
        pendingHandlers: [],
        approvalStatus: undefined,
      };
    },
  },
};
