import { isEmpty } from 'lodash';
import { message } from 'antd';
import { formatMessage } from 'umi/locale';
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
        commoditySpecId: node.commoditySpecId,
      });
    }
    list.push({
      key: node.commoditySpecId,
      commodityName: node.commodityName,
      commodityDescription: node.commodityDescription,
      themeParkCode: node.themeParkCode,
      commodityCode: node.commodityCode,
      commoditySpecId: node.commoditySpecId,
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
    filter: {
      likeParam: {},
    },
    PLUList: [],
    checkedList: [],
    selectedRowKeys: [],
  },
  effects: {
    *fetchPLUList({ payload }, { call, put, select }) {
      const { commodityType, bindingType } = payload;
      const { pagination, filter } = yield select(state => state.offlineNew);
      const { likeParam } = filter;
      let requestData = {
        ...pagination,
        commodityType,
        bindingType,
      };
      if (!isEmpty(likeParam)) {
        requestData = {
          ...pagination,
          commodityType,
          bindingType,
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
    *add({ payload }, { call, put }) {
      const { params, commodityList } = payload;
      const reqParams = {
        ...params,
        commodityList,
      };
      const { success, errorMsg } = yield call(service.add, reqParams);
      if (success) {
        message.success(formatMessage({ id: 'COMMON_ADDED_SUCCESSFULLY' }));
        // fresh list data
        yield put({
          type: 'offline/fetchOfflineList',
        });
      } else throw errorMsg;
    },
    *searchPLU({ payload }, { put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'save',
        payload,
      });
      yield put({
        type: 'fetchPLUList',
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveSelectPLU(state, { payload }) {
      const { PLUList } = state;
      const { selectedRowKeys } = payload;
      const selectedPLU = [];
      for (let i = 0; i < PLUList.length; i += 1) {
        for (let j = 0; j < PLUList.length; j += 1) {
          if (PLUList[j] === PLUList[i].key) {
            PLUList.push(PLUList[i]);
          }
        }
      }
      return {
        ...state,
        selectedRowKeys,
        selectedPLU,
      };
    },
    clear(state, { payload }) {
      return {
        ...state,
        ...payload,
        value: 'tiered',
        tieredCommissionRuleList: [],
        commission: [[]],
        checkedList: [],
        selectedRowKeys: [],
        // addPLUModal: false,
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
