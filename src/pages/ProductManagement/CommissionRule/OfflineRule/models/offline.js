import { isEmpty } from 'lodash';
import * as service from '../services/offline';

export default {
  namespace: 'offline',
  state: {
    filter: {
      likeParam: {},
    },
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    offlineList: [],
    detailVisible: false,
  },
  effects: {
    *fetchOfflineList(_, { call, put, select }) {
      const { filter, pagination } = yield select(state => state.offline);
      const { likeParam } = filter;
      let result;
      if (isEmpty(likeParam)) {
        result = yield call(service.offlineList, pagination);
      } else {
        result = yield call(service.offlineList, { ...likeParam, ...pagination });
      }

      const {
        data: {
          result: { List },
        },
      } = result;

      const { currentPage, pageSize, totalSize } = result;
      if (List && List.length > 0) {
        List.map(v => {
          Object.assign(v, { key: `offlineList${v.id}` });
          return v;
        });
      }
      yield put({
        type: 'save',
        payload: {
          currentPage,
          pageSize,
          totalSize,
          offlineList: List,
        },
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    clear(state) {
      return {
        ...state,
        filter: {},
        pagination: {
          currentPage: 1,
          pageSize: 10,
        },
        commissionRuleSetupList: [],
        detailVisible: false,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname !== '/ProductManagement/CommissionRule/OfflineRule') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
