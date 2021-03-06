import { message } from 'antd';
import moment from 'moment';
import {
  checkCompanyExist,
  deleteFile,
  modifyTaInfo,
  queryInfoWithNoId,
  queryTaAccountInfo,
  queryTaInfo,
  queryTaInfoWithMask,
  queryTaMappingInfo,
  registrationTaInfo,
} from '../services/taCommon';
import { isNvl } from '@/utils/utils';

export default {
  namespace: 'taMgr',
  state: {
    customerInfo: {
      contactInfo: {},
      companyInfo: {
        isGstRegIndicator: '0',
      },
    },
    otherInfo: {},
    salesPersonInfo:{},
    mappingInfo: {},
    accountInfo: {},
    taId: null,
    signature: null,
    status: null,
    remark: null,
    isRegistration: false,
    taInfoLoadingFlag: false,
    taMappingInfoLoadingFlag: false,
    taAccountInfoLoadingFlag: false,
    isCompanyExist: false,
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
        if (result.customerInfo && result.customerInfo.companyInfo) {
          if (result.customerInfo.companyInfo.incorporationDate) {
            result.customerInfo.companyInfo.incorporationDate = moment(
              result.customerInfo.companyInfo.incorporationDate,
              'YYYY-MM-DD'
            ).format('YYYY-MM-DD');
          }
          if (result.customerInfo.companyInfo.gstEffectiveDate) {
            result.customerInfo.companyInfo.gstEffectiveDate = moment(
              result.customerInfo.companyInfo.gstEffectiveDate,
              'YYYY-MM-DD'
            ).format('YYYY-MM-DD');
          }
          if (result.customerInfo.companyInfo.effectiveDate) {
            result.customerInfo.companyInfo.effectiveDate = moment(
              result.customerInfo.companyInfo.effectiveDate,
              'YYYY-MM-DD'
            ).format('YYYY-MM-DD');
          }
          if (result.customerInfo.companyInfo.endDate) {
            result.customerInfo.companyInfo.endDate = moment(
              result.customerInfo.companyInfo.endDate,
              'YYYY-MM-DD'
            ).format('YYYY-MM-DD');
          }
        }
        yield put({
          type: 'save',
          payload: {
            customerInfo: result.customerInfo || {},
            otherInfo: result.otherInfo || {},
            salesPersonInfo: result.salesPersonInfo || {},
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
        if (result.customerInfo && result.customerInfo.companyInfo) {
          if (result.customerInfo.companyInfo.incorporationDate) {
            result.customerInfo.companyInfo.incorporationDate = moment(
              result.customerInfo.companyInfo.incorporationDate,
              'YYYY-MM-DD'
            ).format('YYYY-MM-DD');
          }
          if (result.customerInfo.companyInfo.gstEffectiveDate) {
            result.customerInfo.companyInfo.gstEffectiveDate = moment(
              result.customerInfo.companyInfo.gstEffectiveDate,
              'YYYY-MM-DD'
            ).format('YYYY-MM-DD');
          }
          if (result.customerInfo.companyInfo.effectiveDate) {
            result.customerInfo.companyInfo.effectiveDate = moment(
              result.customerInfo.companyInfo.effectiveDate,
              'YYYY-MM-DD'
            ).format('YYYY-MM-DD');
          }
          if (result.customerInfo.companyInfo.endDate) {
            result.customerInfo.companyInfo.endDate = moment(
              result.customerInfo.companyInfo.endDate,
              'YYYY-MM-DD'
            ).format('YYYY-MM-DD');
          }
        }
        yield put({
          type: 'save',
          payload: {
            customerInfo: result.customerInfo || {},
            otherInfo: result.otherInfo || {},
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
        if (result.customerInfo && result.customerInfo.companyInfo) {
          if (result.customerInfo.companyInfo.incorporationDate) {
            result.customerInfo.companyInfo.incorporationDate = moment(
              result.customerInfo.companyInfo.incorporationDate,
              'YYYY-MM-DD'
            ).format('YYYY-MM-DD');
          }
          if (result.customerInfo.companyInfo.gstEffectiveDate) {
            result.customerInfo.companyInfo.gstEffectiveDate = moment(
              result.customerInfo.companyInfo.gstEffectiveDate,
              'YYYY-MM-DD'
            ).format('YYYY-MM-DD');
          }
          if (result.customerInfo.companyInfo.effectiveDate) {
            result.customerInfo.companyInfo.effectiveDate = moment(
              result.customerInfo.companyInfo.effectiveDate,
              'YYYY-MM-DD'
            ).format('YYYY-MM-DD');
          }
          if (result.customerInfo.companyInfo.endDate) {
            result.customerInfo.companyInfo.endDate = moment(
              result.customerInfo.companyInfo.endDate,
              'YYYY-MM-DD'
            ).format('YYYY-MM-DD');
          }
        }
        yield put({
          type: 'save',
          payload: {
            customerInfo: result.customerInfo || {},
            otherInfo: result.otherInfo || {},
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
    *fetchCheckCompanyExist({ payload }, { call, put }) {
      if (isNvl(payload.registrationNo)) {
        yield put({ type: 'save', payload: { isCompanyExist: false } });
        return false;
      }
      payload.registrationNo = payload.registrationNo.trim();
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(checkCompanyExist, { ...payload });
      if (resultCode === '0' || resultCode === 0) {
        const isCompanyExist = !isNvl(result) && !isNvl(result.companyName);
        yield put({ type: 'save', payload: { isCompanyExist } });
        return isCompanyExist;
      }
      message.warn(resultMsg, 10);
      yield put({ type: 'save', payload: { isCompanyExist: false } });
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
              isGstRegIndicator: '0',
            },
          },
          otherInfo: {},
          mappingInfo: {},
          accountInfo: {},
          taId: null,
          signature: null,
          status: null,
          remark: null,
          isRegistration: false,
          taInfoLoadingFlag: false,
          taMappingInfoLoadingFlag: false,
          taAccountInfoLoadingFlag: false,
          isCompanyExist: false,
        },
        ...payload,
      };
    },
  },
};
