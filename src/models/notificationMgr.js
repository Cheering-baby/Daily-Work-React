import { message } from 'antd';
import * as service from '../services/notification';

export default {
  namespace: 'notificationMgr',

  state: {
    systemNotificationList: [],
    systemNotificationCount: 0,
    pendingActivityList: [],
    pendingActivityCount: 0,
    bulletinList: [],
    bulletinCount: 0,
    circularList: [],
    circularCount: 0,
    nextQueryTime: 120,
    bellNotificationLoading: false,
    notificationVisibleFlag: false,
  },

  effects: {
    *fetchBellNotification({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { bellNotificationLoading: true } });
      const resultData = yield call(service.queryBellNotification, { ...payload });
      const { data, success, errorMsg } = resultData;
      yield put({ type: 'save', payload: { bellNotificationLoading: false } });
      if (success) {
        const { resultCode, resultMsg, result } = data;
        if (resultCode === '0' || resultCode === 0) {
          yield put({
            type: 'save',
            payload: {
              systemNotificationList: result.systemNotificationList || [],
              systemNotificationCount: result.systemNotificationCount || 0,
              pendingActivityList: result.pendingActivityList || [],
              pendingActivityCount: result.pendingActivityCount || 0,
              bulletinList: result.bulletinList || [],
              bulletinCount: result.bulletinCount || 0,
              circularList: result.circularList || [],
              circularCount: result.circularCount || 0,
              nextQueryTime: result.nextQueryTime || 120,
            },
          });
          return result.nextQueryTime || 120;
        }
        if (resultCode === 'USER-30004') {
          yield put({
            type: 'login/logout',
          });
          return null;
        }
        message.warn(resultMsg, 10);
        return null;
      }
      message.warn(errorMsg, 10);
      return null;
    },
    *saveData({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload,
      });
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear(state) {
      return {
        ...state,
        systemNotificationList: [],
        systemNotificationCount: 0,
        pendingActivityList: [],
        pendingActivityCount: 0,
        bulletinList: [],
        bulletinCount: 0,
        circularList: [],
        circularCount: 0,
        bellNotificationLoading: false,
        notificationVisibleFlag: false,
      };
    },
  },
  subscriptions: {
    // setup({ dispatch, history }) {
    //   history.listen(location => {
    //     if (location.pathname !== '/') {
    //       dispatch({ type: 'clear' });
    //     }
    //   });
    // },
  },
};
