import UAAService from '@/uaa-npm';

/* eslint-disable */

export async function queryInvitationRecordList(params) {
  return UAAService.request(`/proxy/ali/pams/profile/queryInvitationRecord`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function sendInvitation(params) {
  return UAAService.request(`/proxy/ali/pams/subprofile/sendInvitation`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
