import React from 'react';
import { Badge, Button, Card, Col, Icon, Row, Table, Tooltip } from 'antd';
// import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
// import { SCREEN } from '../../../../utils/screen';
import { connect } from 'dva';
import styles from '../index.less';
import constants from '../constants';

const colProps = {
  xs: 24,
  sm: 12,
  md: 6,
  xl: 6,
};

@connect(({ roleMgr, loading }) => ({
  roleMgr,
  loading: loading.effects['roleMgr/queryUserRolesByCondition'],
}))
class Index extends React.PureComponent {
  componentDidMount() {
    // TODO get ROLES
    // TODO get companies
    //

    this.columns = [
      {
        title: this.showTableTitle(formatMessage({ id: 'NO' })),
        dataIndex: 'id',
        width: '15%',
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'ROLE_NAME' })),
        dataIndex: 'roleName',
        width: '20%',
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'ROLE_TYPE' })),
        dataIndex: 'roleType',
        width: '20%',
        render: (text, record) => {
          const { roleType } = record;
          if (roleType === '01') {
            return formatMessage({ id: 'RWS_ROLE' });
          }
          if (roleType === '02') {
            return formatMessage({ id: 'TA_ROLE' });
          }
          return formatMessage({ id: 'SUB_TA_ROLE' });
        },
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'ROLE_INCLUDE' })),
        width: '15%',
        dataIndex: 'includePerson',
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'STATUS' })),
        width: '15%',
        dataIndex: 'status',
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
          return (
            <div>
              <Badge color="#FF9A1B" />
              {formatMessage({ id: 'INACTIVE' })}
            </div>
          );
        },
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'OPERATION' })),
        width: '15%',
        render: (text, record) => {
          const { status = '00' } = record;
          return (
            <div>
              <Tooltip title={formatMessage({ id: 'app.settings.security.modify' })}>
                <Icon
                  style={{ marginRight: '10px' }}
                  type="edit"
                  onClick={() => {
                    this.edit(record);
                  }}
                />
              </Tooltip>
              <Tooltip title={formatMessage({ id: 'GRANT' })}>
                <Icon
                  style={{ marginRight: '10px' }}
                  type="api"
                  onClick={() => {
                    this.grantPrivileges(record);
                  }}
                />
              </Tooltip>
              <Tooltip
                title={formatMessage({
                  id: status === '00' ? 'COMMON_DISABLE' : 'COMMON_ENABLE',
                })}
              >
                <span
                  style={{ marginRight: '10px' }}
                  onClick={() => {
                    this.oprUserStatus(record);
                  }}
                  className={status === '00' ? 'iconfont icon-ban' : 'iconfont icon-circle-o'}
                />
              </Tooltip>
            </div>
          );
        },
      },
    ];
  }

  showTotal = total => {
    return <div>Total {total} items</div>;
  };

  showTableTitle = value => <span className={styles.tableTitle}>{value}</span>;

  onChangeEvent = pagination => {
    const {
      dispatch,
      roleMgr: { queryParam = {} },
    } = this.props;
    const { current, pageSize } = pagination;
    dispatch({
      type: 'roleMgr/saveData',
      payload: {
        queryParam: {
          ...queryParam,
          currentPage: current,
          pageSize,
        },
      },
    }).then(() => {
      dispatch({
        type: 'roleMgr/queryUserRolesByCondition',
      });
    });
  };

  edit = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleMgr/saveData',
      payload: {
        operType: constants.MODIFY_USER_ROLE,
        drawerShowFlag: true,
      },
    });
    const { roleCode = '' } = record;
    dispatch({
      type: 'roleMgr/queryUserRoleDetail',
      payload: {
        roleCode,
        appCode: constants.APP_CODE,
      },
    });
  };

  grantPrivileges = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleMgr/saveData',
      payload: {
        privilegeModalShowFlag: true,
      },
    });
    const { roleCode = '' } = record;
    dispatch({
      type: 'roleMgr/queryAllPrivileges',
      payload: {
        appCode: constants.APP_CODE,
      },
    });
    dispatch({
      type: 'roleMgr/queryUserRoleDetail',
      payload: {
        roleCode,
        appCode: constants.APP_CODE,
      },
    });
  };

  oprUserStatus = record => {
    const { dispatch } = this.props;
    const { roleCode = '', status = '' } = record;
    dispatch({
      type: 'roleMgr/modifyUserRole',
      payload: {
        roleCode,
        status: status === '00' ? '99' : '00',
        appCode: constants.APP_CODE,
      },
    }).then(() => {
      dispatch({
        type: 'roleMgr/queryUserRolesByCondition',
      });
    });
  };

  addUserRole = e => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: 'roleMgr/saveData',
      payload: {
        drawerShowFlag: true,
        operType: constants.ADD_USER_ROLE,
        expandedKeys: [constants.ROOT_CODE + constants.ROOT_CODE],
      },
    });
  };

  render() {
    const {
      loading,
      roleMgr: {
        userRoles = [],
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
            <Button type="primary" onClick={e => this.addUserRole(e)}>
              {formatMessage({ id: 'COMMON_NEW' })}
            </Button>
          </Col>
        </Row>
        <Table
          {...tableOpts}
          rowKey="id"
          bordered={false}
          size="small"
          dataSource={userRoles}
          pagination={pagination}
          loading={loading}
          columns={this.columns}
          onChange={(paginationConfig, filters, sorter, extra) => {
            this.onChangeEvent(paginationConfig, filters, sorter, extra);
          }}
        />
      </Card>
    );
  }
}

export default Index;
