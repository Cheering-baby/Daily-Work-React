import { queryNotificationList } from '../../services/notification';

export default {
  namespace: 'bulletin',

  state: {
    type: '02',
    filter: {
      title: undefined,
      type: undefined,
      status: undefined,
      // bulletin
      notificationTypeList: ['01'],
      targetList: [],
      startDate: undefined,
      endDate: undefined,
    },
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    notificationList: [],
    notificationInfo: {},
  },

  effects: {
    *search({ payload }, { put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'save',
        payload,
      });
      yield put({
        type: 'queryNotificationList',
      });
    },
    *queryNotificationList(_, { call, put, select }) {
      const { filter, pagination } = yield select(state => state.bulletin);
      const requestData = {
        ...filter,
        ...pagination,
      };
      const {
        data: { result, resultCode, resultMsg },
      } = yield call(queryNotificationList, requestData);

      if (resultCode !== '0') {
        throw resultMsg;
      }

      const {
        notificationList = [],
        pageInfo: { currentPage, pageSize, totalSize },
      } = result;

      yield put({
        type: 'save',
        payload: {
          pagination: {
            currentPage,
            pageSize,
            totalSize,
          },
          notificationList,
        },
      });
    },
    *change({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: {
          ...payload,
        },
      });

      yield put({
        type: 'queryNotificationList',
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
        type: '02',
        filter: {
          title: undefined,
          type: undefined,
          status: undefined,
          // bulletin
          notificationTypeList: ['01'],
          targetList: [],
          startDate: undefined,
          endDate: undefined,
        },
        pagination: {
          currentPage: 1,
          pageSize: 10,
        },
        notificationList: [],
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname !== '/Notifications/Bulletin') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
