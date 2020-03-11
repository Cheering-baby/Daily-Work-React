import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import {
  queryUserOrgTree,
  queryUsersInOrg,
  queryUsersInCompany,
  addUserOrg,
  orgBatchAddUser,
  modifyUserOrg,
  orgBatchRemoveUser,
  operateMoveUpOrg,
  operateMoveDownOrg,
  removeUserOrg,
} from '../service/orgService';

const generateList = (data = [], result = []) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { code, orgName } = node;
    if (i === 0) {
      node.isFirst = true;
    }
    if (i === data.length - 1) {
      node.isLast = true;
    }
    result.push({ key: code, title: orgName, ...node });
    if (node.subOrgs) {
      generateList(node.subOrgs, result);
    }
  }
};

const getSelectedOrg = (userOrg = {}, orgList = []) => {
  for (const item of orgList) {
    if (userOrg.code === item.code) {
      return { ...item };
    }
  }
  return {};
};

const getCanAddUsers = (operType = 'ADD_USER_ORG', companyUsers = [], orgUsers = []) => {
  if (operType === 'ADD_USER_ORG') {
    return companyUsers;
  }
  const result = [];
  companyUsers.forEach(item => {
    const flag = orgUsers.find(temp => item.userCode === temp.userCode);
    if (!flag) {
      result.push(item);
    }
  });
  return result;
};

export default {
  namespace: 'orgManagement',
  state: {
    orgTree: [],
    orgList: [],
    searchValue: '',
    expandedKeys: [],
    autoExpandParent: true,
    selectedKeys: [],
    selectedOrg: {},
    orgUsers: [],
    drawerShowFlag: false,
    operType: 'ADD_USER_ORG',
    companyUsers: [],
    selectedUserKeys: [],
    userSearchValue: '',
    canAddUsers: [],
    filteredCanAddUsers: [],
  },
  subscriptions: {
    // setup({ dispatch }) {},
  },
  effects: {
    *queryUserOrgTree({ payload }, { call, put, select }) {
      const {
        data: { resultCode, resultMsg, resultData },
      } = yield call(queryUserOrgTree, { ...payload });
      if (resultCode === '0') {
        const orgList = [];
        const { code = '' } = resultData;
        const expandedKeys = [code];
        generateList([resultData], orgList);
        let { selectedOrg = {} } = yield select(state => state.orgManagement);
        if (Object.keys(selectedOrg).length !== 0) {
          selectedOrg = getSelectedOrg(selectedOrg, orgList);
          const { operType = '' } = payload;
          if (operType === 'ADD_USER_ORG') {
            expandedKeys.push(selectedOrg.code);
          }
        }
        yield put({
          type: 'save',
          payload: {
            orgTree: [resultData],
            orgList,
            expandedKeys,
            selectedOrg,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *queryUsersInOrg(_, { call, put, select }) {
      const { selectedOrg = {} } = yield select(state => state.orgManagement);
      const {
        data: { resultCode, resultMsg, resultData },
      } = yield call(queryUsersInOrg, {
        orgCode: selectedOrg.code,
        pageSize: 1000,
        currentPage: 1,
      });
      if (resultCode === '0') {
        const { userProfiles = [] } = resultData;
        yield put({
          type: 'save',
          payload: {
            orgUsers: userProfiles,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *queryUsersInCompany(_, { call, put, select }) {
      const { selectedOrg = {}, operType = 'ADD_USER_ORG', orgUsers = [] } = yield select(
        state => state.orgManagement
      );
      const {
        data: { resultCode, resultMsg, resultData },
      } = yield call(queryUsersInCompany, {
        companyIds: [selectedOrg.companyId].join(','),
        pageSize: 1000,
        currentPage: 1,
      });
      if (resultCode === '0') {
        const { userProfiles = [] } = resultData;
        const canAddUsers = getCanAddUsers(operType, userProfiles, orgUsers);
        yield put({
          type: 'save',
          payload: {
            companyUsers: userProfiles,
            canAddUsers,
            filteredCanAddUsers: canAddUsers,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *addUserOrg({ payload }, { call }) {
      const {
        data: { resultCode, resultMsg },
      } = yield call(addUserOrg, { ...payload });
      if (resultCode === '0') {
        message.success(formatMessage({ id: 'ADD_SUCCESS' }), 10);
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *modifyUserOrg({ payload }, { call }) {
      const {
        data: { resultCode, resultMsg },
      } = yield call(modifyUserOrg, { ...payload });
      if (resultCode === '0') {
        message.success(formatMessage({ id: 'MODIFY_SUCCESS' }), 10);
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *operateMoveUpOrg({ payload }, { call }) {
      const {
        data: { resultCode, resultMsg },
      } = yield call(operateMoveUpOrg, { ...payload });
      if (resultCode === '0') {
        message.success(formatMessage({ id: 'MOVE_UP_SUCCESS' }), 10);
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *operateMoveDownOrg({ payload }, { call }) {
      const {
        data: { resultCode, resultMsg },
      } = yield call(operateMoveDownOrg, { ...payload });
      if (resultCode === '0') {
        message.success(formatMessage({ id: 'MOVE_DOWN_SUCCESS' }), 10);
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *removeUserOrg({ payload }, { call }) {
      const {
        data: { resultCode, resultMsg },
      } = yield call(removeUserOrg, { ...payload });
      if (resultCode === '0') {
        message.success(formatMessage({ id: 'REMOVE_SUCCESS' }), 10);
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *orgBatchAddUser({ payload }, { call }) {
      const {
        data: { resultCode, resultMsg },
      } = yield call(orgBatchAddUser, { ...payload });
      if (resultCode === '0') {
        message.success(formatMessage({ id: 'ADD_SUCCESS' }), 10);
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *orgBatchRemoveUser({ payload }, { call }) {
      const {
        data: { resultCode, resultMsg },
      } = yield call(orgBatchRemoveUser, { ...payload });
      if (resultCode === '0') {
        message.success(formatMessage({ id: 'REMOVE_SUCCESS' }), 10);
      } else {
        message.warn(resultMsg, 10);
      }
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
    clean(state, { payload }) {
      return {
        detailVisible: false,
        userRoles: [],
        pageInfo: {},
        queryParam: {
          roleName: '',
          roleType: '',
          pageSize: 10,
          currentPage: 1,
        },
        drawerShowFlag: false,
        menuTree: [],
        menuList: [],
      };
    },
  },
};
