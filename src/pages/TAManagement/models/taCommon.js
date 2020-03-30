import { message } from 'antd';
import { queryAgentOpt, queryDictionary, querySalesPerson } from '../services/taCommon';

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
    allDictList: [],
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
    *fetchQueryCityList({ payload }, { call, put, select }) {
      if (payload.isBil) {
        yield put({ type: 'save', payload: { bilCityLoadingFlag: true } });
      } else {
        yield put({ type: 'save', payload: { cityLoadingFlag: true } });
      }
      let cityList = [];
      let bilCityList = [];
      const { allDictList } = yield select(state => state.taCommon);
      if (allDictList && allDictList.length > 0) {
        if (payload.isBil) {
          bilCityList =
            (
              allDictList.find(
                n =>
                  String(n.subDictType) === String(payload.countryId) &&
                  String(n.dictType) === '1002'
              ) || {}
            ).dictionaryList || [];
        } else {
          cityList =
            (
              allDictList.find(
                n =>
                  String(n.subDictType) === String(payload.countryId) &&
                  String(n.dictType) === '1002'
              ) || {}
            ).dictionaryList || [];
        }
      } else {
        const reqParam = {
          dictType: '1002',
        };
        if (payload.countryId) {
          reqParam.dictSubType = payload.countryId;
        }
        const {
          data: { resultCode, resultMsg, result },
        } = yield call(queryDictionary, { ...reqParam });
        if (resultCode === '0' || resultCode === 0) {
          if (payload.isBil) {
            bilCityList = result || [];
          } else {
            cityList = result || [];
          }
        } else message.warn(resultMsg, 10);
      }
      if (payload.isBil) {
        yield put({
          type: 'save',
          payload: {
            bilCityLoadingFlag: false,
            bilCityList,
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            cityLoadingFlag: false,
            cityList,
          },
        });
      }
    },
    *fetchQueryCustomerGroupList({ payload }, { call, put, select }) {
      yield put({ type: 'save', payload: { customerGroupLoadingFlag: true } });
      let customerGroupList = [];
      const { allDictList } = yield select(state => state.taCommon);
      if (allDictList && allDictList.length > 0) {
        customerGroupList =
          (
            allDictList.find(
              n =>
                String(n.subDictType) === String(payload.categoryId) &&
                String(n.dictType) === '1004'
            ) || {}
          ).dictionaryList || [];
      } else {
        const reqParam = {
          dictType: '1004',
        };
        if (payload.categoryId) {
          reqParam.dictSubType = payload.categoryId;
        }
        const {
          data: { resultCode, resultMsg, result },
        } = yield call(queryDictionary, { ...reqParam });
        if (resultCode === '0' || resultCode === 0) {
          customerGroupList = result || [];
        } else message.warn(resultMsg, 10);
      }
      yield put({
        type: 'save',
        payload: {
          customerGroupLoadingFlag: false,
          customerGroupList,
        },
      });
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
    *fetchQueryAgentOpt(_, { call, put }) {
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryAgentOpt, { queryType: 'signUp' });
      if (resultCode === '0' || resultCode === 0) {
        if (result && result.length > 0) {
          const salutationList =
            (
              result.find(n => String(n.subDictType) === '1001' && String(n.dictType) === '10') ||
              {}
            ).dictionaryList || [];
          const countryList =
            (
              result.find(n => String(n.subDictType) === '1002' && String(n.dictType) === '10') ||
              {}
            ).dictionaryList || [];
          let cityList = [];
          let bilCityList = [];
          if (countryList && countryList.length > 0) {
            const countryInfo = countryList[0];
            cityList =
              (
                result.find(
                  n =>
                    String(n.subDictType) === String(countryInfo.dictId) &&
                    String(n.dictType) === '1002'
                ) || {}
              ).dictionaryList || [];
            bilCityList =
              (
                result.find(
                  n =>
                    String(n.subDictType) === String(countryInfo.dictId) &&
                    String(n.dictType) === '1002'
                ) || {}
              ).dictionaryList || [];
          }
          const organizationRoleList =
            (
              result.find(n => String(n.subDictType) === '1003' && String(n.dictType) === '10') ||
              {}
            ).dictionaryList || [];
          const categoryList =
            (
              result.find(n => String(n.subDictType) === '1004' && String(n.dictType) === '10') ||
              {}
            ).dictionaryList || [];
          let customerGroupList = [];
          if (categoryList && categoryList.length > 0) {
            const categoryInfo = categoryList[0];
            customerGroupList =
              (
                result.find(
                  n =>
                    String(n.subDictType) === String(categoryInfo.dictId) &&
                    String(n.dictType) === '1004'
                ) || {}
              ).dictionaryList || [];
          }
          const arAccountEndConfigList =
            (
              result.find(n => String(n.subDictType) === '1005' && String(n.dictType) === '10') ||
              {}
            ).dictionaryList || [];
          const marketList =
            (
              result.find(n => String(n.subDictType) === '1006' && String(n.dictType) === '10') ||
              {}
            ).dictionaryList || [];
          yield put({
            type: 'save',
            payload: {
              salutationList,
              countryList,
              cityList,
              bilCityList,
              organizationRoleList,
              categoryList,
              customerGroupList,
              arAccountEndConfig:
                arAccountEndConfigList && arAccountEndConfigList.length > 0
                  ? arAccountEndConfigList[0].dictId
                  : '24',
              marketList,
              allDictList: result || [],
            },
          });
          return {
            organizationRoleInfo: organizationRoleList[0],
          };
        }
        return null;
      }
      message.warn(resultMsg, 10);
      return null;
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
          allDictList: [],
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
