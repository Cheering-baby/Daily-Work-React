import moment from 'moment';
import { message } from 'antd';
import {
  DATE_FORMAT,
  EMPTY_ARR,
  PAGE_SIZE,
  PATH_PAMS_REPORT_ADHOC_REPORTS,
} from '@/pages/ReportCenter/consts/pamsReport';
import {
  queryAdhocReportList,
  queryAgentDictionary,
  queryReportByFilter,
  queryReportFilter,
} from '@/pages/ReportCenter/PamsReport/services/adhocReportsService';
import FetchReportRequestProcessor from '@/pages/ReportCenter/PamsReport/utils/Processor/Fetch/FetchReportRequestProcessor';
import FetchFilterResponseProcessor from '@/pages/ReportCenter/PamsReport/utils/Processor/Fetch/FetchFilterResponseProcessor';
import { renderContent } from '@/pages/ReportCenter/PamsReport/AdhocReports/components/BasicTableBanner';

const defaultState = {
  reportList: EMPTY_ARR,
  reportTypeMapping: {},
  filterOptions: {},
  sortOptions: {},
  filterList: EMPTY_ARR,
  basicTable: {
    columns: EMPTY_ARR,
    totalSize: 0,
    pageSize: PAGE_SIZE,
    currentPage: 1,
    dataList: EMPTY_ARR,
  },
};

export default {
  namespace: 'adhocReports',
  state: defaultState,

  effects: {
    *fetchAdhocReportList({ payload = {} }, { call, put }) {
      const response = yield call(queryAdhocReportList, payload);
      if (!response || !response.success) return;
      const {
        data: { result, resultCode },
      } = response;
      if (resultCode !== '0') {
        message.warn(`Failed to queryAdhocReportList.`);
        return;
      }
      yield put({ type: 'saveReportList', payload: { result } });
    },

    *fetchReportFilterList({ payload = {} }, { call, put }) {
      const response = yield call(queryReportFilter, payload);
      if (!response || !response.success) return;
      const {
        data: { result: filterList = [], resultCode },
      } = response;
      if (resultCode !== '0') {
        message.warn(`Failed to queryReportFilterList.`);
        return;
      }
      // todo promise
      const appendState = {};
      for (let index = 0; index <= filterList.length - 1; index += 1) {
        const { preprocess, service, params, process } = FetchFilterResponseProcessor(
          {},
          filterList[index]
        );
        if (preprocess && preprocess()) {
          const _response = yield call(service, params);
          if (_response && _response.success) {
            const store = { _response, filterList, index };
            const _appendState = process(store, filterList[index]);
            Object.assign(appendState, _appendState);
          }
        }
      }
      yield put({ type: 'saveReportFilterList', payload: { filterList, appendState } });
    },

    *fetchReportByFilter({ payload = {} }, { call, put, select }) {
      const {
        basicTable: { currentPage, pageSize },
        filterOptions,
        sortOptions,
        filterList,
      } = yield select(state => state.adhocReports);

      const {
        filterOptions: newFilterOptions = filterOptions,
        sortOptions: newSortOptions = sortOptions,
        currentPage: newCurrentPage = currentPage,
        pageSize: newPageSize = pageSize,
      } = payload;

      yield put({
        type: 'updateState',
        payload: {
          filterOptions: newFilterOptions,
          sortOptions: newSortOptions,
        },
      });

      const response = yield call(
        queryReportByFilter,
        FetchReportRequestProcessor.transform2ListReqParams({
          filterOptions: newFilterOptions,
          sortOptions: newSortOptions,
          currentPage: newCurrentPage,
          pageSize: newPageSize,
          filterList,
        })
      );

      if (!response || !response.success) return;
      const {
        data: { result, resultCode },
      } = response;
      if (resultCode !== '0') {
        message.warn(`Failed to search.`);
        return;
      }
      yield put({ type: 'saveBasicReportList', payload: { result } });
    },

    *fetchAgentDictionary({ payload: { dictType, subDictType, saveType } = {} }, { call, put }) {
      const response = yield call(queryAgentDictionary, { dictType, subDictType });
      if (!response || !response.success) return;
      const {
        data: { result: dictInfoList },
      } = response;
      yield put({ type: saveType, payload: { dictInfoList } });
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },

    saveReportList(state, { payload }) {
      const { result = [] } = payload;
      const reportList = result.map(({ reportName, reportType, updateTime }) => ({
        reportName,
        reportType,
        updateTime,
        updateDate: updateTime && moment(updateTime).format(DATE_FORMAT),
      }));
      const reportTypeMapping = {};
      reportList.forEach(({ reportType, reportName }) => {
        Object.assign(reportTypeMapping, { [reportType]: reportName });
      });
      return { ...state, reportList, reportTypeMapping };
    },

    saveReportFilterList(state, { payload }) {
      const { filterList, appendState } = payload;
      return {
        ...state,
        ...appendState,
        filterList: filterList.map(({ filterKey, filterName, filterType, options }) => ({
          filterKey,
          filterName,
          filterType,
          options,
        })),
      };
    },

    saveBasicReportList(state, { payload }) {
      const {
        result: {
          data: { pageInfo, column, dataList },
        },
      } = payload;

      const keys = Object.keys(column);
      const columns = keys.map(item => ({
        key: item,
        title: column[item],
        dataIndex: item,
        render: renderContent,
      }));

      return {
        ...state,
        basicTable: {
          ...pageInfo,
          columns,
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
        if (pathname === PATH_PAMS_REPORT_ADHOC_REPORTS) {
          dispatch({ type: 'cleanState' });
        }
      });
    },
  },
};
