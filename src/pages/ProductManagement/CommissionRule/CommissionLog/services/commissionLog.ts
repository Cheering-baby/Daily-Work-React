import UAAService from '@/uaa-npm';

const localPath = process.env.NODE_ENV === 'development' ? '' : '';


// eslint-disable-next-line import/prefer-default-export
export async function queryCommissionAuditLogList(params) {
  return UAAService.request(
    `${localPath}/b2b/agent/v1/commission/AuditLog/queryCommissionAuditLogList`,
    {
      method: 'POST',
      body: {
        ...params,
      },
    }
  );
}
