import { queryNotificationList } from '../../services/notification';

export default {
  namespace: 'circular',

  state: {
    filter: {
      title: undefined,
      type: undefined,
      status: undefined,
      // circular
      notificationTypeList: ['02'],
      targetList: [],
      startDate: undefined,
      endDate: undefined,
    },
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    notificationList: [],
  },

  effects: {
    *queryNotificationList(_, { call, put, select }) {
      const { filter, pagination } = yield select(state => state.circular);
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
        filter: {
          title: '',
          type: '',
          status: '',
          // circular
          notificationTypeList: ['02'],
          targetList: [],
          startDate: '',
          endDate: '',
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
        if (location.pathname !== '/Notifications/Circular') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
