import { message } from 'antd';
import * as service from '../services/subTaMgr';
import { isNvl } from '@/utils/utils';

export default {
  namespace: 'subTaMgr',
  state: {
    subTaId: null,
    subTaInfo: {},
    subTaInfoLoadingFlag: false,
    countryList: [],
    hasSubTaWithEmail: false,
  },
  effects: {
    *fetchSubTARegistration({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { subTaInfoLoadingFlag: true } });
      const {
        data: { result, resultCode, resultMsg },
      } = yield call(service.registrationSubTaInfo, { ...payload });
      if (resultCode === '0' || resultCode === 0) {
        yield put({ type: 'save', payload: { subTaInfoLoadingFlag: false } });
        if (result) {
          const { subTaId } = result;
          if (subTaId) {
            yield put({
              type: 'save',
              payload: {
                subTaId,
              },
            });
          }
        }
        return true;
      }
      yield put({ type: 'save', payload: { taInfoLoadingFlag: false } });
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
    *fetchQrySubTaInfoWithEmail({ payload }, { call, put }) {
      const {
        data: { resultCode, resultMsg, result },
      } = yield call(service.querySubTaInfoWithEmail, { ...payload });
      if (resultCode === '0' || resultCode === 0) {
        if (result) {
          yield put({
            type: 'save',
            payload: {
              subTaInfo: result,
              hasSubTaWithEmail: !isNvl(result),
            },
          });
        } else {
          yield put({
            type: 'save',
            payload: {
              hasSubTaWithEmail: !isNvl(result),
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
        yield put({ type: 'save', payload: { countryList: result || [] } });
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
