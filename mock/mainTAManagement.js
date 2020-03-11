export default {
  'GET /pams/profile/queryTaList': (req, res) => {
    const pageInfo = JSON.parse(req.query.pageInfo);
    if (String(pageInfo.currentPage) === '1') {
      res.send({
        resultCode: '0',
        resultMsg: 'success',
        result: {
          taList: [
            {
              number: '1',
              taId: '6',
              companyName: 'Clippinger Chevrolet Oldsmobile',
              peoplesoftEwalletId: '215243r5234r5234',
              peoplesoftArAccountId: '154142353245234',
              effectiveDate: '20191005',
              statusName: 'ACTIVE',
            },
            {
              number: '2',
              taId: '7',
              companyName: 'Clippinger Chevrolet Oldsmobile',
              peoplesoftEwalletId: '215243r5234r5234',
              peoplesoftArAccountId: '154142353245234',
              effectiveDate: '20191005',
              statusName: 'ACTIVE',
            },
            {
              number: '3',
              taId: '1111113',
              companyName: 'Clippinger Chevrolet Oldsmobile',
              peoplesoftEwalletId: '215243r5234r5234',
              peoplesoftArAccountId: '154142353245234',
              effectiveDate: '20191005',
              statusName: 'ACTIVE',
            },
            {
              number: '4',
              taId: '1111114',
              companyName: 'Clippinger Chevrolet Oldsmobile',
              peoplesoftEwalletId: '215243r5234r5234',
              peoplesoftArAccountId: '154142353245234',
              effectiveDate: '20191005',
              statusName: 'ACTIVE',
            },
            {
              number: '5',
              taId: '1111115',
              companyName: 'Clippinger Chevrolet Oldsmobile',
              peoplesoftEwalletId: '215243r5234r5234',
              peoplesoftArAccountId: '154142353245234',
              effectiveDate: '20191005',
              statusName: 'ACTIVE',
            },
            {
              number: '6',
              taId: '1111116',
              companyName: 'Clippinger Chevrolet Oldsmobile',
              peoplesoftEwalletId: '215243r5234r5234',
              peoplesoftArAccountId: '154142353245234',
              effectiveDate: '20191005',
              statusName: 'ACTIVE',
            },
            {
              number: '7',
              taId: '1111117',
              companyName: 'Clippinger Chevrolet Oldsmobile',
              peoplesoftEwalletId: '215243r5234r5234',
              peoplesoftArAccountId: '154142353245234',
              effectiveDate: '20191005',
              statusName: 'ACTIVE',
            },
            {
              number: '8',
              taId: '1111118',
              companyName: 'Clippinger Chevrolet Oldsmobile',
              peoplesoftEwalletId: '215243r5234r5234',
              peoplesoftArAccountId: '154142353245234',
              effectiveDate: '20191005',
              statusName: 'ACTIVE',
            },
            {
              number: '9',
              taId: '1111119',
              companyName: 'Clippinger Chevrolet Oldsmobile',
              peoplesoftEwalletId: '215243r5234r5234',
              peoplesoftArAccountId: '154142353245234',
              effectiveDate: '20191005',
              statusName: 'INACTIVE',
            },
            {
              number: '10',
              taId: '1111120',
              companyName: 'Clippinger Chevrolet Oldsmobile',
              peoplesoftEwalletId: '215243r5234r5234',
              peoplesoftArAccountId: '154142353245234',
              effectiveDate: '20191005',
              statusName: 'INACTIVE',
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
          taList: [
            {
              number: '11',
              taId: '1111121',
              companyName: 'Clippinger Chevrolet Oldsmobile',
              peoplesoftEwalletId: '215243r5234r5234',
              peoplesoftArAccountId: '154142353245234',
              effectiveDate: '20191005',
              statusName: 'INACTIVE',
            },
            {
              number: '12',
              taId: '1111122',
              companyName: 'Clippinger Chevrolet Oldsmobile',
              peoplesoftEwalletId: '215243r5234r5234',
              peoplesoftArAccountId: '154142353245234',
              effectiveDate: '20191005',
              statusName: 'INACTIVE',
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
          taList: [],
          pageInfo: {
            totalSize: '0',
            currentPage: '1',
            pageSize: '10',
          },
        },
      });
    }
  },
  'GET /pams/contract/queryContractHistoryList': (req, res) => {
    const pageInfo = JSON.parse(req.query.pageInfo);
    if (String(pageInfo.currentPage) === '1') {
      res.send({
        resultCode: '0',
        resultMsg: 'success',
        result: {
          contractList: [
            {
              number: '1',
              uploadedBy: 'Gay Upton',
              uploadedTime: '20191005',
              fileList: [
                {
                  name: 'taFile_f2113087ec1148089b8efd59741c3664_1581520642021_certificate.p12',
                  path:
                    'agent/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/',
                  sourceName: '12312321321qweqweqw312312312certificate.p12',
                },
                {
                  name: 'taFile_f2113087ec1148089b8efd59741c3664_1581520642021_certificate.p12',
                  path:
                    'agent/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/',
                  sourceName: '12312321321312312312certificate.p12',
                },
              ],
            },
            {
              number: '2',
              uploadedBy: 'Gay Upton',
              uploadedTime: '20191005',
              fileList: [
                {
                  name: 'taFile_f2113087ec1148089b8efd59741c3664_1581520642021_certificate.p12',
                  path:
                    'agent/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/',
                  sourceName: '12312321321qweqweqw312312312certificate.p12',
                },
                {
                  name: 'taFile_f2113087ec1148089b8efd59741c3664_1581520642021_certificate.p12',
                  path:
                    'agent/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/',
                  sourceName: '12312321321312312312certificate.p12',
                },
              ],
            },
            {
              number: '3',
              uploadedBy: 'Gay Upton',
              uploadedTime: '20191005',
              fileList: [
                {
                  name: 'taFile_f2113087ec1148089b8efd59741c3664_1581520642021_certificate.p12',
                  path:
                    'agent/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/',
                  sourceName: '12312321321qweqweqw312312312certificate.p12',
                },
              ],
            },
            {
              number: '4',
              uploadedBy: 'Gay Upton',
              uploadedTime: '20191005',
              fileList: [
                {
                  name: 'taFile_f2113087ec1148089b8efd59741c3664_1581520642021_certificate.p12',
                  path:
                    'agent/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/',
                  sourceName: '12312321321qweqweqw312312312certificate.p12',
                },
              ],
            },
            {
              number: '5',
              uploadedBy: 'Gay Upton',
              uploadedTime: '20191005',
              fileList: [
                {
                  name: 'taFile_f2113087ec1148089b8efd59741c3664_1581520642021_certificate.p12',
                  path:
                    'agent/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/',
                  sourceName: '12312321321qweqweqw312312312certificate.p12',
                },
              ],
            },
            {
              number: '6',
              uploadedBy: 'Gay Upton',
              uploadedTime: '20191005',
              fileList: [
                {
                  name: 'taFile_f2113087ec1148089b8efd59741c3664_1581520642021_certificate.p12',
                  path:
                    'agent/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/',
                  sourceName: '12312321321qweqweqw312312312certificate.p12',
                },
              ],
            },
            {
              number: '7',
              uploadedBy: 'Gay Upton',
              uploadedTime: '20191005',
              fileList: [
                {
                  name: 'taFile_f2113087ec1148089b8efd59741c3664_1581520642021_certificate.p12',
                  path:
                    'agent/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/',
                  sourceName: '12312321321qweqweqw312312312certificate.p12',
                },
              ],
            },
            {
              number: '8',
              uploadedBy: 'Gay Upton',
              uploadedTime: '20191005',
              fileList: [
                {
                  name: 'taFile_f2113087ec1148089b8efd59741c3664_1581520642021_certificate.p12',
                  path:
                    'agent/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/',
                  sourceName: '12312321321qweqweqw312312312certificate.p12',
                },
              ],
            },
            {
              number: '9',
              uploadedBy: 'Gay Upton',
              uploadedTime: '20191005',
              fileList: [
                {
                  name: 'taFile_f2113087ec1148089b8efd59741c3664_1581520642021_certificate.p12',
                  path:
                    'agent/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/',
                  sourceName: '12312321321qweqweqw312312312certificate.p12',
                },
              ],
            },
            {
              number: '10',
              uploadedBy: 'Gay Upton',
              uploadedTime: '20191005',
              fileList: [
                {
                  name: 'taFile_f2113087ec1148089b8efd59741c3664_1581520642021_certificate.p12',
                  path:
                    'agent/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/',
                  sourceName: '12312321321qweqweqw312312312certificate.p12',
                },
              ],
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
          contractList: [
            {
              number: '11',
              uploadedBy: 'Gay Upton',
              uploadedTime: '20191005',
              fileList: [
                {
                  name: 'taFile_f2113087ec1148089b8efd59741c3664_1581520642021_certificate.p12',
                  path:
                    'agent/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/',
                  sourceName: '12312321321qweqweqw312312312certificate.p12',
                },
                {
                  name: 'taFile_f2113087ec1148089b8efd59741c3664_1581520642021_certificate.p12',
                  path:
                    'agent/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/',
                  sourceName: '12312321321312312312certificate.p12',
                },
              ],
            },
            {
              number: '12',
              uploadedBy: 'Gay Upton',
              uploadedTime: '20191005',
              fileList: [
                {
                  name: 'taFile_f2113087ec1148089b8efd59741c3664_1581520642021_certificate.p12',
                  path:
                    'agent/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/',
                  sourceName: '12312321321qweqweqw312312312certificate.p12',
                },
              ],
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
  'GET /pams/profile/queryProfileStatusHistory': (req, res) => {
    const pageInfo = JSON.parse(req.query.pageInfo);
    if (String(pageInfo.currentPage) === '1') {
      res.send({
        resultCode: '0',
        resultMsg: 'success',
        result: {
          historyList: [
            {
              number: '1',
              uploadedBy: 'Gay Upton',
              uploadedTime: '20191005',
              statusBefore: 'ACTIVE',
              statusAfter: 'INACTIVE',
            },
            {
              number: '2',
              uploadedBy: 'Gay Upton',
              uploadedTime: '20191005',
              statusBefore: 'ACTIVE',
              statusAfter: 'INACTIVE',
            },
            {
              number: '3',
              uploadedBy: 'Gay Upton',
              uploadedTime: '20191005',
              statusBefore: 'ACTIVE',
              statusAfter: 'INACTIVE',
            },
            {
              number: '4',
              uploadedBy: 'Gay Upton',
              uploadedTime: '20191005',
              statusBefore: 'ACTIVE',
              statusAfter: 'INACTIVE',
            },
            {
              number: '5',
              uploadedBy: 'Gay Upton',
              uploadedTime: '20191005',
              statusBefore: 'ACTIVE',
              statusAfter: 'INACTIVE',
            },
            {
              number: '6',
              uploadedBy: 'Gay Upton',
              uploadedTime: '20191005',
              statusBefore: 'ACTIVE',
              statusAfter: 'INACTIVE',
            },
            {
              number: '7',
              uploadedBy: 'Gay Upton',
              uploadedTime: '20191005',
              statusBefore: 'ACTIVE',
              statusAfter: 'INACTIVE',
            },
            {
              number: '8',
              uploadedBy: 'Gay Upton',
              uploadedTime: '20191005',
              statusBefore: 'ACTIVE',
              statusAfter: 'INACTIVE',
            },
            {
              number: '9',
              uploadedBy: 'Gay Upton',
              uploadedTime: '20191005',
              statusBefore: 'ACTIVE',
              statusAfter: 'INACTIVE',
            },
            {
              number: '10',
              uploadedBy: 'Gay Upton',
              uploadedTime: '20191005',
              statusBefore: 'ACTIVE',
              statusAfter: 'INACTIVE',
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
          historyList: [
            {
              number: '11',
              uploadedBy: 'Gay Upton',
              uploadedTime: '20191005',
              statusBefore: 'ACTIVE',
              statusAfter: 'INACTIVE',
            },
            {
              number: '12',
              uploadedBy: 'Gay Upton',
              uploadedTime: '20191005',
              statusBefore: 'ACTIVE',
              statusAfter: 'INACTIVE',
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
