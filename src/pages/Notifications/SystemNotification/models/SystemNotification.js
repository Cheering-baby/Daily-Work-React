import { queryNotificationList } from '../../services/notification';

export default {
  namespace: 'systemNotification',
  state: {
    filter: {
      title: undefined,
      type: undefined,
      status: undefined,
      // circular
      notificationTypeList: ['03', '04'],
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
      const { filter, pagination } = yield select(state => state.systemNotification);
      const requestData = {
        ...filter,
        ...pagination,
      };
      const result = yield call(queryNotificationList, requestData);

      const { data: resultData, success, errorMsg } = result;

      if (success) {
        const {
          resultCode,
          resultMsg,
          result: {
            notificationList,
            pageInfo: { currentPage, pageSize, totalSize },
          },
        } = resultData;

        if (resultCode !== '00' && resultCode !== '0') {
          throw resultMsg;
        }

        if (notificationList && notificationList.length > 0) {
          notificationList.map(v => {
            Object.assign(v, { key: `${v.id}` });
            return v;
          });
        }

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
      } else throw errorMsg;
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
          notificationTypeList: ['03', '04'],
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
        if (location.pathname !== '/Notifications/SystemNotification') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
