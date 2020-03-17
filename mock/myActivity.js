const myActivityResult = {
  resultCode: 0,
  resultMsg: 'success',
  gRMemberNoList: {
    currentPage: 1,
    pageSize: 5,
    totalSize: 20,
    approvalList: [
      {
        No: '01',
        agentID: '',
        companyName: 'Singapore Tourism Limited…',
        eMail: 'mason.bogan@126.com',
        applicationDate: '20190531150433201',
        status: 'PENDING OPERATION',
        operation: 'DOWNLOAD',
      },
      {
        No: '02',
        agentID: '',
        companyName: 'Singapore Tourism Limited…',
        eMail: 'mason.bogan@126.com',
        applicationDate: '20190531150433201',
        status: 'PENDING OPERATION',
        operation: 'USER',
      },
      {
        No: '03',
        agentID: '',
        companyName: 'Singapore Tourism Limited…',
        eMail: 'mason.bogan@126.com',
        applicationDate: '20190531150433201',
        status: 'PENDING OPERATION',
        operation: 'BLOCK',
      },
      {
        No: '04',
        agentID: '',
        companyName: 'Singapore Tourism Limited…',
        eMail: 'mason.bogan@126.com',
        applicationDate: '20190531150433201',
        status: 'PENDING OPERATION',
        operation: 'AUDIT',
      },
      {
        No: '05',
        agentID: '1234',
        companyName: 'Singapore Tourism Limited…',
        eMail: 'mason.bogan@126.com',
        applicationDate: '20190531150433201',
        status: 'COMPLETE',
        operation: '',
      },
      {
        No: '06',
        agentID: '6789',
        companyName: 'Singapore Tourism Limited…',
        eMail: 'mason.bogan@126.com',
        applicationDate: '20190531150433201',
        status: 'REJECTED',
        operation: '',
      },
    ],
  },
};
const api = 'POST /pams/api/myActivity';

const statusList = {
  resultCode: '00',
  resultMsg: 'success',
  result: {
    pageInfo: {
      currentPage: 1,
      pageSize: 5,
      totalSize: 20,
    },
    activityDictList: [
      {
        code: '00',
        value: 'Complete',
      },
      {
        code: '01',
        value: 'Rejected',
      },
      {
        code: '02',
        value: 'Pending Approval',
      },

      {
        code: '03',
        value: 'Pending Others Approval',
      },
    ],
  },
};

const templateList = {
  resultCode: '00',
  resultMsg: 'success',
  result: {
    pageInfo: {
      currentPage: 1,
      pageSize: 5,
      totalSize: 20,
    },
    templateList: [
      {
        id: '1',
        templateCode: 'TA-SIGN-UP',
        templateName: 'TA Sign Up',
      },
      {
        id: '2',
        templateCode: 'USER-SIGN-UP',
        templateName: 'User Sign Up',
      },
      {
        id: '3',
        templateCode: 'SUB-TA-SIGN-UP',
        templateName: 'Sub TA Sign Up',
      },
    ],
  },
};

const statusDetail = id => {
  let status = [
    {
      status: '00',
      statusName: 'Complete',
    },
    {
      id: '01',
      status: 'Rejected',
    },
    {
      id: '02',
      status: 'Pending Approval',
    },

    {
      id: '03',
      status: 'Pending Others Approval',
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

const statusApi = 'POST /pams/api/status';
const detail = 'POST /pams/api/statusDetail';
const templateApi = 'POST /pams/api/templateList';
module.exports = {
  [api](req, res) {
    res.json({ list: myActivityResult });
  },
  [statusApi](req, res) {
    res.json(statusList);
  },
  [templateApi](req, res) {
    res.json(templateList);
  },
  [detail](req, res) {
    res.json(statusDetail(req.body.id));
  },
};
