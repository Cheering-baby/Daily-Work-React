import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import * as service from '../services/menuMgr';
import { getDefaultExpandedRowKeys, menuAdapter } from '../utils/pubUtils';
import * as setting from '@/uaa-npm/setting';

export default {
  namespace: 'menuMgr',
  state: {
    searchForm: {
      menuName: null,
    },
    menuTree: [],
    keys: [],
    qryMenuTableLoading: false,
    menuTypeList: [
      { dicType: '10', dicName: 'Directory menu', dicValue: '01' },
      { dicType: '10', dicName: 'Leaf menu', dicValue: '02' },
    ],
    iconArr: [],
    menuInfo: {},
    menuInfoLoadingFlag: false,
    menuFormVisible: false,
    selectMenuCode: null,
    menuMoreVisible: false,
    viewId: 'menuView',
  },
  effects: {
    *fetchAllMenus(_, { call, put }) {
      yield put({ type: 'save', payload: { qryMenuTableLoading: true } });
      const {
        data: { resultCode, resultMsg, resultData },
      } = yield call(service.queryAllMenus, { appCode: `${setting.appCode}` });
      yield put({ type: 'save', payload: { qryMenuTableLoading: false } });
      if (resultCode === 0 || resultCode === '0') {
        const menuTop = {
          key: resultData.menuCode,
          children: [],
          ...resultData,
        };
        const menuData = menuAdapter(menuTop, resultData.subMenus || []);
        menuTop.children = menuData;
        const menuTree = [menuTop];
        const keys = getDefaultExpandedRowKeys(menuTree, []) || [];
        yield put({
          type: 'save',
          payload: {
            menuTree,
            keys,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *fetchAllFontIcons(_, { call, put }) {
      const { success, errorMsg, data } = yield call(service.queryAllFontIcons);
      if (success) {
        yield put({
          type: 'save',
          payload: {
            iconArr: data || [],
          },
        });
      } else message.warn(errorMsg, 10);
    },
    *fetchAddMenu({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { menuInfoLoadingFlag: true } });
      const {
        data: { resultCode, resultMsg },
      } = yield call(service.addMenu, { ...payload });
      yield put({ type: 'save', payload: { menuInfoLoadingFlag: false } });
      if (resultCode === '0' || resultCode === 0) {
        message.success(formatMessage({ id: 'ADD_SUCCESS' }), 10);
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *fetchModifyMenu({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { menuInfoLoadingFlag: true } });
      const {
        data: { resultCode, resultMsg },
      } = yield call(service.modifyMenu, { ...payload });
      yield put({ type: 'save', payload: { menuInfoLoadingFlag: false } });
      if (resultCode === '0' || resultCode === 0) {
        message.success(formatMessage({ id: 'MODIFY_SUCCESS' }), 10);
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *fetchRemoveMenu({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { menuInfoLoadingFlag: true } });
      const {
        data: { resultCode, resultMsg },
      } = yield call(service.removeMenu, { ...payload });
      yield put({ type: 'save', payload: { menuInfoLoadingFlag: false } });
      if (resultCode === '0' || resultCode === 0) {
        message.success(formatMessage({ id: 'DELETE_SUCCESS' }), 10);
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *fetchMoveUpMenu({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { menuInfoLoadingFlag: true } });
      const {
        data: { resultCode, resultMsg },
      } = yield call(service.moveUpMenu, { ...payload });
      yield put({ type: 'save', payload: { menuInfoLoadingFlag: false } });
      if (resultCode === '0' || resultCode === 0) {
        message.success(formatMessage({ id: 'MOVE_UP_SUCCESS' }), 10);
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *fetchMoveDownMenu({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { menuInfoLoadingFlag: true } });
      const {
        data: { resultCode, resultMsg },
      } = yield call(service.moveDownMenu, { ...payload });
      yield put({ type: 'save', payload: { menuInfoLoadingFlag: false } });
      if (resultCode === '0' || resultCode === 0) {
        message.success(formatMessage({ id: 'MOVE_DOWN_SUCCESS' }), 10);
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *doSaveData({ payload }, { put }) {
      yield put({ type: 'save', payload });
    },
    *doCleanData({ payload }, { put }) {
      yield put({ type: 'clean', payload });
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
        ...state,
        ...{
          searchForm: {
            menuName: null,
          },
          menuTree: [],
          keys: [],
          qryMenuTableLoading: false,
          menuTypeList: [
            { dicType: '10', dicName: 'Directory menu', dicValue: '01' },
            { dicType: '10', dicName: 'Leaf menu', dicValue: '02' },
          ],
          iconArr: [],
          menuInfo: {},
          menuInfoLoadingFlag: false,
          menuFormVisible: false,
          selectMenuCode: null,
          menuMoreVisible: false,
          viewId: 'menuView',
        },
        ...payload,
      };
    },
  },
};
