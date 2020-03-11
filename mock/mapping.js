const mappingList = {
  resultCode: 0,
  resultMsg: 'success',
  resultList: {
    currentPage: 1,
    pageSize: 5,
    totalSize: 20,
    mappingList: [
      {
        No: '01',
        agentID: '1234',
        companyName: 'Singapore Tourism Limited…',
        GST: 'mason.bogan@126.com',
        effectiveDate: '20190531150433201',
        AR: '10000',
        eWallet: '2000',
        status: 'PENDING OPERATION',
        operation: 'DOWNLOAD',
      },
      {
        No: '02',
        agentID: '1234',
        companyName: 'Singapore Tourism Limited…',
        GST: 'mason.bogan@126.com',
        effectiveDate: '20190531150433201',
        AR: '10000',
        eWallet: '2000',
        status: 'FAIL',
        operation: 'DOWNLOAD',
      },
      {
        No: '01',
        agentID: '1234',
        companyName: 'Singapore Tourism Limited…',
        GST: 'mason.bogan@126.com',
        effectiveDate: '20190531150433201',
        AR: '10000',
        eWallet: '2000',
        status: 'SUCCESS',
        operation: 'DOWNLOAD',
      },
    ],
  },
};
const map = 'POST /pams/api/mapping';

const statusDetail = id => {
  let status = [
    {
      id: '01',
      status: 'pending',
    },
    {
      id: '02',
      status: 'fail',
    },
    {
      id: '03',
      status: 'success',
    },
  ];
  status = status.filter(item => item.id === id);
  return {
    resultCode: 0,
    resultMsg: 'success',
    list: {
      status: status[0] || null,
    },
  };
};
const detail = 'POST /pams/api/mappingDetail';
module.exports = {
  [map](req, res) {
    res.json({ list: mappingList });
  },
  [detail](req, res) {
    res.json(statusDetail(req.body.id));
  },
};
