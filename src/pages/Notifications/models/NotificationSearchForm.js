import { queryNotificationsType } from '../services/notification';

export default {
  namespace: 'notificationSearchForm',

  state: {
    notificationTypeList: [],
    targetTypeList: [],
    statusList: [],
  },

  effects: {
    *queryNotificationTypeList(_, { call, put }) {
      const { data } = yield call(queryNotificationsType, 2);
      // const { resultCode, resultMsg } = data;
      // if (resultCode === '0') {
      const { dictionaryInfos } = data;
      yield put({
        type: 'save',
        payload: {
          notificationTypeList: dictionaryInfos,
        },
      });
      // } else message.warn(resultMsg, 10);
    },

    *queryTargetTypeList(_, { call, put }) {
      const { data } = yield call(queryNotificationsType, 3);
      // const { resultCode, resultMsg } = data;
      // if (resultCode === '0') {
      const { dictionaryInfos } = data;
      yield put({
        type: 'save',
        payload: {
          targetTypeList: dictionaryInfos,
        },
      });
      // } else message.warn(resultMsg, 10);
    },

    *queryStatusList(_, { call, put }) {
      const { data } = yield call(queryNotificationsType, 4);
      // const { resultCode, resultMsg } = data;
      // if (resultCode === '0') {
      const { dictionaryInfos } = data;
      yield put({
        type: 'save',
        payload: {
          statusList: dictionaryInfos,
        },
      });
      // } else message.warn(resultMsg, 10);
    },

    *saveData({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: {
          ...payload,
        },
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    clear(state) {
      return {
        ...state,
        notificationTypeList: [],
        targetTypeList: [],
        statusList: [],
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (!location.pathname.startsWith('/Notifications')) {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
