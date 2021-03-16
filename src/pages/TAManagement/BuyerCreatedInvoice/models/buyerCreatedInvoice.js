import moment from 'moment';
import {
  DATE_FORMAT,
  PAGE_SIZE,
  PAGE_SIZE_SIMPLE,
  PATH_BUYER_CREATED_INVOICE,
} from '@/pages/TAManagement/BuyerCreatedInvoice/consts/buyerCreatedInvoice';
import {
  queryBuyerCreatedInvoiceList,
  queryPreviewOfPdf,
  queryTaNameList,
} from '@/pages/TAManagement/BuyerCreatedInvoice/services/buyerCreatedInvoiceService';
import { transform2ListParams } from '@/pages/TAManagement/BuyerCreatedInvoice/utils/buyerCreatedInvoiceFetchUtils';
import { queryReportByFilter } from '@/pages/ReportCenter/PamsReport/services/adhocReportsService';
import { renderContent } from '@/pages/TAManagement/BuyerCreatedInvoice/components/InvoiceTableBanner';

const defaultState = {
  filterOptions: {
    agentCode: null,
    taName: null,
    invoiceDate: [],
  },
  sortOptions: {},
  table: {
    totalSize: 0,
    pageSize: PAGE_SIZE,
    currentPage: 1,
    dataList: [],
  },
  taNameList: [],

  /**
   * Fix Commission Detail
   */
  commissionTable: {
    totalSize: 0,
    pageSize: PAGE_SIZE_SIMPLE,
    currentPage: 1,
    dataList: [],
    columns: [],
  },
  invoiceDetailModalVisible: false,
  selectedInvoice: {},
};

export default {
  namespace: 'buyerCreatedInvoice',
  state: defaultState,

  effects: {
    *fetchBuyerCreatedInvoiceList({ payload = {} }, { call, put, select }) {
      const {
        filterOptions: newFilterOptions,
        sortOptions: newSortOptions,
        currentPage,
        pageSize,
        fileName,
      } = payload;
      const { table, filterOptions, sortOptions } = yield select(
        ({ buyerCreatedInvoice }) => buyerCreatedInvoice
      );
      const filters = newFilterOptions || filterOptions;
      const sorts = newSortOptions || sortOptions;
      const current = currentPage || table.currentPage;
      const size = pageSize || table.pageSize;
      yield put({ type: 'updateState', payload: { filterOptions: filters, sortOptions: sorts } });
      const response = yield call(
        queryBuyerCreatedInvoiceList,
        {...transform2ListParams(filters, sorts, current, size), fileName}
      );
      if (!response || !response.data || response.data.resultCode !== '0') return;
      const {
        data: { result },
      } = response;
      yield put({
        type: 'saveBuyerCreatedInvoiceList',
        payload: { result },
      });
      return result.taxInvoiceList;
    },

    *fetchPreviewOfPdf({ payload }, { call, put }) {
      const response = yield call(queryPreviewOfPdf, payload);
      if (!response || !response.data || response.data.resultCode !== '0') return;
      const {
        data: {
          result: { fileBase64 },
        },
      } = response;
      yield put({
        type: 'updateState',
        payload: { previewOfPdfBase64: `data:application/pdf;base64,${fileBase64}` },
      });
    },

    *fetchTaNameList({ payload }, { call, put }) {
      const response = yield call(queryTaNameList, payload);
      if (!response || !response.data || response.data.resultCode !== '0') return;
      const {
        data: { result },
      } = response;
      yield put({ type: 'updateState', payload: { taNameList: result } });
    },

    *fetchFixedCommissionList({ payload }, { call, put, select }) {
      const {
        currentPage,
        pageSize,
        transactionDateFrom,
        transactionDateTo,
        accountBookId,
        bciNo,
      } = payload;
      const { commissionTable } = yield select(({ buyerCreatedInvoice }) => buyerCreatedInvoice);
      const current = currentPage || commissionTable.currentPage;
      const size = pageSize || commissionTable.pageSize;
      const response = yield call(queryReportByFilter, {
        pageInfo: { pageSize: size, currentPage: current },
        filterList: [
          { key: 'accountBookId', value: accountBookId },
          { key: 'transactionDateFrom', value: transactionDateFrom },
          { key: 'transactionDateTo', value: transactionDateTo },
          { key: 'bciNo', value: bciNo },
        ],
        reportType: 'FixedCommissionReport',
      });
      if (!response || !response.data || response.data.resultCode !== '0') return;
      const {
        data: { result },
      } = response;
      yield put({ type: 'saveFixedCommissionList', payload: { result } });
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },

    saveBuyerCreatedInvoiceList(state, { payload: { result } }) {
      const { taxInvoiceList, pageSize, currentPage, totalSize } = result;
      const dataList = taxInvoiceList
        ? taxInvoiceList.map(item => ({
            ...item,
            invoiceDate: item.invoiceDate && moment(item.invoiceDate).format(DATE_FORMAT),
          }))
        : [];

      return {
        ...state,
        table: {
          totalSize,
          pageSize,
          currentPage,
          dataList,
        },
      };
    },

    saveFixedCommissionList(state, { payload: { result } }) {
      const {
        data: {
          column,
          dataList,
          pageInfo: { pageSize, currentPage, totalSize },
        },
      } = result;

      const keys = Object.keys(column);
      const columns = keys.map(item => ({
        key: item,
        title: column[item],
        dataIndex: item,
        render: renderContent,
      }));

      return {
        ...state,
        commissionTable: {
          columns,
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
        if (pathname === PATH_BUYER_CREATED_INVOICE) {
          dispatch({ type: 'cleanState' });
        }
      });
    },
  },
};
