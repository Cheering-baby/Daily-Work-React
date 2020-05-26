import moment from 'moment';
import {
  DATE_FORMAT_WITH_TIME,
  PAGE_SIZE,
  PAGE_SIZE_SIMPLE,
  PATH_PAMS_REPORT_SCHEDULED_TASKS,
  PATH_PAMS_REPORT_SCHEDULED_TASKS_NEW,
  USER_TYPE_MAPPING,
} from '@/pages/ReportCenter/consts/pamsReport';
import {
  createScheduledTask,
  deleteScheduledTask,
  queryReceiverList,
  queryScheduledTaskDetail,
  queryScheduledTaskList,
  updateScheduledTask,
} from '@/pages/ReportCenter/PamsReport/services/scheduledTasksService';
import {
  transform2CreateParams,
  transform2ListParams,
} from '@/pages/ReportCenter/PamsReport/utils/scheduledTasksFetchUtils';

const defaultState = {
  reportName: null,
  filterOptions: {},
  sortOptions: {},
  taskTable: {
    totalSize: 0,
    pageSize: PAGE_SIZE,
    currentPage: 1,
    dataList: [],
  },
  receiverList: [],
  receiverTable: {
    totalSize: 0,
    pageSize: PAGE_SIZE_SIMPLE,
    currentPage: 1,
    dataList: [],
  },

  /**
   * New Task & Edit Task
   */
  operationType: '',
  selectedReceivers: [],

  /**
   * Task Detail
   */
  taskDetail: {
    id: 19,
    jobName: null,
    jobCron: null,
    jobDesc: null,
    executorSql: null,
    lastSendTime: null,
    jobStatus: null,
    createTime: null,
    listReceiver: [],
  },
};

export default {
  namespace: 'scheduledTasks',
  state: defaultState,

  effects: {
    *fetchScheduledTaskList({ payload = {} }, { call, put, select }) {
      const {
        filterOptions: newFilterOptions,
        sortOptions: newSortOptions,
        currentPage,
        pageSize,
      } = payload;
      const { taskTable, filterOptions, sortOptions } = yield select(
        ({ scheduledTasks }) => scheduledTasks
      );
      const filters = newFilterOptions || filterOptions;
      const sorts = newSortOptions || sortOptions;
      const current = currentPage || taskTable.currentPage;
      const size = pageSize || taskTable.pageSize;
      yield put({ type: 'updateState', payload: { filterOptions: filters, sortOptions: sorts } });
      const response = yield call(
        queryScheduledTaskList,
        transform2ListParams(filters, sorts, current, size)
      );
      if (!response || !response.data || response.data.resultCode !== '0') return;
      const {
        data: { result },
      } = response;
      yield put({
        type: 'saveScheduledTaskList',
        payload: { result },
      });
    },

    *fetchScheduledTaskDetail({ payload: { id } = {} }, { call, put }) {
      const response = yield call(queryScheduledTaskDetail, { id });
      if (!response || !response.data || response.data.resultCode !== '0') return;
      const {
        data: { result: taskDetail },
      } = response;
      yield put({ type: 'saveScheduledTaskDetail', payload: { taskDetail } });
    },

    *fetchReceiverList({ payload: { fuzzyUserCode, pageSize, currentPage } = {} }, { call, put }) {
      const response = yield call(queryReceiverList, { fuzzyUserCode, pageSize, currentPage });
      if (!response || !response.data || response.data.resultCode !== '0') return;
      const {
        data: {
          resultData: { userProfiles, pageInfo },
        },
      } = response;
      yield put({ type: 'saveReceiverList', payload: { userProfiles, pageInfo } });
    },

    *createScheduledTask({ payload: { values } }, { call }) {
      const response = yield call(createScheduledTask, transform2CreateParams(values));
      if (!response || !response.data) return;
      const {
        data: { resultCode, resultMsg },
      } = response;
      return { resultCode, resultMsg };
    },

    *updateScheduledTask({ payload: { values } }, { call }) {
      const response = yield call(updateScheduledTask, transform2CreateParams(values));
      if (!response || !response.data) return;
      const {
        data: { resultCode, resultMsg },
      } = response;
      return { resultCode, resultMsg };
    },

    *deleteScheduledTask({ payload: { id } = {} }, { call }) {
      const response = yield call(deleteScheduledTask, { id });
      return !(!response || !response.data || response.data.resultCode !== '0');
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },

    saveScheduledTaskList(state, { payload: { result } }) {
      const {
        pageInfo: { pageSize, currentPage, totalSize },
      } = result;
      let { dataList } = result;
      dataList = dataList.map(item => ({
        key: item.id,
        id: item.id,
        reportName: `${item.jobName} ${moment(item.updateTime).format('DD_MM_YYYY')}`,
        status: item.jobStatus,
        receiver: item.receiver,
        lastSendTime: item.lastSendTime && moment(item.lastSendTime).format(DATE_FORMAT_WITH_TIME),
      }));

      return {
        ...state,
        taskTable: {
          totalSize,
          pageSize,
          currentPage,
          dataList,
        },
      };
    },

    saveScheduledTaskDetail(state, { payload: { taskDetail } }) {
      const { listReceiver = [] } = taskDetail;
      const selectedReceivers = listReceiver.map(({ userCode, userType }) => ({
        key: userCode,
        userCode,
        userType,
        userTypeName: USER_TYPE_MAPPING[userType] || userType,
      }));
      return {
        ...state,
        selectedReceivers,
        taskDetail,
      };
    },

    saveReceiverList(state, { payload: { userProfiles, pageInfo } }) {
      const { totalSize, pageSize, currentPage } = pageInfo;
      const dataList = userProfiles.map(({ userCode, userType }) => ({
        key: userCode,
        userCode,
        userType,
        userTypeName: USER_TYPE_MAPPING[userType] || userType,
      }));

      return {
        ...state,
        receiverTable: {
          totalSize,
          pageSize,
          currentPage,
          dataList,
        },
      };
    },

    cleanState() {
      return defaultState;
    },
  },

  subscriptions: {
    setup(props) {
      const { history, dispatch } = props;
      return history.listen(({ pathname }) => {
        if (pathname === PATH_PAMS_REPORT_SCHEDULED_TASKS) {
          dispatch({ type: 'cleanState' });
        }
        if (pathname === PATH_PAMS_REPORT_SCHEDULED_TASKS_NEW) {
          dispatch({ type: 'cleanState' });
        }
      });
    },
  },
};
