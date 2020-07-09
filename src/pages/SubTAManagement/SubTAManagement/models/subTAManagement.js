import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import * as service from '../services/subTAManagement';
import PrivilegeUtil from "@/utils/PrivilegeUtil";
import constants from "@/pages/SystemManagement/UserManagement/constants";

export default {
  namespace: 'subTAManagement',
  state: {
    selectSubTaId: null,
    searchList: {
      total: 0,
      currentPage: 1,
      pageSize: 10,
    },
    searchForm: {
      taCompanyId: null,
      companyName: null,
      applyStartDate: null,
      applyEndDate: null,
    },
    subTaList: [],
    qrySubTaTableLoading: false,
    isDetail: false,
    isEdit: false,
    operationVisible: false,
    hisVisible: false,
    viewId: 'subTaView',
    companyList: [],
  },
  effects: {
    *queryAllCompany(_, { call, put, select }) {
      const { userCompanyInfo = {} } = yield select(state => state.global);
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
        } = yield call(service.queryAllCompany, { showColumnName: 'companyName' });
        if (resultCode === '0') {
          result.forEach(item => {
            Object.assign(item, {
              id: Number.parseInt(item.key, 10),
              companyName: `${item.value}`,
              companyType: '01',
            });
          });
          result.unshift(currentCompany);
          yield put({
            type: 'save',
            payload: {
              companyList: result,
            },
          });
        } else message.warn(resultMsg, 10);
      } else if (PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.MAIN_TA_ADMIN_PRIVILEGE])) {
        const currentCompany = {
          id: userCompanyInfo.companyId,
          companyName: userCompanyInfo.companyName,
          companyType: userCompanyInfo.companyType,
        };
        yield put({
          type: 'save',
          payload: {
            companyList: [currentCompany],
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

        yield put({
          type: 'save',
          payload: {
            companyList: [currentCompany],
          },
        });
      } else {
        message.warn(formatMessage({ id: 'HAVE_NO_PRIVILEGE' }), 10);
      }
    },
    *fetchQrySubTAList({ payload }, { call, put, select }) {
      const { searchList } = yield select(state => state.subTAManagement);
      const reqParam = {
        pageInfo: {
          ...searchList,
        },
        ...payload,
      };
      yield put({ type: 'save', payload: { qrySubTaTableLoading: true } });
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.querySubTAList, { ...reqParam });
      yield put({ type: 'save', payload: { qrySubTaTableLoading: false } });
      if (resultCode === '0' || resultCode === 0) {
        const { pageInfo, subTaList } = result;
        yield put({
          type: 'save',
          payload: {
            subTaList: subTaList || [],
            searchList: {
              total: Number(pageInfo.totalSize || '0'),
              currentPage: Number(pageInfo.currentPage || '1'),
              pageSize: Number(pageInfo.pageSize || '10'),
            },
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *fetchUpdateProfileStatus({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { qrySubTaTableLoading: true } });
      const {
        data: { resultCode, resultMsg },
      } = yield call(service.updateProfileStatus, { ...payload });
      yield put({ type: 'save', payload: { qrySubTaTableLoading: false } });
      if (resultCode === '0' || resultCode === 0) {
        if (String(payload.status).toLowerCase() === 'inactive') {
          message.success(formatMessage({ id: 'PROHIBIT_SUB_TA_PROFILE_SUCCESS' }), 10);
        }
        if (String(payload.status).toLowerCase() === 'active') {
          message.success(formatMessage({ id: 'ENABLE_SUB_TA_PROFILE_SUCCESS' }), 10);
        }
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
      yield put({ type: 'subTAStateChangeHistory/clean', payload });
    },
    *doCleanCommonData({ payload }, { put }) {
      yield put({ type: 'subTaMgr/clean', payload });
      yield put({ type: 'subTAStateChangeHistory/clean', payload });
    },
    *doCleanAllDate({ payload }, { put }) {
      yield put({ type: 'clean', payload });
      yield put({ type: 'subTaMgr/clean', payload });
      yield put({ type: 'subTAStateChangeHistory/clean', payload });
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
          selectSubTaId: null,
          searchList: {
            total: 0,
            currentPage: 1,
            pageSize: 10,
          },
          searchForm: {
            taCompanyId: null,
            companyName: null,
            applyStartDate: null,
            applyEndDate: null,
          },
          subTaList: [],
          qrySubTaTableLoading: false,
          isDetail: false,
          isEdit: false,
          operationVisible: false,
          hisVisible: false,
          viewId: 'subTaView',
          companyList: [],
        },
        ...payload,
      };
    },
  },
};
