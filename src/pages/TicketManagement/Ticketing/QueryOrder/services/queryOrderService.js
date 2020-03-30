import UAAService from '@/uaa-npm';

const uaaPath =
  process.env.NODE_ENV === 'development'
    ? 'http://pamsdev.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com/pams'
    : '';

export async function queryOrder(params) {
  return UAAService.request(`${uaaPath}/b2b/transaction/v1/booking/list${params}`, {
    method: 'GET',
  });
}

export async function queryBookingDetail(params) {
  return UAAService.request(`${uaaPath}/b2b/transaction/v1/booking/query${params}`, {
    method: 'GET',
  });
}

export async function revalidationTicket(params) {
  return UAAService.request(`${uaaPath}/b2b/transaction/v1/booking/revalidationticket`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function refundTicket(params) {
  return UAAService.request(`${uaaPath}/b2b/transaction/v1/booking/refund`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function downloadETicket(params) {
  return UAAService.request(`${uaaPath}/b2b/transaction/v1/attraction/ticket/download${params}`, {
    method: 'GET',
  });
}

export async function judgeUrl(url) {
  return UAAService.request(url, {
    method: 'GET',
  });
}

export async function sendEmail(params) {
  return UAAService.request(`${uaaPath}/b2b/transaction/v1/attraction/ticket/sendmail`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function accept(params) {
  return UAAService.request(`${uaaPath}/b2b/user/v1/activity/accept`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reject(params) {
  return UAAService.request(`${uaaPath}/b2b/user/v1/activity/reject`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
