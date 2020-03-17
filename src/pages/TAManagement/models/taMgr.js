import { message } from 'antd';
import {
  deleteFile,
  modifyTaInfo,
  queryInfoWithNoId,
  queryTaAccountInfo,
  queryTaInfo,
  queryTaInfoWithMask,
  queryTaMappingInfo,
  registrationTaInfo,
} from '../services/taCommon';

export default {
  namespace: 'taMgr',
  state: {
    customerInfo: {
      contactInfo: {},
      companyInfo: {
        isGstRegIndicator: '1',
      },
    },
    otherInfo: {},
    mappingInfo: {},
    accountInfo: {},
    taId: null,
    signature: null,
    status: null,
    remark: null,
    taInfoLoadingFlag: false,
    taMappingInfoLoadingFlag: false,
    taAccountInfoLoadingFlag: false,
  },
  effects: {
    *fetchTARegistration({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { taInfoLoadingFlag: true } });
      const {
        data: { result, resultCode, resultMsg },
      } = yield call(registrationTaInfo, { ...payload });
      if (resultCode === '0' || resultCode === 0) {
        yield put({ type: 'save', payload: { taInfoLoadingFlag: false } });
        if (result) {
          const { taId } = result;
          if (taId) {
            yield put({
              type: 'save',
              payload: {
                taId,
              },
            });
          }
          return true;
        }
        return true;
      }
      yield put({ type: 'save', payload: { taInfoLoadingFlag: false } });
      message.warn(resultMsg, 10);
      return false;
    },
    *fetchModifyTaInfo({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { taInfoLoadingFlag: true } });
      const {
        data: { result, resultCode, resultMsg },
      } = yield call(modifyTaInfo, { ...payload });
      if (resultCode === '0' || resultCode === 0) {
        yield put({ type: 'save', payload: { taInfoLoadingFlag: false } });
        if (result) {
          const { taId } = result;
          yield put({
            type: 'save',
            payload: {
              taId,
            },
          });
          return true;
        }
        return true;
      }
      yield put({ type: 'save', payload: { taInfoLoadingFlag: false } });
      message.warn(resultMsg, 10);
      return false;
    },
    *fetchQueryTaInfo({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { taInfoLoadingFlag: true } });
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryTaInfo, { ...payload });
      if (resultCode === '0' || resultCode === 0) {
        yield put({
          type: 'save',
          payload: {
            customerInfo: result.customerInfo || {},
            otherInfo: result.otherInfo || {},
            mappingInfo: result.mappingInfo || {},
            status: result.status,
            remark: result.remark,
          },
        });
        if (result && result.customerInfo && result.customerInfo.companyInfo) {
          if (result.customerInfo.companyInfo.country) {
            yield put({
              type: 'taCommon/fetchQueryCityList',
              payload: { countryId: result.customerInfo.companyInfo.country },
            });
          }
          if (result.customerInfo.companyInfo.country) {
            yield put({
              type: 'taCommon/fetchQueryCustomerGroupList',
              payload: { categoryId: result.customerInfo.companyInfo.category },
            });
          }
        }
        if (
          result &&
          result.otherInfo &&
          result.otherInfo.billingInfo &&
          result.otherInfo.billingInfo.country
        ) {
          yield put({
            type: 'taCommon/fetchQueryCityList',
            payload: { countryId: result.otherInfo.billingInfo.country, isBil: true },
          });
        }
        yield put({ type: 'save', payload: { taInfoLoadingFlag: false } });
        return true;
      }
      yield put({ type: 'save', payload: { taInfoLoadingFlag: false } });
      message.warn(resultMsg, 10);
      return false;
    },
    *fetchQueryTaInfoWithNoId(_, { call, put }) {
      yield put({ type: 'save', payload: { taInfoLoadingFlag: true } });
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryInfoWithNoId);
      if (resultCode === '0' || resultCode === 0) {
        yield put({
          type: 'save',
          payload: {
            customerInfo: result.customerInfo || {},
            otherInfo: result.otherInfo || {},
            mappingInfo: result.mappingInfo || {},
            status: result.status,
            remark: result.remark,
          },
        });
        if (result && result.customerInfo && result.customerInfo.companyInfo) {
          if (result.customerInfo.companyInfo.country) {
            yield put({
              type: 'taCommon/fetchQueryCityList',
              payload: { countryId: result.customerInfo.companyInfo.country },
            });
          }
          if (result.customerInfo.companyInfo.country) {
            yield put({
              type: 'taCommon/fetchQueryCustomerGroupList',
              payload: { categoryId: result.customerInfo.companyInfo.category },
            });
          }
        }
        if (
          result &&
          result.otherInfo &&
          result.otherInfo.billingInfo &&
          result.otherInfo.billingInfo.country
        ) {
          yield put({
            type: 'taCommon/fetchQueryCityList',
            payload: { countryId: result.otherInfo.billingInfo.country, isBil: true },
          });
        }
        yield put({ type: 'save', payload: { taInfoLoadingFlag: false } });
        return true;
      }
      yield put({ type: 'save', payload: { taInfoLoadingFlag: false } });
      message.warn(resultMsg, 10);
      return false;
    },
    *fetchQueryTaInfoWithMask({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { taInfoLoadingFlag: true } });
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryTaInfoWithMask, { ...payload });
      if (resultCode === '0' || resultCode === 0) {
        yield put({
          type: 'save',
          payload: {
            customerInfo: result.customerInfo || {},
            otherInfo: result.otherInfo || {},
            mappingInfo: result.mappingInfo || {},
            status: result.status,
            remark: result.remark,
          },
        });
        if (result && result.customerInfo && result.customerInfo.companyInfo) {
          if (result.customerInfo.companyInfo.country) {
            yield put({
              type: 'taCommon/fetchQueryCityList',
              payload: { countryId: result.customerInfo.companyInfo.country },
            });
          }
          if (result.customerInfo.companyInfo.country) {
            yield put({
              type: 'taCommon/fetchQueryCustomerGroupList',
              payload: { categoryId: result.customerInfo.companyInfo.category },
            });
          }
        }
        if (
          result &&
          result.otherInfo &&
          result.otherInfo.billingInfo &&
          result.otherInfo.billingInfo.country
        ) {
          yield put({
            type: 'taCommon/fetchQueryCityList',
            payload: { countryId: result.otherInfo.billingInfo.country, isBil: true },
          });
        }
        yield put({ type: 'save', payload: { taInfoLoadingFlag: false } });
        return true;
      }
      yield put({ type: 'save', payload: { taInfoLoadingFlag: false } });
      message.warn(resultMsg, 10);
      return false;
    },
    *fetchQueryTaMappingInfo({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { taMappingInfoLoadingFlag: true } });
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryTaMappingInfo, { ...payload });
      if (resultCode === '0' || resultCode === 0) {
        yield put({
          type: 'save',
          payload: {
            mappingInfo: result || {},
          },
        });
        yield put({ type: 'save', payload: { taMappingInfoLoadingFlag: false } });
        return true;
      }
      yield put({ type: 'save', payload: { taMappingInfoLoadingFlag: false } });
      message.warn(resultMsg, 10);
      return false;
    },
    *fetchQueryTaAccountInfo({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { taAccountInfoLoadingFlag: true } });
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryTaAccountInfo, { ...payload });
      if (resultCode === '0' || resultCode === 0) {
        yield put({
          type: 'save',
          payload: {
            accountInfo: result || {},
          },
        });
        yield put({ type: 'save', payload: { taAccountInfoLoadingFlag: false } });
        return true;
      }
      yield put({ type: 'save', payload: { taAccountInfoLoadingFlag: false } });
      message.warn(resultMsg, 10);
      return false;
    },
    *fetchDeleteTAFile({ payload }, { call }) {
      const {
        data: { resultCode, resultMsg },
      } = yield call(deleteFile, { ...payload });
      if (resultCode === '0' || resultCode === 0) {
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
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
          customerInfo: {
            contactInfo: {},
            companyInfo: {
              isGstRegIndicator: '1',
            },
          },
          otherInfo: {},
          mappingInfo: {},
          accountInfo: {},
          taId: null,
          signature: null,
          status: null,
          remark: null,
          taInfoLoadingFlag: false,
          taMappingInfoLoadingFlag: false,
          taAccountInfoLoadingFlag: false,
        },
        ...payload,
      };
    },
  },
};
