import { cloneDeep } from 'lodash';
import {
  queryTransactonTypes,
  queryAccount,
  queryActivityList,
  search,
} from '../services/travelAgentWalletServices';
import { ERROR_CODE_SUCCESS } from '@/utils/commonResultCode';

const DEFAULTS = {
  transactionId: null,
  transactionType: null,
  walletType: 'E_WALLET',
  dateRange: [],
  currentPage: 1,
  pageSize: 20,
};
export default {
  namespace: 'taWalletMgr',
  state: {
    taId: null,
    filter: {
      transactionId: DEFAULTS.transactionId,
      transactionType: DEFAULTS.transactionType,
      dateRange: DEFAULTS.dateRange,
    },
    pagination: {
      total: 0,
      currentPage: DEFAULTS.currentPage,
      pageSize: DEFAULTS.pageSize,
    },
    account: {},
    transactionTypes: [],
    dataSource: [],
    arActivity: undefined,
    mappingForArApplicationActivityId: undefined,
    activeKey: ['1'],
  },
  subscriptions: {},
  effects: {
    *effectSave({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
    },
    *fetchTransactionTypes(_, { call, put }) {
      const {
        data: { resultCode, resultMsg, result = [] },
      } = yield call(queryTransactonTypes);
      if (resultCode === '0') {
        yield put({
          type: 'save',
          payload: {
            transactionTypes: result,
          },
        });
      } else throw resultMsg;
    },
    *fetchAccountDetail(_, { call, put, select }) {
      const { taId } = yield select(state => state.taWalletMgr);
      const params = { taId };
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(queryAccount, params);
      if (resultCode === '0') {
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
      const { mappingForArApplicationActivityId, taId } = yield select(state => state.taWalletMgr);
      const params = {
        activityTplCode: 'ACCOUNT_AR_APPLY',
        businessId: taId,
        currentPage: 1,
        pageSize: 1,
      };
      const result = yield call(queryActivityList, params);
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
    *fetchAccountFlowList({ payload }, { call, put, select }) {
      yield put({ type: 'save', payload });
      const { filter, pagination, taId } = yield select(state => state.taWalletMgr);
      const params = {
        taId,
        walletType: DEFAULTS.walletType,
      };
      Object.assign(params, filter, pagination);
      delete params.dateRange;
      if (filter.dateRange && filter.dateRange.length > 0) {
        const startDate = filter.dateRange[0].format('YYYY-MM-DD');
        const endDate = filter.dateRange[1].format('YYYY-MM-DD');
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const {
        data: { resultCode, resultMsg, result = [] },
      } = yield call(search, params);
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
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    clear(state) {
      return {
        ...state,
        taId: null,
        filter: {
          transactionId: DEFAULTS.transactionId,
          transactionType: DEFAULTS.transactionType,
          dateRange: DEFAULTS.dateRange,
        },
        pagination: {
          total: 0,
          currentPage: DEFAULTS.currentPage,
          pageSize: DEFAULTS.pageSize,
        },
        account: {},
        transactionTypes: [],
        dataSource: [],
        arActivity: undefined,
        mappingForArApplicationActivityId: undefined,
        activeKey: ['1'],
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
