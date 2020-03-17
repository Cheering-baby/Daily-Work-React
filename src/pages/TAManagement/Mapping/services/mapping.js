import { stringify } from 'qs';
import UAAService from '@/uaa-npm';

export async function mappingList(pagination) {
  return UAAService.request(
    `/proxy/ali/b2b/profile/queryMappingList?pageInfo.pageSize=${pagination.pageSize}&pageInfo.currentPage=${pagination.currentPage}`,
    {
      method: 'GET',
    }
  );
}

export async function like(filter, pagination) {
  const paramstring = stringify({
    'pageInfo.pageSize': pagination.pageSize,
    'pageInfo.currentPage': pagination.currentPage,
    'pageInfo.idOrName': pagination.idOrName,
    'pageInfo.applicationBeginDate': pagination.applicationBeginDate,
    'pageInfo.applicationEndDate': pagination.applicationEndDate,
    'pageInfo.status': pagination.status,
  });
  const url = `/proxy/ali/b2b/profile/queryMappingList?${paramstring}`;
  return UAAService.request(url, {
    method: 'GET',
  });
}

export async function queryDictionary(params) {
  return UAAService.request(
    `/common/queryDictionary?dictType=${params.dictType}&dictSubType=${params.dictSubType}`,
    {
      method: 'GET',
    }
  );
}

export async function queryMappingDetail(taId) {
  return UAAService.request(`/proxy/ali/b2b/profile/queryMappingInfo?taId=${taId}`, {
    method: 'GET',
  });
}

export async function endInvitation(params) {
  return UAAService.request(`/proxy/ali/b2b/profile/registerMappingInfo`, {
    method: 'POST',
    body: { params },
  });
}

export async function registerMappingInfo() {
  return UAAService.request(`/profile/registerMappingInfo`, {
    method: 'POST',
    body: {},
  });
}
