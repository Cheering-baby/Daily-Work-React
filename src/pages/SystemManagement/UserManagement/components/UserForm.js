import React, { Fragment } from 'react';
import { Button, Col, Form, Input, InputNumber, message, Row, Select } from 'antd';
// import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
// import { SCREEN } from '../../../../utils/screen';
import { connect } from 'dva';
import TextArea from 'antd/es/input/TextArea';
import router from 'umi/router';
import styles from '../index.less';
import constants from '../constants';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const formItemLayoutFull = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const formItemLayoutFull1 = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 7,
  },
};

const colProps = {
  sm: 24,
  md: 12,
};

@Form.create()
@connect(({ userMgr, global, loading }) => ({
  userMgr,
  global,
  addLoading: loading.effects['userMgr/addTAUser'],
  modifyLoading: loading.effects['userMgr/modifyUser'],
}))
class Index extends React.PureComponent {
  componentDidMount() {
    const {
      dispatch,
      type = 'NEW',
      userMgr: { companyList = [] },
    } = this.props;
    if (type === 'NEW' && companyList.length === 0) {
      dispatch({
        type: 'userMgr/queryAllCompany',
      });
    }
  }

  getRoleCodes = (currentUserProfile = {}) => {
    const { type = 'NEW' } = this.props;
    if (type === 'NEW') {
      return [];
    }
    const { userRoles = [] } = currentUserProfile;
    const roleCodes = [];
    userRoles.forEach(item => {
      const { roleCode } = item;
      roleCodes.push(roleCode);
    });
    return roleCodes;
  };

