module.exports = {
  MAIN_TA_PRIVILEGE: 'ORG_MGR_MAIN_TA_ADMIN',
  SUB_TA_PRIVILEGE: 'ORG_MGR_SUB_TA_ADMIN',
  SALES_SUPPORT_PRIVILEGE: 'ORG_MGR_SALES_SUPPORT',
  RWS_ORG_TYPES: [{ key: '01', value: '01', text: 'TA Org' }],
  TA_ORG_TYPES: [
    { key: '02', value: '02', text: 'Sub TA' },
    { key: '03', value: '03', text: 'Normal Org' },
  ],
  SUB_TA_ORG_TYPES: [{ key: '03', value: '03', text: 'Normal Org' }],
  ORG_TYPE_MAP: new Map([
    ['00', 'Root'],
    ['01', 'TA Org'],
    ['02', 'Sub TA Org'],
    ['03', 'Normal ORG'],
  ]),
  RWS_ORG_CODE: 'RWS',
  RWS_USER_TYPE: '01',
  TA_USER_TYPE: '02',
  SUB_TA_USER_TYPE: '03',
};
