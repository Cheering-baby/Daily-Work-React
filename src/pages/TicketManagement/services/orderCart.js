import UAAService from '@/uaa-npm';

const dev = 'http://pamsdev.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com/pams';
const mock =
  'http://easymock.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com/mock/5e1c1fb0f5006f0021bfc342/PAMS';
const uaaPath = process.env.NODE_ENV === 'development' ? dev : '';

const uaaPathWithMock = process.env.NODE_ENV === 'development' ? mock : '';

export async function createBooking(params) {
  return UAAService.request(`${uaaPath}/proxy/ali/pams/transaction/v1/booking/create`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
