import { stringify } from 'qs';
import UAAService from '@/uaa-npm';

const mock = 'http://dev-easymock.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com/mock/5e854bf1f8436f0020822df9/PAMS'

export function commissionRuleSetupList(data) {
  return UAAService.request(
    `/b2b/agent/v1/commission/template/queryCommissionTplList?${stringify(data)}`,
    {
      method: 'GET',
    }
  );
}

const localPath = process.env.NODE_ENV === 'development' ? '' : '';
export async function queryPluAttribute(params) {
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

export function queryCommissionTplDetail(data) {
  return UAAService.request(
    `/b2b/agent/v1/commission/template/queryCommissionTplDetail?${stringify(data)}`,
    {
      method: 'GET',
    }
  );
}

export function queryCommissionBindingList(data) {
  return UAAService.request(
    `/b2b/agent/v1/commission/binding/queryCommissionBindingList?${stringify(data)}`,
    {
      method: 'GET',
    }
  );
}

export function offerList(data) {
  return UAAService.request(
    `/b2b/agent/v1/commission/binding/queryCommodityList?${stringify(data)}`,
    {
      method: 'GET',
    }
  );
}

export async function grant(params) {
  const url = `/b2b/agent/v1/commission/binding/saveCommissionBindingList`;
  return UAAService.request(url, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function edit(params) {
  const url = `/b2b/agent/v1/commission/template/saveCommissionTpl`;
  return UAAService.request(url, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function add(params) {
  return UAAService.request(`/b2b/agent/v1/commission/template/saveCommissionTpl`, {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return UAAService.request(`/b2b/agent/v1/commission/template/trashCommissionTpl`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryAgentOfferBindingList(params) {
  return UAAService.request(`/b2b/agent/v1/commission/binding/queryAgentOfferBindingList`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
