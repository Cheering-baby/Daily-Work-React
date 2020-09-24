import { message } from 'antd';
import * as service from '../services/report';
import { renderContent } from '../components/BasicTableBanner';

export default {
  namespace: 'downloadAdHocReport',
  state: {
    previewModal: false,
    startTime: '',
    endTime: '',
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    dataList: [],
    columns: [],
    reportType: '',
    sortList: {},
    displayColumnList: [],
    filterList: [],
  },
  effects: {
    *fetchPreviewReport({ payload = {} }, { put, call, select }) {
      const { pagination } = yield select(state => state.downloadAdHocReport);
      const { reportType, displayColumnList, filterList, sortList } = payload;
      yield put({
        type: 'save',
        payload: {
          reportType,
          filterList,
          displayColumnList,
        },
      });
      const sortValueMap = {
        ascend: 'ASC',
        descend: 'DESC',
      };
      if (sortList && sortList.length > 0) {
        sortList.map(v => {
          const orderBy2 = sortValueMap[v.value];
          Object.assign(v, {
            value: orderBy2,
            key: v.key,
          });
        });
      }
      const reqParams = {
        reportType,
        filterList,
        displayColumnList,
        pageInfo: {
          ...pagination,
        },
        sortList,
      };

      const res = yield call(service.queryReportByFilter, reqParams);
      const {
        data: { resultCode, resultMsg, result },
      } = res;
      if (resultCode === '0' || resultCode === 0) {
        const { data } = result;
        const {
          pageInfo: { currentPage, pageSize, totalSize },
          dataList,
          column,
        } = data;
        const keys = Object.keys(column);
        const columns = keys.map(item => ({
          key: item,
          title: column[item],
          dataIndex: item,
          render: renderContent,
          sorter: true,
        }));
        yield put({
          type: 'save',
          payload: {
            currentPage,
            pageSize,
            totalSize,
            dataList,
            columns,
          },
        });
      } else throw resultMsg;
    },
    *fetchDownload({ payload }, { call, put }) {
      yield put({ type: 'save' });
      const { fileSuffixType, reportType, filterList } = payload;
      const params = { fileSuffixType, reportType, filterList };
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(service.download, params);
      yield put({
        type: 'save',
      });
      if (resultCode !== '0') {
        message.warn(resultMsg, 10);
      } else {
        return result;
      }
    },
    *tableChanged({ payload }, { put }) {
      const { reportType, displayColumnList, filterList, sortList } = payload;
      yield put({
        type: 'save',
        payload,
      });

      yield put({
        type: 'fetchPreviewReport',
        payload: {
          reportType,
          filterList,
          displayColumnList,
          sortList,
        },
      });
    },

    *search({ payload }, { put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'save',
        payload,
      });
      yield put({
        type: 'fetchPreviewReport',
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    clear(state) {
      return {
        ...state,
        previewModal: false,
        dataList: [],
        columns: [],
        reportType: '',
        sortList: {},
        displayColumnList: [],
        filterList: [],
        startTime: '',
        endTime: '',
        pagination: {
          currentPage: 1,
          pageSize: 10,
        },
      };
    },
    toggleModal(state, { payload }) {
      const { key, val } = payload;
      return {
        ...state,
        [key]: val,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname !== '/ReportsCenter/Reports/DownloadAdhocReport') {
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
