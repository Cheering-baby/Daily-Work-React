import { message } from 'antd';
import {
  queryDictionary,
  querySalesPerson,
  queryMainTAList,
} from '../services/travelAgentWalletServices';

export default {
  namespace: 'travelAgentWalletMgr',
  state: {
    searchForm: {
      idOrName: null,
      peoplesoftEwalletId: null,
      peoplesoftArAccountId: null,
      market: [],
      customerGroup: [],
      salesPerson: [],
      category: null,
    },
    searchList: {
      total: 0,
      currentPage: 1,
      pageSize: 10,
    },
    qryTaTableLoading: false,
    marketList: [],
    salesPersonList: [],
    customerGroupList: [],
    categoryList: [],
    mainTAList: [],
  },
  effects: {
    * fetchMarketList(_, {put, call}) {
      const params = {
        dictType: '10',
        dictSubType: '1006',
      };
      const {
        data: {resultCode, resultMsg, result},
      } = yield call(queryDictionary, {...params});
      if (resultCode === '0' || resultCode === 0) {
        yield put({type: 'save', payload: {marketList: result || []}});
      } else message.warn(resultMsg, 10);
    },
    * fetchCategoryList(_, {put, call}) {
      const params = {
        dictType: '10',
        dictSubType: '1004',
      };
      const {
        data: {resultCode, resultMsg, result},
      } = yield call(queryDictionary, {...params});
      if (resultCode === '0' || resultCode === 0) {
        yield put({type: 'save', payload: {categoryList: result || []}});
      } else message.warn(resultMsg, 10);
    },
    * fetchAllCustomerGroupList(_, {call, put}) {
      const params = {
        dictType: '1004',
      };
      const {
        data: {resultCode, resultMsg, result},
      } = yield call(queryDictionary, {...params});
      if (resultCode === '0' || resultCode === 0) {
        yield put({
          type: 'save',
          payload: {
            allCustomerGroupList: result || [],
          }
        });
      } else message.warn(resultMsg, 10);
    },
    * fetchSalesPersonList(_, {put, call}) {
      const reqParam = {
        market: null,
      };
      const {
        data: {resultCode, resultMsg, resultData},
      } = yield call(querySalesPerson, {...reqParam});
      if (resultCode === '0' || resultCode === 0) {
        yield put({
          type: 'save',
          payload: {salesPersonList: resultData.userProfiles || []},
        });
      } else message.warn(resultMsg, 10);
    },
    * fetchQryMainTAList({payload}, {call, put, select}) {
      const {searchList} = yield select(state => state.travelAgentWalletMgr);
      const reqParam = {
        pageInfo: {
          ...searchList,
        },
        ...payload,
      };
      yield put({type: 'save', payload: {qryTaTableLoading: true}});
      const {
        data: {resultCode, resultMsg, result},
      } = yield call(queryMainTAList, {...reqParam});
      yield put({type: 'save', payload: {qryTaTableLoading: false}});
      if (resultCode === '0') {
        const {pageInfo, taList} = result;
        yield put({
          type: 'save',
          payload: {
            mainTAList: taList || [],
            searchList: {
              total: Number(pageInfo.totalSize || '0'),
              currentPage: Number(pageInfo.currentPage || '1'),
              pageSize: Number(pageInfo.pageSize || '10'),
            },
          },
        });
      } else message.warn(resultMsg, 10);
    },
    * fetchCustomerGroupListByCategory({payload}, {put, select}) {
      const {allCustomerGroupList = []} = yield select(state => state.travelAgentWalletMgr);
      const {category} = payload;
      const customerGroupList = allCustomerGroupList.filter((item) => String(item.dictSubType) === String(category));
      yield put({
        type: 'save',
        payload: {
          customerGroupList,
        }
      });
    },
    * doSaveData({payload}, {put}) {
      yield put({type: 'save', payload});
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clean(state) {
      return {
        ...state,
        searchForm: {
          idOrName: null,
          peoplesoftEwalletId: null,
          peoplesoftArAccountId: null,
          market: [],
          customerGroup: [],
          salesPerson: [],
          category: null,
        },
        searchList: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
        },
        qryTaTableLoading: false,
        marketList: [],
        salesPersonList: [],
        customerGroupList: [],
        categoryList: [],
        mainTAList: [],
      };
    },
  },
};
