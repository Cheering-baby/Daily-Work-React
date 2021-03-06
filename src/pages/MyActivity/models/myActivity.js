import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import * as service from '../services/myActivity';
import { ERROR_CODE_SUCCESS } from '@/utils/commonResultCode';

export default {
  namespace: 'myActivity',
  state: {
    filter: {
      startDate: undefined,
      endDate: undefined,
      activityTplCode: undefined,
      status: undefined,
      activityId: undefined,
      agentId: undefined,
      companyName: undefined,
    },
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    approvalList: [],
    statusList: [],
    templateList: [],
    contractFileList: [],
    selectTaId: null,
    contractFileUploading: false,
    companyDetailInfo: null,
  },
  effects: {
    *queryActivityList(_, { call, put, select }) {
      const { filter, pagination } = yield select(state => state.myActivity);
      const requestData = {
        queryType: '04',
        ...filter,
        ...pagination,
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.queryActivityList, requestData);

      if (resultCode !== ERROR_CODE_SUCCESS) {
        throw resultMsg;
      }

      const {
        activityInfoList,
        pageInfo: { currentPage, pageSize, totalSize },
      } = result;

      if (activityInfoList && activityInfoList.length > 0) {
        activityInfoList.map(v => {
          Object.assign(v, { key: `${v.activityId}` });
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
          approvalList: activityInfoList,
        },
      });
    },

    *registerContractFile({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { contractFileUploading: true } });
      const {
        data: { resultCode, resultMsg },
      } = yield call(service.registerContractFile, { ...payload });
      yield put({ type: 'save', payload: { qryTaTableLoading: false } });
      if (resultCode === '0' || resultCode === 0) {
        message.success(formatMessage({ id: 'UPLOAD_FILE_SUCCESS' }), 10);
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },

    *tableChanged({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });

      yield put({
        type: 'queryActivityList',
      });
    },

    *search({ payload }, { put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'save',
        payload,
      });
      yield put({
        type: 'queryActivityList',
      });
    },

    *fetchSelectReset(_, { put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'queryActivityList',
      });
    },

    *queryActivityDict(_, { call, put }) {
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.queryActivityDict);

      if (resultCode !== ERROR_CODE_SUCCESS) {
        throw resultMsg;
      }
      const { activityDictList } = result;
      yield put({
        type: 'save',
        payload: {
          statusList: activityDictList,
        },
      });
    },

    *queryTemplateList(_, { call, put }) {
      const pagination = {
        current: 1,
        pageSize: 1000,
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.queryTemplateList, pagination);

      if (resultCode !== ERROR_CODE_SUCCESS) {
        throw resultMsg;
      }
      const { templateList } = result;
      yield put({
        type: 'save',
        payload: {
          templateList,
        },
      });
    },

    *fetchDeleteTAFile({ payload }, { call }) {
      const {
        data: { resultCode, resultMsg },
      } = yield call(service.deleteFile, { ...payload });
      if (resultCode === '0' || resultCode === 0) {
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },

    *fetchCompanyDetail({ payload }, { call, put }) {
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(service.queryCompanyInfo, { taId: payload.companyId });
      if (resultCode === '0') {
        yield put({
          type: 'save',
          payload: {
            companyDetailInfo: result,
          },
        });
      } else {
        message.warn(resultMsg, 10);
        yield put({
          type: 'save',
          payload: {
            companyDetailInfo: {},
          },
        });
      }
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
          startDate: undefined,
          endDate: undefined,
          activityTplCode: undefined,
          status: undefined,
          activityId: undefined,
          businessId: undefined,
          agentId: undefined,
          companyName: undefined,
        },
        pagination: {
          currentPage: 1,
          pageSize: 10,
        },
        approvalList: [],
        contractFileList: [],
        selectTaId: null,
        contractFileUploading: false,
        isOperationApproval: undefined,
        companyDetailInfo: null,
      };
    },
    toggleModal(state, { payload }) {
      const { key, val } = payload;
      return {
        ...state,
        [key]: val,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname !== '/MyActivity') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
