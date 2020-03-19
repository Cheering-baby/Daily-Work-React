import moment from 'moment';
import {message} from 'antd';
import * as service from '../services/myWallet';

const InvoiceModel = {
  namespace: 'invoice',
  state: {
    profile: {
      name: 'NaN',
      address: 'NaN',
    },
    descriptions: [
      {label: 'AR NO:', dataKey: 'AR_NO'},
      {label: 'Tax Invoice:', dataKey: 'Tax_Invoice'},
      {label: 'Date:', dataKey: 'Date'},
      {label: 'GST Reg No:', dataKey: 'GST_Reg_No'},
      {label: 'Co. Reg No:', dataKey: 'Co_Reg_No'},
      {label: 'Payment Term:', dataKey: 'Payment_Term'},
      {label: 'Page:', dataKey: 'Page'},
    ],
    descriptionsData: {
      AR_NO: 'NaN',
      Tax_Invoice: 'NaN',
      Date: 'NaN',
      GST_Reg_No: 'M90364180J',
      Co_Reg_No: '200502573D',
      Payment_Term: 'Due 30 Days upon\n invoice date',
      Page: '1 of 1',
    },
    details: {
      Date: 'NaN',
      Line_Description: 'WIN1300001-Top up prepayment \nfor Nov19',
      Total_Amount: 'NaN',
      internal: {
        befGstAmount: 'NaN',
        gstAmount: 'NaN',
        totalAmount: 'NaN',
      },
      taxRatio: 'NaN',
    },
    paymentInstructions:
      'Payment should be made by cheque, GLRO or T/T quoting invoice numbers being paid to"Resorts World at Sentosa Pte LtdBank: DBS Bank Ltd, Address: 12 Marina Boulevard, Marina Bay Financial Centre Tower 3, Singapore 018982Bank Code: 7171. Branch Code: 003 Account No: 003-910526-6. Swift Code: DBSSSGSG',
  },
  subscriptions: {},
  effects: {
    *fetchInvoiceDetail({ payload }, { call, put }) {
      yield put({ type: 'clear' });
      const params = { accountBookFlowId: payload.accountBookFlowId };
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(service.invoiceDetail, params);
      const { companyInfo = {}, mappingInfo = {}, flow = {} } = result;
      if (resultCode === '0') {
        yield put({
          type: 'save',
          payload: {
            profile: {
              name: companyInfo.companyName,
              address: companyInfo.address,
            },
            descriptionsData: {
              AR_NO: mappingInfo.peoplesoftEwalletId,
              Tax_Invoice: flow.invoiceNo || flow.sourceInvoiceNo,
              Date: moment(flow.createTime)
                .format('DD/MM/YYYY')
                .toString(),
              GST_Reg_No: 'M90364180J',
              Co_Reg_No: '200502573D',
              Payment_Term: 'Due 30 Days upon\n invoice date',
              Page: '1 of 1',
            },
            details: {
              Date: moment(flow.createTime)
                .format('DD/MM/YYYY')
                .toString(),
              Total_Amount: flow.charge.toFixed(2),
              Line_Description: 'WIN1300001-Top up prepayment \nfor Nov19',
              internal: {
                befGstAmount: Number(flow.befGstAmount.toFixed(2)),
                gstAmount: flow.gstAmount.toFixed(2),
                totalAmount: flow.charge.toFixed(2),
              },
              taxRatio: `${(flow.taxRatio * 100).toFixed(2)} %`,
            },
          },
        });
      } else message.warn(resultMsg, 10);
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    clear(state) {
      return {
        ...state,
        profile: {
          name: 'NaN',
          address: 'NaN',
        },
        descriptionsData: {
          AR_NO: 'NaN',
          Tax_Invoice: 'NaN',
          Date: 'NaN',
          GST_Reg_No: 'M90364180J',
          Co_Reg_No: '200502573D',
          Payment_Term: 'Due 30 Days upon\n invoice date',
          Page: '1 of 1',
        },
        details: {
          Date: 'NaN',
          Line_Description: 'WIN1300001-Top up prepayment \nfor Nov19',
          Total_Amount: 'NaN',
          internal: {
            befGstAmount: 'NaN',
            gstAmount: 'NaN',
            totalAmount: 'NaN',
          },
          taxRatio: 'NaN',
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
};
export default InvoiceModel;
