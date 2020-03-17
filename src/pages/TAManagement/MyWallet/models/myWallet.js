import { cloneDeep } from 'lodash';
import * as service from '../services/myWallet';
import { ERROR_CODE_SUCCESS } from '@/utils/commonResultCode';

const DEFAULTS = {
  transactionId: null,
  transactionType: null,
  walletType: null,
  dateRange: null,
  currentPage: 1,
  pageSize: 20,
};
const MyWalletModel = {
  namespace: 'myWallet',
  state: {
    taId: 20000,
    filter: {
      transactionId: DEFAULTS.transactionId,
      transactionType: DEFAULTS.transactionType,
      walletType: DEFAULTS.walletType,
      dateRange: DEFAULTS.dateRange,
    },
    pagination: {
      total: 0,
      currentPage: DEFAULTS.currentPage,
      pageSize: DEFAULTS.pageSize,
    },

    account: {},
    walletTypes: [{ label: 'eWallet', value: 'E_WALLET' }],
    transactionTypes: [],
    dataSource: [],
    arActivity: undefined,
  },
  subscriptions: {},
  effects: {
    *fetchAccountFlowList({ payload }, { call, put, select }) {
      yield put({ type: 'save', payload });
      const { filter, pagination } = yield select(state => state.myWallet);
      const params = {
        // startDate: filter.dateRange? filter.dateRange[0]: null,
        // endDate: filter.dateRange? filter.dateRange[1]: null
      };
      Object.assign(params, filter, pagination);
      // console.log('parmas',params);
      delete params.dateRange;
      if (filter.dateRange) {
        params.dateRange = [
          filter.dateRange[0].format('YYYY-MM-DD').toString(),
          filter.dateRange[1].format('YYYY-MM-DD').toString(),
        ];
      }
      const {
        data: { resultCode, resultMsg, result = [] },
      } = yield call(service.search, params);
      if (resultCode === '0') {
        const dataSource = [];
        result.array.forEach((item, index) => {
          item.key = index;
          dataSource.push(item);
        });
        yield put({
          type: 'save',
          payload: {
            dataSource,
            pagination: {
              total: result.totalSize,
              currentPage: result.currentPage,
              pageSize: result.pageSize,
            },
          },
        });
      } else throw resultMsg;
    },

    *fetchTransactionTypes(_, { call, put }) {
      const {
        data: { resultCode, resultMsg, result = [] },
      } = yield call(service.queryTransactonTypes);
      if (resultCode === '0') {
        yield put({
          type: 'save',
          payload: {
            transactionTypes: result,
          },
        });
      } else throw resultMsg;
    },
    *fetchWalletTypes(_, { call, put }) {
      const {
        data: { resultCode, resultMsg, result = [] },
      } = yield call(service.queryWalletTypes);
      if (resultCode === '0') {
        yield put({
          type: 'save',
          payload: {
            walletTypes: result,
          },
        });
      } else throw resultMsg;
    },
    *fetchAccountDetail(_, { call, put, select }) {
      const {
        userCompanyInfo: { companyId = '' },
      } = yield select(state => state.global);
      const params = { taId: companyId };
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(service.queryAccount, params);
      if (resultCode === '0') {
        if (!result.accountProfileBean) return;
        const bean = cloneDeep(result.accountProfileBean);
        bean.accountBookBeanList.forEach(item => {
          if (item.accountBookType === 'E_WALLET') {
            bean.eWallet = cloneDeep(item);
          }
          if (item.accountBookType === 'AR_CREDIT') {
            bean.ar = cloneDeep(item);
          }
        });

        yield put({
          type: 'save',
          payload: {
            account: bean,
          },
        });
      } else throw resultMsg;
    },
    *fetchMyActivityList(_, { call, put }) {
      const params = {
        activityTplCode: 'ACCOUNT_AR_APPLY',
        currentPage: 1,
        pageSize: 1,
        queryType: '03',
      };
      const result = yield call(service.queryActivityList, params);
      const { data: resultData, success, errorMsg } = result;
      if (success) {
        const {
          resultCode,
          resultMsg,
          result: { activityInfoList },
        } = resultData;

        if (resultCode !== ERROR_CODE_SUCCESS) {
          throw resultMsg;
        }
        let activity;
        if (activityInfoList && activityInfoList.length > 0) {
          activityInfoList.forEach(item => {
            if (item.status === '02' || item.status === '03') {
              activity = item;
            }
          });
        }
        yield put({
          type: 'save',
          payload: {
            arActivity: activity,
          },
        });
      } else throw errorMsg;
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    clear(state) {
      return {
        ...state,
        filter: {
          transactionId: DEFAULTS.transactionId,
          transactionType: DEFAULTS.transactionType,
          walletType: DEFAULTS.walletType,
          dateRange: DEFAULTS.dateRange,
        },
        pagination: {
          currentPage: DEFAULTS.currentPage,
          pageSize: DEFAULTS.pageSize,
        },
        account: [],
        walletTypes: [{ label: 'eWallet', value: 'E_WALLET' }],
        transactionTypes: [],
        dataSource: [],
      };
    },
    toggleModal(state, { payload }) {
      const { key, val } = payload;
      return {
        ...state,
        [key]: val,
      };
    },
  },
};
export default MyWalletModel;
