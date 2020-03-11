import UAAService from '@/uaa-npm';

export default async function queryError(code) {
  return UAAService.request(`/api/${code}`);
}
