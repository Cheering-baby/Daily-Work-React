import UAAService from '@/uaa-npm';

const localPath = process.env.NODE_ENV === 'development' ? '' : '';
const mock =
  'http://dev-easymock.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com/mock/5e854bf1f8436f0020822df9/PAMS';

// eslint-disable-next-line import/prefer-default-export
export async function queryCommissionAuditLogList(params) {
  return UAAService.request(
    `${mock}/b2b/agent/v1/commission/AuditLog/queryCommissionAuditLogList`,
    {
      method: 'POST',
      body: {
        ...params,
      },
    }
  );
}
