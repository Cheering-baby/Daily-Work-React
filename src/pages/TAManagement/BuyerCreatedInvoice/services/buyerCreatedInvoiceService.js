import UAAService from '@/uaa-npm';

const NORMAL = '';
// const MOCK = `${window.location.origin}`;
// const LOCAL = 'http://10.25.159.231:18088/api';
// const DEV = 'http://pamsdev.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com';
// const url = process.env.NODE_ENV === 'development' ? DEV : window.location.origin;
// const test = 'http://pamdevapi.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com';

// export const downloadBuyerCreatedInvoiceUrl = `${MOCK}/api/agent/v1/bci/download`;
export const downloadBuyerCreatedInvoiceUrl = `${window.location.origin}/pams/b2b/agent/v1/bci/download`;
const queryBuyerCreatedInvoiceListUrl = `${NORMAL}/b2b/agent/v1/bci/searchResult`;
const queryPreviewOfPdfUrl = `${NORMAL}/b2b/agent/v1/bci/preview`;
const queryTaNameListUrl = `${NORMAL}/b2b/agent/v1/bci/agentName`;

export function queryBuyerCreatedInvoiceList(params) {
  return UAAService.request(queryBuyerCreatedInvoiceListUrl, {
    method: 'POST',
    body: params,
  });
}

export function queryPreviewOfPdf(params) {
  return UAAService.request(queryPreviewOfPdfUrl, {
    method: 'GET',
    params,
  });
}

export function queryTaNameList(params) {
  return UAAService.request(queryTaNameListUrl, {
    method: 'GET',
    params,
  });
}
