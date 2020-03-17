const systemList = {
  resultCode: 0,
  resultMsg: 'success',
  result: {
    currentPage: 1,
    pageSize: 5,
    totalSize: 100,
    notification: [
      {
        id: '17905',
        subject: 'New activities ',
        content: 'New activities',
        userId: '1',
        state: 'R',
        createTime: 1579225227000,
        modifyTime: 1579332953000,
      },
      {
        id: '17906',
        subject: 'New activities ',
        content: 'New activities',
        userId: '2',
        state: 'R',
        createTime: 1579225227000,
        modifyTime: 1579332953000,
      },
      {
        id: '17907',
        subject: 'New activities',
        content: 'New activities',
        userId: '3',
        state: 'R',
        createTime: 1579225227000,
        modifyTime: 1579225227000,
      },
      {
        id: '17908',
        subject: 'New activities',
        content: 'New activities',
        userId: '4',
        state: 'R',
        createTime: 1579225227000,
        modifyTime: 1579225227000,
      },
      {
        id: '17909',
        subject: 'New activities',
        content: 'New activities',
        userId: '5',
        state: 'R',
        createTime: 1579225227000,
        modifyTime: 1579225227000,
      },
      {
        id: '17900',
        subject: 'New activities',
        content: 'New activities',
        userId: '6',
        state: 'R',
        createTime: 1579225227000,
        modifyTime: 1579225227000,
      },
    ],
  },
};

const pendingApprovalList = {
  resultCode: 0,
  resultMsg: 'success',
  result: {
    currentPage: 1,
    pageSize: 5,
    totalSize: 100,
    notification: [
      {
        id: '17905',
        subject: 'New activities ',
        content: 'New activities',
        userId: '1',
        state: 'R',
        createTime: 1579225227000,
        modifyTime: 1579332953000,
      },
      {
        id: '17906',
        subject: 'New activities ',
        content: 'New activities',
        userId: '2',
        state: 'R',
        createTime: 1579225227000,
        modifyTime: 1579332953000,
      },
      {
        id: '17907',
        subject: 'New activities',
        content: 'New activities',
        userId: '3',
        state: 'R',
        createTime: 1579225227000,
        modifyTime: 1579225227000,
      },
      {
        id: '17908',
        subject: 'New activities',
        content: 'New activities',
        userId: '4',
        state: 'R',
        createTime: 1579225227000,
        modifyTime: 1579225227000,
      },
      {
        id: '17909',
        subject: 'New activities',
        content: 'New activities',
        userId: '5',
        state: 'R',
        createTime: 1579225227000,
        modifyTime: 1579225227000,
      },
      {
        id: '17900',
        subject: 'New activities',
        content: 'New activities',
        userId: '6',
        state: 'R',
        createTime: 1579225227000,
        modifyTime: 1579225227000,
      },
    ],
  },
};

const templateApi = 'POST /pams/api/notification';
const pendingApprovalApi = 'POST /pams/api/pendingApproval';
module.exports = {
  [templateApi](req, res) {
    res.json(systemList);
  },
  [pendingApprovalApi](req, res) {
    res.json(pendingApprovalList);
  },
};
