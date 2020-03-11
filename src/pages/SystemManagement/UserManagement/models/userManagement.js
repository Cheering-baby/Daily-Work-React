import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import { queryUsersByCondition, addTAUser, modifyUser } from '../service/userService';

export default {
  namespace: 'userManagement',
  state: {
    userProfiles: [],
    pageInfo: {},
    queryParam: {
      userCode: '',
      companyIds: [],
      orgCodes: [],
      pageSize: 10,
      currentPage: 1,
    },
    currentUserProfile: {},
  },
  effects: {
    *queryUsersByCondition(_, { call, put, select }) {
      const { queryParam } = yield select(state => state.userManagement);
      const param = {};
      Object.assign(param, queryParam);
      if (param.userCode === '') {
        param.userCode = null;
      }
      if (param.companyIds && param.companyIds.length === 0) {
        param.companyIds = null;
      }
      if (param.orgCodes && param.orgCodes.length === 0) {
        param.orgCodes = null;
      }
      const {
        data: { resultCode, resultMsg, resultData },
      } = yield call(queryUsersByCondition, { ...param });
      if (resultCode === '0') {
        const { userProfiles = [], pageInfo = {} } = resultData;
        yield put({
          type: 'save',
          payload: {
            userProfiles,
            pageInfo,
          },
        });
      } else {
        message.warn(resultMsg, 10);
      }
    },
    *queryUserDetail({ payload }, { call, put, select }) {
      const { userCode = '' } = payload;
      const param = { userCode };
      const {
        data: { resultCode, resultMsg, resultData },
      } = yield call(queryUsersByCondition, { ...param });
      if (resultCode === '0') {
        const { userProfiles = [] } = resultData;
        if (userProfiles.length > 0) {
          yield put({
            type: 'save',
            payload: {
              currentUserProfile: userProfiles[0],
            },
          });
        } else {
          message.warn(formatMessage({ id: 'USER_NOT_FOND' }), 10);
        }
      } else {
        message.warn(resultMsg, 10);
      }
    },
    *addTAUser({ payload }, { call, put }) {
      const {
        data: { resultCode, resultMsg },
      } = yield call(addTAUser, { ...payload });
      if (resultCode === '0') {
        message.success(formatMessage({ id: 'ADD_SUCCESS' }), 10);
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *modifyUser({ payload }, { call, put }) {
      const {
        data: { resultCode, resultMsg },
      } = yield call(modifyUser, { ...payload });
      if (resultCode === '0') {
        message.success(formatMessage({ id: 'MODIFY_SUCCESS' }), 10);
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *saveData({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
    },
  },
  reducers: {
    toggleModal(state, { payload }) {
      const { key, val } = payload;
      return {
        ...state,
        [key]: val,
      };
    },
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clean(state, { payload }) {
      return {
        ...state,
        ...{
          customerInfo: {},
          otherInfo: {},
          taId: null,
          status: null,
          remark: null,
          taInfoLoadingFlag: false,
          taMappingInfoLoadingFlag: false,
          taAccountInfoLoadingFlag: false,
        },
        ...payload,
      };
    },
  },
};
