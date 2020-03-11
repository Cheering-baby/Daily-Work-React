const commissionRuleSetupList = {
  resultCode: 0,
  resultMsg: 'success',
  result: {
    currentPage: 1,
    pageSize: 5,
    totalSize: 20,
    commissionRuleSetupList: [
      {
        tplId: '1',
        name: 'using Lorem Ipsum is that',
        type: 'Attendance',
        scheme: '$0.95',
        status: 'ACTIVE',
        source: '',
        createStaff: '',
      },
      {
        tplId: '2',
        name: 'will be distracted by the ',
        type: 'Tiered',
        scheme: 'Singapore Tourism Limited…',
        status: 'ACTIVE',
        source: '',
        createStaff: '',
      },
      {
        tplId: '3',
        name: 'using Lorem Ipsum is that',
        type: 'Attendance',
        scheme: '$1.4',
        status: 'ACTIVE',
        source: '',
        createStaff: '',
      },
      {
        tplId: '4',
        name: 'here',
        type: 'Tiered',
        scheme: '$1.4',
        status: 'ACTIVE',
        source: '',
        createStaff: '',
      },
      {
        tplId: '5',
        name: 'product',
        type: 'Tiered',
        scheme: '$1.5',
        status: 'INACTIVE',
        source: '',
        createStaff: '',
      },
      {
        tplId: '5',
        name: 'long',
        type: 'Tiered',
        scheme: '$2',
        status: 'INACTIVE',
        source: '',
        createStaff: '',
      },
    ],
  },
};
const api = 'POST /pams/api/v1/agent/commission/template/queryCommissionlist';

const tieredCommissionRule = {
  resultCode: 0,
  resultMsg: 'success',
  list: {
    tieredCommissionRuleList: [
      {
        tieredCommissionTier: '3000~4000',
        commissionScheme: '$0.95',
        operation: '',
      },
      {
        tieredCommissionTier: '5000~5566',
        commissionScheme: 'Singapore Tourism Limited…',
        operation: '',
      },
      {
        tieredCommissionTier: '5000~30000',
        commissionScheme: '$1.4',
        operation: '',
      },
    ],
  },
};
const tiered = 'POST /pams/api/tieredCommissionRule';

module.exports = {
  [api](req, res) {
    res.json(commissionRuleSetupList);
  },
  [tiered](req, res) {
    res.json(tieredCommissionRule);
  },
};
