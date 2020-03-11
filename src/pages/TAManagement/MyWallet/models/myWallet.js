import { cloneDeep } from 'lodash';
import * as service from '../services/myWallet';

/* eslint-disable */

const DEFAULTS = {
  transactionId: '',
  transactionType: '',
  walletTypes: '',
  dateRange: [],
  currentPage: 1,
  pageSize: 20,
};
const MyWalletModel = {
  namespace: 'myWallet',
  state: {
    taId: 20000,
    filter: {
      transactionId: DEFAULTS.transactionId,
      transactionType: DEFAULTS.transactionType,
      walletTypes: DEFAULTS.walletTypes,
      dateRange: DEFAULTS.dateRange,
    },
    pagination: {
      total: 0,
      currentPage: DEFAULTS.currentPage,
      pageSize: DEFAULTS.pageSize,
    },

    account: {},
    walletTypes: [],
    transactionTypes: [],
    dataSource: [],
    invoice: {
      invoice: {
        AR_NO: 'TN1300001',
        Debit_Memo: 'NLDP1911001',
        Date: '14/11/2019',
        GST_Reg_No: 'M90364180J',
        Co_Reg_No: '200502573D',
        Payment_Term: 'Due 30 Days upon\n invoice date',
        Page: '1 of 1',
      },
      details: {
        Date: '14/11/2019',
        Line_Description: 'WIN130000L-TOP up prepaymentfor Nov19',
        Total_Amount: '5,000.00',
      },
      paymentInstructions:
        'Payment should be made by cheque, GLRO or T/T quoting invoice numbers being paid to"Resorts World at Sentosa Pte LtdBank: DBS Bank Ltd, Address: 12 Marina Boulevard, Marina Bay Financial Centre Tower 3, Singapore 018982Bank Code: 7171. Branch Code: 003 Account No: 003-910526-6. Swift Code: DBSSSGSG',
    },
  },
  subscriptions: {
    setup({ dispatch }) {},
  },
  effects: {
    *fetchAccountFlowlList({ payload }, { call, put, select }) {
      yield put({ type: 'save', payload });
      const { filter, pagination } = yield select(state => state.myWallet);
      const {
        userCompanyInfo: { companyId = '' },
      } = yield select(state => state.global);
      const params = {};
      Object.assign(params, filter, pagination, { taId: companyId });
      const {
        data: { resultCode, resultMsg, result = [] },
      } = yield call(service.search, params);
      if (resultCode === '0') {
        const dataSource = [];
        result.array.forEach((item, index) => {
          item.key = index;
          dataSource.push(item);
        });
        yield put({
          type: 'save',
          payload: {
            dataSource: dataSource,
            pagination: {
              total: result.totalSize,
              currentPage: result.currentPage,
            },
          },
        });
      }
    },
    *paginationChanged({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });

      yield put({
        type: 'fetchAccountFlowlList',
      });
    },
    *fetchSelectReset({ payload }, { call, put }) {
      yield put({
        type: 'clear',
      });
      yield put({
        type: 'fetchAccountFlowlList',
      });
    },
    *fetchTransactionTypes(_, { call, put }) {
      const {
        data: { resultCode, resultMsg, result = [] },
      } = yield call(service.queryTransactonTypes);
      if (resultCode === '0') {
        yield put({
          type: 'save',
          payload: {
            transactionTypes: result,
          },
        });
      }
    },
    *fetchWalletTypes(_, { call, put }) {
      const {
        data: { resultCode, resultMsg, result = [] },
      } = yield call(service.queryWalletTypes);
      if (resultCode === '0') {
        yield put({
          type: 'save',
          payload: {
            walletTypes: result,
          },
        });
      }
    },
    *fetchAccountDetail(_, { call, put, select }) {
      const {
        userCompanyInfo: { companyId = '' },
      } = yield select(state => state.global);
      const params = { taId: companyId };
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(service.queryAccount, params);
      if (resultCode === '0') {
        if (!result.accountProfileBean) return;
        let bean = cloneDeep(result.accountProfileBean);
        bean.accountBookBeanList.forEach(item => {
          if (item.accountBookType === 'E_WALLET') {
            bean['eWallet'] = cloneDeep(item);
          }
          if (item.accountBookType === 'AR_CREDIT') {
            bean['ar'] = cloneDeep(item);
          }
        });

        yield put({
          type: 'save',
          payload: {
            account: bean,
          },
        });
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    clear(state) {
      return {
        ...state,
        filter: {
          transactionId: DEFAULTS.transactionId,
          transactionType: DEFAULTS.transactionType,
          walletTypes: DEFAULTS.walletTypes,
          dateRange: DEFAULTS.dateRange,
        },
        pagination: {
          currentPage: DEFAULTS.currentPage,
          pageSize: DEFAULTS.pageSize,
        },
        account: [],
        walletTypes: [],
        transactionTypes: [],
        dataSource: [],
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
};
export default MyWalletModel;
