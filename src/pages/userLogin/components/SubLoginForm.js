import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { Button, Form, Input, Select } from 'antd';
import loginStyles from '../login.less';

const FormItem = Form.Item;

class SubLoginForm extends Component {
  handleSubmit = e => {
    e.preventDefault();
    const {
      form: { validateFields },
      appCode,
      redirect,
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'login/login',
          payload: {
            ...values,
            appCode: appCode === undefined ? 'PAMS' : appCode,
            loginType: '02',
            redirect,
          },
        });
      }
    });
  };

  getUserOrg = e => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: 'login/fetchOrgListByUser',
      payload: {
        userCode: e.target.value,
      },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      login: { companyList = [], userCode = null, agentId = null },
    } = this.props;
    const requiredMsg = formatMessage({ id: 'REQUIRED' });
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label={formatMessage({ id: 'SUB_TA_USER_LOGIN' })}>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: requiredMsg }],
          })(
            <Input
              placeholder={formatMessage({ id: 'USER_LOGIN_PLACEHOLDER' })}
              size="default"
              autoComplete="off"
              onChange={e => this.getUserOrg(e)}
            />
          )}
        </FormItem>
        <FormItem label={formatMessage({ id: 'TA_COMPANY_NAME' })}>
          {getFieldDecorator('agentId', {
            rules: [{ required: true, message: requiredMsg }],
            initialValue: agentId || [],
          })(
            <Select
              getPopupContainer={() => document.getElementById(`pams`)}
              placeholder={formatMessage({ id: 'TA_COMPANY_NAME_PLACEHOLDER' })}
              disabled={!userCode}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {companyList && companyList.length > 0
                ? companyList.map(item => (
                  <Select.Option key={`companyList${item.taId}`} value={`${item.taId}`}>
                    {item.companyName}
                  </Select.Option>
                  ))
                : null}
            </Select>
          )}
        </FormItem>
        <FormItem label={formatMessage({ id: 'PASSWORD' })}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: requiredMsg }],
          })(<Input placeholder={formatMessage({ id: 'PASSWORD_PLACEHOLDER' })} type="password" />)}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className={loginStyles.btn} block>
            {formatMessage({ id: 'LOGIN' })}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default connect(({ login }) => ({
  login,
}))(Form.create()(SubLoginForm));
