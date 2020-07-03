import UAAService from '@/uaa-npm';

const dev = 'http://pamsdev.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com/pams';
const uaaPath = process.env.NODE_ENV === 'development' ? dev : '';
const localPath = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : '';

export async function createBooking(params) {
  return UAAService.request(`${localPath}/b2b/transaction/v1/booking/create`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryBookingStatus(params) {
  return UAAService.request(
    `${localPath}/b2b/transaction/v1/booking/status?bookingNo=${params.bookingNo}`,
    {
      method: 'GET',
      body: {
        ...params,
      },
    }
  );
}

export async function queryBookingDetail(params) {
  return UAAService.request(
    `${localPath}/b2b/transaction/v1/booking/query?isSubOrder=0&bookingNo=${params.bookingNo}`,
    {
      method: 'GET',
      body: {
        ...params,
      },
    }
  );
}

export async function paymentOrder(params) {
  return UAAService.request(`${localPath}/b2b/transaction/v1/payment/transactionPaymentOrder/pay`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function ticketDownload(params) {
  return UAAService.request(`${localPath}/b2b/transaction/v1/attraction/ticket/download`, {
    method: 'GET',
    params,
  });
}

export async function invoiceDownload(params) {
  return UAAService.request(`${localPath}/b2b/transaction/v1/invoice/download`, {
    method: 'GET',
    params,
  });
}

export function accountTopUp(params) {
  return UAAService.request(`${uaaPath}/b2b/account/topup`, {
    method: 'POST',
    body: params,
  });
}

export function sendTransactionPaymentOrder(params) {
  return UAAService.request(`${localPath}/b2c/transaction/v1/payment/send`, {
    method: 'POST',
    body: params,
  });
}

export async function queryTask(params) {
  return UAAService.request(`${localPath}/b2c/transaction/v1/task/query`, {
    method: 'GET',
    params,
  });
}
