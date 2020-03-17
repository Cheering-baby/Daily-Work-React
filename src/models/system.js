import * as service from '../services/notification';

export default {
  namespace: 'system',
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
    systemList: [],
    systemLoading: false,
    systemCount: 0,
    activeKey: '1',
  },
  effects: {
    *queryNotificationList(_, { call, put, select }) {
      yield put({
        type: 'updateState',
        payload: {
          systemLoading: true,
        },
      });
      const { filter, pagination } = yield select(state => state.system);
      const requestData = {
        ...filter,
        ...pagination,
      };
      const result = yield call(service.queryNotificationList, requestData);
      const { data, success, errorMsg } = result;

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            systemLoading: false,
          },
        });
        const {
          resultCode,
          resultMsg,
          result: {
            notificationList,
            pageInfo: { currentPage, pageSize, totalSize },
          },
        } = data;

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
            systemCount: totalSize,
            systemList: notificationList,
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
        systemList: [],
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname !== '/') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
