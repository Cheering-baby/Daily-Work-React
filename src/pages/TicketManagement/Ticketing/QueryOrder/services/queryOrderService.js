import UAAService from '@/uaa-npm';

const uaaPath =
  process.env.NODE_ENV === 'development'
    ? 'http://pamsdev.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com/pams'
    : window.location.origin;
//
// const test = 'http://10.25.159.214:18091/pams';

export async function queryOrder(params) {
  return UAAService.request(`${uaaPath}/proxy/ali/b2b/transaction/v1/booking/list${params}`, {
    method: 'GET',
  });
}

export async function queryBookingDetail(params) {
  return UAAService.request(`${uaaPath}/proxy/ali/b2b/transaction/v1/booking/query${params}`, {
    method: 'GET',
  });
}
