import { stringify } from 'qs';
import UAAService from '@/uaa-npm';

const rwsUrl = 'http://10.25.159.236:18091/pams';
export async function queryPluAttribute(params) {
  return UAAService.request(`/b2c/product/v1/dictionary/attraction/list`, {
    method: 'POST',
    body: params,
  });
}

export function commodityList(data) {
  return UAAService.request(
    `${rwsUrl}/proxy/ali/b2b/agent/v1/commission/binding/queryCommodityList?${stringify(data)}`,
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
    `${rwsUrl}/proxy/ali/b2b/agent/v1/commission/template/queryCommodityCommissionTplList?${stringify(
      newParam
    )}`,
    {
      method: 'GET',
    }
  );
}

export function queryCommodityCommissionTplList(pagination) {
  return UAAService.request(
    `${rwsUrl}/proxy/ali/b2b/agent/v1/commission/template/queryCommodityCommissionTplList?${stringify(
      pagination
    )}`,
    {
      method: 'GET',
    }
  );
}

export function detail(data) {
  return UAAService.request(
    `${rwsUrl}/proxy/ali/b2b/agent/v1/commission/binding/queryCommodityBindingList?${stringify(
      data
    )}`,
    {
      method: 'GET',
    }
  );
}

export async function edit(params) {
  return UAAService.request(
    `${rwsUrl}/proxy/ali/b2b/agent/v1/commission/template/saveCommissionTpl`,
    {
      method: 'POST',
      body: params,
    }
  );
}

export async function add(params) {
  return UAAService.request(
    `${rwsUrl}/proxy/ali/b2b/agent/v1/commission/template/saveCommissionTpl`,
    {
      method: 'POST',
      body: params,
    }
  );
}
