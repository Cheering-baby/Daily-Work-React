import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import {
  addTAUser,
  modifyUser,
  queryAllCompany,
  queryCompanyInfo,
  queryDictionary,
  queryUserRolesByCondition,
  queryUsersByCondition,
  queryUsersInCompany,
} from '../service/userService';
import constants from '../constants';

export default {
  namespace: 'userMgr',
  state: {
    userProfiles: [],
    pageInfo: {},
    queryParam: {
      userCode: '',
      companyIds: [],
      orgCodes: [],
      categoryId: '',
      customerGroupId: '',
      pageSize: 10,
      currentPage: 1,
    },
    currentUserProfile: {},
    companyList: [],
    companyMap: new Map([]),
    orgList: [],
    userFormOkDisable: false,
    userRoles: [],
    companyDetailInfo: {},
    categories: [],
    customerGroups: [],
    searchUserCode: undefined,
    searchCompanyId: undefined,
    searchCategoryId: undefined,
    searchCustomerGroupId: undefined,
  },
  effects: {
    *queryUsersByCondition(_, { call, put, select }) {
      const { queryParam } = yield select(state => state.userMgr);
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
    *queryUserDetail({ payload }, { call, put }) {
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
          const { userType = '', taInfo = {} } = userProfiles[0];
          yield put({
            type: 'queryUserRoles',
            payload: {
              roleType: userType,
            },
          });
          yield put({
            type: 'queryAllCompany',
          });
          if (userType === constants.TA_USER_TYPE) {
            const { companyId } = taInfo;
            yield put({
              type: 'getTACompanyDetail',
              payload: {
                companyId,
              },
            });
          }
        } else {
          message.warn(formatMessage({ id: 'USER_NOT_FOND' }), 10);
        }
      } else {
        message.warn(resultMsg, 10);
      }
    },
    *addTAUser({ payload }, { call }) {
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
    *modifyUser({ payload }, { call }) {
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
    *getTACompanyDetail({ payload }, { call, put }) {
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(queryCompanyInfo, { taId: payload.companyId });
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
    *queryAllCompany(_, { call, put, select }) {
      const {
        currentUser: { userType = '' },
        userCompanyInfo = {},
      } = yield select(state => state.global);

      const companyMap = new Map();

      if (constants.RWS_USER_TYPE === userType) {
        const currentCompany = {
          id: -1,
          companyName: constants.RWS_COMPANY,
          companyType: constants.RWS_COMPANY,
        };
        const {
          data: { resultCode, resultMsg, result = [] },
        } = yield call(queryAllCompany);
        if (resultCode === '0') {
          result.forEach(item => {
            Object.assign(item, {
              id: Number.parseInt(item.key, 10),
              companyName: `${item.value}(${constants.TA_TYPE})`,
              companyType: '01',
            });
            companyMap.set(`${item.id}`, item);
          });
          result.unshift(currentCompany);
          companyMap.set(`${currentCompany.id}`, currentCompany);
          yield put({
            type: 'save',
            payload: {
              companyList: result,
              companyMap,
            },
          });
        } else message.warn(resultMsg, 10);
      } else if (constants.TA_USER_TYPE === userType) {
        const currentCompany = {
          id: userCompanyInfo.companyId,
          companyName: userCompanyInfo.companyName,
          companyType: userCompanyInfo.companyType,
        };
        const {
          data: { resultCode, resultMsg, result = {} },
        } = yield call(queryCompanyInfo, { taId: userCompanyInfo.companyId });
        if (resultCode === '0') {
          const { subTaList = [] } = result;
          subTaList.forEach(item => {
            Object.assign(item, {
              companyName: `${item.companyName}(${constants.SUB_TA_TYPE})`,
              companyType: '02',
            });
            companyMap.set(`${item.id}`, item);
          });
          subTaList.unshift(currentCompany);
          companyMap.set(`${currentCompany.id}`, currentCompany);
          yield put({
            type: 'save',
            payload: {
              companyList: subTaList,
              companyDetailInfo: result,
              companyMap,
            },
          });
        } else message.warn(resultMsg, 10);
      } else if (constants.SUB_TA_USER_TYPE === userType) {
        const currentCompany = {
          id: userCompanyInfo.companyId,
          companyName: userCompanyInfo.companyName,
          companyType: userCompanyInfo.companyType,
        };
        companyMap.set(`${userCompanyInfo.companyId}`, userCompanyInfo);
        yield put({
          type: 'save',
          payload: {
            companyList: [currentCompany],
            companyMap,
          },
        });
      } else {
        message.warn(formatMessage({ id: 'NOT_SUPPORT_USER_TYPE_ERROR' }), 10);
      }
    },

    *checkHasMasterUser({ payload }, { call, select }) {
      const { currentUserProfile = {} } = yield select(state => state.userMgr);
      const {
        data: {
          resultCode,
          resultMsg,
          resultData: { userProfiles = [] },
        },
      } = yield call(queryUsersInCompany, { ...payload, pageSize: 1, currentPage: 1 });
      if (resultCode === '0') {
        if (userProfiles.length > 0) {
          return userProfiles[0].userCode === currentUserProfile.userCode;
        }
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *queryUserRoles({ payload }, { call, put }) {
      const {
        data: {
          resultCode,
          resultMsg,
          resultData: { userRoles = [] },
        },
      } = yield call(queryUserRolesByCondition, { ...payload, pageSize: 1000, currentPage: 1 });
      if (resultCode === '0') {
        yield put({
          type: 'save',
          payload: {
            userRoles,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *queryCategories(_, { call, put }) {
      const {
        data: { resultCode, resultMsg, result = [] },
      } = yield call(queryDictionary, { dictType: '10', dictSubType: '1004' });
      if (resultCode === '0') {
        yield put({
          type: 'save',
          payload: {
            categories: result,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *queryCustomerGroups({ payload }, { call, put }) {
      const { categoryId } = payload;
      const {
        data: { resultCode, resultMsg, result = [] },
      } = yield call(queryDictionary, { dictType: '1004', dictSubType: categoryId });
      if (resultCode === '0') {
        yield put({
          type: 'save',
          payload: {
            customerGroups: result,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *saveData({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clean() {
      return {
        userProfiles: [],
        pageInfo: {},
        queryParam: {
          userCode: '',
          companyIds: [],
          orgCodes: [],
          categoryId: '',
          customerGroupId: '',
          pageSize: 10,
          currentPage: 1,
        },
        currentUserProfile: {},
        companyList: [],
        companyMap: new Map([]),
        orgList: [],
        userFormOkDisable: false,
        userRoles: [],
        companyDetailInfo: {},
        categories: [],
        customerGroups: [],

        searchUserCode: undefined,
        searchCompanyId: undefined,
        searchCategoryId: undefined,
        searchCustomerGroupId: undefined,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname.indexOf('/SystemManagement/UserManagement') === -1) {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
