import * as service from '../services/myWallet';

/* eslint-disable */
const InvoiceModel = {
  namespace: 'invoice',
  state: {
    companyInfo: {},
    flow: {},
    profile: {
      name: '',
      address: '',
    },
    descriptions: [
      { label: 'AR NO.', dataKey: 'AR_NO' },
      { label: 'Debit Memo', dataKey: 'Debit_Memo' },
      { label: 'Date', dataKey: 'Date' },
      { label: 'GST Reg No.', dataKey: 'GST_Reg_No' },
      { label: 'Co. Reg No.', dataKey: 'Co_Reg_No' },
      { label: 'Payment Term', dataKey: 'Payment_Term' },
      { label: 'Page', dataKey: 'Page' },
    ],
    descriptionsData: {
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
      Line_Description: 'WIN130000L-TOP up \nprepayment for Nov19',
      Total_Amount: '5,000.00',
      internal: {
        befGstAmount: '4,000.00',
        gstAmount: '4,000.00',
        totalAmount: '5,000.00',
      },
    },
    paymentInstructions:
      'Payment should be made by cheque, GLRO or T/T quoting invoice numbers being paid to"Resorts World at Sentosa Pte LtdBank: DBS Bank Ltd, Address: 12 Marina Boulevard, Marina Bay Financial Centre Tower 3, Singapore 018982Bank Code: 7171. Branch Code: 003 Account No: 003-910526-6. Swift Code: DBSSSGSG',
  },
  subscriptions: {
    setup({ dispatch }) {},
  },
  effects: {
    *fetchInvoiceDetail({ payload }, { call, put, select }) {
      const {
        userCompanyInfo: { companyId = '' },
      } = yield select(state => state.global);
      const params = { accountBookFlowId: payload.accountBookFlowId, taId: companyId };
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(service.invoiceDetail, params);
      const { companyInfo = {}, flow = {} } = result;
      if (resultCode === '0') {
        yield put({
          type: 'save',
          payload: {
            // companyInfo: companyInfo,
            profile: {
              name: companyInfo.companyName,
              address: companyInfo.address,
            },
            flow: flow,
            descriptionsData: {
              // AR_NO: 'TN1300001',
              Debit_Memo: 'OLTPP240220001',
              Date: '24/02/2020',
              // GST_Reg_No: 'M90364180J',
              // Co_Reg_No: '200502573D',
              // Payment_Term: 'Due 30 Days upon\n invoice date',
              // Page: '1 of 1',
            },
            // details: result.details,
            // paymentInstructions: result.paymentInstructions,
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
        profile: {},
        descriptionsData: {},
        details: {},
        paymentInstructions: {},
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
export default InvoiceModel;
