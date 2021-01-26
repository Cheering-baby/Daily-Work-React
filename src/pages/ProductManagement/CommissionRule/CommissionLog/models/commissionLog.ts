import { Effect, Reducer, Subscription, responseType } from '@/types/model';
import { queryCommissionAuditLogList } from '../services/commissionLog';

export type operationType = 'Add' | 'Update' | 'Delete' | undefined;

export type commissionAuditLogListItem = {
  logSnId: string;
  offerId: string;
  offerNo: string;
  offerName: string;
  packagePlu: string;
  packagePluDesc: string;
  pluCode: string;
  pluCodeDesc: string;
  commissionType: string;
  operationType: operationType;
  newValue: string;
  oldValue: string;
  createdDate: string;
  createBy: string;
  commissionName: string;
  fieldName: string;
};

export type CommissionLogResult = {
  pageBean: {
    totalRecord: number;
    pageSize: number;
    currentPage: number;
  };
  onlineFixedCommissionLogList: commissionAuditLogListItem[];
  offlineFixedCommissionLogList: commissionAuditLogListItem[];
  attendanceTieredCommissionLogList: commissionAuditLogListItem[];
};

export type commissionTabKeyType =
  | 'Online Fixed commission'
  | 'Offline Fixed commission'
  | 'Tiered & Attendance';

const getInitialState = () => {
  return {
    activeKey: 'Online Fixed commission' as commissionTabKeyType,
    commissionAuditLogList: [] as commissionAuditLogListItem[],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
    searchOptions: {
      commissionName: null as string | null,
      queryOfferKey: null as string | null,
      queryPluKey: null as string | null,
      operationType: undefined as operationType,
      createBy: null as string | null,
      startDate: null as string | null,
      endDate: null as string | null,
    },
  };
};

export type CommissionLogStateType = ReturnType<typeof getInitialState>;

export type CommissionLogType = {
  namespace: string;
  state: CommissionLogStateType;
  effects: {
    queryCommissionAuditLogList: [Effect, { type: string }];
  };
  reducers: {
    saveSearchOptions: Reducer<CommissionLogStateType>;
    resetSearchOptions: Reducer<CommissionLogStateType>;
    save: Reducer<CommissionLogStateType>;
    reset: Reducer<CommissionLogStateType>;
  };
  subscriptions: {
    setup: Subscription;
  };
};

const takeLatest = { type: 'takeLatest' };

const Model: CommissionLogType = {
  namespace: 'commissionLog',

  state: getInitialState(),

  effects: {
    queryCommissionAuditLogList: [
      function* queryPeakDateListFunction({ payload }, { call, put, select }) {
        const commissionLog: CommissionLogStateType = yield select(state => state.commissionLog);
        const { activeKey: commissionType, pagination, searchOptions } = commissionLog;
        const params = {
          pageSize: pagination.pageSize,
          currentPage: pagination.current,
          commissionType,
          ...searchOptions,
          ...payload,
        };

        for (let arg in params) {
          if (typeof params[arg] === 'string' && params[arg]) {
            params[arg] = params[arg].trim();
          }
        }

        const response: responseType<CommissionLogResult> = yield call(
          queryCommissionAuditLogList,
          params
        );
        if (!response) return false;
        const {
          data: { resultCode, resultMsg, result },
        } = response;
        if (resultCode === '0') {
          const {
            pageBean: { pageSize, totalRecord, currentPage },
            onlineFixedCommissionLogList,
            offlineFixedCommissionLogList,
            attendanceTieredCommissionLogList,
          } = result;
          let commissionAuditLogList = [];

          if (commissionType === 'Online Fixed commission') {
            commissionAuditLogList = onlineFixedCommissionLogList;
          } else if (commissionType === 'Offline Fixed commission') {
            commissionAuditLogList = offlineFixedCommissionLogList;
          } else if (commissionType === 'Tiered & Attendance') {
            commissionAuditLogList = attendanceTieredCommissionLogList;
          }

          yield put({
            type: 'save',
            payload: {
              pagination: {
                total: totalRecord,
                pageSize,
                current: currentPage,
              },
              commissionAuditLogList,
            },
          });
        } else throw resultMsg;
      },
      takeLatest,
    ],
  },

  reducers: {
    saveSearchOptions(state, { payload }) {
      return {
        ...state,
        searchOptions: {
          ...state.searchOptions,
          ...payload,
        },
      };
    },
    resetSearchOptions(state) {
      return {
        ...state,
        searchOptions: {
          commissionName: null,
          queryOfferKey: null,
          queryPluKey: null,
          operationType: undefined,
          createBy: null,
          startDate: null,
          endDate: null,
        },
      };
    },
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    reset() {
      return getInitialState();
    },
  },

  subscriptions: {
    setup({ history, dispatch }) {
      history.listen(location => {
        const { pathname } = location;
        if (pathname === '/ProductManagement/CommissionRule/CommissionLog') {
          dispatch({
            type: 'commissionLog/queryCommissionAuditLogList',
          });
        } else {
          dispatch({
            type: 'commissionLog/reset',
          });
        }
      });
    },
  },
};

export default Model;
