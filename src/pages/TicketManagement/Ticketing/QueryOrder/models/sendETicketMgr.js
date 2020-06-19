import { formatMessage } from 'umi/locale';
import { message } from 'antd';
import { queryTask, sendEmail } from '../services/queryOrderService';

export default {
  namespace: 'sendETicketMgr',
  state: {
    sendETicketVisible: false,
    bookingNo: null,
    email: null,
    emailCorrect: true,
    downloadFileLoading: false,
  },

  effects: {
    *effectSave({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
    },
    *sendEmail({ payload }, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          downloadFileLoading: true,
        },
      });
      const response = yield call(sendEmail, payload);
      if (!response) return false;

      if (response.success) {
        const {
          data: { resultCode, resultMsg, result },
        } = response;
        if (resultCode === '0') {
          let taskStatus = 'processing';
          while (taskStatus === 'processing') {
            const { downloadFileLoading } = yield select(state => state.sendETicketMgr);
            if (!downloadFileLoading) {
              return;
            }
            const queryTaskParams = {
              taskId: result,
            };
            const responseDetail = yield call(queryTask, queryTaskParams);
            const {
              data: {
                resultCode: queryTaskResultCode,
                resultMsg: queryTaskResultMsg,
                result: queryTaskResult,
              },
            } = responseDetail;
            if (!responseDetail || !responseDetail.success) {
              message.error('queryTask error.');
              return;
            }
            if (queryTaskResultCode === '0') {
              if (queryTaskResult && queryTaskResult.status === 2) {
                taskStatus = 'success';
                message.success(formatMessage({ id: 'SENT_SUCCESSFULLY' }));
              }
              if (queryTaskResult && queryTaskResult.status === 3) {
                taskStatus = 'failed';
              }
              if (queryTaskResult && queryTaskResult.reason) {
                message.warn(queryTaskResult.reason);
              }
            } else {
              taskStatus = 'failed';
              message.error(queryTaskResultMsg);
            }
            yield call(
              () =>
                new Promise(resolve => {
                  setTimeout(() => resolve(), 5000);
                })
            );
          }

          yield put({
            type: 'save',
            payload: {
              downloadFileLoading: false,
            },
          });
        } else {
          message.error(resultMsg);
        }
      } else {
        message.error('sendEmail error.');
      }

      yield put({
        type: 'save',
        payload: {
          downloadFileLoading: true,
        },
      });

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
    resetData(state) {
      return {
        ...state,
        sendETicketVisible: false,
        bookingNo: null,
        email: null,
        emailCorrect: true,
        downloadFileLoading: false,
      };
    },
  },

  subscriptions: {},
};
