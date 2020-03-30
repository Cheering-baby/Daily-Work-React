import UAAService from '@/uaa-npm';

/* eslint-disable */

export async function queryInvitationRecordList(params) {
  return UAAService.request(`/b2b/agent/v1/subprofile/queryInvitationRecord`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function sendInvitation(params) {
  return UAAService.request(`/b2b/agent/v1/subprofile/sendInvitation`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function generateContent(params) {
  return UAAService.request(`/b2b/user/v1/email/generateContent`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
