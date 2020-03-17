import { message } from 'antd';
import { queryMenuTree, queryUserRolesByCondition } from '../service/roleService';
import { appCode } from '../../../../uaa-npm/setting';

const generateList = (data = [], result = []) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { menuCode, menuName, appCode } = node;
    result.push({ key: menuCode + appCode, title: menuName });
    if (node.subMenus) {
      generateList(node.subMenus, result);
    }
  }
};

export default {
  namespace: 'roleManagement',
  state: {
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
  },
  subscriptions: {
    // setup({ dispatch }) {},
  },
  effects: {
    *queryUserRolesByCondition(_, { call, put, select }) {
      const { queryParam } = yield select(state => state.roleManagement);
      const param = {};
      Object.assign(param, queryParam);
      if (param.roleName === '') {
        param.roleName = null;
      }
      if (param.roleType === '') {
        param.roleType = null;
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
    *queryMenuTree(_, { call, put, select }) {
      const param = { appCode };
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
