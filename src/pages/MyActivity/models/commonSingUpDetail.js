import { message } from 'antd';
import * as service from '../services/myActivity';

export default {
  namespace: 'commonSignUpDetail',

  state: {
    countryList: [],
    cityList: [],
    bilCityList: [],
    organizationRoleList: [],
    salutationList: [],
  },
  effects: {
    *queryCountryList(_, { call, put }) {
      const reqParam = {
        dictType: '10',
        dictSubType: '1002',
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.queryDictionary, { ...reqParam });
      if (resultCode === '0' || resultCode === 0) {
        yield put({ type: 'save', payload: { countryList: result || [] } });
        return true;
      }

      message.warn(resultMsg, 10);
      return false;
    },

    *queryCityList({ payload }, { call, put }) {
      const reqParam = {
        dictType: '1002',
        dictSubType: payload.countryId || '',
      };
      if (payload.isBil) {
        yield put({ type: 'save', payload: { bilCityLoadingFlag: true } });
      } else {
        yield put({ type: 'save', payload: { cityLoadingFlag: true } });
      }
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.queryDictionary, { ...reqParam });
      if (resultCode === '0' || resultCode === 0) {
        if (payload.isBil) {
          yield put({ type: 'save', payload: { bilCityList: result || [] } });
        } else {
          yield put({ type: 'save', payload: { cityList: result || [] } });
        }
      } else message.warn(resultMsg, 10);
    },

    *querySalutationList(_, { call, put }) {
      const reqParam = {
        dictType: '10',
        dictSubType: '1001',
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.queryDictionary, { ...reqParam });
      if (resultCode === '0' || resultCode === 0) {
        yield put({ type: 'save', payload: { salutationList: result || [] } });
      } else message.warn(resultMsg, 10);
    },

    *queryOrganizationRoleList(_, { call, put }) {
      const reqParam = {
        dictType: '10',
        dictSubType: '1003',
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.queryDictionary, { ...reqParam });
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
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    reset(state, { payload }) {
      return {
        ...state,
        ...payload,
        countryList: [],
        cityList: [],
        bilCityList: [],
        organizationRoleList: [],
        salutationList: [],
      };
    },
  },
};
