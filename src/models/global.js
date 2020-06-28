/* eslint-disable no-restricted-syntax */
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import { setLocale } from 'umi/locale';
import { includes } from 'lodash';
import UAAService from '@/uaa-npm';
import loginSession from '../utils/loginSession';
import * as CommonService from '../services/common';

import {
  collapseMenu,
  getPageQuery,
  getServicePath,
  menuAdapter,
  openMenu,
  setCookie,
  transformFormat,
} from '../utils/utils';

const notPageUrls = ['/userLogin', '/userLogin/pamsLogin', '/'];
const watchObj = { refreshed: false };

const leafMenuSpecialMap = () => {
  return new Map([
    [
      'CREATE_ORDER',
      {
        noShowLeft: false,
        onLeftClick: 'ticketMgr/backRouterEventOnMobile',
        rightContent: null,
        menuCode: 'CREATE_ORDER',
      },
    ],
    [
      'QUERY_ORDER',
      {
        noShowLeft: false,
        onLeftClick: 'ticketMgr/backRouterEventOnMobile',
        rightContent: null,
        menuCode: 'QUERY_ORDER',
      },
    ],
    [
      'TICKET_SEASONALITY_CALENDAR',
      {
        noShowLeft: false,
        onLeftClick: 'ticketMgr/backRouterEventOnMobile',
        rightContent: null,
        menuCode: 'TICKET_SEASONALITY_CALENDAR',
      },
    ],
  ]);
};

