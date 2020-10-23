import UAAService from '@/uaa-npm';

const uaaPath =
  process.env.NODE_ENV === 'development'
    ? 'http://pamsdev.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com/pams'
    : '';
const mock = 'http://easymock.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com/mock/5e854bf1f8436f0020822df9/PAMS';
export async function queryOrder(params) {
  return UAAService.request(`${mock}/b2b/transaction/v1/booking/list${params}`, {
    method: 'GET',
  });
}

export async function queryRevalidationVids(params) {
  return UAAService.request(`${uaaPath}/b2b/transaction/v1/booking/queryVid${params}`, {
    method: 'GET',
  });
}

export async function queryBookingDetail(params) {
  return UAAService.request(`${mock}/b2b/transaction/v1/booking/query${params}`, {
    method: 'GET',
  });
}

export async function queryPluAttribute(params) {
  return UAAService.request(`${uaaPath}/b2c/product/v1/dictionary/attraction/list`, {
    method: 'POST',
    body: params,
  });
}

export async function queryOfferBookingCategory(params) {
  return UAAService.request(
    `${uaaPath}/b2c/product/v1/offer/offerBookingCategory/queryOfferBookingCategory`,
    {
      method: 'POST',
      body: params,
    }
  );
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

export async function secondUpdate(params) {
  return UAAService.request(`${uaaPath}/b2b/transaction/v1/booking/updateGalaxyNo`, {
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

export async function attractionTaConfirm(params) {
  return UAAService.request(`${uaaPath}/b2b/transaction/v1/booking/attractionTaConfirm`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function downloadInvoice(params) {
  return UAAService.request(`${uaaPath}/b2b/transaction/v1/invoice/download${params}`, {
    method: 'GET',
  });
}

export async function queryTask(params) {
  return UAAService.request(`${uaaPath}/b2c/transaction/v1/task/query`, {
    method: 'GET',
    params,
  });
}
