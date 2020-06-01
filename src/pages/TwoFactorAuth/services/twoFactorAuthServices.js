import UAAService from '@/uaa-npm';

export async function generateCode() {
  return UAAService.requestByRT(`/v1/validateCode`, {
    method: 'GET',
  });
}

export async function validateCode(code) {
  return UAAService.requestByRT(`/v1/validateCode?code=${code}`, {
    method: 'GET',
  });
}
