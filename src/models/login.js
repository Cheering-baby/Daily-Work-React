import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import loginSession from '../utils/loginSession';
import UAAService from '@/uaa-npm';
import * as CommonService from '../services/common';
import { loginRedirect } from '../utils/utils';

export default {
  namespace: 'login',

  state: {
    resetModal: false,
    userMsg: '',
    loginData: [],
    orgType: '01',
    companyList: [],
    userCode: null,
    agentId: null,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const data = yield call(
        UAAService.login,
        payload.username,
        payload.password,
        payload.appCode,
        payload.loginType || '01',
        payload.agentId
      );

      if (data.success) {
        window.g_app.login_payload = payload;
        window.g_app.login_data = data;

        loginRedirect();

        yield put({
          type: 'changeLoginStatus',
          payload: data,
        });

        yield put({
          type: 'global/logged',
          payload: {
            from: 'Login',
          },
        });
      }
    },

    *changeUserPwd({ payload }, { call, put, select }) {
      const {
        data: { resultCode, resultMsg },
      } = yield call(
        CommonService.changePassword,
        payload.username,
        payload.oldPwd,
        payload.newPwd
      );
      if (resultCode === 0 || resultCode === '0') {
        message.success(formatMessage({ id: 'PWD_MOD_PWD_SUCCESSFULLY' }));
        yield put({
          type: 'closeModal',
        });
        const { currentUser } = yield select(state => state.global);
        const { orgType } = yield select(state => state.login);
        let agentId = currentUser.taInfo.companyId;
        if (String(orgType) !== '01') {
          agentId = currentUser.companyInfo.mainTAInfo.companyId;
        }
        yield put({
          type: 'login',
          payload: {
            username: currentUser.userCode,
            password: payload.newPwd,
            appCode: `${UAAService.defaults.appCode}`,
            loginType: orgType || '01',
            agentId,
          },
        });
      } else message.warn(resultMsg, 10);
    },

    *logout({ payload }, { call, put }) {
      if (!payload || !payload.noCallLogout) {
        yield call(UAAService.logout);
      }

      loginSession.signOut();

      if (window.portal && window.portal.logonStatus) {
        window.portal.logonStatus = false;
      }

      window.g_app.login_data = {};

      yield put({
        type: 'global/updateState',
        payload: {
          currentUser: {},
        },
      });

      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });

      yield put({
        type: 'global/resetLoadFlag',
      });

      reloadAuthorized();

      const urlParams = new URL(window.location.href);
      const { hash } = urlParams;

      if (hash.indexOf('/userLogin') <= -1 && hash.indexOf('redirect') <= -1) {
        yield put(
          routerRedux.push({
            pathname: '/userLogin',
          })
        );
      }
    },

    *fetchOrgListByUser({ payload = {} }, { call, put }) {
      const { userCode } = payload;
      let companyList = [];
      if (userCode) {
        const {
          data: { resultCode, resultMsg, result },
        } = yield call(CommonService.queryOrgListByUser, userCode);
        if (resultCode === '0' || resultCode === 0) {
          companyList = [...result];
        } else {
          message.warn(resultMsg, 10);
        }
      }
      yield put({
        type: 'save',
        payload: {
          companyList,
          userCode,
          selectOrgId: null,
        },
      });
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.userCode);
      return {
        ...state,
        ...payload,
      };
    },
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    closeModal(state, { payload }) {
      return {
        ...state,
        ...payload,
        resetModal: false,
      };
    },
  },
};
