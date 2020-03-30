import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import * as service from '../services/mainTAManagement';

export default {
  namespace: 'mainTAManagement',
  state: {
    selectTaId: null,
    searchForm: {
      idOrName: null,
      peoplesoftEwalletId: null,
      peoplesoftArAccountId: null,
    },
    searchList: {
      total: 0,
      currentPage: 1,
      pageSize: 10,
    },
    mainTAList: [],
    qryTaTableLoading: false,

    selectMoreTaId: null,
    taMoreVisible: false,

    modalVisible: false,
    constraintVisible: false,
    contractHisModalVisible: false,
    hisActiveKey: '1',

    isBilCheckBox: false,
    isRwsRoom: null,
    isRwsAttraction: null,
    isAllInformationToRws: true,
    currentStep: 0,
    viewId: 'mainTaEditView',
    selectedRowKeys: [],
    rowSelected: '',
    rowAllSelected: {},
  },
  effects: {
    *fetchQryMainTAList({ payload }, { call, put, select }) {
      const { searchList } = yield select(state => state.mainTAManagement);
      const reqParam = {
        pageInfo: {
          ...searchList,
        },
        ...payload,
      };
      yield put({ type: 'save', payload: { qryTaTableLoading: true } });
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.queryMainTAList, { ...reqParam });
      yield put({ type: 'save', payload: { qryTaTableLoading: false } });
      if (resultCode === '0' || resultCode === 0) {
        const { pageInfo, taList } = result;
        yield put({
          type: 'save',
          payload: {
            mainTAList: taList || [],
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
      yield put({ type: 'save', payload: { qryTaTableLoading: true } });
      const {
        data: { resultCode, resultMsg },
      } = yield call(service.updateProfileStatus, { ...payload });
      yield put({ type: 'save', payload: { qryTaTableLoading: false } });
      if (resultCode === '0' || resultCode === 0) {
        if (String(payload.status).toLowerCase() === 'inactive') {
          message.success(formatMessage({ id: 'PROHIBIT_TA_PROFILE_SUCCESS' }), 10);
        }
        if (String(payload.status).toLowerCase() === 'active') {
          message.success(formatMessage({ id: 'ENABLE_TA_PROFILE_SUCCESS' }), 10);
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
      yield put({ type: 'uploadContract/clean', payload });
      yield put({ type: 'uploadContractHistory/clean', payload });
      yield put({ type: 'stateChangeHistory/clean', payload });
    },
    *doCleanCommonData({ payload }, { put }) {
      yield put({ type: 'taCommon/clean', payload });
      yield put({ type: 'taMgr/clean', payload });
      yield put({ type: 'uploadContract/clean', payload });
      yield put({ type: 'uploadContractHistory/clean', payload });
      yield put({ type: 'stateChangeHistory/clean', payload });
    },
    *doCleanAllDate({ payload }, { put }) {
      yield put({ type: 'clean', payload });
      yield put({ type: 'taCommon/clean', payload });
      yield put({ type: 'taMgr/clean', payload });
      yield put({ type: 'uploadContract/clean', payload });
      yield put({ type: 'uploadContractHistory/clean', payload });
      yield put({ type: 'stateChangeHistory/clean', payload });
    },
    *changeSelectedKey({ payload }, { put }) {
      yield put({ type: 'updateSelectKey', payload });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveSelect(state, { payload }) {
      const { mainTAList } = state;
      const { selectedRowKeys } = payload;
      const selectedMainTA = [];
      for (let i = 0; i < mainTAList.length; i += 1) {
        for (let j = 0; j < mainTAList.length; j += 1) {
          if (mainTAList[j] === mainTAList[i].key) {
            mainTAList.push(mainTAList[i]);
          }
        }
      }
      return {
        ...state,
        selectedRowKeys,
        selectedMainTA,
      };
    },
    updateSelectKey(state, { payload: data }) {
      return { ...state, rowSelected: data.rowSelected };
    },
    clean(state, { payload }) {
      return {
        ...state,
        ...{
          selectTaId: null,
          searchForm: {
            idOrName: null,
            peoplesoftEwalletId: null,
            peoplesoftArAccountId: null,
          },
          searchList: {
            total: 0,
            currentPage: 1,
            pageSize: 10,
          },
          mainTAList: [],
          qryTaTableLoading: false,

          selectMoreTaId: null,
          taMoreVisible: false,

          modalVisible: false,
          constraintVisible: false,
          contractHisModalVisible: false,
          hisActiveKey: '1',

          isBilCheckBox: false,
          isRwsRoom: null,
          isRwsAttraction: null,
          isAllInformationToRws: true,
          currentStep: 0,
          viewId: 'mainTaEditView',
        },
        ...payload,
      };
    },
  },
};
