import { message } from 'antd';
import * as service from '@/pages/TAManagement/Mapping/services/mapping';

export default {
  namespace: 'myProfile',
  state: {
    isBilCheckBox: false,
    isRwsRoom: null,
    isRwsAttraction: null,
    isAllInformationToRws: false,
    currentStep: 0,
    viewId: 'profileEditView',
    queryMappingInfo: {},
  },
  effects: {
    *doCleanData({ payload }, { put }) {
      yield put({ type: 'clean', payload });
      yield put({ type: 'taCommon/clean', payload });
      yield put({ type: 'taMgr/clean', payload });
    },

    *queryMappingDetail({ payload }, { call, put }) {
      const { taId } = payload;
      const res = yield call(service.queryMappingDetail, taId);
      const { resultCode, resultMsg, result } = res.data;
      if (resultCode === '0' || resultCode === 0) {
        yield put({
          type: 'save',
          payload: {
            queryMappingInfo: result,
          },
        });
      } else message.warn(resultMsg, 10);
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
          isBilCheckBox: false,
          isRwsRoom: null,
          isRwsAttraction: null,
          isAllInformationToRws: false,
          currentStep: 0,
          viewId: 'profileEditView',
        },
        ...payload,
      };
    },
  },
};
