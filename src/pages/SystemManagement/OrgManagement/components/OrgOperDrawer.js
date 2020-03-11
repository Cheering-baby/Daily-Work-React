import React from 'react';
import { Button, Card, Collapse, Drawer, Form, Icon, Input, Table, Tooltip } from 'antd';
// import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
// import { SCREEN } from '../../../../utils/screen';
import { connect } from 'dva';
import styles from '../index.less';

const { Panel } = Collapse;
const { Search } = Input;

const customerPanelStyle = {
  background: '#fff',
  marginBottom: '50px',
};

@Form.create()
@connect(({ orgManagement, loading }) => ({
  orgManagement,
  addOrgLoading: loading.effects['orgManagement/addUserOrg'],
  addMemberLoading: loading.effects['roleManagement/orgBatchAddUser'],
  modifyOrgLoading: loading.effects['roleManagement/modifyUserOrg'],
  queryUsersLoading: loading.effects['roleManagement/queryUsersInCompany'],
}))
class Index extends React.PureComponent {
  componentDidMount() {
    // TODO get ROLES
    // TODO get companies

    this.columns = [
      {
        title: this.showTableTitle(formatMessage({ id: 'NO' })),
        dataIndex: 'id',
        width: '20%',
      },
      {
        title: this.showTableTitle(formatMessage({ id: 'FULL_NAME' })),
        width: '40%',
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
        width: '40%',
      },
    ];
  }

  showTableTitle = value => <span className={styles.tableTitle}>{value}</span>;

