import * as service from '../services/myActivity';
import { ERROR_CODE_SUCCESS } from '@/utils/commonResultCode';

export default {
  namespace: 'myActivityUpload',
  state: {},
  effects: {
    *fetchApprovalList(_, { call, put, select }) {
      const { filter, pagination } = yield select(state => state.myActivity);
      const requestData = {
        queryType: '02',
        ...filter,
        ...pagination,
      };
      const result = yield call(service.approvalList, requestData);

      const { data: resultData, success, errorMsg } = result;

      if (success) {
        const {
          resultCode,
          resultMsg,
          result: {
            activityInfoList,
            pageInfo: { currentPage, pageSize, totalSize },
          },
        } = resultData;

        if (resultCode !== ERROR_CODE_SUCCESS) {
          throw resultMsg;
        }

        if (activityInfoList && activityInfoList.length > 0) {
          activityInfoList.map(v => {
            Object.assign(v, { key: `${v.activityId}` });
            return v;
          });
        }

        yield put({
          type: 'save',
          payload: {
            pagination: {
              currentPage,
              pageSize,
              totalSize,
            },
            approvalList: activityInfoList,
          },
        });
      } else throw errorMsg;
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    clear(state) {
      return {
        ...state,
      };
    },
  },
};
