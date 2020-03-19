import React from 'react';
import { Button, Collapse, Drawer, Form, Icon, Input, Select, Table } from 'antd';
// import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
// import { SCREEN } from '../../../../utils/screen';
import { connect } from 'dva';
import styles from '../index.less';
import constants from '../constants';

const { Panel } = Collapse;
const { Search } = Input;
const { Option } = Select;

const customerPanelStyle = {
  background: '#fff',
  marginBottom: '50px',
};

// ADD COMPANY ORG

// ADD SUB COMPANY ORG

// ADD ORG

// MODIFY ORG

// ADD MEMBER

@Form.create()
@connect(({ orgMgr, global, loading }) => ({
  orgMgr,
  global,
  addOrgLoading: loading.effects['orgMgr/addUserOrg'],
  addMemberLoading: loading.effects['roleManagement/orgBatchAddUser'],
  modifyOrgLoading: loading.effects['roleManagement/modifyUserOrg'],
  queryUsersLoading: loading.effects['roleManagement/queryUsersInCompany'],
}))
class Index extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      orgType: '',
    };

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
        width: '40%',
      },
    ];
  }

  componentDidMount() {}

  showTableTitle = value => <span className={styles.tableTitle}>{value}</span>;

  commit = e => {
    e.preventDefault();
    const {
      form,
      orgMgr: { operType = 'ADD_USER_ORG' },
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        if (operType === 'ADD_USER_ORG') {
          this.addUserOrg(values);
        } else if (operType === 'ADD_MEMBER') {
          this.addMember();
        } else if (operType === 'MODIFY_USER_ORG') {
          this.modifyUserOrg(values);
        } else if (operType === 'ADD_TA_COMPANY') {
          this.addTACompanyOrg(values);
        }
      }
    });
  };

  addMember = () => {
    const {
      dispatch,
      orgMgr: { selectedUserKeys = [], selectedOrg = {} },
    } = this.props;
    dispatch({
      type: 'orgMgr/orgBatchAddUser',
      payload: {
        orgCode: selectedOrg.code,
        userCodes: selectedUserKeys,
      },
    }).then(result => {
      if (result) {
        dispatch({
          type: 'orgMgr/queryUsersInOrg',
        });
        this.closeDetailDrawer();
      }
    });
  };

  addTACompanyOrg = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgMgr/addUserOrg',
      payload: {
        ...values,
        companyType: '01',
      },
    }).then(result => {
      if (result) {
        dispatch({
          type: 'orgMgr/queryUserOrgTree',
          payload: {
            orgCode: constants.RWS_ORG_CODE,
          },
        });
        this.closeDetailDrawer();
      }
    });
  };

  addUserOrg = values => {
    const { orgType } = this.state;
    const {
      dispatch,
      orgMgr: { selectedUserKeys = [], selectedOrg = {}, subTAOrg = {} },
      global: { userCompanyInfo = {} },
    } = this.props;

    let payload = {};
    let type = 'orgMgr/addUserOrg';
    // ADD SUB TA COMPANY
    if (orgType === '02') {
      if (Object.keys(subTAOrg).length > 0) {
        type = 'orgMgr/addSubTARelation';
        payload = {
          taOrgCode: selectedOrg.code,
          subTaOrgCode: subTAOrg.code,
        };
      } else {
        payload = {
          ...values,
          companyType: '02',
          parentOrgCode: selectedOrg.code,
        };
      }
    } else if (orgType === '03') {
      // ADD Normal Org
      payload = {
        ...values,
        parentOrgCode: selectedOrg.code,
        companyId: selectedOrg.companyId,
        companyType: selectedOrg.companyType,
        userCodes: selectedUserKeys,
      };
    }
    dispatch({
      type,
      payload,
    }).then(result => {
      if (result) {
        const { companyId, companyType } = userCompanyInfo;
        dispatch({
          type: 'orgMgr/queryUserOrgTree',
          payload: {
            companyId,
            companyType,
          },
        });
        this.closeDetailDrawer();
      }
    });
  };

  modifyUserOrg = values => {
    const {
      dispatch,
      global: { currentUser = {}, userCompanyInfo = {} },
    } = this.props;
    dispatch({
      type: 'orgMgr/modifyUserOrg',
      payload: {
        ...values,
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
        this.closeDetailDrawer();
      }
    });
  };

  closeDetailDrawer = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgMgr/saveData',
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
      orgMgr: { canAddUsers = [] },
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
      type: 'orgMgr/saveData',
      payload: {
        filteredCanAddUsers,
      },
    });
  };

  selectUser = selectedRowKeys => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orgMgr/saveData',
      payload: {
        selectedUserKeys: selectedRowKeys,
      },
    });
  };

  getDrawerTitle = () => {
    const {
      orgMgr: { operType = 'ADD_USER_ORG' },
    } = this.props;
    if (operType === 'ADD_USER_ORG') {
      return formatMessage({ id: 'ADD_SUB_ORG' });
    }
    if (operType === 'ADD_MEMBER') {
      return formatMessage({ id: 'ADD_MEMBER' });
    }
    if (operType === 'MODIFY_USER_ORG') {
      return formatMessage({ id: 'MODIFY_USER_ORG' });
    }
    if (operType === 'ADD_TA_COMPANY') {
      return formatMessage({ id: 'ADD_TA_COMPANY' });
    }
  };

  getOrgTypes = () => {
    const {
      global: { currentUser = {} },
      orgMgr: { orgList = [], selectedOrg = {} },
    } = this.props;
    const { userType = '01' } = currentUser;
    let orgTypes = [];
    if (userType === '01') {
      orgTypes = constants.RWS_ORG_TYPES;
    } else if (userType === '02') {
      orgTypes = constants.TA_ORG_TYPES;
      if (orgList.length > 0 && Object.keys(selectedOrg).length > 0) {
        orgTypes[0].disable = orgList[0].code !== selectedOrg.code;
      }
    } else if (userType === '03') {
      orgTypes = constants.SUB_TA_ORG_TYPES;
    }
    return orgTypes.map(item => {
      return (
        <Option key={item.key} value={item.value} disabled={item.disable}>
          {item.text}
        </Option>
      );
    });
  };

  getOrgTypeValue = () => {
    const {
      orgMgr: {
        operType = 'ADD_USER_ORG',
        selectedOrg: { orgType = '' },
      },
    } = this.props;
    if (operType === 'ADD_USER_ORG') {
      return undefined;
    }
    if (operType === 'ADD_MEMBER' || operType === 'MODIFY_USER_ORG') {
      return constants.ORG_TYPE_MAP.get(orgType);
    }
    if (operType === 'ADD_TA_COMPANY') {
      return '01';
    }
    return undefined;
  };

  getOrgTypeDisable = () => {
    const {
      orgMgr: { operType = 'ADD_USER_ORG' },
    } = this.props;
    if (operType === 'ADD_USER_ORG') {
      return false;
    }
    if (operType === 'ADD_MEMBER' || operType === 'MODIFY_USER_ORG') {
      return true;
    }
    if (operType === 'ADD_TA_COMPANY') {
      return false;
    }
    return true;
  };

  getCompanyOptions = () => {
    const {
      orgMgr: { companyList = [] },
    } = this.props;
    return companyList.map(item => {
      return (
        <Option key={item.id} value={item.id} disabled={this.getCompanyOptionDisable(item)}>
          {item.companyName}
        </Option>
      );
    });
  };

  getCompanyOptionDisable = item => {
    const {
      orgMgr: {
        selectedOrg: { subOrgs = [] },
      },
    } = this.props;
    return subOrgs.findIndex(org => String(org.companyId) === String(item.id)) > -1;
  };

  orgTypeChange = value => {
    const {
      dispatch,
      form: { setFieldsValue },
    } = this.props;
    this.setState({
      orgType: value,
    });
    dispatch({
      type: 'orgMgr/saveData',
      payload: {
        subTAOrg: {},
      },
    });
    setFieldsValue({
      orgCode: '',
      orgName: '',
    });
  };

  onCompanyChange = value => {
    const { orgType = '' } = this.state;
    const {
      dispatch,
      orgMgr: { operType = '' },
      form: { setFieldsValue },
    } = this.props;
    // if add user org and add Sub ta org
    if (operType === 'ADD_USER_ORG' && orgType === '02' && value) {
      dispatch({
        type: 'orgMgr/getSubTAOrg',
        payload: {
          companyId: value,
          companyType: '02',
        },
      }).then(org => {
        const { code = '', orgName = '' } = org;
        setFieldsValue({
          orgCode: code,
          orgName,
        });
      });
    } else {
      dispatch({
        type: 'orgMgr/saveData',
        payload: {
          subTAOrg: {},
        },
      });
    }
  };

  render() {
    const { orgType } = this.state;
    const {
      form: { getFieldDecorator },
      orgMgr: {
        subTAOrg = {},
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

    const orgTypeValue = this.getOrgTypeValue();

    return (
      <Drawer
        title={this.getDrawerTitle()}
        className={styles.drawerClass}
        destroyOnClose
        width={480}
        closable
        onClose={this.closeDetailDrawer}
        visible
      >
        <Form onSubmit={e => this.commit(e)} layout="vertical" style={{ paddingTop: '15px' }}>
          <Form.Item label={formatMessage({ id: 'ORG_TYPE' })}>
            {getFieldDecorator(`orgType`, {
              initialValue: orgTypeValue,
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <Select
                allowClear
                disabled={this.getOrgTypeDisable()}
                onChange={this.orgTypeChange}
                placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
              >
                {this.getOrgTypes()}
              </Select>
            )}
          </Form.Item>
          {operType === 'ADD_TA_COMPANY' || (orgType === '02' && operType === 'ADD_USER_ORG') ? (
            <Form.Item label={formatMessage({ id: 'COMPANY_NAME' })}>
              {getFieldDecorator(`companyId`, {
                initialValue: undefined,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <Select
                  allowClear
                  onChange={this.onCompanyChange}
                  placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                >
                  {this.getCompanyOptions()}
                </Select>
              )}
            </Form.Item>
          ) : null}
          <Form.Item label={formatMessage({ id: 'ORG_CODE' })}>
            {getFieldDecorator(`orgCode`, {
              initialValue:
                operType === 'ADD_USER_ORG' || operType === 'ADD_TA_COMPANY' ? '' : code,
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <Input
                placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                disabled={
                  !(operType === 'ADD_USER_ORG' || operType === 'ADD_TA_COMPANY') ||
                  Object.keys(subTAOrg).length > 0
                }
                allowClear
              />
            )}
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'ORG_NAME' })}>
            {getFieldDecorator(`orgName`, {
              initialValue:
                operType === 'ADD_USER_ORG' || operType === 'ADD_TA_COMPANY' ? '' : orgName,
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <Input
                placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                disabled={operType === 'ADD_MEMBER' || Object.keys(subTAOrg).length > 0}
                allowClear
              />
            )}
          </Form.Item>
          {operType === 'MODIFY_USER_ORG' ||
          operType === 'ADD_TA_COMPANY' ||
          orgType === '02' ? null : (
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
                    scroll={{ y: 190 }}
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