export default {
  namespace: 'global',

  state: {
    collapsed:
      loginSession.getData('collapsed') === null ? false : loginSession.getData('collapsed'),
    currentUser: {},
    languages: [],
    currentUserRole: [],
    defaultUrl: '/',
    menu: [],
    rawMenu: [],
    leafMenuSpecialGroup: leafMenuSpecialMap(),
    // 菜单是否加载过
    menuLoaded: false,
    // 系统配置参数
    sysparams: {
      timeFormat: transformFormat('hh:ii:ss'),
      dateFormat: transformFormat('yyyy-mm-dd'),
      dataTimeFormat: transformFormat('yyyy-mm-dd hh:ii:ss'),
    },
    isFullScreen: false,
    pagePrivileges: [],
    appPrivileges: [],
    userCompanyInfo: {},
    needChangePassword: '00', // 00: no 01: Initial password 02: 90 days
  },

  effects: {
    /**
     * get system language
     * @param _
     * @param call
     * @returns {IterableIterator<*>}
     */ *getLocale(_, { call }) {
      const { success, errorMsg, data } = yield call(CommonService.getLocale);
      if (success) {
        // 默认英文
        let key = 'en-US';
        if (data === 'zh') {
          key = 'zh-CN';
        }
        setLocale(key);
        setCookie('PORTAL_LOCALE', data, 30);
        return data;
      }
      throw errorMsg;
    },
    /**
     * get support language
     * @param _
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */ *getSupportLanguage(_, { call, put }) {
      const { success, errorMsg, data } = yield call(CommonService.getSupportLanguage);
      if (success) {
        const { languageList } = data;
        yield put({
          type: 'updateState',
          payload: {
            languages: languageList,
          },
        });
      } else throw errorMsg;
    },
    /**
     * login success get login message
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */ *logged({ payload = {} }, { call, put }) {
      watchObj.refreshed = false;
      const umiLocale = loginSession.getLanguage();
      if (!umiLocale) {
        setLocale('en-US');
      }
      const data = yield call(UAAService.postLogin, { ...payload });

      window.g_app.login_data = data;

      if (String(data.needChangePassword) === '01' || String(data.needChangePassword) === '02') {
        yield put({
          type: 'login/save',
          payload: {
            resetModal: true,
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            needChangePassword: data.needChangePassword,
          },
        });
      }

      if (!window.portal) {
        window.portal = {};
      }

      if (Object.keys(data).length > 0) {
        const urlParams = new URL(window.location.href);
        const { hash } = urlParams;
        const { need2faVerify = false } = data;
        if (need2faVerify) {
          if (hash.indexOf('/twoFactorAuth') <= -1) {
            router.push({
              pathname: '/twoFactorAuth',
            });
          }
        } else {
          // 抛出全局对象portal：登录状态logonStatus/获取菜单路由方法collapseMenu/打开菜单方法openMenu
          window.portal.collapseMenu = collapseMenu;
          window.portal.openMenu = openMenu;
          window.portal.logonStatus = true;
          window.portal.defaultUrl = '/';

          if (!window.AppGlobal) {
            window.AppGlobal = {};
          }
          window.AppGlobal.userCode = data.username;
          window.AppGlobal.userName = data.username;
          window.AppGlobal.webroot = getServicePath();
          window.AppGlobal.version = '0.0.1';
          const {
            appInfo: { appComponents = [] },
          } = data;
          const appComponentMap = new Map();
          appComponents.forEach(item => {
            const { componentCode = '' } = item;
            appComponentMap.set(componentCode, item);
          });
          window.AppGlobal.appPrivilegeMap = appComponentMap;
          yield put({
            type: 'notificationMgr/fetchBellNotification',
            payload: {
              pageInfo: {
                currentPage: 1,
                pageSize: 5,
              },
            },
          });
          yield put({
            type: 'updateState',
            payload: {
              currentUser: { userName: data.username, ...data },
              currentUserRole: data.roles || [],
              userCompanyInfo: data.companyInfo || {},
              appPrivileges: appComponents,
            },
          });
          // postLogin 接口调用成功，通知 privilege 接口调用
          watchObj.refreshed = true;
          if (
            String(data.needChangePassword) !== '01' &&
            String(data.needChangePassword) !== '02'
          ) {
            yield put({
              type: 'fetchCurrentUserMenu',
              payload: {
                ...payload,
              },
            });
          }
        }
      } else {
        watchObj.refreshed = false;
        yield put({
          type: 'login/logout',
          payload: {
            noCallLogout: true,
          },
        });
      }
    },
    *fetchCurrentUserRole(_, { call, put }) {
      const data = yield call(CommonService.queryCurrentUserRoles);
      yield put({
        type: 'updateState',
        payload: {
          currentUserRole: data,
        },
      });
    },
    *fetchCurrentUserMenu({ payload = {} }, { call, put }) {
      const data = yield call(UAAService.menus);
      const menuData = menuAdapter(data);
      yield put({
        type: 'saveMenu',
        payload: {
          menu: menuData,
          rawMenu: data,
          menuLoaded: true,
        },
      });

      const { from = '' } = payload;
      if (from === 'Login') {
        const params = getPageQuery();
        const { redirect } = params;
        if (redirect && redirect.indexOf('/userLogin') <= -1) {
          // 判断redirect是否存在于menuList
          if (data.some(v => includes(redirect, v.url))) {
            window.location.href = redirect;
          } else {
            yield put({
              type: 'fetchDefaultMenu',
              payload: {
                from,
              },
            });
          }
        } else if (window.location.hash.indexOf('/userLogin') > -1) {
          yield put({
            type: 'fetchDefaultMenu',
            payload: {
              from,
            },
          });
        }
        const urlArr = window.location.href.split('#');
        if (!redirect && urlArr && urlArr.length > 0) {
          if (!data.some(v => includes(urlArr[0], v.url))) {
            yield put({
              type: 'fetchDefaultMenu',
              payload: {
                from,
              },
            });
          }
        }
      }
    },
    *fetchDefaultMenu({ payload = {} }, { put, select }) {
      const { currentUser } = yield select(state => state.global);
      const { menuList } = currentUser;
      // 如果只有一个叶子菜单，且此菜单为全屏菜单，则全屏
      if (menuList) {
        const childMenuList = [];
        for (const menu of menuList) {
          if (menu.menuType === 'M') {
            childMenuList.push(menu);
          }
        }

        if (childMenuList.length === 1 && childMenuList[0].isFullScreen === 'Y') {
          yield put({
            type: 'updateState',
            payload: {
              isFullScreen: true,
            },
          });

          yield put(routerRedux.push(childMenuList[0].url));
        }
      }

      if (payload.from) {
        yield put(routerRedux.push('/'));
      }
    },
    *fetchPrivileges({ payload = {} }, { call, put, select }) {
      const { pathname } = payload;
      if (pathname === '' || notPageUrls.includes(pathname)) {
        return;
      }
      const { currentUser = {} } = yield select(state => state.global);
      if (Object.keys(currentUser).length > 0) {
        const { pageComponents = [] } = yield call(UAAService.privileges, '', pathname);
        const pagePrivilegeMap = new Map();
        pageComponents.forEach(item => {
          const { componentCode = '' } = item;
          pagePrivilegeMap.set(componentCode, item);
        });
        window.AppGlobal.pagePrivilegeMap = pagePrivilegeMap;
        yield put({
          type: 'updateState',
          payload: {
            pagePrivileges: pageComponents,
            privilegeLoaded: true,
          },
        });
      } else {
        window.AppGlobal.pagePrivilegeMap = new Map();
        yield put({
          type: 'updateState',
          payload: {
            pagePrivileges: [],
            privilegeLoaded: true,
          },
        });
      }
    },
  },

  reducers: {
    resetLoadFlag(state, action) {
      return {
        ...state,
        ...action.payload,
        menuLoaded: false,
      };
    },
    saveMenu(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    changeLayoutCollapsed(state, { payload }) {
      loginSession.saveData('collapsed', payload);
      return {
        ...state,
        collapsed: payload,
      };
    },
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
    setupHistory({ dispatch, history }) {
      history.listen(localtion => {
        const { pathname } = localtion;
        if (pathname === '' || notPageUrls.includes(pathname.trim())) {
          return;
        }
        // 界面刷新 需要延迟调用，等 postLogin 接口调用完成后，请求权限
        if (!watchObj.refreshed) {
          let refreshed = null;
          Object.defineProperty(watchObj, 'refreshed', {
            get() {
              return refreshed;
            },
            set(newValue) {
              refreshed = newValue;
              if (newValue) {
                dispatch({
                  type: 'fetchPrivileges',
                  payload: {
                    pathname,
                  },
                });
              }
            },
          });
          return;
        }

        dispatch({
          type: 'fetchPrivileges',
          payload: {
            pathname,
          },
        });
      });
    },
  },
};
