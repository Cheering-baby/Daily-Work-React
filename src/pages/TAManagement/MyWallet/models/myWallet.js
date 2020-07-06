import { cloneDeep, isEqual } from 'lodash';
import * as service from '../services/myWallet';
import { ERROR_CODE_SUCCESS } from '@/utils/commonResultCode';

const DEFAULTS = {
  transactionId: null,
  transactionType: null,
  walletType: 'E_WALLET',
  dateRange: [],
  currentPage: 1,
  pageSize: 20,
  filter: {
    // transactionId: DEFAULTS.transactionId,
    // transactionType: DEFAULTS.transactionType,
    // dateRange: DEFAULTS.dateRange,
  },
  filterFields: {},
};

const RESULT_CODE_SUCCESS = '0';
const MyWalletModel = {
  namespace: 'myWallet',
  state: {
    // filter: {
    //   transactionId: DEFAULTS.transactionId,
    //   transactionType: DEFAULTS.transactionType,
    //   dateRange: DEFAULTS.dateRange,
    // },
    filter: DEFAULTS.filter,
    filterFields: DEFAULTS.filterFields,
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
    mappingForArApplicationActivityId: undefined,
  },
  effects: {
    *fetchAccountFlowList({ payload }, { call, put, select }) {
      yield put({ type: 'save', payload });
      const {
        userCompanyInfo: { companyId },
      } = yield select(state => state.global);
      const { filter, pagination } = yield select(state => state.myWallet);
      const params = {
        taId: companyId,
        walletType: DEFAULTS.walletType,
        ...filter,
        ...pagination,
      };

      const { dateRange } = filter;
      if (dateRange && dateRange.length > 0) {
        const startDate = dateRange[0].format('YYYY-MM-DD');
        const endDate = dateRange[1].format('YYYY-MM-DD');
        params.startDate = startDate;
        params.endDate = endDate;
      }
      delete params.dateRange;

      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(service.search, params);
      if (resultCode === RESULT_CODE_SUCCESS) {
        const dataSource = [];
        result.array.forEach((item, index) => {
          item.key = index;
          dataSource.push(item);
        });
        const { totalSize, currentPage, pageSize } = result;
        yield put({
          type: 'save',
          payload: {
            dataSource,
            pagination: {
              total: totalSize,
              currentPage,
              pageSize,
            },
          },
        });
      } else throw resultMsg;
    },

    *fetchTransactionTypes(_, { call, put }) {
      const {
        data: { resultCode, resultMsg, result = [] },
      } = yield call(service.queryTransactonTypes);
      if (resultCode === RESULT_CODE_SUCCESS) {
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
      if (resultCode === RESULT_CODE_SUCCESS) {
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
        userCompanyInfo: { companyId },
      } = yield select(state => state.global);
      const params = { taId: companyId };
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(service.queryAccount, params);
      if (resultCode === RESULT_CODE_SUCCESS) {
        if (!result.accountProfileBean) return;
        const bean = cloneDeep(result.accountProfileBean);
        let arRemark = {};
        bean.accountBookBeanList.forEach(item => {
          if (item.accountBookType === 'E_WALLET') {
            const strs = item.balance
              .toFixed(3)
              .toString()
              .split('.');
            strs[0] =
              strs[0].length > 3
                ? `${strs[0].substring(0, strs[0].length - 3)},${strs[0].substring(
                    strs[0].length - 3
                  )}`
                : strs[0];
            bean.eWallet = {
              balance: item.balance.toFixed(2),
              integer: strs[0],
              decimal: strs[1].substring(0, 2),
            };
          }
          if (item.accountBookType === 'AR_CREDIT') {
            arRemark = item.remark ? JSON.parse(item.remark) : {};
            if (item.status !== 'A') {
              return;
            }
            const strs = item.balance
              .toFixed(3)
              .toString()
              .split('.');
            strs[0] =
              strs[0].length > 3
                ? `${strs[0].substring(0, strs[0].length - 3)},${strs[0].substring(
                    strs[0].length - 3
                  )}`
                : strs[0];
            bean.ar = {
              balance: item.balance,
              integer: strs[0],
              decimal: strs[1].substring(0, 2),
            };
          }
        });

        const { account } = yield select(state => state.myWallet);
        if (!isEqual(account, bean)) {
          yield put({ type: 'resetFilter' });
          yield put({ type: 'fetchAccountFlowList' });
        }
        yield put({
          type: 'save',
          payload: {
            account: bean,
          },
        });
        yield put({
          type: 'save',
          payload: {
            mappingForArApplicationActivityId: arRemark.activityId,
          },
        });
      } else throw resultMsg;
    },
    *fetchMyActivityList(_, { call, put, select }) {
      const { mappingForArApplicationActivityId } = yield select(state => state.myWallet);
      const {
        userCompanyInfo: { companyId = '' },
      } = yield select(state => state.global);
      const params = {
        activityTplCode: 'ACCOUNT_AR_APPLY',
        businessId: companyId,
        currentPage: 1,
        pageSize: 1,
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
        if (activityInfoList && activityInfoList.length > 0) {
          const index = 0;
          const activity = activityInfoList[index];
          if (mappingForArApplicationActivityId !== activity.activityId) {
            yield put({
              type: 'save',
              payload: {
                arActivity: activity,
              },
            });
          }
        }
      } else throw errorMsg;
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    resetState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    resetFilter(state) {
      return {
        ...state,
        filter: DEFAULTS.filter,
        pagination: {
          total: 0,
          currentPage: DEFAULTS.currentPage,
          pageSize: DEFAULTS.pageSize,
        },
      };
    },
  },
};
export default MyWalletModel;
