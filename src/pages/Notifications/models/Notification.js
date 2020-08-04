import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import * as service from '../services/notification';

export default {
  namespace: 'notification',
  state: {
    filter: {
      keyword: undefined,
      type: undefined,
    },
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    templateList: [],
    visibleFlag: false,
    templateId: undefined,
    templateViewVisible: false,
    type: '',
    notificationType: '',
    notificationInfo: {},
    notificationInfoLoadingFlag: false,
    isAdminRoleFlag: false,
    defaultTargetList: [],
  },
  effects: {
    *queryNotificationTemplateList(_, { call, put, select }) {
      const { filter, pagination } = yield select(state => state.notification);
      const requestData = {
        ...filter,
        ...pagination,
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.templateList, requestData);
      if (resultCode === '0' || resultCode === 0) {
        const {
          templateList,
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
            templateList,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *fetchAddNotification({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { notificationInfoLoadingFlag: true } });
      const {
        data: { resultCode, resultMsg },
      } = yield call(service.createNotification, { ...payload });
      yield put({ type: 'save', payload: { notificationInfoLoadingFlag: false } });
      if (resultCode === '0' || resultCode === 0) {
        message.success(formatMessage({ id: 'ADD_SUCCESS' }), 10);
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *fetchModifyNotification({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { notificationInfoLoadingFlag: true } });
      const {
        data: { resultCode, resultMsg },
      } = yield call(service.modifyNotification, { ...payload });
      yield put({ type: 'save', payload: { notificationInfoLoadingFlag: false } });
      if (resultCode === '0' || resultCode === 0) {
        message.success(formatMessage({ id: 'MODIFY_SUCCESS' }), 10);
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *fetchDeleteNotification({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { notificationInfoLoadingFlag: true } });
      const {
        data: { resultCode, resultMsg },
      } = yield call(service.deleteNotification, { ...payload });
      yield put({ type: 'save', payload: { notificationInfoLoadingFlag: false } });
      if (resultCode === '0' || resultCode === 0) {
        message.success(formatMessage({ id: 'DELETE_SUCCESS' }), 10);
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *fetchDeleteNotificationFile({ payload }, { call }) {
      const {
        data: { resultCode, resultMsg },
      } = yield call(service.deleteFile, { ...payload });
      if (resultCode === '0' || resultCode === 0) {
        message.success(formatMessage({ id: 'DELETE_FILE_SUCCESS' }), 10);
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *fetchUpdateNotificationStatus({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { notificationInfoLoadingFlag: true } });
      const { notificationId } = payload;
      const notificationIdList = [];
      notificationIdList.push(String(notificationId));
      const {
        data: { resultCode, resultMsg },
      } = yield call(service.batchUpdateReadStatus, { notificationIdList });
      yield put({ type: 'save', payload: { notificationInfoLoadingFlag: false } });
      if (resultCode === '0' || resultCode === 0) {
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *batchUpdateNotificationStatus({ payload }, { call }) {
      const {
        data: { resultCode, resultMsg },
      } = yield call(service.batchUpdateReadStatus, payload);
      if (resultCode === '0' || resultCode === 0) {
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
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
    *cleanData({ payload }, { put }) {
      yield put({
        type: 'clean',
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
    clean(state, { payload }) {
      return {
        ...state,
        ...{
          filter: {
            keyword: undefined,
            type: undefined,
          },
          pagination: {
            currentPage: 1,
            pageSize: 10,
          },
          templateList: [],
          visibleFlag: false,
          templateId: undefined,
          templateViewVisible: false,
          type: '',
          notificationType: '',
          notificationInfo: {},
          notificationInfoLoadingFlag: false,
          isAdminRoleFlag: false,
          defaultTargetList: [],
        },
        ...payload,
      };
    },
  },
};
