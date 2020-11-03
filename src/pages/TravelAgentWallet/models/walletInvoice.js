import moment from 'moment';
import { message } from 'antd';
import * as service from '../services/travelAgentWalletServices';

const DEFAULT_PROFILE = {
  name: 'NaN',
  address: 'NaN',
  postalCode: 'NaN',
  primaryFinanceContactName: 'NaN',
};

const DEFAULT_DESCRIPTIONS_DATA = {
  AR_NO: 'NaN',
  Tax_Invoice: 'NaN',
  Date: 'NaN',
  GST_Reg_No: 'M90364180J',
  Co_Reg_No: '200502573D',
  Payment_Term: 'Due Immediately',
  Page: '1 of 1',
};

const DEFAULT_DETAILS = {
  Date: 'NaN',
  Line_Description: '',
  Total_Amount: 'NaN',
  internal: {
    befGstAmount: 'NaN',
    gstAmount: 'NaN',
    totalAmount: 'NaN',
  },
  taxRatio: 'NaN',
};
const DEFAULT_PAYMENT_INSTRUCTIONS = {
  footer: 'This is a computer generated invoice. No signature is required.',
};

const WalletInvoiceModel = {
  namespace: 'walletInvoice',
  state: {
    profile: DEFAULT_PROFILE,
    descriptions: [
      { label: 'AR NO:', dataKey: 'AR_NO' },
      { label: 'Tax Invoice:', dataKey: 'Tax_Invoice' },
      { label: 'Date:', dataKey: 'Date' },
      { label: 'GST Reg No:', dataKey: 'GST_Reg_No' },
      { label: 'Co. Reg No:', dataKey: 'Co_Reg_No' },
      { label: 'Payment Term:', dataKey: 'Payment_Term' },
      { label: 'Page:', dataKey: 'Page' },
      { label: 'Payment Mode:', dataKey: 'Payment_Mode' },
      { label: 'Credit Card Type:', dataKey: 'Credit_Card_Type' },
      { label: 'Payment Reference NO:', dataKey: 'Payment_Reference_NO' },
    ],
    descriptionsData: DEFAULT_DESCRIPTIONS_DATA,
    details: DEFAULT_DETAILS,
    paymentInstructions: DEFAULT_PAYMENT_INSTRUCTIONS,
  },
  subscriptions: {},
  effects: {
    *fetchInvoiceDetail({ payload }, { call, put }) {
      yield put({ type: 'clear' });
      const { accountBookFlowId, taId } = payload;
      const params = { accountBookFlowId, taId };
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(service.invoiceDetail, params);
      const {
        companyInfo = {},
        billingInfo = {},
        mappingInfo = {},
        flow = {},
        primaryFinanceContact = {},
      } = result;
      if (resultCode === '0') {
        yield put({
          type: 'save',
          payload: {
            profile: Object.assign(DEFAULT_PROFILE, {
              name: companyInfo.companyName,
              address: billingInfo.address,
              postalCode: billingInfo.postalCode,
              countryName: billingInfo.countryName,
              primaryFinanceContactName: primaryFinanceContact.contactPerson,
              taId: companyInfo.taId,
            }),
            descriptionsData: Object.assign(DEFAULT_DESCRIPTIONS_DATA, {
              AR_NO: mappingInfo.peoplesoftEwalletId,
              Tax_Invoice: flow.invoiceNo || flow.sourceInvoiceNo,
              Date: moment(flow.createTime)
                .format('DD/MM/YYYY')
                .toString(),
              Payment_Mode: flow.paymentMode,
              Credit_Card_Type: flow.paymentCardType,
              Payment_Reference_NO: flow.paymentReferenceNo,
            }),
            details: Object.assign(DEFAULT_DETAILS, {
              id: flow.accountBookFlowId,
              Date: moment(flow.createTime)
                .format('DD/MM/YYYY')
                .toString(),
              Total_Amount: flow.charge.toFixed(2),
              Line_Description: `${
                mappingInfo.peoplesoftEwalletId
              } - Top up prepayment for ${moment(flow.createTime)
                .format('MMM YYYY')
                .toString()}`,
              internal: {
                befGstAmount: Number(flow.befGstAmount.toFixed(2)),
                gstAmount: flow.gstAmount.toFixed(2),
                totalAmount: flow.charge.toFixed(2),
              },
              taxRatio: `${(flow.taxRatio * 100).toFixed(2)} %`,
            }),
          },
        });
      } else message.warn(resultMsg, 10);
    },
    *fetchDownloadInvoice({ payload }, { call, put }) {
      yield put({ type: 'save' });
      const params = { accountBookFlowId: payload.accountBookFlowId };
      const {
        data: { resultCode, resultMsg, result = {} },
      } = yield call(service.invoiceDownload, params);
      yield put({
        type: 'save',
      });
      if (resultCode !== '0') {
        message.warn(resultMsg, 10);
      } else {
        return result;
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
        profile: {
          name: 'NaN',
          address: 'NaN',
        },
        descriptionsData: DEFAULT_DESCRIPTIONS_DATA,
        details: DEFAULT_DETAILS,
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
export default WalletInvoiceModel;
