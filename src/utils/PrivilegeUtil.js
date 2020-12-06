module.exports = {
  PAMS_ADMIN_PRIVILEGE: 'PAMS_ADMIN_PRIVILEGE',
  SALES_LEADER_PRIVILEGE: 'SALES_LEADER_PRIVILEGE',
  SALES_SUPPORT_PRIVILEGE: 'SALES_SUPPORT_PRIVILEGE',
  AR_ACCOUNT_PRIVILEGE: 'AR_ACCOUNT_PRIVILEGE',
  MAIN_TA_ADMIN_PRIVILEGE: 'MAIN_TA_ADMIN_PRIVILEGE',
  SUB_TA_ADMIN_PRIVILEGE: 'SUB_TA_ADMIN_PRIVILEGE',
  CREATE_RWS_USER_PRIVILEGE: 'CREATE_RWS_USER_PRIVILEGE',
  TRAN_ORDER_DETAIL_NO_MASK_PRIVILEGE: 'TRAN_ORDER_DETAIL_NO_MASK_PRIVILEGE',
  TRAN_ORDER_REDRESS_BCINPCC_PRIVILEGE: 'TRAN_ORDER_REDRESS_BCINPCC_PRIVILEGE',
  hasAnyPrivilege: (checkPrivileges = []) => {
    const { appPrivilegeMap = new Map(), pagePrivilegeMap = new Map() } = window.AppGlobal;
    for (const privilege of checkPrivileges) {
      if (appPrivilegeMap.get(privilege) || pagePrivilegeMap.get(privilege)) {
        return true;
      }
    }
    return false;
  },
  hasAllPrivilege: (checkPrivileges = []) => {
    // debugger

    const { appPrivilegeMap = new Map(), pagePrivilegeMap = new Map() } = window.AppGlobal;
    for (const privilege of checkPrivileges) {
      if (!appPrivilegeMap.get(privilege) && !pagePrivilegeMap.get(privilege)) {
        return false;
      }
    }
    return true;
  },
};
