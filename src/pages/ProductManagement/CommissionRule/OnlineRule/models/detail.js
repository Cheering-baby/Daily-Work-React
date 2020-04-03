import { message } from 'antd';
import * as service from '../services/commissionRuleSetup';

const bingdingPLU2 = commodityList => {
  const list = [];
  if (commodityList && commodityList.length > 0) {
    commodityList.forEach(node => {
      const children = [];
      if (node.subCommodityList && node.subCommodityList.length > 0) {
        node.subCommodityList.forEach(child => {
          children.push({
            key: `${child.commoditySpecId}`,
            isSubNode: true,
            commodityCode: child.commodityCode,
            commodityDescription: child.commodityDescription,
            themeParkCode: child.themeParkCode,
          });
        });
      }
      list.push({
        key: node.commoditySpecId,
        commodityCode: node.commodityCode,
        commodityDescription: node.commodityDescription,
        themeParkCode: node.themeParkCode,
        children: children.length > 0 ? children : null,
      });
    });
    return list;
  }
};

export default {
  namespace: 'detail',
  state: {
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    commisssionList: {},
    tieredList: [],
    bingdingOffer: [],
    bingdingPLU: [],
    addInput1Min: '',
    addInput1Max: '',
    addInput2: '',
  },
  effects: {
    *queryDetail({ payload }, { call, put }) {
      const { tplId } = payload;
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.queryCommissionTplDetail, { tplId });

      const {
        commissionName,
        commissionType,
        effectiveDate,
        expiryDate,
        caluculateCycle,
        commissionScheme,
        tieredList,
      } = result;
      if (resultCode === 0 || resultCode === '0') {
        if (tieredList && tieredList.length > 0) {
          tieredList.map(v => {
            Object.assign(v, { key: `commissionList${v.tplId}` });
            return v;
          });
        }
        yield put({
          type: 'save',
          payload: {
            commisssionList: {
              commissionName,
              commissionType,
              effectiveDate,
              expiryDate,
              caluculateCycle,
              commissionScheme,
            },
            tieredList,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *offerDetail({ payload }, { call, put, select }) {
      const { pagination } = yield select(state => state.detail);
      const { tplId, commodityType } = payload;
      const requestData = {
        ...pagination,
        tplId,
        commodityType,
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.queryCommissionBindingList, requestData);

      const {
        commodityList,
        page: { currentPage, pageSize, totalSize },
      } = result;
      if (resultCode === 0 || resultCode === '0') {
        if (commodityList && commodityList.length > 0) {
          commodityList.map(v => {
            Object.assign(v, { key: `binding${v.commoditySpecId}` });
            return v;
          });
        }
        yield put({
          type: 'save',
          payload: {
            currentPage,
            pageSize,
            totalSize,
            bingdingOffer: commodityList,
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *pluDetail({ payload }, { call, put, select }) {
      const { pagination } = yield select(state => state.detail);
      const { tplId, commodityType } = payload;
      const requestData = {
        ...pagination,
        tplId,
        commodityType,
      };
      const res = yield call(service.queryCommissionBindingList, requestData);
      const {
        data: { resultCode, resultMsg, result },
      } = res;
      if (!result) return;

      const {
        commodityList,
        page: { currentPage, pageSize, totalSize },
      } = result;
      if (resultCode === 0 || resultCode === '0') {
        yield put({
          type: 'save',
          payload: {
            pagination: {
              currentPage,
              pageSize,
              totalSize,
            },
            bingdingPLU: bingdingPLU2(commodityList),
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *tableChanged({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });

      yield put({
        type: 'queryDetail',
      });
    },
    *saveData({ payload }, { put }) {
      yield put({
        type: 'save',
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
    clear(state, { payload }) {
      return {
        ...state,
        ...payload,
        pagination: {
          currentPage: 1,
          pageSize: 10,
        },
        commisssionList: {},
        tieredList: [],
        bingdingOffer: [],
        bingdingPLU: [],
        addInput1Min: '',
        addInput1Max: '',
        addInput2: '',
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
