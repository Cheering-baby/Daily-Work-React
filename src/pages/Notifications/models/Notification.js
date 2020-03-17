import { templateList } from '../services/notification';

export default {
  namespace: 'notification',

  state: {
    filter: {
      keyword: undefined,
      type: undefined,
      startDate: undefined,
      endDat: undefined,
    },
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    templateList: [],
    type: '',
    notificationType: '',
  },

  effects: {
    *queryTemplateList({ payload }, { call, put, select }) {
      const { filter, pagination } = yield select(state => state.notification);
      const requestData = {
        ...filter,
        ...pagination,
      };
      const result = yield call(templateList, requestData);

      const { data: resultData, success, errorMsg } = result;

      if (success) {
        const {
          resultCode,
          resultMsg,
          result: {
            templateList,
            pageInfo: { currentPage, pageSize, totalSize },
          },
        } = resultData;

        if (resultCode !== '0') {
          throw resultMsg;
        }

        if (templateList && templateList.length > 0) {
          templateList.map(v => {
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
            templateList,
          },
        });
      } else throw errorMsg;
    },

    *addNotification({ payload }, { call, put }) {
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

    *modifyNotification({ payload }, { call, put }) {
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

    *change({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: {
          ...payload,
        },
      });

      yield put({
        type: 'queryNotificationTemplateList',
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
};
