import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import * as service from '../services/mainTAManagement';
import { queryDictionary, querySalesPerson } from '@/pages/TAManagement/services/taCommon';

export default {
  namespace: 'mainTAManagement',
  state: {
    selectTaId: null,
    arAllowed: false,
    searchForm: {
      idOrName: null,
      peoplesoftEwalletId: null,
      peoplesoftArAccountId: null,
      market: [],
      customerGroup: [],
      salesPerson: [],
      category: null,
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

    taSelectedRowKeys: [],

    customerGroupList: [],
    allCustomerGroupList: [],
    marketList: [],
    salesPersonList: [],
    categoryList: [],
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
            taSelectedRowKeys: [],
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
    *fetchCustomerGroupListByCategory({ payload }, { put, select }) {
      const { allCustomerGroupList = [] } = yield select(state => state.mainTAManagement);
      const { category } = payload;
      const customerGroupList = allCustomerGroupList.filter((item, index, arr) => {
        return String(item.dictSubType) === String(category);
      });
      yield put({
        type: 'save',
        payload: {
          customerGroupList,
        },
      });
    },
    *fetchAllCustomerGroupList(_, { call, put }) {
      const params = {
        dictType: '1004',
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryDictionary, { ...params });
      if (resultCode === '0' || resultCode === 0) {
        yield put({
          type: 'save',
          payload: {
            allCustomerGroupList: result || [],
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *fetchCategoryList(_, { put, call }) {
      const params = {
        dictType: '10',
        dictSubType: '1004',
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryDictionary, { ...params });
      if (resultCode === '0' || resultCode === 0) {
        yield put({ type: 'save', payload: { categoryList: result || [] } });
      } else message.warn(resultMsg, 10);
    },
    *fetchMarketList({ payload }, { put, call }) {
      const params = {
        dictType: '10',
        dictSubType: '1006',
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryDictionary, { ...params });
      if (resultCode === '0' || resultCode === 0) {
        yield put({ type: 'save', payload: { marketList: result || [] } });
      } else message.warn(resultMsg, 10);
    },
    *fetchSalesPersonList({ payload }, { put, call }) {
      const reqParam = {
        market: null,
      };
      const {
        data: { resultCode, resultMsg, resultData },
      } = yield call(querySalesPerson, { ...reqParam });
      if (resultCode === '0' || resultCode === 0) {
        yield put({
          type: 'save',
          payload: { salesPersonList: resultData.userProfiles || [] },
        });
      } else message.warn(resultMsg, 10);
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
      // yield put({ type: 'taCommon/clean', payload });
      // yield put({ type: 'taMgr/clean', payload });
      // yield put({ type: 'uploadContract/clean', payload });
      // yield put({ type: 'uploadContractHistory/clean', payload });
      // yield put({ type: 'stateChangeHistory/clean', payload });
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
    *getState(_, { select }) {
      return yield select(state => state.mainTAManagement)
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
          arAllowed: false,
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

          taSelectedRowKeys: [],
        },
        ...payload,
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const { pathname } = location;
        if (pathname !== '/TAManagement/MainTAManagement') {
          dispatch({ type: 'mainTAManagement/doCleanAllDate' });
        } else if (pathname === '/TAManagement/MainTAManagement') {
          const getState = dispatch({ type: 'mainTAManagement/getState' });
          getState.then(state => {
            const {
              idOrName = null,
              peoplesoftEwalletId = null,
              peoplesoftArAccountId = null,
              searchList,
            } = state;
            dispatch({
              type: 'mainTAManagement/fetchMarketList'
            });
            dispatch({ type: 'mainTAManagement/fetchCategoryList' });
            dispatch({ type: 'mainTAManagement/fetchAllCustomerGroupList' });
            dispatch({ type: 'mainTAManagement/fetchSalesPersonList' });
            dispatch({
              type: 'mainTAManagement/fetchQryMainTAList',
              payload: {
                idOrName,
                peoplesoftEwalletId,
                peoplesoftArAccountId,
                pageInfo: {
                  currentPage: 1,
                  pageSize: searchList.pageSize,
                  totalSize: searchList.total,
                },
              },
            });
          })
        }
      });
    },
  },
};
