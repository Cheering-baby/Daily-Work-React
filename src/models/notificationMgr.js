import * as service from '../services/notification';

export default {
  namespace: 'notificationMgr',

  state: {
    pagination: {
      currentPage: 1,
      pageSize: 5,
    },
    notificationList: [],
    systemFilter: {
      queryType: '02',
      title: undefined,
      type: undefined,
      status: undefined,
      // circular
      notificationTypeList: ['03', '04'],
      targetList: [],
      startDate: undefined,
      endDate: undefined,
    },
    bulletinFilter: {
      queryType: '02',
      title: undefined,
      type: undefined,
      status: undefined,
      // bulletin
      notificationTypeList: ['01'],
      targetList: [],
      startDate: undefined,
      endDate: undefined,
    },
    visibleFlag: false,
    systemList: [],
    systemLoading: false,
    systemCount: 0,
    activeKey: '1',
    bulletinList: [],
    bulletinLoading: false,
    bulletinCount: 0,
  },

  effects: {
    *querySystemList(_, { call, put, select }) {
      yield put({
        type: 'updateState',
        payload: {
          systemLoading: true,
        },
      });
      const { systemFilter, pagination } = yield select(state => state.notificationMgr);
      const requestData = {
        ...systemFilter,
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
    *querybulletinList(_, { call, put, select }) {
      yield put({
        type: 'updateState',
        payload: {
          bulletinLoading: true,
        },
      });
      const { bulletinFilter, pagination } = yield select(state => state.notificationMgr);
      const requestData = {
        ...bulletinFilter,
        ...pagination,
      };
      const result = yield call(service.queryNotificationList, requestData);
      const { data, success, errorMsg } = result;

      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            bulletinLoading: false,
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
            bulletinList: notificationList,
            bulletinCount: totalSize,
          },
        });
      } else throw errorMsg;
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
        notificationTypeList: [],
        visibleFlag: false,
        notificationList: [],
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
