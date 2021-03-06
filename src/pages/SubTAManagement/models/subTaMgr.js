import { message } from 'antd';
import * as service from '../services/subTaMgr';
import { isNvl } from '@/utils/utils';
import { queryAgentOpt } from '@/pages/TAManagement/services/taCommon';

export default {
  namespace: 'subTaMgr',
  state: {
    subTaId: null,
    subTaInfo: {},
    subTaInfoLoadingFlag: false,
    countryList: [],
    phoneCountryList: [],
    mobileCountryList: [],
    hasSubTaWithEmail: false,
    isEmailError: false,
    isCompanyNameError: false,
    signature: '',
    mainTaId: '',
  },
  effects: {
    *fetchSubTARegistration({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { subTaInfoLoadingFlag: true } });
      const {
        data: { result, resultCode, resultMsg },
      } = yield call(service.registrationSubTaInfo, { ...payload });
      if (resultCode === '0' || resultCode === 0) {
        yield put({ type: 'save', payload: { subTaInfoLoadingFlag: false } });
        if (result && result.subTaId) {
          yield put({
            type: 'save',
            payload: {
              subTaId: result.subTaId,
            },
          });
        }
        return true;
      }
      yield put({ type: 'save', payload: { subTaInfoLoadingFlag: false } });
      message.warn(resultMsg, 10);
      return false;
    },
    *fetchModifySubTaInfo({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { subTaInfoLoadingFlag: true } });
      const {
        data: { result, resultCode, resultMsg },
      } = yield call(service.modifySubTaInfo, { ...payload });
      if (resultCode === '0' || resultCode === 0) {
        yield put({ type: 'save', payload: { subTaInfoLoadingFlag: false } });
        if (result && result.subTaId) {
          yield put({
            type: 'save',
            payload: {
              subTaId: result.subTaId,
            },
          });
        }
        return true;
      }
      yield put({ type: 'save', payload: { subTaInfoLoadingFlag: false } });
      message.warn(resultMsg, 10);
      return false;
    },
    *fetchQrySubTaInfo({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { subTaInfoLoadingFlag: true } });
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.querySubTaInfo, { ...payload });
      if (resultCode === '0' || resultCode === 0) {
        yield put({
          type: 'save',
          payload: {
            subTaInfo: result,
          },
        });
        yield put({ type: 'save', payload: { subTaInfoLoadingFlag: false } });
        return true;
      }
      yield put({ type: 'save', payload: { subTaInfoLoadingFlag: false } });
      message.warn(resultMsg, 10);
      return false;
    },
    *fetchQrySubTaInfoWithNoId(_, { call, put }) {
      yield put({ type: 'save', payload: { subTaInfoLoadingFlag: true } });
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.querySubTaInfoWithNoId);
      if (resultCode === '0' || resultCode === 0) {
        yield put({
          type: 'save',
          payload: {
            subTaInfo: result,
          },
        });
        yield put({ type: 'save', payload: { subTaInfoLoadingFlag: false } });
        return true;
      }
      yield put({ type: 'save', payload: { subTaInfoLoadingFlag: false } });
      message.warn(resultMsg, 10);
      return false;
    },
    *fetchQrySubTaInfoWithMask({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { subTaInfoLoadingFlag: true } });
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.querySubTaInfoWithMask, { ...payload });
      if (resultCode === '0' || resultCode === 0) {
        yield put({
          type: 'save',
          payload: {
            subTaInfo: result,
          },
        });
        yield put({ type: 'save', payload: { subTaInfoLoadingFlag: false } });
        return true;
      }
      yield put({ type: 'save', payload: { subTaInfoLoadingFlag: false } });
      message.warn(resultMsg, 10);
      return false;
    },
    *fetchQrySubTaInfoWithEmail({ payload }, { call, put, select }) {
      const { hasSubTaWithEmail, subTaInfo, signature, mainTaId } = yield select(
        state => state.subTaMgr
      );
      if (isNvl(payload.email) && isNvl(payload.companyName)) {
        const returnDate = hasSubTaWithEmail ? {} : false;
        yield put({
          type: 'save',
          payload: {
            hasSubTaWithEmail: false,
          },
        });
        return returnDate;
      }
      if (isNvl(payload.email)) {
        payload.email = null;
      }
      if (isNvl(payload.companyName)) {
        payload.companyName = null;
      }
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.querySubTaInfoWithEmail, { ...payload, signature, taId: mainTaId });
      if (resultCode === '0' || resultCode === 0) {
        if (result) {
          yield put({
            type: 'save',
            payload: {
              subTaInfo: {
                ...result,
                taId: !isNvl(subTaInfo.taId) ? subTaInfo.taId : null,
                mainCompanyName: !isNvl(subTaInfo.mainCompanyName)
                  ? subTaInfo.mainCompanyName
                  : null,
              },
              hasSubTaWithEmail: !isNvl(result),
            },
          });
          return result;
        }
        yield put({
          type: 'save',
          payload: {
            hasSubTaWithEmail: !isNvl(result),
          },
        });
        return hasSubTaWithEmail ? {} : false;
      }
      message.warn(resultMsg, 10);
      return -1;
    },
    *fetchQueryAgentOpt(_, { call, put }) {
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(queryAgentOpt, { queryType: 'signUp' });
      if (resultCode === '0' || resultCode === 0) {
        if (result && result.length > 0) {
          const countryList =
            (
              result.find(n => String(n.subDictType) === '1002' && String(n.dictType) === '10') ||
              {}
            ).dictionaryList || [];
          countryList.sort((a, b) => {
            if (String(a.dictId) === '65' || String(a.dictId) === '86') {
              return -1;
            }
            if (String(b.dictId) === '65' || String(b.dictId) === '86') {
              return -1;
            }
            if (a.dictName > b.dictName) {
              return 1;
            }
            if (b.dictName > a.dictName) {
              return -1;
            }
            return 0;
          });
          yield put({
            type: 'save',
            payload: {
              countryList: countryList || [],
              phoneCountryList: countryList || [],
              mobileCountryList: countryList || [],
            },
          });
        }
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
    },
    *fetchQueryCountryList(_, { call, put }) {
      const reqParam = {
        dictType: '10',
        dictSubType: '1002',
      };
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.queryDictionary, { ...reqParam });
      if (resultCode === '0' || resultCode === 0) {
        if (result) {
          result.sort((a, b) => {
            if (String(a.dictId) === '86' || String(a.dictId) === '65') {
              return -1;
            }
            if (String(b.dictId) === '86' || String(b.dictId) === '65') {
              return -1;
            }
            if (a.dictName > b.dictName) {
              return 1;
            }
            if (b.dictName > a.dictName) {
              return -1;
            }
            return 0;
          });
        }
        yield put({
          type: 'save',
          payload: {
            countryList: result || [],
            phoneCountryList: result || [],
            mobileCountryList: result || [],
          },
        });
        return true;
      }
      message.warn(resultMsg, 10);
      return false;
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
          subTaId: null,
          subTaInfo: {},
          subTaInfoLoadingFlag: false,
          countryList: [],
          hasSubTaWithEmail: false,
        },
        ...payload,
      };
    },
  },
};
