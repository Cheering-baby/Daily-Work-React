import { isEmpty } from 'lodash';
import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import * as service from '../services/commissionRuleSetup';

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
  namespace: 'commissionNew',
  state: {
    value: 'tiered',
    tieredCommissionRuleList: [],
    commission: [[]],
    addBindingModal: false,
    addPLUModal: false,
    addCommissionSchema: false,
    type: '',
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    filter: {},
    offerList: [],
    ifEdit: false,
    ifAdd: false,
    selectedRowKeys: [],
    selectedRowKeys2: [],
    selectedOffer: [],
    commissionTplList: [],
    PLUList: [],
    expandedRowKeys: [],
    index: undefined,
    offerExistedDisales: [],
    PLUSelected: [],
    PLUSelectItem: [],
    activityId: undefined,
    PLURelationList: [],
    commoditySpecId: null,
    checkedList: [],
  },
  effects: {
    *fetchOfferList({ payload }, { call, put, select }) {
      const { bindingId, bindingType, commodityType } = payload;
      const { pagination, filter } = yield select(state => state.commissionNew);
      const { likeParam } = filter;
      let requestData = {
        ...pagination,
        bindingId,
        bindingType,
        commodityType,
      };
      if (!isEmpty(likeParam)) {
        requestData = {
          ...pagination,
          bindingId,
          bindingType,
          commodityType,
          ...likeParam,
        };
      }

      const res = yield call(service.offerList, requestData);
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
            offerList: commodityList,
          },
        });
      } else throw resultMsg;
    },
    *fetchPLUList({ payload }, { call, put, select }) {
      const { bindingId, bindingType, commodityType } = payload;
      const { pagination, filter } = yield select(state => state.commissionNew);
      const { likeParam } = filter;
      let requestData = {
        ...pagination,
        bindingId,
        bindingType,
        commodityType,
      };
      if (!isEmpty(likeParam)) {
        requestData = {
          ...pagination,
          bindingId,
          bindingType,
          commodityType,
          ...likeParam,
        };
      }
      const res = yield call(service.offerList, requestData);
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
      const { params, tieredList, commodityList } = payload;
      const reqParams = {
        ...params,
        tieredList,
        commodityList,
      };
      const { success, errorMsg } = yield call(service.add, reqParams);
      if (success) {
        message.success(formatMessage({ id: 'COMMON_ADDED_SUCCESSFULLY' }));
        // fresh list data
        yield put({
          type: 'commissionRuleSetup/fetchCommissionRuleSetupList',
        });
      } else throw errorMsg;
    },
    *edit({ payload }, { call, put }) {
      const { params, tieredList, commodityList, tplId } = payload;
      const reqParams = {
        ...params,
        tieredList,
        commodityList,
        tplId,
      };
      const { success, errorMsg } = yield call(service.add, reqParams);
      if (success) {
        message.success(formatMessage({ id: 'COMMON_ADDED_SUCCESSFULLY' }));
        // fresh list data
        yield put({
          type: 'commissionRuleSetup/fetchCommissionRuleSetupList',
        });
      } else throw errorMsg;
    },
    *searchOffer({ payload }, { put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'save',
        payload,
      });
      yield put({
        type: 'fetchOfferList',
        payload,
      });
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
        payload,
      });
    },
    *reset({ payload }, { put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'fetchOfferList',
        payload,
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
        type: 'fetchPLUList',
      });
    },
    *resetPLU({ payload }, { put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'fetchPLUList',
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
        type: 'fetchPLUList',
      });
    },
    *binding({ payload }, { call }) {
      const { commodityList, tplId } = payload;
      const reqParams = {
        commodityList,
        tplId,
      };
      const { success, errorMsg } = yield call(service.grant, reqParams);
      if (success) {
        message.success(formatMessage({ id: 'COMMON_GRANTED_SUCCESSFULLY' }));

        // yield put({
        //   type: 'grant/fetchMappingList',
        // });
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
    clear(state, { payload }) {
      return {
        ...state,
        ...payload,
        value: 'tiered',
        tieredCommissionRuleList: [],
        commission: [[]],
        // addBindingModal: false,
        // addPLUModal: false,
        // addCommissionSchema: false,
        tags: [
          {
            id: undefined,
            segments: [],
          },
        ],
        offerList: [],
        selectedRowKeys: [],
        selectedRowKeys2: [],
        selectedOffer: [],
        PLUList: [],
        PLUSelected: [],
        PLUSelectItem: [],
        PLURelationList: [],
        commoditySpecId: null,
        checkedList: [],
      };
    },
    saveSelectOffer(state, { payload }) {
      const { offerList } = state;
      const { selectedRowKeys } = payload;
      const selectedOffer = [];
      for (let i = 0; i < offerList.length; i += 1) {
        for (let j = 0; j < offerList.length; j += 1) {
          if (offerList[j] === offerList[i].key) {
            offerList.push(offerList[i]);
          }
        }
      }
      return {
        ...state,
        selectedRowKeys,
        selectedOffer,
      };
    },
    saveSelectOffer2(state, { payload }) {
      const { offerList } = state;
      const { selectedRowKeys2 } = payload;
      const selectedOffer2 = [];
      for (let i = 0; i < offerList.length; i += 1) {
        for (let j = 0; j < offerList.length; j += 1) {
          if (offerList[j] === offerList[i].key) {
            offerList.push(offerList[i]);
          }
        }
      }
      return {
        ...state,
        selectedRowKeys2,
        selectedOffer2,
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
