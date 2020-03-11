import React from 'react';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Icon,
  Input,
  Row,
  Select,
  Table,
  Tooltip,
} from 'antd';
// import MediaQuery from 'react-responsive';
import {formatMessage} from 'umi/locale';
import {connect} from 'dva';
// import { SCREEN } from '../../../../utils/screen';
import styles from './index.less';
import router from 'umi/router';

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 23,
  },
};

const ColProps = {
  xs: 24,
  sm: 12,
  md: 6,
  xl: 6,
};

@Form.create()
@connect(({userManagement, loading}) => ({
  userManagement,
  loading: loading.effects['userManagement/queryUsersByCondition'],
}))
class Index extends React.PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: this.showTableTitle(formatMessage({id: 'NAME'})),
        width: '15%',
        render: (text, record) => {
          let {userType, rwsInfo = {}, taInfo = {}} = record;
          rwsInfo = rwsInfo || {};
          taInfo = taInfo || {};
          if (userType === '01') {
            const {surName = '', givenName = ''} = rwsInfo;
            return `${surName} ${givenName}`;
          }
          const {fullName = ''} = taInfo;
          return fullName;
        },
      },
      {
        title: this.showTableTitle(formatMessage({id: 'USER_ORG'})),
        width: '15%',
        render: (text, record) => {
          const {userOrgTrees} = record;
          return this.getUserOrgTrees(userOrgTrees);
        },
      },
      {
        title: this.showTableTitle(formatMessage({id: 'USER_LOGIN'})),
        width: '12.5%',
        dataIndex: 'userCode',
      },
      {
        title: this.showTableTitle(formatMessage({id: 'COMPANY_NAME'})),
        width: '15%',
        render: (text, record) => {
          let {taInfo = {}} = record;
          const {userType} = record;
          taInfo = taInfo || {};
          if (userType === '01') {
            return '';
          }
          const {companyId = ''} = taInfo;
          // TODO get companyName
          return companyId;
        },
      },
      {
        title: this.showTableTitle(formatMessage({id: 'STATUS'})),
        width: '10%',
        render: (text, record) => {
          const {status} = record;
          if (status === '00') {
            return 'enable';
          }
          if (status === '99') {
            return 'disable';
          }
          if (status === '01') {
            return 'one-time';
          }
        },
      },
      {
        title: this.showTableTitle(formatMessage({id: 'ROLE'})),
        width: '20%',
        render: (text, record) => {
          const {userRoles} = record;
          return this.getUserRoles(userRoles);
        },
      },
      {
        title: this.showTableTitle(formatMessage({id: 'OPERATION'})),
        width: '12.5%',
        render: (text, record) => {
          const {userType = '01'} = record;
          return (
            <div>
              {
                userType === '01' ? null : <Tooltip title={formatMessage({id: 'app.settings.security.modify'})}>
                  <Icon
                    style={{marginRight: '10px'}}
                    type="edit"
                    onClick={() => {
                      this.edit(record);
                    }}
                  />
                </Tooltip>
              }
              <Tooltip
                title={formatMessage({
                  id: record.status !== '99' ? 'COMMON_DISABLE' : 'COMMON_ENABLE',
                })}
              >
                <span
                  style={{marginRight: '10px'}}
                  onClick={() => {
                    this.oprUserStatus(record);
                  }}
                  className={
                    record.status !== '99' ? 'iconfont icon-ban' : 'iconfont icon-circle-o'
                  }
                />
              </Tooltip>
              <Tooltip title={formatMessage({id: 'COMMON_DETAIL'})}>
                <Icon
                  type="eye"
                  onClick={() => {
                    this.detail(record);
                  }}
                />
              </Tooltip>
            </div>
          );
        },
      },
    ];
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'userManagement/queryUsersByCondition',
      payload: {},
    });
  }

  oprUserStatus = userInfo => {
    // TODO disable user
    // TODO enable user

    const {dispatch} = this.props;
    let status = '00';
    if (userInfo.status !== '99') {
      status = '99';
    }

    dispatch({
      type: 'userManagement/modifyUser',
      payload: {
        userCode: userInfo.userCode,
        status,
      },
    }).then(() => {
      dispatch({
        type: 'userManagement/queryUsersByCondition',
      });
    });
  };

  edit = userInfo => {
    const {dispatch} = this.props;
    dispatch({
      type: 'userManagement/saveData',
      payload: {
        currentUserProfile: userInfo,
      },
    }).then(() => {
      router.push(`/SystemManagement/UserManagement/Edit/${userInfo.userCode}`);
    });
  };

  detail = userInfo => {
    const {dispatch} = this.props;
    dispatch({
      type: 'userManagement/saveData',
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
    let orgText = '';
    userOrgTrees.forEach(orgTree => {
      orgTree.forEach(org => {
        const {orgName = ''} = org;
        orgText += `${orgName}/`;
      });
      orgText += ';';
    });
    if (orgText) {
      orgText = orgText.substring(0, orgText.length - 1);
    }
    return orgText;
  };

  getUserRoles = userRoles => {
    if (!userRoles) {
      return '';
    }
    let roleNames = '';
    userRoles.forEach(item => {
      const {roleName = ''} = item;
      roleNames += `${roleName};`;
    });
    if (roleNames) {
      roleNames = roleNames.substring(0, roleNames.length - 1);
    }
    return roleNames;
  };

  addUser = e => {
    e.preventDefault();
    const {dispatch} = this.props;
    dispatch({
      type: 'userManagement/saveData',
      payload: {
        currentUserProfile: {},
      },
    }).then(() => {
      router.push(`/SystemManagement/UserManagement/New`);
    });
  };

  showTotal(total) {
    return <div>Total {total} items</div>;
  }

  handleSearch = e => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.query(values);
      }
    });
  };

  query = values => {
    const {dispatch} = this.props;
    dispatch({
      type: 'userManagement/saveData',
      payload: {
        queryParam: {
          ...values,
          pageSize: 10,
          currentPage: 1,
        },
      },
    }).then(() => {
      dispatch({
        type: 'userManagement/queryUsersByCondition',
      });
    });
  };

  handleReset = () => {
    const {form} = this.props;
    form.resetFields();
    form.validateFields((err, values) => {
      this.query(values);
    });
  };

  onChangeEvent = pagination => {
    const {
      dispatch,
      userManagement: {queryParam = {}},
    } = this.props;
    const {current, pageSize} = pagination;
    dispatch({
      type: 'userManagement/saveData',
      payload: {
        queryParam: {
          ...queryParam,
          currentPage: current,
          pageSize,
        },
      },
    }).then(() => {
      dispatch({
        type: 'userManagement/queryUsersByCondition',
      });
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {
      loading,
      userManagement: {
        userProfiles = [],
        pageInfo: {pageSize, currentPage, totalSize},
      },
    } = this.props;
    const tableOpts = {
      size: 'small',
      bordered: false,
      scroll: {x: 750},
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
      <Col lg={24} md={24}>
        <Breadcrumb separator=" > " style={{marginBottom: '10px'}}>
          <Breadcrumb.Item className={styles.breadCrumbStyle}>
            {formatMessage({id: 'SYSTEM_MANAGEMENT'})}
          </Breadcrumb.Item>
          <Breadcrumb.Item className={styles.breadCrumbBold}>
            {formatMessage({id: 'USER_MANAGEMENT'})}
          </Breadcrumb.Item>
        </Breadcrumb>
        <Card className="has-shadow no-border">
          <Form onSubmit={e => this.handleSearch(e)}>
            <Row gutter={24}>
              <Col {...ColProps}>
                <Form.Item {...formItemLayout}>
                  {getFieldDecorator(`userCode`)(
                    <Input placeholder={formatMessage({id: 'USER_LOGIN'})} allowClear/>
                  )}
                </Form.Item>
              </Col>
              <Col {...ColProps}>
                <Form.Item {...formItemLayout}>
                  {getFieldDecorator(`companyId`)(
                    <Select
                      placeholder={formatMessage({id: 'COMPANY_NAME'})}
                      optionFilterProp="children"
                      style={{width: '100%'}}
                      allowClear
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...ColProps}>
                <Form.Item {...formItemLayout}>
                  {getFieldDecorator(`orgCode`)(
                    <Select
                      placeholder={formatMessage({id: 'USER_ORG'})}
                      optionFilterProp="children"
                      style={{width: '100%'}}
                      allowClear
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...ColProps} style={{textAlign: 'right'}}>
                <Button type="primary" htmlType="submit">
                  {formatMessage({id: 'BTN_SEARCH'})}
                </Button>
                <Button style={{marginLeft: 8}} onClick={this.handleReset}>
                  {formatMessage({id: 'BTN_RESET'})}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card className={`has-shadow no-border ${styles.tableClass}`}>
          <Row gutter={24}>
            <Col {...ColProps} style={{padding: '12px'}}>
              <Button type="primary" onClick={e => this.addUser(e)}>
                {formatMessage({id: 'COMMON_NEW'})}
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
            onChange={(pagination, filters, sorter, extra) => {
              this.onChangeEvent(pagination, filters, sorter, extra);
            }}
          />
        </Card>
      </Col>
    );
  }
}

export default Index;
