import { message } from 'antd';
import { isEmpty } from 'lodash';
import { formatMessage } from 'umi/locale';
import * as service from '../services/mainTAManagement';

const bindingList2 = bindingList => {
  const list = [];
  bindingList.forEach(node => {
    const children = [];
    if (node.subBinding && node.subBinding.length > 0) {
      node.subBinding.forEach(child => {
        children.push({
          isSubNode: true,
          ...child,
          key: child.bindingId,
        });
      });
    }
    list.push({
      key: node.bindingId,
      bindingName: node.bindingName,
      bindingDescription: node.bindingDescription,
      bindingIdentifier: node.bindingIdentifier,
      children: children.length > 0 ? children : null,
    });
  });
  return list;
};

export default {
  namespace: 'grant',
  state: {
    addOfferModal: false,
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    pagination2: {
      currentPage: 1,
      pageSize: 10,
    },
    bindingList: [],
    expandedRowKeys: [],
    addOfferList: [],
    selectedRowKeys: [],
    filter: {},
    checkedList: [],
  },
  effects: {
    *commodityBindingList({ payload }, { call, put, select }) {
      const { commoditySpecType } = payload;
      const { pagination } = yield select(state => state.grant);
      const requestData = {
        ...pagination,
        commoditySpecType,
      };

      const res = yield call(service.queryCommodityBindingList, requestData);
      const {
        data: { resultCode, resultMsg, result },
      } = res;

      if (resultCode === '0' || resultCode === 0) {
        const {
          page: { currentPage, pageSize, totalSize },
          bindingList,
        } = result;
        yield put({
          type: 'save',
          payload: {
            pagination: {
              currentPage,
              pageSize,
              totalSize,
            },
            bindingList: bindingList2(bindingList),
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *fetchCommodityList({ payload }, { call, put, select }) {
      const { bindingId, bindingType, commodityType } = payload;
      const { pagination2, filter } = yield select(state => state.grant);
      const { likeParam } = filter;
      let requestData = {
        ...pagination2,
        bindingId,
        bindingType,
        commodityType,
      };
      if (!isEmpty(likeParam)) {
        requestData = {
          ...pagination2,
          bindingId,
          bindingType,
          commodityType,
          ...likeParam,
        };
      }
      const res = yield call(service.addOfferList, requestData);
      const {
        data: { resultCode, resultMsg, result },
      } = res;

      if (resultCode === 0 || resultCode === '0') {
        const {
          page: { currentPage, pageSize, totalSize },
          commodityList,
        } = result;
        if (commodityList && commodityList.length > 0) {
          commodityList.map(v => {
            Object.assign(v, { key: `${v.commoditySpecId}` });
            return v;
          });
        }

        yield put({
          type: 'save',
          payload: {
            pagination: {
              currentPage,
              pageSize,
              totalSize,
            },
            addOfferList: commodityList,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *add({ payload }, { call, put }) {
      const { commodityList, tplId } = payload;
      const reqParams = {
        commodityList,
        tplId,
      };
      const { success, errorMsg } = yield call(service.add, reqParams);
      if (success) {
        message.success(formatMessage({ id: 'COMMON_ADDED_SUCCESSFULLY' }));

        yield put({
          type: 'commodityBindingList',
        });
      } else throw errorMsg;
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
        type: 'fetchCommodityList',
        payload,
      });
    },
    *reset({ payload }, { put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'fetchCommodityList',
        payload,
      });
    },
    *saveData({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
    },
    *tableChanged({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });

      yield put({
        type: 'fetchCommodityList',
        payload,
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
    saveSelectOffer(state, { payload }) {
      const { addOfferList } = state;
      const { selectedRowKeys } = payload;
      const selectedOffer = [];
      for (let i = 0; i < addOfferList.length; i += 1) {
        for (let j = 0; j < addOfferList.length; j += 1) {
          if (addOfferList[j] === addOfferList[i].key) {
            addOfferList.push(addOfferList[i]);
          }
        }
      }
      return {
        ...state,
        selectedRowKeys,
        selectedOffer,
      };
    },
    clear(state, { payload }) {
      return {
        ...state,
        ...payload,
        // addOfferModal: false,
        bindingList: [],
        addOfferList: [],
        selectedRowKeys: [],
        filter: {},
        pagination: {
          currentPage: 1,
          pageSize: 10,
        },
        pagination2: {
          currentPage: 1,
          pageSize: 10,
        },
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname !== '/SystemManagement/UserManagement') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