  commit = e => {
    e.preventDefault();
    const {
      form,
      orgManagement: { operType = 'ADD_USER_ORG' },
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        if (operType === 'ADD_USER_ORG') {
          this.addUserOrg(values);
        } else if (operType === 'ADD_MEMBER') {
          this.addMember(values);
        } else if (operType === 'MODIFY_USER_ORG') {
          this.modifyUserOrg(values);
        }
      }
    });
  };

  addMember = values => {
    const {
      dispatch,
      orgManagement: { selectedUserKeys = [], selectedOrg = {} },
    } = this.props;
    dispatch({
      type: 'orgManagement/orgBatchAddUser',
      payload: {
        orgCode: selectedOrg.code,
        userCodes: selectedUserKeys,
      },
    }).then(result => {
      if (result) {
        dispatch({
          type: 'orgManagement/queryUsersInOrg',
        });
        this.closeDetailDrawer();
      }
    });
  };

  addUserOrg = values => {
    const {
      dispatch,
      orgManagement: { selectedUserKeys = [], selectedOrg = {} },
    } = this.props;
    dispatch({
      type: 'orgManagement/addUserOrg',
      payload: {
        ...values,
        parentOrgCode: selectedOrg.code,
        companyId: selectedOrg.companyId,
        companyType: selectedOrg.companyType,
        orgType: '03',
        userCodes: selectedUserKeys,
      },
    }).then(result => {
      if (result) {
        dispatch({
          type: 'orgManagement/queryUserOrgTree',
          payload: {
            orgCode: 'TEST_TA_1',
            operType: 'ADD_USER_ORG',
          },
        });
        this.closeDetailDrawer();
      }
    });
  };

  modifyUserOrg = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgManagement/modifyUserOrg',
      payload: {
        ...values,
      },
    }).then(result => {
      if (result) {
        dispatch({
          type: 'orgManagement/queryUserOrgTree',
          payload: {
            orgCode: 'TEST_TA_1',
            operType: 'MODIFY_USER_ORG',
          },
        });
        this.closeDetailDrawer();
      }
    });
  };

  closeDetailDrawer = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgManagement/saveData',
      payload: {
        drawerShowFlag: false,
        selectedUserKeys: [],
      },
    });
  };

  expandIcon = panelProps => {
    const { isActive } = panelProps;
    if (isActive) {
      return <Icon type="minus-square" className={styles.panelIconClass} theme="filled" />;
    }
    return <Icon type="plus-square" className={styles.panelIconClass} theme="filled" />;
  };

  onChange = e => {
    const {
      orgManagement: { canAddUsers = [] },
      dispatch,
    } = this.props;
    const { value } = e.target;
    const filteredCanAddUsers = [];
    canAddUsers.forEach(item => {
      if (item.userCode.indexOf(value) !== -1) {
        filteredCanAddUsers.push(item);
      }
    });
    dispatch({
      type: 'orgManagement/saveData',
      payload: {
        filteredCanAddUsers,
      },
    });
  };

  selectUser = selectedRowKeys => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgManagement/saveData',
      payload: {
        selectedUserKeys: selectedRowKeys,
      },
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      orgManagement: {
        drawerShowFlag = false,
        operType = 'ADD_USER_ORG',
        canAddUsers = [],
        filteredCanAddUsers = [],
        selectedUserKeys = [],
        selectedOrg: { code = '', orgName = '' },
      },
      addOrgLoading = false,
      addMemberLoading = false,
      modifyOrgLoading = false,
      queryUsersLoading = false,
    } = this.props;

    return (
      <Drawer
        title={formatMessage({ id: 'DETAIL' })}
        className={styles.drawerClass}
        destroyOnClose
        width={480}
        closable
        onClose={this.closeDetailDrawer}
        visible={drawerShowFlag}
      >
        <Form onSubmit={e => this.commit(e)} layout="vertical" style={{ paddingTop: '15px' }}>
          <Form.Item label={formatMessage({ id: 'ORG_CODE' })}>
            {getFieldDecorator(`orgCode`, {
              initialValue: operType === 'ADD_USER_ORG' ? '' : code,
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <Input
                placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                disabled={operType !== 'ADD_USER_ORG'}
                allowClear
              />
            )}
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'ORG_NAME' })}>
            {getFieldDecorator(`orgName`, {
              initialValue: operType === 'ADD_USER_ORG' ? '' : orgName,
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <Input
                placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                disabled={operType === 'ADD_MEMBER'}
                allowClear
              />
            )}
          </Form.Item>
          {operType === 'MODIFY_USER_ORG' ? null : (
            <Form.Item label={formatMessage({ id: 'MEMBER' })}>
              {getFieldDecorator(`member`, {
                initialValue: 'initValue',
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <Input
                  style={{ display: 'none' }}
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  allowClear
                />
              )}
              <Collapse defaultActiveKey={['1']} expandIcon={this.expandIcon}>
                <Panel
                  header={`${selectedUserKeys.length}/${canAddUsers.length}`}
                  className={styles.tableClass}
                  style={customerPanelStyle}
                  key="1"
                >
                  <Search
                    style={{ marginBottom: 8 }}
                    placeholder={formatMessage({ id: 'component.globalHeader.search' })}
                    onChange={this.onChange}
                  />
                  <Table
                    rowKey="userCode"
                    loading={queryUsersLoading}
                    bordered={false}
                    size="small"
                    dataSource={filteredCanAddUsers}
                    columns={this.columns}
                    scroll={{ y: 188 }}
                    className="no-border"
                    pagination={false}
                    rowSelection={{
                      type: 'checkbox',
                      selectedRowKeys: selectedUserKeys,
                      onChange: this.selectUser,
                    }}
                  />
                </Panel>
              </Collapse>
            </Form.Item>
          )}
          <div className={styles.drawerBtnWrapper}>
            <Button
              style={{
                marginRight: 8,
              }}
              onClick={this.closeDetailDrawer}
            >
              {formatMessage({ id: 'COMMON_CANCEL' })}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={addOrgLoading || addMemberLoading || modifyOrgLoading}
            >
              {formatMessage({ id: 'COMMON_OK' })}
            </Button>
          </div>
        </Form>
      </Drawer>
    );
  }
}

export default Index;
