import { message } from 'antd';
import { queryNotifications, queryNotificationsType } from '../service/Bulletin';

export default {
  namespace: 'bulletin',

  state: {
    queryParams: {
      title: '',
      type: '',
      status: '',
      targetType: '',
      pageSize: 5,
      currentPage: 1,
    },
    currentPage: 1,
    pageSize: 5,
    totalSize: 0,
    notificationList: [],
    notificationTypeList: [],
    targetTypeList: [],
    statusList: [],
  },

  effects: {
    *queryNotifications(_, { call, put, select }) {
      const { queryParams, currentPage: qryCurrentPage, pageSize: qryPageSize } = yield select(
        state => state.bulletin
      );
      const { title, type, status, targetType } = queryParams;
      const { data } = yield call(
        queryNotifications,
        qryCurrentPage,
        qryPageSize,
        type,
        targetType,
        status,
        title
      );
      const { resultCode, resultMsg } = data;
      if (resultCode === '0') {
        const { systemNotificationList, totalSize = 0, pageSize = 5, currentPage = 1 } = data;
        yield put({
          type: 'save',
          payload: {
            notificationList: systemNotificationList,
            totalSize,
            pageSize,
            currentPage,
          },
        });
      } else message.warn(resultMsg, 10);
    },
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
  },
};
