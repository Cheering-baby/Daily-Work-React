import { isEmpty } from 'lodash';
import * as service from '../services/offline';

const commodity = commodityList => {
  const list = [];
  commodityList.forEach(node => {
    const children = [];
    if (node.subCommodityList && node.subCommodityList.length > 0) {
      const key = `add_${node.commoditySpecId}`;
      children.push({
        key: `${key}-${0}`,
        isSubNode: true,
        commodityName: node.commodityName,
        commodityDescription: node.commodityDescription,
        themeParkCode: node.themeParkCode,
        commodityCode: node.commodityCode,
      });
    }
    list.push({
      key: node.commoditySpecId,
      commodityName: node.commodityName,
      commodityDescription: node.commodityDescription,
      themeParkCode: node.themeParkCode,
      commodityCode: node.commodityCode,
      children: children.length > 0 ? children : null,
    });
  });
  return list;
};
export default {
  namespace: 'offlineNew',
  state: {
    value: '',
    tieredCommissionRuleList: [],
    commission: [[]],
    addPLUModal: false,
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    filter: {},
    PLUList: [],
  },
  effects: {
    *fetchPLUList({ payload }, { call, put, select }) {
      const { commodityType } = payload;
      const { pagination, filter } = yield select(state => state.offlineNew);
      const { likeParam } = filter;
      let requestData = {
        ...pagination,
        commodityType,
      };
      if (!isEmpty(likeParam)) {
        requestData = {
          ...pagination,
          commodityType,
          ...likeParam,
        };
      }
      const res = yield call(service.commodityList, requestData);
      const {
        data: { resultCode, resultMsg, result },
      } = res;

      if (resultCode === '0' || resultCode === 0) {
        const {
          page: { currentPage, pageSize, totalSize },
          commodityList,
        } = result;
        yield put({
          type: 'save',
          payload: {
            pagination: {
              currentPage,
              pageSize,
              totalSize,
            },
            PLUList: commodity(commodityList),
          },
        });
      } else throw resultMsg;
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear(state, { payload }) {
      return {
        ...state,
        ...payload,
        value: 'tiered',
        tieredCommissionRuleList: [],
        commission: [[]],
        addPLUModal: false,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname !== '/ProductManagement/CommissionRuleSetup/New') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
