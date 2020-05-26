import React from 'react';
import { Button, Card, Icon, Modal, Table, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from '../index.less';
import constants from '../constants';
import PrivilegeUtil from '../../../../utils/PrivilegeUtil';

@connect(({ orgMgr, global, loading }) => ({
  orgMgr,
  global,
  loadUserInOrg: loading.effects['orgMgr/queryUsersInOrg'],
}))
class OrgInformation extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [
      {
        title: this.showTableTitle(formatMessage({ id: 'NO' })),
        key: 'code',
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'SUB_ORG_NAME' })),
        dataIndex: 'orgName',
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'ORG_TYPE' })),
        dataIndex: 'orgType',
        render: text => {
          return constants.ORG_TYPE_MAP.get(text);
        },
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'OPERATION' })),
        render: (text, record) => {
          const { isFirst = false, isLast = false } = record;
          return (
            <React.Fragment>
              {isFirst ? (
                <Icon type="to-top" className={styles.iconDisabled} />
              ) : (
                <Tooltip placement="top" title={formatMessage({ id: 'MOVE_UP' })}>
                  <Icon type="to-top" onClick={e => this.goMoveUp(e, record)} />
                </Tooltip>
              )}
              {isLast ? (
                <Icon type="vertical-align-bottom" className={styles.iconDisabled} />
              ) : (
                <Tooltip placement="top" title={formatMessage({ id: 'MOVE_DOWN' })}>
                  <Icon type="vertical-align-bottom" onClick={e => this.goMoveDown(e, record)} />
                </Tooltip>
              )}
              <Tooltip placement="top" title={formatMessage({ id: 'REMOVE' })}>
                <Icon
                  type="delete"
                  onClick={() => {
                    this.removeOrg(record);
                  }}
                />
              </Tooltip>
            </React.Fragment>
          );
        },
      },
    ];

    this.memberColumns = [
      {
        title: this.showTableTitle(formatMessage({ id: 'NO' })),
        key: 'seq',
        dataIndex: 'seq',
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'FULL_NAME' })),
        render: (text, record) => {
          let { rwsInfo = {}, taInfo = {} } = record;
          const { userType } = record;
          rwsInfo = rwsInfo || {};
          taInfo = taInfo || {};
          if (userType === '01') {
            const { surName = '', givenName = '' } = rwsInfo;
            return `${surName} ${givenName}`;
          }
          const { fullName = '' } = taInfo;
          return fullName;
        },
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'USER_LOGIN' })),
        dataIndex: 'userCode',
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'OPERATION' })),
        key: 'id',
        render: (text, record) => {
          return (
            <div>
              <Tooltip title={formatMessage({ id: 'REMOVE' })}>
                <Icon
                  type="delete"
                  onClick={() => {
                    this.removeMember(record);
                  }}
                />
              </Tooltip>
            </div>
          );
        },
      },
    ];
  }

  removeOrg = item => {
    Modal.confirm({
      title: formatMessage({ id: 'ORG_DEL_CONFIRM' }),
      okText: formatMessage({ id: 'COMMON_YES' }),
      cancelText: formatMessage({ id: 'COMMON_NO' }),
      icon: <Icon type="info-circle" style={{ backgroundColor: '#faad14' }} />,
      onOk: () => {
        const {
          orgMgr: {
            selectedOrg: { code: parentOrgCode = '', orgType: parentOrgType = '' },
          },
        } = this.props;
        const { code = '', orgType = '' } = item;

        if (parentOrgType === '01' && orgType === '02') {
          this.removeSubTARelation(parentOrgCode, code);
        } else {
          this.removeUserOrg(code);
        }
      },
    });
  };

  removeSubTARelation = (taOrgCode, subTaOrgCode) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgMgr/removeSubTARelation',
      payload: {
        taOrgCode,
        subTaOrgCode,
      },
    }).then(result => {
      if (result) {
        this.queryUserOrgTree();
      }
    });
  };

  removeUserOrg = code => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgMgr/removeUserOrg',
      payload: {
        code,
      },
    }).then(result => {
      if (result) {
        this.queryUserOrgTree();
      }
    });
  };

  queryUserOrgTree = () => {
    const {
      dispatch,
      global: { currentUser = {}, userCompanyInfo = {} },
    } = this.props;
    const { userType = '' } = currentUser;
    let payload;
    if (userType === '01') {
      payload = {
        orgCode: constants.RWS_ORG_CODE,
      };
    } else {
      const { companyId, companyType } = userCompanyInfo;
      payload = {
        companyId,
        companyType,
      };
    }
    dispatch({
      type: 'orgMgr/queryUserOrgTree',
      payload,
    });
  };

  goMoveUp = (e, item) => {
    e.preventDefault();
    const {
      dispatch,
      global: { currentUser = {}, userCompanyInfo = {} },
      orgMgr: {
        selectedOrg: { code: parentOrgCode = '' },
      },
    } = this.props;
    const { code: orgCode = '' } = item;
    dispatch({
      type: 'orgMgr/operateMoveUpOrg',
      payload: {
        orgCode,
        parentOrgCode,
      },
    }).then(result => {
      if (result) {
        const { userType = '' } = currentUser;
        let payload = {};
        if (userType === '01') {
          payload = {
            orgCode: constants.RWS_ORG_CODE,
          };
        } else {
          const { companyId, companyType } = userCompanyInfo;
          payload = {
            companyId,
            companyType,
          };
        }
        dispatch({
          type: 'orgMgr/queryUserOrgTree',
          payload,
        });
      }
    });
  };

  goMoveDown = (e, item) => {
    e.preventDefault();
    const {
      dispatch,
      global: { currentUser = {}, userCompanyInfo = {} },
      orgMgr: {
        selectedOrg: { code: parentOrgCode = '' },
      },
    } = this.props;
    const { code: orgCode = '' } = item;
    dispatch({
      type: 'orgMgr/operateMoveDownOrg',
      payload: {
        orgCode,
        parentOrgCode,
      },
    }).then(result => {
      if (result) {
        const { userType = '' } = currentUser;
        let payload = {};
        if (userType === '01') {
          payload = {
            orgCode: constants.RWS_ORG_CODE,
          };
        } else {
          const { companyId, companyType } = userCompanyInfo;
          payload = {
            companyId,
            companyType,
          };
        }
        dispatch({
          type: 'orgMgr/queryUserOrgTree',
          payload,
        });
      }
    });
  };

  showTableTitle = value => <span className={styles.tableTitle}>{value}</span>;

  getExtra = () => {
    return (
      <Button type="link" style={{ visibility: 'hidden' }}>
        {formatMessage({ id: 'ADD_BTN_TEXT' })}
      </Button>
    );
  };

  addOrgBtnClick = e => {
    const {
      orgMgr: { selectedOrg = {} },
    } = this.props;
    const { code = '' } = selectedOrg;
    if (code === constants.RWS_ORG_CODE) {
      this.showOperDrawer(e, 'ADD_TA_COMPANY');
    } else {
      this.showOperDrawer(e, 'ADD_USER_ORG');
    }
  };

  showOperDrawer = (e, type = 'ADD_USER_ORG') => {
    e.preventDefault();
    const {
      dispatch,
      orgMgr: { selectedOrg = {} },
    } = this.props;
    dispatch({
      type: 'orgMgr/saveData',
      payload: {
        drawerShowFlag: true,
        operType: type,
      },
    }).then(() => {
      if (type === 'ADD_USER_ORG' || type === 'ADD_MEMBER') {
        dispatch({
          type: 'orgMgr/queryUsersInCompany',
        });
      }
      if (type === 'ADD_TA_COMPANY') {
        dispatch({
          type: 'orgMgr/queryAllCompany',
        });
      }
      if (type === 'ADD_USER_ORG') {
        const { companyId } = selectedOrg;
        dispatch({
          type: 'orgMgr/querySubCompany',
          payload: {
            companyId,
          },
        });
      }
    });
  };

  removeMember = item => {
    Modal.confirm({
      title: formatMessage({ id: 'MEMBER_DEL_CONFIRM' }),
      okText: formatMessage({ id: 'COMMON_YES' }),
      cancelText: formatMessage({ id: 'COMMON_NO' }),
      icon: <Icon type="info-circle" style={{ backgroundColor: '#faad14' }} />,
      onOk: () => {
        const {
          dispatch,
          orgMgr: {
            selectedOrg: { code = '' },
          },
        } = this.props;
        const { userCode = '' } = item;
        dispatch({
          type: 'orgMgr/orgBatchRemoveUser',
          payload: {
            orgCode: code,
            userCodes: [userCode],
          },
        }).then(() => {
          dispatch({
            type: 'orgMgr/queryUsersInOrg',
          });
        });
      },
    });
  };

  getAddOrgBtnDisable = () => {
    const {
      orgMgr: { selectedOrg = {}, orgList = [] },
      global: { currentUser = {} },
    } = this.props;

    const { userType = '' } = currentUser;

    if (Object.keys(selectedOrg).length === 0) {
      return true;
    }

    // 如果不是同一家公司 禁止操作 其他公司的组织结构
    if (orgList.length > 0) {
      if (
        orgList[0].companyId !== selectedOrg.companyId &&
        !PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.PAMS_ADMIN_PRIVILEGE])
      ) {
        return true;
      }
    }

    return !(
      PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.PAMS_ADMIN_PRIVILEGE]) ||
      (PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.SALES_SUPPORT_PRIVILEGE]) &&
        userType === constants.RWS_USER_TYPE) ||
      (PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.MAIN_TA_ADMIN_PRIVILEGE]) &&
        userType === constants.TA_USER_TYPE) ||
      (PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.SUB_TA_ADMIN_PRIVILEGE]) &&
        userType === constants.SUB_TA_USER_TYPE)
    );
  };

  getAddMemberBtnDisable = () => {
    const {
      orgMgr: { selectedOrg = {}, orgList = [] },
      global: { currentUser = {} },
    } = this.props;

    const { userType = '' } = currentUser;

    if (Object.keys(selectedOrg).length === 0) {
      return true;
    }

    const { code = '' } = selectedOrg;
    if (code === constants.RWS_ORG_CODE) {
      return true;
    }

    // 如果不是同一家公司 禁止操作 其他公司的组织结构
    if (orgList.length > 0) {
      if (
        orgList[0].companyId !== selectedOrg.companyId &&
        !PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.PAMS_ADMIN_PRIVILEGE])
      ) {
        return true;
      }
    }

    return !(
      PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.PAMS_ADMIN_PRIVILEGE]) ||
      (PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.MAIN_TA_ADMIN_PRIVILEGE]) &&
        userType === constants.TA_USER_TYPE) ||
      (PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.SUB_TA_ADMIN_PRIVILEGE]) &&
        userType === constants.SUB_TA_USER_TYPE)
    );
  };

  getAddMemberCardShow = () => {
    const {
      orgMgr: { selectedOrg = {}, orgList = [] },
      global: { currentUser = {} },
    } = this.props;

    const { userType = '' } = currentUser;

    if (Object.keys(selectedOrg).length === 0) {
      return true;
    }

    const { code = '' } = selectedOrg;
    if (code === constants.RWS_ORG_CODE) {
      return true;
    }

    // 如果不是同一家公司 禁止操作 其他公司的组织结构 除非是 pams admin
    if (orgList.length > 0) {
      if (
        orgList[0].companyId !== selectedOrg.companyId &&
        !PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.PAMS_ADMIN_PRIVILEGE])
      ) {
        return true;
      }
    }

    return !(
      PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.PAMS_ADMIN_PRIVILEGE]) ||
      (PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.MAIN_TA_ADMIN_PRIVILEGE]) &&
        userType === constants.TA_USER_TYPE) ||
      (PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.SUB_TA_ADMIN_PRIVILEGE]) &&
        userType === constants.SUB_TA_USER_TYPE)
    );
  };

  getCardTitle = () => {
    const {
      orgMgr: { selectedOrg = {} },
    } = this.props;

    const { orgName = '', orgType = '' } = selectedOrg;
    return orgName
      ? `${orgName}(${constants.ORG_TYPE_MAP.get(orgType)})`
      : formatMessage({ id: 'CHECK_ORG_FIRST' });
  };

  render() {
    const {
      orgMgr: { selectedOrg = {}, orgUsers = [] },
      loadUserInOrg = false,
    } = this.props;

    const { subOrgs = [] } = selectedOrg;
    const cardTitle = this.getCardTitle();
    return (
      <Card
        className={`has-shadow no-border ${styles.tableClass} ${styles.cardClass}`}
        title={cardTitle}
        extra={this.getExtra()}
      >
        <div className={styles.titleHeader}>{formatMessage({ id: 'SUB_ORG' })}</div>
        <Button
          disabled={this.getAddOrgBtnDisable()}
          type="link"
          className={styles.addBtnClass}
          onClick={e => this.addOrgBtnClick(e)}
        >
          {formatMessage({ id: 'ADD_BTN_TEXT' })}
        </Button>
        <Table
          rowKey="id"
          bordered={false}
          size="small"
          dataSource={subOrgs}
          columns={this.columns}
          scroll={{ y: 190 }}
          className="no-border"
          pagination={false}
        />
        {this.getAddMemberCardShow() ? null : (
          <React.Fragment>
            <div className={styles.titleHeader}>
              {formatMessage({ id: 'PERSONNEL' })}({orgUsers.length})
            </div>
            <Button
              disabled={this.getAddMemberBtnDisable()}
              type="link"
              className={styles.addBtnClass}
              onClick={e => this.showOperDrawer(e, 'ADD_MEMBER')}
            >
              {formatMessage({ id: 'ADD_BTN_TEXT' })}
            </Button>
            <Table
              rowKey="userCode"
              loading={loadUserInOrg}
              bordered={false}
              size="small"
              dataSource={orgUsers}
              columns={this.memberColumns}
              scroll={{ y: 190 }}
              className="no-border"
              pagination={false}
            />
          </React.Fragment>
        )}
      </Card>
    );
  }
}

export default OrgInformation;
