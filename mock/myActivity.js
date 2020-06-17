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

const feeDetail = {
  resultCode: 0,
  resultMsg: 'success',
  result: {
    feeDetailList: {
      commissionType: 'Tiered Commission Verfication',
      amountFee: 0.11,
      befGstFee: '1.12',
      tax: '0.02',
      feeStartDate: '1589876101000',
      feeEndDate: '1753891200000',
      calculationCycle: 'Month',
      reportFile: [
        {
          field: 'taFile',
          name: 'taFile_e5576ffd84934936bb84b99d5a1cdbda_1591241276043_adasda.txt',
          path: 'agent/taFile/202006/',
          sourceName: 'adasda.txt',
        },
      ],
      tieredList: [
        {
          commissionValue: '1',
          createStaff: null,
          createTime: null,
          maxmum: '2',
          minimum: '1',
          status: null,
          statusTime: null,
          tierOrder: 1,
          tieredId: null,
          tplId: '200515171955618383',
        },
        {
          commissionValue: '10',
          createStaff: null,
          createTime: null,
          maxmum: '5',
          minimum: '2',
          status: null,
          statusTime: null,
          tierOrder: 1,
          tieredId: null,
          tplId: '200515171955618300',
        },
      ],
    },
  },
};

const statusApi = 'POST /pams/api/status';
const detail = 'POST /pams/api/statusDetail';
const templateApi = 'POST /pams/api/templateList';
const commissionApi = 'GET /pams/api/v1/agent/commission/activity/queryFeeDetail';
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
  [commissionApi](req, res) {
    res.json(feeDetail);
  },
};
