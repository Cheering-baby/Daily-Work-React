import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import {
  addUserRole,
  modifyUserRole,
  operUserPrivileges,
  queryAllPrivileges,
  queryMenuTree,
  queryUserRoleDetail,
  queryUserRolesByCondition,
} from '../service/roleService';
import constants from '../constants';

const generateList = (data = [], result = [], resultMap = new Map()) => {
  for (let i = 0; i < data.length; i += 1) {
    const node = data[i];
    const { menuCode, menuName, appCode } = node;
    result.push({ key: menuCode + appCode, title: menuName, menuCode });
    if (node.subMenus) {
      generateList(node.subMenus, result);
      resultMap.set(menuCode + appCode, true);
    } else {
      resultMap.set(menuCode + appCode, false);
    }
  }
};

export default {
  namespace: 'roleMgr',
  state: {
    userRoles: [],
    pageInfo: {},
    queryParam: {
      roleName: '',
      fuzzyRoleName: '',
      roleType: '',
      pageSize: 10,
      currentPage: 1,
    },
    drawerShowFlag: false,
    menuTree: [],
    menuList: [],
    expandedKeys: [],
    halfCheckedKeys: [],
    autoExpandParent: true,
    checkedKeys: [],
    selectedKeys: [],
    searchValue: '',
    operType: 'ADD_USER_ROLE',
    checkedMenuCodes: [],
    privilegeModalShowFlag: false,
    allPrivileges: [],
    rolePrivileges: [],
    selectedPrivileges: [],
  },

  effects: {
    *queryUserRolesByCondition(_, { call, put, select }) {
      const { queryParam } = yield select(state => state.roleMgr);
      const param = {};
      Object.assign(param, queryParam);
      if (param.roleName === '') {
        param.roleName = null;
      }
      if (param.roleType === '') {
        param.roleType = null;
      }
      if (param.fuzzyRoleName === '') {
        param.fuzzyRoleName = null;
      }
      const {
        data: { resultCode, resultMsg, resultData },
      } = yield call(queryUserRolesByCondition, { ...param });
      if (resultCode === '0') {
        const { userRoles = [], pageInfo = {} } = resultData;
        yield put({
          type: 'save',
          payload: {
            userRoles,
            pageInfo,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *queryMenuTree(_, { call, put }) {
      const param = { appCode: constants.APP_CODE };
      const {
        data: { resultCode, resultMsg, resultData },
      } = yield call(queryMenuTree, { ...param });
      if (resultCode === '0') {
        const menuList = [];
        generateList([resultData], menuList);
        yield put({
          type: 'save',
          payload: {
            menuTree: [resultData],
            menuList,
            expandedKeys: [constants.ROOT_CODE],
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *addUserRole({ payload }, { call }) {
      const {
        data: { resultCode, resultMsg },
      } = yield call(addUserRole, { ...payload });
      if (resultCode === '0') {
        message.success(formatMessage({ id: 'ADD_SUCCESS' }), 10);
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *modifyUserRole({ payload }, { call }) {
      const {
        data: { resultCode, resultMsg },
      } = yield call(modifyUserRole, { ...payload });
      if (resultCode === '0') {
        message.success(formatMessage({ id: 'MODIFY_SUCCESS' }), 10);
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *queryUserRoleDetail({ payload }, { call, put }) {
      const {
        data: { resultCode, resultMsg, resultData = {} },
      } = yield call(queryUserRoleDetail, { ...payload });
      if (resultCode === '0') {
        const { userMenus = [], userComponents = [] } = resultData;
        const roleMenus = [];
        const roleMenuMap = new Map();
        generateList(userMenus, roleMenus, roleMenuMap);
        const checkedKeys = roleMenus
          .map(item => {
            if (roleMenuMap.get(item.key)) {
              return null;
            }
            return item.key;
          })
          .filter(item => item);
        const checkedMenuCodes = roleMenus.map(item => item.menuCode);
        yield put({
          type: 'save',
          payload: {
            userRoleDetail: resultData,
            checkedKeys,
            checkedMenuCodes,
            expandedKeys: [constants.ROOT_CODE + constants.ROOT_CODE],
            rolePrivileges: userComponents.map(item => item.componentCode),
            selectedPrivileges: userComponents.map(item => item.componentCode),
          },
        });
      } else {
        message.warn(resultMsg, 10);
      }
    },
    *queryAllPrivileges({ payload }, { call, put }) {
      const {
        data: { resultCode, resultMsg, resultData = {} },
      } = yield call(queryAllPrivileges, { ...payload });
      if (resultCode === '0') {
        const { userComponents = [] } = resultData;
        userComponents.forEach(item => {
          item.key = item.componentCode;
        });
        yield put({
          type: 'save',
          payload: {
            allPrivileges: userComponents,
          },
        });
      } else {
        message.warn(resultMsg, 10);
      }
    },
    *operUserPrivileges({ payload }, { call }) {
      const {
        data: { resultCode, resultMsg },
      } = yield call(operUserPrivileges, { ...payload });
      if (resultCode === '0') {
        message.success(formatMessage({ id: 'GRANT_SUCCESS' }), 10);
        return true;
      }
      message.warn(resultMsg, 10);
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
    clean() {
      return {
        userRoles: [],
        pageInfo: {},
        queryParam: {
          roleName: '',
          fuzzyRoleName: '',
          roleType: '',
          pageSize: 10,
          currentPage: 1,
        },
        drawerShowFlag: false,
        menuTree: [],
        menuList: [],
        expandedKeys: [],
        halfCheckedKeys: [],
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: [],
        searchValue: '',
        operType: 'ADD_USER_ROLE',
        checkedMenuCodes: [],
        privilegeModalShowFlag: false,
        allPrivileges: [],
        rolePrivileges: [],
        selectedPrivileges: [],
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname.indexOf('/SystemManagement/RoleManagement') === -1) {
          dispatch({ type: 'clean' });
        }
      });
    },
  },
};
