import { stringify } from 'qs';
import UAAService from '@/uaa-npm';

export async function page(pagination) {
  return UAAService.request(`/log/page?${stringify(pagination)}`, {
    method: 'GET',
  });
}

export async function search(values, pagination) {
  return UAAService.request(`/log/conditionSearch?${stringify(pagination)}`, {
    method: 'POST',
    body: values,
  });
}

export async function queryLogType() {
  return UAAService.request(`/log/queryLogType`, {
    method: 'GET',
  });
}
