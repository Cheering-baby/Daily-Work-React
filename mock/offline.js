const offlineList = {
  resultCode: 0,
  resultMsg: 'success',
  result: {
    currentPage: 1,
    pageSize: 5,
    totalSize: 20,
    List: [
      {
        tplId: '1',
        name: 'using',
        type: 'Attendance',
        scheme: '$0.95',
        status: 'ACTIVE',
        source: '',
        createStaff: '',
      },
      {
        tplId: '2',
        name: 'will',
        type: 'Tiered',
        scheme: '$0.95',
        status: 'ACTIVE',
        source: '',
        createStaff: '',
      },
      {
        tplId: '3',
        name: 'using',
        type: 'Attendance',
        scheme: '$1.4',
        status: 'ACTIVE',
        source: '',
        createStaff: '',
      },
      {
        tplId: '4',
        name: 'here',
        type: 'Fixed',
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
const api = 'POST /pams/api/v1/agent/commission/template/queryOfflinelist';

module.exports = {
  [api](req, res) {
    res.json(offlineList);
  },
};
