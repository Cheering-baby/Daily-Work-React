import React from 'react';
import { Icon, Select, Table, Card, Button, Tooltip, Popover } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from '../index.less';

@connect(({ orgManagement, loading }) => ({
  orgManagement,
  loadUserInOrg: loading.effects['orgManagement/queryUsersInOrg'],
}))
class OrgInformation extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [
      {
        title: this.showTableTitle(formatMessage({ id: 'NO' })),
        dataIndex: 'seq',
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'SUB_ORG_NAME' })),
        dataIndex: 'orgName',
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
        dataIndex: 'id',
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'FULL_NAME' })),
        render: (text, record) => {
          let { userType, rwsInfo = {}, taInfo = {} } = record;
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
        render: (text, record) => {
          const { userType = '01' } = record;
          return (
            <div>
              <Tooltip title={formatMessage({ id: 'REMOVE_MEMBER' })}>
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
    const { dispatch } = this.props;
    const { code = '' } = item;
    dispatch({
      type: 'orgManagement/removeUserOrg',
      payload: {
        code,
      },
    }).then(result => {
      if (result) {
        dispatch({
          type: 'orgManagement/queryUserOrgTree',
          payload: {
            orgCode: 'TEST_TA_1',
          },
        });
      }
    });
  };

  goMoveUp = (e, item) => {
    e.preventDefault();
    const {
      dispatch,
      orgManagement: {
        selectedOrg: { code: parentOrgCode = '' },
      },
    } = this.props;
    const { code: orgCode = '' } = item;
    dispatch({
      type: 'orgManagement/operateMoveUpOrg',
      payload: {
        orgCode,
        parentOrgCode,
      },
    }).then(result => {
      if (result) {
        dispatch({
          type: 'orgManagement/queryUserOrgTree',
          payload: {
            orgCode: 'TEST_TA_1',
          },
        });
      }
    });
  };

  goMoveDown = (e, item) => {
    e.preventDefault();
    const {
      dispatch,
      orgManagement: {
        selectedOrg: { code: parentOrgCode = '' },
      },
    } = this.props;
    const { code: orgCode = '' } = item;
    dispatch({
      type: 'orgManagement/operateMoveDownOrg',
      payload: {
        orgCode,
        parentOrgCode,
      },
    }).then(result => {
      if (result) {
        dispatch({
          type: 'orgManagement/queryUserOrgTree',
          payload: {
            orgCode: 'TEST_TA_1',
          },
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

  showOperDrawer = (e, type = 'ADD_USER_ORG') => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: 'orgManagement/saveData',
      payload: {
        drawerShowFlag: true,
        operType: type,
      },
    }).then(() => {
      dispatch({
        type: 'orgManagement/queryUsersInCompany',
      });
    });
  };

  removeMember = item => {
    const {
      dispatch,
      orgManagement: {
        selectedOrg: { code = '' },
      },
    } = this.props;
    const { userCode = '' } = item;
    dispatch({
      type: 'orgManagement/orgBatchRemoveUser',
      payload: {
        orgCode: code,
        userCodes: [userCode],
      },
    }).then(() => {
      dispatch({
        type: 'orgManagement/queryUsersInOrg',
      });
    });
  };

  render() {
    const {
      orgManagement: { selectedOrg = {}, orgUsers = [] },
      loadUserInOrg = false,
    } = this.props;
    const { orgName = '', subOrgs = [] } = selectedOrg;
    return (
      <Card
        className={`has-shadow no-border ${styles.tableClass} ${styles.cardClass}`}
        title={orgName}
        extra={this.getExtra()}
      >
        <div className={styles.titleHeader}>{formatMessage({ id: 'SUB_ORG' })}</div>
        <Button
          disabled={Object.keys(selectedOrg).length === 0}
          type="link"
          className={styles.addBtnClass}
          onClick={e => this.showOperDrawer(e, 'ADD_USER_ORG')}
        >
          {formatMessage({ id: 'ADD_BTN_TEXT' })}
        </Button>
        <Table
          bordered={false}
          size="small"
          dataSource={subOrgs}
          columns={this.columns}
          scroll={{ y: 188 }}
          className="no-border"
          pagination={false}
        />
        <div className={styles.titleHeader}>
          {formatMessage({ id: 'PERSONNEL' })}({orgUsers.length})
        </div>
        <Button
          disabled={Object.keys(selectedOrg).length === 0}
          type="link"
          className={styles.addBtnClass}
          onClick={e => this.showOperDrawer(e, 'ADD_MEMBER')}
        >
          {formatMessage({ id: 'ADD_BTN_TEXT' })}
        </Button>
        <Table
          loading={loadUserInOrg}
          bordered={false}
          size="small"
          dataSource={orgUsers}
          columns={this.memberColumns}
          scroll={{ y: 188 }}
          className="no-border"
          pagination={false}
        />
      </Card>
    );
  }
}

export default OrgInformation;
