import { message } from 'antd';
import { queryDictionary, querySalesPerson } from '../services/taCommon';

export default {
  namespace: 'taCommon',
  state: {
    organizationRoleList: [],
    salutationList: [],
    countryList: [],
    cityList: [],
    bilCityList: [],
    currencyList: [{ dictId: 'GSD', dictName: 'GSD' }],
    categoryList: [],
    customerGroupList: [],
    marketList: [],
    salesPersonList: [],
    settlementCycleList: [
      { dictId: '01', dictName: 'Quarter' },
      { dictId: '02', dictName: 'Month' },
    ],
    arAccountEndConfig: '24',
    bilCityLoadingFlag: false,
    cityLoadingFlag: false,
    customerGroupLoadingFlag: false,
    salesPersonLoadingFlag: false,
  },
  effects: {
    *fetchQuerySalutationList(_, { call, put }) {
      const reqParam = {
        dictType: '10',
        dictSubType: '1001',
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryDictionary, { ...reqParam });
      if (resultCode === '0' || resultCode === 0) {
        yield put({ type: 'save', payload: { salutationList: result || [] } });
      } else message.warn(resultMsg, 10);
    },
    *fetchQueryCountryList(_, { call, put }) {
      const reqParam = {
        dictType: '10',
        dictSubType: '1002',
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryDictionary, { ...reqParam });
      if (resultCode === '0' || resultCode === 0) {
        yield put({ type: 'save', payload: { countryList: result || [] } });
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *fetchQueryCityList({ payload }, { call, put }) {
      const reqParam = {
        dictType: '1002',
      };
      if (payload.countryId) {
        reqParam.dictSubType = payload.countryId;
      }
      if (payload.isBil) {
        yield put({ type: 'save', payload: { bilCityLoadingFlag: true } });
      } else {
        yield put({ type: 'save', payload: { cityLoadingFlag: true } });
      }
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryDictionary, { ...reqParam });
      if (payload.isBil) {
        yield put({ type: 'save', payload: { bilCityLoadingFlag: false } });
      } else {
        yield put({ type: 'save', payload: { cityLoadingFlag: false } });
      }
      if (resultCode === '0' || resultCode === 0) {
        if (payload.isBil) {
          yield put({ type: 'save', payload: { bilCityList: result || [] } });
        } else {
          yield put({ type: 'save', payload: { cityList: result || [] } });
        }
      } else message.warn(resultMsg, 10);
    },
    *fetchQueryOrganizationRoleList(_, { call, put }) {
      const reqParam = {
        dictType: '10',
        dictSubType: '1003',
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryDictionary, { ...reqParam });
      if (resultCode === '0' || resultCode === 0) {
        yield put({ type: 'save', payload: { organizationRoleList: result || [] } });
        if (result && result.length > 0) {
          return result[0];
        }
        return null;
      }
      message.warn(resultMsg, 10);
      return null;
    },
    *fetchQueryCategoryList(_, { call, put }) {
      const reqParam = {
        dictType: '10',
        dictSubType: '1004',
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryDictionary, { ...reqParam });
      if (resultCode === '0' || resultCode === 0) {
        yield put({ type: 'save', payload: { categoryList: result || [] } });
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *fetchQueryCustomerGroupList({ payload }, { call, put }) {
      const reqParam = {
        dictType: '1004',
      };
      if (payload.categoryId) {
        reqParam.dictSubType = payload.categoryId;
      }
      yield put({ type: 'save', payload: { customerGroupLoadingFlag: true } });
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryDictionary, { ...reqParam });
      yield put({ type: 'save', payload: { customerGroupLoadingFlag: false } });
      if (resultCode === '0' || resultCode === 0) {
        yield put({
          type: 'save',
          payload: { customerGroupList: result || [] },
        });
      } else message.warn(resultMsg, 10);
    },
    *fetchQryArAccountEndConfig(_, { call, put }) {
      const reqParam = {
        dictType: '10',
        dictSubType: '1005',
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryDictionary, { ...reqParam });
      if (resultCode === '0' || resultCode === 0) {
        if (result && result.length > 0) {
          yield put({ type: 'save', payload: { arAccountEndConfig: result[0].dictId || '24' } });
        }
      } else message.warn(resultMsg, 10);
    },
    *fetchQryMarketList(_, { call, put }) {
      const reqParam = {
        dictType: '10',
        dictSubType: '1006',
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryDictionary, { ...reqParam });
      if (resultCode === '0' || resultCode === 0) {
        yield put({ type: 'save', payload: { marketList: result || [] } });
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *fetchQrySalesPersonList(_, { call, put }) {
      const reqParam = {
        market: null,
      };
      yield put({ type: 'save', payload: { salesPersonLoadingFlag: true } });
      const {
        data: { resultCode, resultMsg, resultData },
      } = yield call(querySalesPerson, { ...reqParam });
      yield put({ type: 'save', payload: { salesPersonLoadingFlag: false } });
      if (resultCode === '0' || resultCode === 0) {
        yield put({
          type: 'save',
          payload: { salesPersonList: resultData.userProfiles || [] },
        });
      } else message.warn(resultMsg, 10);
    },
    *doCleanData({ payload }, { put }) {
      yield put({ type: 'clean', payload });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clean(state, { payload }) {
      return {
        ...state,
        ...{
          organizationRoleList: [],
          salutationList: [],
          countryList: [],
          cityList: [],
          bilCityList: [],
          currencyList: [{ dictId: 'GSD', dictName: 'GSD' }],
          categoryList: [],
          customerGroupList: [],
          marketList: [],
          salesPersonList: [],
          settlementCycleList: [
            { dictId: '01', dictName: 'Quarter' },
            { dictId: '02', dictName: 'Month' },
          ],
          arAccountEndConfig: '24',
          bilCityLoadingFlag: false,
          cityLoadingFlag: false,
          customerGroupLoadingFlag: false,
          salesPersonLoadingFlag: false,
        },
        ...payload,
      };
    },
  },
};
