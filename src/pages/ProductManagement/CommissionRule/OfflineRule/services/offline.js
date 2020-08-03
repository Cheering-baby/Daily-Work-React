import { stringify } from 'qs';
import UAAService from '@/uaa-npm';

const localPath = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : '';
export async function queryPluAttribute(params) {
  return UAAService.request(`${localPath}/b2c/product/v1/dictionary/attraction/list`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryOfferBookingCategory(params) {
  return UAAService.request(
    `${localPath}/b2c/product/v1/offer/offerBookingCategory/queryOfferBookingCategory`,
    {
      method: 'POST',
      body: {
        ...params,
      },
    }
  );
}

export function commodityList(data) {
  return UAAService.request(
    `/b2b/agent/v1/commission/binding/queryCommodityList?${stringify(data)}`,
    {
      method: 'GET',
    }
  );
}

export function like(likeParam) {
  const newParam = {};
  Object.keys(likeParam).forEach(key => {
    if (likeParam[key]) {
      newParam[key] = likeParam[key];
    }
  });
  return UAAService.request(
    `/b2b/agent/v1/commission/template/queryCommodityCommissionTplList?${stringify(newParam)}`,
    {
      method: 'GET',
    }
  );
}

export function queryCommodityCommissionTplList(data) {
  return UAAService.request(
    `/b2b/agent/v1/commission/template/queryCommodityCommissionTplList?${stringify(data)}`,
    {
      method: 'GET',
    }
  );
}

export function detail(data) {
  return UAAService.request(
    `/b2b/agent/v1/commission/binding/queryCommodityBindingList?${stringify(data)}`,
    {
      method: 'GET',
    }
  );
}

export async function edit(params) {
  return UAAService.request(`/b2b/agent/v1/commission/template/saveCommissionTpl`, {
    method: 'POST',
    body: params,
  });
}

export async function add(params) {
  return UAAService.request(`/b2b/agent/v1/commission/template/batchSaveCommodityCommissionTpl`, {
    method: 'POST',
    body: params,
  });
}

export async function themepark(params) {
  return UAAService.request(`/b2c/product/v1/dictionary/attraction/list`, {
    method: 'POST',
    body: params,
  });
}
