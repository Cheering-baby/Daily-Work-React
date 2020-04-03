import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import {
  addSubTARelation,
  addUserOrg,
  modifyUserOrg,
  operateMoveDownOrg,
  operateMoveUpOrg,
  orgBatchAddUser,
  orgBatchRemoveUser,
  queryAllCompany,
  queryCompanyInfo,
  queryRootOrgByCompany,
  queryUserOrgTree,
  queryUsersInCompany,
  queryUsersInOrg,
  removeSubTARelation,
  removeUserOrg,
} from '../service/orgService';

const generateList = (data = [], result = []) => {
  for (let i = 0; i < data.length; i += 1) {
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
  namespace: 'orgMgr',
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
    companyList: [],
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
        const { selectedOrg = {} } = yield select(state => state.orgMgr);
        if (Object.keys(selectedOrg).length > 0) {
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
    *queryAllCompany(_, { call, put }) {
      const {
        data: { resultCode, resultMsg, result = [] },
      } = yield call(queryAllCompany);
      if (resultCode === '0') {
        result.map(item =>
          Object.assign(item, { id: Number.parseInt(item.key, 10), companyName: item.value })
        );
        yield put({
          type: 'save',
          payload: {
            companyList: result,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *getSubTAOrg({ payload }, { call, put }) {
      const {
        data: { resultCode, resultMsg, resultData = {} },
      } = yield call(queryRootOrgByCompany, { ...payload });
      if (resultCode === '0') {
        const subTAOrg = resultData || {};
        yield put({
          type: 'save',
          payload: {
            subTAOrg,
          },
        });
        return subTAOrg;
      }
      message.warn(resultMsg, 10);
      return {};
    },
    *querySubCompany({ payload }, { call, put }) {
      const { companyId } = payload;
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(queryCompanyInfo, { taId: companyId });
      if (resultCode === '0') {
        const { subTaList = [] } = result;
        yield put({
          type: 'save',
          payload: {
            companyList: subTaList,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *queryUsersInOrg(_, { call, put, select }) {
      const { selectedOrg = {} } = yield select(state => state.orgMgr);
      const {
        data: { resultCode, resultMsg, resultData },
      } = yield call(queryUsersInOrg, {
        orgCode: selectedOrg.code,
        pageSize: 1000,
        currentPage: 1,
      });
      if (resultCode === '0') {
        const { userProfiles = [] } = resultData;
        for (let i = 0; i < userProfiles.length; i += 1) {
          userProfiles[i].seq = i + 1;
        }
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
        state => state.orgMgr
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
    *removeSubTARelation({ payload }, { call }) {
      const {
        data: { resultCode, resultMsg },
      } = yield call(removeSubTARelation, { ...payload });
      if (resultCode === '0') {
        message.success(formatMessage({ id: 'REMOVE_SUCCESS' }), 10);
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *addSubTARelation({ payload }, { call }) {
      const {
        data: { resultCode, resultMsg },
      } = yield call(addSubTARelation, { ...payload });
      if (resultCode === '0') {
        message.success(formatMessage({ id: 'ADD_SUCCESS' }), 10);
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
    clean() {
      return {
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
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname.indexOf('/SystemManagement/OrgManagement') === -1) {
          dispatch({ type: 'clean' });
        }
      });
    },
  },
};
