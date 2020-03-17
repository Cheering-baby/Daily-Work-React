import React from 'react';
import { Badge, Button, Card, Col, Icon, Row, Table, Tooltip } from 'antd';
// import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
// import { SCREEN } from '../../../../utils/screen'*;
import { connect } from 'dva';
import router from 'umi/router';
import styles from '../index.less';
import constants from '../constants';

const colProps = {
  xs: 24,
  sm: 12,
  md: 6,
  xl: 6,
};

@connect(({ userMgr, loading }) => ({
  userMgr,
  loading: loading.effects['userMgr/queryUsersByCondition'],
}))
class Index extends React.PureComponent {
  constructor(props) {
    super(props);

    this.columns = [
      {
        title: this.showTableTitle(formatMessage({ id: 'FULL_NAME' })),
        width: '12.5%',
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
        title: this.showTableTitle(formatMessage({ id: 'USER_ORG' })),
        width: '22.5%',
        render: (text, record) => {
          const { userOrgTrees } = record;
          const { userType } = record;
          if (userType === '01') {
            return constants.RWS_ORG;
          }
          return this.getUserOrgTrees(userOrgTrees);
        },
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'USER_LOGIN' })),
        width: '12.5%',
        dataIndex: 'userCode',
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'COMPANY_NAME' })),
        width: '12.5%',
        render: (text, record) => {
          const {
            userMgr: { companyMap = new Map() },
          } = this.props;
          let { taInfo = {} } = record;
          const { userType } = record;
          taInfo = taInfo || {};
          if (userType === '01') {
            return constants.RWS_ORG;
          }
          const { companyId = '' } = taInfo;
          const { companyName = '' } = companyMap.get(companyId) || {};
          return <Tooltip title={companyName}>{companyName}</Tooltip>;
        },
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'STATUS' })),
        width: '10%',
        render: (text, record) => {
          const { status } = record;
          if (status === '00') {
            return (
              <div>
                <Badge color="#40C940" />
                {formatMessage({ id: 'ACTIVE' })}
              </div>
            );
          }
          if (status === '99') {
            return (
              <div>
                <Badge color="#FF9A1B" />
                {formatMessage({ id: 'INACTIVE' })}
              </div>
            );
          }
          if (status === '01') {
            return (
              <div>
                <Badge color="#2db7f5" />
                {formatMessage({ id: 'ONE_TIME' })}
              </div>
            );
          }
        },
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'ROLE' })),
        width: '20%',
        render: (text, record) => {
          const { userRoles } = record;
          return this.getUserRoles(userRoles);
        },
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'OPERATION' })),
        width: '10%',
        render: (text, record) => {
          return (
            <div>
              <Tooltip title={formatMessage({ id: 'COMMON_DETAIL' })}>
                <Icon
                  type="eye"
                  onClick={() => {
                    this.detail(record);
                  }}
                />
              </Tooltip>
              <Tooltip title={formatMessage({ id: 'app.settings.security.modify' })}>
                <Icon
                  type="edit"
                  onClick={() => {
                    this.edit(record);
                  }}
                />
              </Tooltip>
              <Tooltip
                title={formatMessage({
                  id: record.status !== '99' ? 'COMMON_DISABLE' : 'COMMON_ENABLE',
                })}
              >
                <span
                  style={{ fontSize: '14px' }}
                  onClick={() => {
                    this.oprUserStatus(record);
                  }}
                  className={
                    record.status !== '99' ? 'iconfont icon-ban' : 'iconfont icon-circle-o'
                  }
                />
              </Tooltip>
            </div>
          );
        },
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userMgr/queryUsersByCondition',
      payload: {},
    });
  }

  // sendEmail = record => {
  //
  // };

  oprUserStatus = userInfo => {
    const { dispatch } = this.props;
    let status = '00';
    if (userInfo.status !== '99') {
      status = '99';
    }

    dispatch({
      type: 'userMgr/modifyUser',
      payload: {
        userCode: userInfo.userCode,
        status,
      },
    }).then(() => {
      dispatch({
        type: 'userMgr/queryUsersByCondition',
      });
    });
  };

  edit = userInfo => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userMgr/saveData',
      payload: {
        currentUserProfile: userInfo,
      },
    }).then(() => {
      router.push(`/SystemManagement/UserManagement/Edit/${userInfo.userCode}`);
    });
  };

  detail = userInfo => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userMgr/saveData',
      payload: {
        currentUserProfile: userInfo,
      },
    }).then(() => {
      router.push(`/SystemManagement/UserManagement/Detail/${userInfo.userCode}`);
    });
  };

  showTableTitle = value => <span className={styles.tableTitle}>{value}</span>;

  getUserOrgTrees = userOrgTrees => {
    if (!userOrgTrees) {
      return '';
    }

    const orgs = [];
    userOrgTrees.forEach(orgTree => {
      let orgText = '';
      orgTree.forEach(org => {
        const { orgName = '' } = org;
        orgText += `${orgName}/`;
      });
      if (orgText) {
        orgText = orgText.substring(0, orgText.length - 1);
      }
      orgs.push(orgText);
    });

    const orgBody = orgs.map(item => <div key={item.code}>{item}</div>);

    return (
      <Tooltip overlayClassName={styles.overlayClass} title={orgBody}>
        {orgBody}
      </Tooltip>
    );
  };

  getUserRoles = userRoles => {
    if (!userRoles) {
      return '';
    }
    let roleNames = '';
    userRoles.forEach(item => {
      const { roleName = '' } = item;
      roleNames += `${roleName};`;
    });
    if (roleNames) {
      roleNames = roleNames.substring(0, roleNames.length - 1);
    }
    return <Tooltip title={roleNames}>{roleNames}</Tooltip>;
  };

  addUser = e => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: 'userMgr/saveData',
      payload: {
        currentUserProfile: {},
      },
    }).then(() => {
      router.push(`/SystemManagement/UserManagement/New`);
    });
  };

  showTotal = total => {
    return <div>Total {total} items</div>;
  };

  onChangeEvent = pagination => {
    const {
      dispatch,
      userMgr: { queryParam = {} },
    } = this.props;
    const { current, pageSize } = pagination;
    dispatch({
      type: 'userMgr/saveData',
      payload: {
        queryParam: {
          ...queryParam,
          currentPage: current,
          pageSize,
        },
      },
    }).then(() => {
      dispatch({
        type: 'userMgr/queryUsersByCondition',
      });
    });
  };

  render() {
    const {
      loading,
      userMgr: {
        userProfiles = [],
        pageInfo: { pageSize, currentPage, totalSize },
      },
    } = this.props;
    const tableOpts = {
      size: 'small',
      bordered: false,
      scroll: { x: 750 },
    };
    const pagination = {
      current: currentPage,
      pageSize,
      total: totalSize,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '15', '20', '50'],
      showTotal: this.showTotal,
    };
    return (
      <Card className={`has-shadow no-border ${styles.tableClass}`}>
        <Row gutter={24}>
          <Col {...colProps} style={{ padding: '12px' }}>
            <Button type="primary" onClick={e => this.addUser(e)}>
              {formatMessage({ id: 'COMMON_NEW' })}
            </Button>
          </Col>
        </Row>
        <Table
          {...tableOpts}
          rowKey="id"
          bordered={false}
          size="small"
          dataSource={userProfiles}
          pagination={pagination}
          loading={loading}
          columns={this.columns}
          // className={styles.tableWrapper}
          onChange={(paginationConfig, filters, sorter, extra) => {
            this.onChangeEvent(paginationConfig, filters, sorter, extra);
          }}
        />
      </Card>
    );
  }
}

export default Index;
