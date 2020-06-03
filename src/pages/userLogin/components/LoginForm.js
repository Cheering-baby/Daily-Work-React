import React from 'react';
import { formatMessage } from 'umi/locale';
import { Button, Form, Input } from 'antd';
import { connect } from 'dva';
import loginStyles from '../login.less';

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
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
            loginType: '01',
            redirect,
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const requiredMsg = formatMessage({ id: 'REQUIRED' });
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label={formatMessage({ id: 'USER_LOGIN' })}>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: requiredMsg }],
          })(
            <Input
              placeholder={formatMessage({ id: 'USER_LOGIN_PLACEHOLDER' })}
              size="default"
              autoComplete="off"
            />
          )}
        </FormItem>
        <FormItem label={formatMessage({ id: 'PASSWORD' })}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: requiredMsg }],
          })(
            <Input.Password
              placeholder={formatMessage({ id: 'PASSWORD_PLACEHOLDER' })}
              type="password"
            />
          )}
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
}))(Form.create()(NormalLoginForm));
