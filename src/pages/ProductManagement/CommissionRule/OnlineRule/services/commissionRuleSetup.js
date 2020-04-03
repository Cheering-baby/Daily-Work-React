import { stringify } from 'qs';
import UAAService from '@/uaa-npm';

const rwsUrl = 'http://10.25.159.236:18091/pams';
export function commissionRuleSetupList(data) {
  return UAAService.request(
    `/b2b/agent/v1/commission/template/queryCommissionTplList?${stringify(data)}`,
    {
      method: 'GET',
    }
  );
}

export function queryCommissionTplDetail(data) {
  return UAAService.request(
    `${rwsUrl}/proxy/ali/b2b/agent/v1/commission/template/queryCommissionTplDetail?${stringify(
      data
    )}`,
    {
      method: 'GET',
    }
  );
}

export function queryCommissionBindingList(data) {
  return UAAService.request(
    `${rwsUrl}/proxy/ali/b2b/agent/v1/commission/binding/queryCommodityBindingList?${stringify(
      data
    )}`,
    {
      method: 'GET',
    }
  );
}

export function offerList(data) {
  return UAAService.request(
    `${rwsUrl}/proxy/ali/b2b/agent/v1/commission/binding/queryCommodityList?${stringify(data)}`,
    {
      method: 'GET',
    }
  );
}

export async function grant(params) {
  const url = `${rwsUrl}/proxy/ali/b2b/agent/v1/commission/binding/saveCommissionBindingList`;
  return UAAService.request(url, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function edit(params) {
  const url = `${rwsUrl}/proxy/ali/b2b/agent/v1/commission/template/saveCommissionTpl`;
  return UAAService.request(url, {
    method: 'POST',
    body: {
      ...params,
    },
  });
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
