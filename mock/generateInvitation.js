export default {
  'GET /pams/profile/queryInvitationRecord': (req, res) => {
    const pageInfo = JSON.parse(req.query.pageInfo);
    if (String(pageInfo.currentPage) === '1') {
      res.send({
        resultCode: '0',
        resultMsg: 'success',
        result: {
          invitationList: [
            {
              number: '1',
              email: 'mason.bogan@126.com',
              invitationDate: '20191005',
              statusName: 'SUCCESS',
            },
            {
              number: '2',
              email: 'mason.bogan@126.com',
              invitationDate: '20191005',
              statusName: 'SUCCESS',
            },
            {
              number: '3',
              email: 'mason.bogan@126.com',
              invitationDate: '20191005',
              statusName: 'SUCCESS',
            },
            {
              number: '4',
              email: 'mason.bogan@126.com',
              invitationDate: '20191005',
              statusName: 'SUCCESS',
            },
            {
              number: '5',
              email: 'mason.bogan@126.com',
              invitationDate: '20191005',
              statusName: 'SUCCESS',
            },
            {
              number: '6',
              email: 'mason.bogan@126.com',
              invitationDate: '20191005',
              statusName: 'SUCCESS',
            },
            {
              number: '7',
              email: 'mason.bogan@126.com',
              invitationDate: '20191005',
              statusName: 'SUCCESS',
            },
            {
              number: '8',
              email: 'mason.bogan@126.com',
              invitationDate: '20191005',
              statusName: 'SUCCESS',
            },
            {
              number: '9',
              email: 'mason.bogan@126.com',
              invitationDate: '20191005',
              statusName: 'SUCCESS',
            },
            {
              number: '10',
              email: 'mason.bogan@126.com',
              invitationDate: '20191005',
              statusName: 'FAIL',
            },
          ],
          pageInfo: {
            totalSize: '12',
            currentPage: '1',
            pageSize: '10',
          },
        },
      });
    } else if (String(pageInfo.currentPage) === '2') {
      res.send({
        resultCode: '0',
        resultMsg: 'success',
        result: {
          invitationList: [
            {
              number: '11',
              email: 'mason.bogan@126.com',
              invitationDate: '20191005',
              statusName: 'SUCCESS',
            },
            {
              number: '12',
              email: 'mason.bogan@126.com',
              invitationDate: '20191005',
              statusName: 'SUCCESS',
            },
          ],
          pageInfo: {
            totalSize: '12',
            currentPage: '2',
            pageSize: '10',
          },
        },
      });
    } else {
      res.send({
        resultCode: '0',
        resultMsg: 'success',
        result: {
          contractList: [],
          pageInfo: {
            totalSize: '0',
            currentPage: '1',
            pageSize: '10',
          },
        },
      });
    }
  },
};
