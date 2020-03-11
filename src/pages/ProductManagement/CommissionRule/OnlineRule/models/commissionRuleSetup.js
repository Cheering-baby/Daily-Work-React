import { isEmpty } from 'lodash';
import * as service from '../services/commissionRuleSetup';

export default {
  namespace: 'commissionRuleSetup',
  state: {
    filter: {
      likeParam: {},
    },
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    commissionRuleSetupList: [],
    detailVisible: false,
  },
  effects: {
    *fetchCommissionRuleSetupList(_, { call, put, select }) {
      const { filter, pagination } = yield select(state => state.commissionRuleSetup);
      const { likeParam } = filter;
      let result;
      if (isEmpty(likeParam)) {
        result = yield call(service.commissionRuleSetupList, pagination);
      } else {
        result = yield call(service.commissionRuleSetupList, { ...likeParam, ...pagination });
      }

      const {
        data: {
          result: { commissionRuleSetupList },
        },
      } = result;

      const { currentPage, pageSize, totalSize } = result;
      if (commissionRuleSetupList && commissionRuleSetupList.length > 0) {
        commissionRuleSetupList.map(v => {
          Object.assign(v, { key: `commissionRuleSetupList${v.commissionName}` });
          return v;
        });
      }
      yield put({
        type: 'save',
        payload: {
          currentPage,
          pageSize,
          totalSize,
          commissionRuleSetupList,
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
    toggleModal(state, { payload }) {
      const { key, val } = payload;
      return {
        ...state,
        [key]: val,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname !== '/ProductManagement/CommissionRule/OnlineRule') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
