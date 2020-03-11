// import React from 'react';
import * as service from '../services/myActivity';
import {ERROR_CODE_SUCCESS} from '@/utils/commonResultCode';

/* eslint-disable */
export default {
  namespace: 'myActivity',
  state: {
    filter: {
      startDate: undefined,
      endDate: undefined,
      activityTplCode: undefined,
      status: undefined,
    },
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    approvalList: [],
    uploadVisible: false,
    detailVisible: false,
    userAddVisible: false,
    downloadVisible: false,
    statusList: [],
    templateList: [],
    isMyActivityPage: false,
  },
  subscriptions: {
    setup({ dispatch }) {},
  },
  effects: {
    *fetchApprovalList(_, { call, put, select }) {
      const {filter, pagination} = yield select(state => state.myActivity);
      const requestData = {
        ...filter,
        ...pagination,
      };
      const result = yield call(service.approvalList, requestData);

      const {data: resultData, success: success, errorMsg: errorMsg} = result;

      if (success) {
        const {
          resultCode: resultCode,
          resultMsg: resultMsg,
          result: {
            activityInfoList,
            pageInfo: {currentPage, pageSize, totalSize},
          },
        } = resultData;

        if (resultCode !== ERROR_CODE_SUCCESS) {
          throw resultMsg;
        }

        if (activityInfoList && activityInfoList.length > 0) {
          activityInfoList.map(v => {
            Object.assign(v, {key: `${v.activityId}`});
            return v
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
      } else throw errorMsg;
    },
    *tableChanged({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });

      yield put({
        type: 'fetchApprovalList',
      });
    },
    *search({ payload }, { call, put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'save',
        payload,
      });
      yield put({
        type: 'fetchApprovalList',
      });
    },
    *fetchSelectReset({ payload }, { call, put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'fetchApprovalList',
      });
    },
    *statusList(_, { call, put }) {
      const pagination = {
        current: 1,
        pageSize: 1000,
      };

      const {data: resultData, success: success, errorMsg: errorMsg} = yield call(
        service.statusList,
        pagination
      );

      const {
        resultCode,
        resultMsg,
        result: {statusList},
      } = resultData;

      if (resultCode !== ERROR_CODE_SUCCESS) {
        throw resultMsg;
      }

      yield put({
        type: 'save',
        payload: {
          statusList: statusList,
        },
      });
    },
    * templateList(_, {call, put}) {
      const pagination = {
        current: 1,
        pageSize: 1000,
      };

      const {data: resultData, success: success, errorMsg: errorMsg} = yield call(
        service.templateList,
        pagination
      );

      const {
        resultCode: resultCode,
        resultMsg: resultMsg,
        result: {templateList: templateList},
      } = resultData;

      if (resultCode !== ERROR_CODE_SUCCESS) {
        throw resultMsg;
      }

      yield put({
        type: 'save',
        payload: {
          templateList: templateList,
        },
      });
    },
    * setIsMyActivityPageToFalse({payload, callback}, {call, put}) {
      yield put({
        type: 'save',
        payload: {
          isMyActivityPage: false,
        },
      });
      callback('yes');
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
        },
        pagination: {
          currentPage: 1,
          pageSize: 10,
        },
        approvalList: [],
        uploadVisible: false,
        detailVisible: false,
        userAddVisible: false,
        downloadVisible: false,
        statusList: [],
        templateList: [],
        isMyActivityPage: false,
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
};
