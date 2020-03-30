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
    type: '',
    drawerVisible: false,
    themeParkList: [],
  },
  effects: {
    *fetchOfflineList(_, { call, put, select }) {
      const { filter, pagination } = yield select(state => state.offline);
      const { likeParam } = filter;
      let result;
      if (isEmpty(likeParam)) {
        result = yield call(service.queryCommodityCommissionTplList, pagination);
      } else {
        result = yield call(service.queryCommodityCommissionTplList, {
          ...likeParam,
          ...pagination,
        });
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
    *queryPluAttribute({ payload }, { call }) {
      const params = {
        attributeItem: payload.attributeItem,
      };
      const res = yield call(service.queryPluAttribute, params);
      // yield put({ type: 'save', payload: {checkOutLoading: false}, });
      // if (resultCode !== '0' && resultCode !== 0) {
      //   message.warn(resultMsg);
      //   return;
      // }
      // if (!result.items || result.items.length===0) {
      //   // eslint-disable-next-line no-throw-literal
      //   message.warn(`${payload.attributeItem} config is null`);
      //   return;
      // }
      // let queryPluKey = 0;
      // result.items.map(item=>{
      //   if (item.item === 'DeliveryPLU') {
      //     queryPluKey = item.itemValue;
      //   }
      // });
      // yield put({
      //   type: 'queryPluListByCondition',
      //   payload: {
      //     queryPluKey,
      //   },
      // });
    },
    *search({ payload }, { put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'save',
        payload,
      });
      yield put({
        type: 'fetchOfflineList',
      });
    },
    *fetchSelectReset(_, { put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'fetchOfflineList',
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
        type: '',
        drawerVisible: false,
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
