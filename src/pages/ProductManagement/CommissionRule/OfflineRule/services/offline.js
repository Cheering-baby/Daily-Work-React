import { stringify } from 'qs';
import UAAService from '@/uaa-npm';

const rwsUrl = 'http://10.25.159.236:18091/pams';
// const localPath = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : '';
// export async function queryPluAttribute(params) {
//   return UAAService.request(`${localPath}/proxy/ali/b2c/product/v1/dictionary/attraction/list`, {
//     method: 'POST',
//     body: {
//       ...params,
//     },
//   });
// }

export async function queryPluAttribute(params) {
  return UAAService.request(`/proxy/ali/b2c/product/v1/dictionary/attraction/list`, {
    method: 'POST',
    headers: { Authorization: 'fCm7Pc1OXg7XXWPW4DUqO3s2fa8ObSX2' },
    body: params,
  });
}

export function commodityList(data) {
  return UAAService.request(
    `${rwsUrl}/proxy/ali/b2b/api/v1/agent/commission/binding/queryCommodityList?${stringify(data)}`,
    {
      method: 'GET',
    }
  );
}

export function queryCommodityCommissionTplList(data) {
  return UAAService.request(
    `${rwsUrl}/proxy/ali/b2b/api/v1/agent/commission/template/queryCommodityCommissionTplList?${stringify(
      data
    )}`,
    {
      method: 'GET',
    }
  );
}
