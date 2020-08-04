import { router } from 'umi';
import { message } from 'antd';
import * as service from '../services/myActivity';
import { ERROR_CODE_SUCCESS } from '@/utils/commonResultCode';
import { isNvl } from '@/utils/utils';

export default {
  namespace: 'operationApproval',

  state: {
    bReroute: false,
    approvalStatus: undefined,
    rerouteList: [],
    saleManagerList: [],
    allowRestart: false,
    operationVisible: false,
    loadingFlag: false,
  },
  effects: {
    *approve({ payload }, { call, select, put }) {
      const { reason, approver, allowRestart, remarks, saleManager, productList, taId } = payload;
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
        if (!isNvl(saleManager)) {
          const pload = `{'saleManager' : '${saleManager}'}`;
          result = yield call(service.accept, {
            activityId,
            remarks,
            taId,
            productList,
            payload: pload,
          });
        } else {
          result = yield call(service.accept, { activityId, remarks, taId, productList });
        }
      } else if (approvalStatus === 'R') {
        result = yield call(service.reject, { activityId, reason, allowRestart });
      }
      yield put({
        type: 'save',
        payload: {
          loadingFlag: false,
        },
      });

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

    *querySalePerson(_, { call, put }) {
      const res = yield call(service.querySalePerson);
      const { resultCode, resultMsg, resultData } = res.data;
      if (resultCode === '0' || resultCode === 0) {
        const { userProfiles } = resultData;
        yield put({
          type: 'save',
          payload: {
            saleManagerList: userProfiles,
          },
        });
      } else message.warn(resultMsg, 10);
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
        saleManagerList: [],
      };
    },
  },
};
