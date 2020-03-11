import React, { Fragment } from 'react';
import { Breadcrumb, Button, Card, Col, Form, Input, Row, Select, Table } from 'antd';
// import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
// import { SCREEN } from '../../../../utils/screen';
import { connect } from 'dva';
import TextArea from 'antd/es/input/TextArea';
import router from 'umi/router';
import styles from '../index.less';

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

const ColProps = {
  sm: 24,
  md: 12,
};

@Form.create()
@connect(({ userManagement, loading }) => ({
  userManagement,
  addLoading: loading.effects['userManagement/addTAUser'],
  modifyLoading: loading.effects['userManagement/modifyUser'],
}))
class Index extends React.PureComponent {
  componentDidMount() {
    // TODO get ROLES
    // TODO get companies
    //
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
      userManagement: { currentUserProfile = {} },
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let dispatchType = '';
        if (type === 'NEW') {
          dispatchType = 'userManagement/addTAUser';
        } else {
          dispatchType = 'userManagement/modifyUser';
          const { userRoles = [] } = currentUserProfile;
          const { roleCodes = [] } = values;
          const removeRoleCodes = this.getRemoveRoleCodes(userRoles, roleCodes);
          const addRoleCodes = this.getAdRoleCodes(userRoles, roleCodes);
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

  getAdRoleCodes = (userRoles = [], roleCodes = []) => {
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

  render() {
    const {
      type = 'NEW',
      userManagement = {},
      addLoading = false,
      modifyLoading = false,
    } = this.props;
    const { currentUserProfile = {} } = userManagement;
    const { taInfo = {}, userCode = '' } = currentUserProfile;
    const { companyId, fullName = '', phone = '', email = '', address = '', remarks = '' } = taInfo;

    const { getFieldDecorator } = this.props.form;
    const {} = this.props;
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
              <Col {...ColProps}>
                <Form.Item {...formItemLayout} label={formatMessage({ id: 'COMPANY_NAME' })}>
                  {getFieldDecorator(`companyId`, {
                    initialValue: companyId,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(
                    <Select
                      disabled={type === 'DETAIL'}
                      allowClear
                      placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                    >
                      <Option key="117" value="117">
                        TA1
                      </Option>
                      <Option key="18" value="118">
                        TA2
                      </Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...ColProps}>
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
              <Col {...ColProps}>
                <Form.Item {...formItemLayout} label={formatMessage({ id: 'FULL_NAME' })}>
                  {getFieldDecorator(`userName`, {
                    initialValue: fullName,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(
                    <Input
                      disabled={type === 'DETAIL'}
                      maxLength={100}
                      allowClear
                      placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                      autoComplete="off"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...ColProps}>
                <Form.Item {...formItemLayout} label={formatMessage({ id: 'ROLE' })}>
                  {getFieldDecorator(`roleCodes`, {
                    initialValue: this.getRoleCodes(currentUserProfile),
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(
                    <Select
                      allowClear
                      mode="multiple"
                      disabled={type === 'DETAIL'}
                      placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                    >
                      <Option key="1" value="ADMIN">
                        ADMIN
                      </Option>
                      <Option key="2" value="MAIN_TA_ADMIN">
                        MAIN_TA_ADMIN
                      </Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...ColProps}>
                <Form.Item {...formItemLayout} label={formatMessage({ id: 'PHONE' })}>
                  {getFieldDecorator(`phone`, {
                    initialValue: phone,
                  })(
                    <Input
                      disabled={type === 'DETAIL'}
                      type="number"
                      allowClear
                      maxLength={255}
                      placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                      autoComplete="off"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...ColProps}>
                <Form.Item {...formItemLayout} label={formatMessage({ id: 'EMAIL' })}>
                  {getFieldDecorator(`email`, {
                    initialValue: email,
                    rules: [
                      {
                        type: 'email',
                        message: formatMessage({ id: 'VALID_EMAIL' }),
                      },
                    ],
                  })(
                    <Input
                      disabled={type === 'DETAIL'}
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
                      disabled={type === 'DETAIL'}
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
                      disabled={type === 'DETAIL'}
                      maxLength={2000}
                      placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                      autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item {...formItemLayoutFull1} label={formatMessage({ id: 'MARKET' })}>
                  {getFieldDecorator(`market`)(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col {...ColProps}>
                <Form.Item {...formItemLayout} label={formatMessage({ id: 'EFFECTIVE_DATE' })}>
                  {getFieldDecorator(`effectiveDate`)(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col {...ColProps}>
                <Form.Item {...formItemLayout} label={formatMessage({ id: 'END_DATE' })}>
                  {getFieldDecorator(`endDate`)(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col {...ColProps}>
                <Form.Item {...formItemLayout} label={formatMessage({ id: 'SALES_PERSON' })}>
                  {getFieldDecorator(`salePerson`)(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col {...ColProps}>
                <Form.Item
                  {...formItemLayout}
                  label={formatMessage({ id: 'CATEGORY_AND_CUSTOMER_GROUP' })}
                >
                  {getFieldDecorator(`cateAndGroup`)(<Input disabled />)}
                </Form.Item>
              </Col>
            </Row>
          </div>
          <Row>
            <Col style={{ textAlign: 'right', borderTop: '1px solid #EEE', padding: '10px 15px' }}>
              <Button onClick={e => this.cancel(e)}>
                {formatMessage({ id: 'COMMON_CANCEL' })}
              </Button>
              <Button
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
