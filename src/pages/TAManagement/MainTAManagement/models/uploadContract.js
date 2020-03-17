import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import * as service from '../services/mainTAManagement';

export default {
  namespace: 'uploadContract',
  state: {
    contractFileList: [],
    contractFileUploading: false,
  },
  effects: {
    *fetchRegisterContractFile({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { contractFileUploading: true } });
      const {
        data: { resultCode, resultMsg },
      } = yield call(service.registerContractFile, { ...payload });
      yield put({ type: 'save', payload: { contractFileUploading: false } });
      if (resultCode === '0' || resultCode === 0) {
        message.success(formatMessage({ id: 'UPLOAD_FILE_SUCCESS' }), 10);
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
          contractFileList: [],
          contractFileUploading: false,
        },
        ...payload,
      };
    },
  },
};
