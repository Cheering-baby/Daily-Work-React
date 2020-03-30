import { stringify } from 'qs';
import UAAService from '@/uaa-npm';

const rwsUrl = 'http://10.25.159.236:18091/pams';
export function commissionRuleSetupList(data) {
  return UAAService.request(
    `${rwsUrl}/proxy/ali/b2b/api/v1/agent/commission/template/queryCommissionTplList?${stringify(
      data
    )}`,
    {
      method: 'GET',
    }
  );
}

export function queryCommissionTplDetail(data) {
  return UAAService.request(
    `${rwsUrl}/proxy/ali/b2b/api/v1/agent/commission/template/queryCommissionTplDetail?${stringify(
      data
    )}`,
    {
      method: 'GET',
    }
  );
}

export function queryCommissionBindingList(data) {
  return UAAService.request(
    `${rwsUrl}/proxy/ali/b2b/api/v1/agent/commission/binding/queryCommissionBindingList?${stringify(
      data
    )}`,
    {
      method: 'GET',
    }
  );
}

export function offerList(data) {
  return UAAService.request(
    `${rwsUrl}/proxy/ali/b2b/api/v1/agent/commission/binding/queryCommodityList?${stringify(data)}`,
    {
      method: 'GET',
    }
  );
}
