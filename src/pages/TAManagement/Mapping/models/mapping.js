import { isEmpty } from 'lodash';
import { message } from 'antd';
import * as service from '../services/mapping';

export default {
  namespace: 'mapping',
  state: {
    filter: {},
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    mappingList: [],
    statusList: [],
    arCreditTypeList: [],
    eWalletTypeList: [],
    mappingDetailVisible: false,
    salutationList: [],
    type: '',
  },
  effects: {
    *fetchMappingList(_, { call, put, select }) {
      const { filter, pagination } = yield select(state => state.mapping);
      const { likeParam } = filter;
      let reqParams = {
        pageInfo: {
          ...pagination,
        },
      };
      if (!isEmpty(likeParam)) {
        reqParams = {
          pageInfo: {
            ...pagination,
          },
          ...likeParam,
        };
      }
      const response = yield call(service.mappingList, reqParams);
      const { success, errorMsg, data } = response;
      const {
        result: { mappingList, pageInfo },
      } = data;
      const { currentPage, pageSize, totalSize } = pageInfo;
      if (success) {
        if (Array.isArray(mappingList)) {
          mappingList.map(v => {
            Object.assign(v, { key: `mappingList_${v.number}` });
            return v;
          });
        }
        yield put({
          type: 'save',
          payload: {
            currentPage,
            pageSize,
            totalSize,
            mappingList,
          },
        });
      } else {
        yield put({
          type: 'clear',
        });
        throw errorMsg;
      }
    },
    *tableChanged({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });

      yield put({
        type: 'fetchMappingList',
      });
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
        type: 'fetchMappingList',
      });
    },
    *fetchSelectReset(_, { put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'fetchMappingList',
      });
    },
    *fetchqueryDictionary(_, { call, put }) {
      const params = {
        dictType: '10',
        dictSubType: '1009',
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.queryDictionary, { ...params });
      if (resultCode === '0' || resultCode === 0) {
        yield put({ type: 'save', payload: { salutationList: result || [] } });
      } else message.warn(resultMsg, 10);
    },
    *fetchEWalletTypeDictionary(_, { call, put }) {
      const params = { dictType: '10', dictSubType: '1014' };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.queryDictionary, { ...params });
      if (resultCode === '0' || resultCode === 0) {
        yield put({ type: 'save', payload: { arCreditTypeList: result || [] } });
      } else message.warn(resultMsg, 10);
    },
    *fetchArCreditTypeDictionary(_, { call, put }) {
      const params = { dictType: '10', dictSubType: '1013' };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.queryDictionary, { ...params });
      if (resultCode === '0' || resultCode === 0) {
        yield put({ type: 'save', payload: { eWalletTypeList: result || [] } });
      } else message.warn(resultMsg, 10);
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
        mappingList: [],
        mappingDetailVisible: false,
        // salutationList: [],
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
        if (location.pathname !== '/TAManagement/Mapping') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
