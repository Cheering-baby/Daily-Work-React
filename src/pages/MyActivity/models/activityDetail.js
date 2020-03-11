import {router} from 'umi';
import {message} from 'antd';
import * as service from '../services/myActivity';
import {ERROR_CODE_SUCCESS} from '@/utils/commonResultCode';

export default {
  namespace: 'activityDetail',

  state: {
    activityId: undefined,
    bReroute: false,
    activityInfo: {},
    historyHandlers: [],
    pendingHandlers: [],
    approvalStatus: undefined,
  },
  effects: {
    * queryDetail({payload}, {call, put}) {
      const {activityId} = payload;
      const result = yield call(service.queryDetail, {activityId});

      const {data: resultData, success, errorMsg} = result;

      if (success) {
        const {
          resultCode,
          resultMsg,
          result: {activityInfo, historyHandlers, pendingHandlers},
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
    * createActivity({payload}, {call, put}) {
      const {activityId} = payload;
      const result = yield call(service.createActivity, {activityId});

      const {data: resultData, success, errorMsg} = result;

      if (success) {
        const {
          resultCode,
          resultMsg,
          // result: {activityInfo, historyHandlers, pendingHandlers},
        } = resultData;

        if (resultCode !== ERROR_CODE_SUCCESS) {
          throw resultMsg;
        }

        yield put({
          type: 'save',
          // payload: {
          //   activityId,
          //   activityInfo,
          //   historyHandlers,
          //   pendingHandlers,
          // },
        });
      } else throw errorMsg;
    },
    * approve({payload}, {call, select}) {
      const {reason, approver} = payload;
      const {activityId, bReroute, approvalStatus} = yield select(state => state.activityDetail);

      let result = {
        success: false,
        errorMsg: 'Please Reroute/Accept/Reject',
      };
      if (bReroute === true) {
        result = yield call(service.reroute, {
          activityId,
          targetList: [{targetType: '03', targetObj: approver}],
        });
      } else if (approvalStatus === 'A') {
        result = yield call(service.accept, {activityId});
      } else if (approvalStatus === 'R') {
        result = yield call(service.reject, {activityId, reason});
      }

      const {data: resultData, success, errorMsg} = result;

      if (success) {
        const {resultCode, resultMsg} = resultData;

        if (resultCode !== ERROR_CODE_SUCCESS) {
          throw resultMsg;
        }

        message.success(resultMsg);

        router.push({
          pathname: '/MyActivity',
        });
      } else throw errorMsg;
    },
    * queryMappingDetail({ payload }, { call, put }) {
      const { content } = payload;
      const taId = JSON.parse(content).taId
      // console.log(content)
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
  },
  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
    reset(state, {payload}) {
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