  commit = e => {
    e.preventDefault();
    const {
      dispatch,
      form,
      type = 'NEW',
      userMgr: { currentUserProfile = {}, companyMap = new Map() },
    } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        let dispatchType = '';
        if (type === 'NEW') {
          dispatchType = 'userMgr/addTAUser';
          const { companyId } = values;
          const companyInfo = companyMap.get(companyId);
          if (companyInfo.companyType === '01') {
            values.userType = '02';
          } else if (companyInfo.companyType === '02') {
            values.userType = '03';
          } else {
            message.warn(formatMessage({ id: 'COMPANY_TYPE_ERROR' }), 10);
            return;
          }
        } else {
          dispatchType = 'userMgr/modifyUser';
          const { userRoles = [], userType = '' } = currentUserProfile;
          const { roleCodes = [] } = values;
          const removeRoleCodes = this.getRemoveRoleCodes(userRoles, roleCodes);
          const addRoleCodes = this.getAddRoleCodes(userRoles, roleCodes);
          if (userType === constants.RWS_USER_TYPE) {
            delete values.companyId;
          }
          values.removeRoleCodes = removeRoleCodes;
          values.addRoleCodes = addRoleCodes;
        }
        dispatch({
          type: dispatchType,
          payload: values,
        }).then(result => {
          if (result) {
            router.goBack();
          }
        });
      }
    });
  };

  getRemoveRoleCodes = (userRoles = [], roleCodes = []) => {
    const removeRoleCodes = [];
    userRoles.forEach(item => {
      const { roleCode = '' } = item;
      if (!roleCodes.includes(roleCode)) {
        removeRoleCodes.push(roleCode);
      }
    });
    return removeRoleCodes;
  };

  getAddRoleCodes = (userRoles = [], roleCodes = []) => {
    const addRoleCode = [];
    roleCodes.forEach(roleCode => {
      const tem = userRoles.find(item => item.roleCode === roleCode);
      if (!tem) {
        addRoleCode.push(roleCode);
      }
    });
    return addRoleCode;
  };

  cancel = e => {
    e.preventDefault();
    router.goBack();
  };

  getCompanyOptions = () => {
    const {
      userMgr: { companyList = [] },
    } = this.props;
    return companyList.map(item => {
      if (item.id === -1) return null;
      return (
        <Option key={item.id} value={item.id}>
          {item.companyName}
        </Option>
      );
    });
  };

  companyChange = value => {
    const {
      dispatch,
      type = '',
      global: { currentUser = {}, userCompanyInfo = {} },
      userMgr: { currentUserProfile = {}, companyMap = new Map() },
      form: { setFields },
    } = this.props;
    const { userType = '' } = currentUser;
    const { companyId, companyType = '' } = userCompanyInfo;
    const { userType: currentUserType = '', taInfo = {} } = currentUserProfile;
    let flag = false;
    if (userType === constants.RWS_USER_TYPE) {
      flag = true;
    } else if (userType === constants.TA_USER_TYPE && String(companyId) !== String(value)) {
      flag = true;
    }

    if (currentUserType !== constants.RWS_USER_TYPE && type === 'EDIT') {
      const { companyId } = taInfo;
      if (String(companyId) === String(value)) {
        flag = false;
      }
    }

    if (flag && value) {
      dispatch({
        type: 'userMgr/checkHasMasterUser',
        payload: {
          companyIds: value,
        },
      }).then(result => {
        if (!result) {
          setFields({
            companyId: {
              value,
              errors: [new Error(formatMessage({ id: 'THIS_COMPANY_ALREADY_HAS_USER' }))],
            },
          });
          dispatch({
            type: 'userMgr/saveData',
            payload: {
              userFormOkDisable: true,
            },
          });
        }
      });
    }
    dispatch({
      type: 'userMgr/saveData',
      payload: {
        userFormOkDisable: false,
      },
    });

    if (value) {
      const userCompanyType = currentUserType === constants.TA_USER_TYPE ? '01' : '02';
      const companyInfo = companyMap.get(value);
      const { companyType: selectedCompanyType = '' } = companyInfo;
      setFields({
        roleCodes: {
          value:
            userCompanyType !== selectedCompanyType ? [] : this.getRoleCodes(currentUserProfile),
        },
      });
      this.getUserRoles(value);
    }
  };

  getUserRoles = companyId => {
    const {
      dispatch,
      userMgr: { companyMap = new Map() },
    } = this.props;
    const companyInfo = companyMap.get(companyId);
    let roleType = '';
    if (companyInfo.companyType === '01') {
      roleType = '02';
    } else if (companyInfo.companyType === '02') {
      roleType = '03';
    } else {
      message.warn(formatMessage({ id: 'COMPANY_TYPE_ERROR' }), 10);
      return;
    }
    dispatch({
      type: 'userMgr/queryUserRoles',
      payload: {
        roleType,
      },
    });
  };

  getUserRoleOptions = () => {
    const {
      userMgr: { userRoles = [] },
    } = this.props;
    return userRoles.map(item => (
      <Option key={item.roleCode} value={item.roleCode}>
        {item.roleName}
      </Option>
    ));
  };

  getUserInfo = () => {
    const { type = '', userMgr = {} } = this.props;
    const { currentUserProfile = {} } = userMgr;

    if (type === 'NEW') {
      return {};
    }
    const { userCode = '', userType = '' } = currentUserProfile;
    let { taInfo = {}, rwsInfo = {} } = currentUserProfile;
    taInfo = taInfo || {};
    rwsInfo = rwsInfo || {};
    const { companyId, fullName = '', phone = '', email = '', address = '', remarks = '' } = taInfo;
    const { surName = '', givenName = '', phone: rwsPhone = '', email: rwsEmail = '' } = rwsInfo;

    return {
      userCode,
      companyId: userType === constants.RWS_USER_TYPE ? 'RWS' : companyId,
      userName: userType === constants.RWS_USER_TYPE ? `${surName} ${givenName}` : fullName,
      phone: userType === constants.RWS_USER_TYPE ? rwsPhone : phone,
      email: userType === constants.RWS_USER_TYPE ? rwsEmail : email,
      address: userType === constants.RWS_USER_TYPE ? '' : address,
      remarks: userType === constants.RWS_USER_TYPE ? '' : remarks,
    };
  };

  render() {
    const {
      type = 'NEW',
      userMgr: { userFormOkDisable = false, currentUserProfile = {} },
      addLoading = false,
      modifyLoading = false,
      form: { getFieldDecorator },
    } = this.props;
    const { userType = '' } = currentUserProfile;
    const userInfo = this.getUserInfo();
    const {
      userCode,
      companyId,
      userName = '',
      phone = '',
      email = '',
      address = '',
      remarks = '',
    } = userInfo;

    return (
      <Fragment>
        <Form onSubmit={this.commit}>
          <div style={{ padding: '15px' }}>
            <Row>
              <Col className={styles.headerClass}>
                {formatMessage({ id: 'INFORMATION_FOR_SALES' })}
              </Col>
            </Row>
            <Row>
              <Col {...colProps}>
                <Form.Item {...formItemLayout} label={formatMessage({ id: 'COMPANY_NAME' })}>
                  {getFieldDecorator(`companyId`, {
                    initialValue: companyId,
                    rules: [
                      {
                        required: userType !== constants.RWS_USER_TYPE,
                      },
                    ],
                  })(
                    <Select
                      onChange={this.companyChange}
                      disabled={type === 'DETAIL' || userType === constants.RWS_USER_TYPE}
                      allowClear
                      placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                    >
                      {this.getCompanyOptions()}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...colProps}>
                <Form.Item {...formItemLayout} label={formatMessage({ id: 'USER_LOGIN' })}>
                  {getFieldDecorator(`userCode`, {
                    initialValue: userCode,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(
                    <Input
                      allowClear
                      maxLength={50}
                      placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                      autoComplete="off"
                      disabled={type !== 'NEW'}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...colProps}>
                <Form.Item {...formItemLayout} label={formatMessage({ id: 'FULL_NAME' })}>
                  {getFieldDecorator(`userName`, {
                    initialValue: userName,
                    rules: [
                      {
                        required: userType !== constants.RWS_USER_TYPE,
                      },
                    ],
                  })(
                    <Input
                      disabled={type === 'DETAIL' || userType === constants.RWS_USER_TYPE}
                      maxLength={100}
                      allowClear
                      placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                      autoComplete="off"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...colProps}>
                <Form.Item {...formItemLayout} label={formatMessage({ id: 'ROLE' })}>
                  {getFieldDecorator(`roleCodes`, {
                    initialValue: this.getRoleCodes(currentUserProfile),
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })(
                    <Select
                      allowClear
                      mode="multiple"
                      disabled={type === 'DETAIL'}
                      placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                    >
                      {this.getUserRoleOptions()}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...colProps}>
                <Form.Item {...formItemLayout} label={formatMessage({ id: 'PHONE' })}>
                  {getFieldDecorator(`phone`, {
                    initialValue: phone,
                  })(
                    <Input
                      disabled={type === 'DETAIL' || userType === constants.RWS_USER_TYPE}
                      type="number"
                      allowClear
                      maxLength={255}
                      placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                      autoComplete="off"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...colProps}>
                <Form.Item {...formItemLayout} label={formatMessage({ id: 'EMAIL' })}>
                  {getFieldDecorator(`email`, {
                    initialValue: email,
                    rules: [
                      {
                        type: 'email',
                        message: formatMessage({ id: 'VALID_EMAIL' }),
                      },
                      {
                        required: userType !== constants.RWS_USER_TYPE,
                      },
                    ],
                  })(
                    <Input
                      disabled={type === 'DETAIL' || userType === constants.RWS_USER_TYPE}
                      allowClear
                      maxLength={200}
                      placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                      autoComplete="off"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item {...formItemLayoutFull} label={formatMessage({ id: 'ADDRESS' })}>
                  {getFieldDecorator(`address`, {
                    initialValue: address,
                  })(
                    <Input
                      disabled={type === 'DETAIL' || userType === constants.RWS_USER_TYPE}
                      allowClear
                      maxLength={1000}
                      placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                      autoComplete="off"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item {...formItemLayoutFull} label={formatMessage({ id: 'REMARKS' })}>
                  {getFieldDecorator(`remarks`, {
                    initialValue: remarks,
                  })(
                    <TextArea
                      disabled={type === 'DETAIL' || userType === constants.RWS_USER_TYPE}
                      maxLength={2000}
                      placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                      autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            {userType === constants.RWS_USER_TYPE ? null : (
              <React.Fragment>
                <Row>
                  <Col className={styles.headerClass}>
                    {formatMessage({ id: 'TA_SUPPLEMENTARY_INFORMATION' })}
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      {...formItemLayoutFull1}
                      label={formatMessage({ id: 'SETTLEMENT_CYCLE' })}
                    >
                      <span className={styles.spanClass}>{formatMessage({ id: 'THE' })}</span>
                      {getFieldDecorator(`aa`)(
                        <InputNumber style={{ marginLeft: '10px', marginRight: '10px' }} disabled />
                      )}
                      <span className={styles.spanClass}>
                        {formatMessage({ id: 'TH_DATA_OF_THE_MONTH' })}
                      </span>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item {...formItemLayoutFull1} label={formatMessage({ id: 'MARKET' })}>
                      {getFieldDecorator(`market`)(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col {...colProps}>
                    <Form.Item {...formItemLayout} label={formatMessage({ id: 'EFFECTIVE_DATE' })}>
                      {getFieldDecorator(`effectiveDate`)(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col {...colProps}>
                    <Form.Item {...formItemLayout} label={formatMessage({ id: 'END_DATE' })}>
                      {getFieldDecorator(`endDate`)(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col {...colProps}>
                    <Form.Item {...formItemLayout} label={formatMessage({ id: 'SALES_PERSON' })}>
                      {getFieldDecorator(`salePerson`)(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col {...colProps}>
                    <Form.Item
                      {...formItemLayout}
                      label={formatMessage({ id: 'CATEGORY_AND_CUSTOMER_GROUP' })}
                    >
                      {getFieldDecorator(`cateAndGroup`)(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
              </React.Fragment>
            )}
          </div>
          <Row>
            <Col style={{ textAlign: 'right', borderTop: '1px solid #EEE', padding: '10px 15px' }}>
              <Button onClick={e => this.cancel(e)}>
                {formatMessage({ id: 'COMMON_CANCEL' })}
              </Button>
              <Button
                disabled={userFormOkDisable}
                type="primary"
                htmlType="submit"
                loading={addLoading || modifyLoading}
                style={{ marginLeft: '10px', display: type === 'DETAIL' ? 'none' : 'inline' }}
              >
                {formatMessage({ id: 'COMMON_OK' })}
              </Button>
            </Col>
          </Row>
        </Form>
      </Fragment>
    );
  }
}

export default Index;
