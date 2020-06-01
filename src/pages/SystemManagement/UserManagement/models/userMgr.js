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
  resetPassword,
  sendEmail,
} from '../service/userService';
import constants from '../constants';
import PrivilegeUtil from '@/utils/PrivilegeUtil';

export default {
  namespace: 'userMgr',
  state: {
    userProfiles: [],
    pageInfo: {},
    queryParam: {
      userCode: undefined,
      fuzzyUserCode: undefined,
      companyIds: undefined,
      subCompanyIds: undefined,
      orgCodes: undefined,
      categoryId: undefined,
      customerGroupId: undefined,
      pageSize: 10,
      currentPage: 1,
    },
    currentUserProfile: {},
    companyList: [],
    companyMap: new Map([]),
    subTaCompanyList: [],
    subCompanyMap: new Map([]),
    orgList: [],
    userFormOkDisable: false,
    userRoles: [],
    companyDetailInfo: {},
    categories: [],
    customerGroups: [],
    searchUserCode: undefined,
    searchCompanyId: undefined,
    searchSubCompanyId: undefined,
    searchCategoryId: undefined,
    searchCustomerGroupId: undefined,
    formSubTaCompanies: [],
    allSubTACompanyMap: new Map([]),
    allSubTACompanies: [],
    currentCompanyType: '',
  },
  effects: {
    *queryUsersByCondition(_, { call, put, select }) {
      const { queryParam } = yield select(state => state.userMgr);
      const param = {};
      Object.assign(param, queryParam);
      if (param.userCode === '') {
        param.userCode = null;
      }
      if (param.fuzzyUserCode === '') {
        param.fuzzyUserCode = null;
      }
      if (param.companyIds && param.companyIds.length === 0) {
        param.companyIds = null;
      }
      if (param.orgCodes && param.orgCodes.length === 0) {
        param.orgCodes = null;
      }
      if (param.subCompanyIds && param.subCompanyIds.length === 0) {
        param.subCompanyIds = null;
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
          let companyType = '00';
          if (userType === '02') {
            companyType = '01';
          } else if (userType === '03') {
            companyType = '02';
          }
          yield put({
            type: 'saveData',
            payload: {
              currentCompanyType: companyType,
            },
          });
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
    *sendEmail({ payload }, { call }) {
      const {
        data: { resultCode, resultMsg },
      } = yield call(sendEmail, { ...payload });
      if (resultCode === '0') {
        message.success(formatMessage({ id: 'SEND_SUCCESS' }), 10);
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *resetPassword({ payload }, { call }) {
      const {
        data: { resultCode, resultMsg },
      } = yield call(resetPassword, { ...payload });
      if (resultCode === '0') {
        message.success(formatMessage({ id: 'RESET_PASSWORD_SUCCESS' }), 10);
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
        const { subTaList = [] } = result;
        yield put({
          type: 'save',
          payload: {
            companyDetailInfo: result,
            formSubTaCompanies: subTaList,
          },
        });
      } else {
        message.warn(resultMsg, 10);
        yield put({
          type: 'save',
          payload: {
            companyDetailInfo: {},
            formSubTaCompanies: [],
          },
        });
      }
    },
    *querySubTACompanies({ payload }, { call, put }) {
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(queryCompanyInfo, { taId: payload.companyId });
      if (resultCode === '0') {
        const { subTaList = [] } = result;
        const subCompanyMap = new Map([]);
        const allSubTACompanies = [];
        const allSubTACompanyMap = new Map([]);
        subTaList.forEach(item => {
          subCompanyMap.set(item.id, item);
          const { id = '', companyName = '' } = item;
          if (!allSubTACompanyMap.has(id)) {
            const companyInfo = {
              id,
              companyId: id,
              companyName,
              companyType: '02',
            };
            allSubTACompanyMap.set(id, companyInfo);
            allSubTACompanies.push(companyInfo);
          }
        });

        yield put({
          type: 'save',
          payload: {
            subTaCompanyList: subTaList,
            subCompanyMap,
            allSubTACompanies,
            allSubTACompanyMap,
          },
        });
      } else {
        message.warn(resultMsg, 10);
      }
    },
    *queryAllCompany(_, { call, put, select }) {
      const { userCompanyInfo = {} } = yield select(state => state.global);

      const companyMap = new Map();
      if (
        PrivilegeUtil.hasAnyPrivilege([
          PrivilegeUtil.PAMS_ADMIN_PRIVILEGE,
          PrivilegeUtil.SALES_SUPPORT_PRIVILEGE,
        ])
      ) {
        const currentCompany = {
          id: -1,
          companyName: constants.RWS_COMPANY,
          companyType: constants.RWS_COMPANY,
        };
        const {
          data: { resultCode, resultMsg, result = [] },
        } = yield call(queryAllCompany, { showColumnName: 'companyName' });
        if (resultCode === '0') {
          result.sort((a, b) => {
            if (a.value > b.value) {
              return 1;
            }
            if (b.value > a.value) {
              return -1;
            }
            return 0;
          });
          result.forEach(item => {
            Object.assign(item, {
              id: Number.parseInt(item.key, 10),
              companyName: `${item.value}`,
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
      } else if (PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.MAIN_TA_ADMIN_PRIVILEGE])) {
        const currentCompany = {
          id: userCompanyInfo.companyId,
          companyName: userCompanyInfo.companyName,
          companyType: userCompanyInfo.companyType,
        };
        companyMap.set(`${userCompanyInfo.companyId}`, currentCompany);
        yield put({
          type: 'save',
          payload: {
            companyList: [currentCompany],
            companyMap,
          },
        });
        yield put({
          type: 'querySubTACompanies',
          payload: {
            companyId: userCompanyInfo.companyId,
          },
        });
      } else if (PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.SUB_TA_ADMIN_PRIVILEGE])) {
        const currentCompany = {
          id: userCompanyInfo.companyId,
          companyId: userCompanyInfo.companyId,
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
        message.warn(formatMessage({ id: 'HAVE_NO_PRIVILEGE' }), 10);
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
    *querySubTAList(_, { call, put }) {
      const {
        data: { resultCode, resultMsg, result = [] },
      } = yield call(queryAllCompany, { showColumnName: 'companyName', isSubCompany: '1' });

      if (resultCode === '0') {
        const allSubTACompanies = [];
        const allSubTACompanyMap = new Map([]);
        result.forEach(item => {
          const { key = '', value = '' } = item;
          if (!allSubTACompanyMap.has(key)) {
            const companyInfo = {
              id: key,
              companyId: key,
              companyName: value,
              companyType: '02',
            };
            allSubTACompanyMap.set(key, companyInfo);
            allSubTACompanies.push(companyInfo);
          }
        });

        yield put({
          type: 'save',
          payload: {
            allSubTACompanyMap,
            allSubTACompanies,
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
          dispatch({ type: 'clean' });
        }
      });
    },
  },
};
