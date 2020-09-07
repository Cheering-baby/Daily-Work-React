import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import { Button, Card, Col, Form, Input, Row, Radio } from 'antd';
import styles from './index.less';
import VerifySuccess from './components/VerifySuccess';
import SelectAccount from './components/SelectAccount';

const FormItem = Form.Item;
const pamsImage = require('../../assets/image/PARTNERS-LOGO.png');

@Form.create()
@connect(({ forgetMgr, loading }) => ({
  forgetMgr,
  verifyLoading:
    loading.effects['forgetMgr/forgetPassword'] || loading.effects['forgetMgr/queryUsersByEmail'],
}))
class ForgetIdOrPassword extends PureComponent {
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'forgetMgr/clear',
    });
  }

  changeSearchType = value => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'forgetMgr/save',
      payload: {
        searchType: value,
      },
    });
    form.resetFields();
  };

  commitVerify = (e, searchType) => {
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        const { verifyValue } = values;
        const value = verifyValue ? verifyValue.trim() : verifyValue;
        if (searchType === 'accountId') {
          dispatch({
            type: 'forgetMgr/forgetPassword',
            payload: {
              userCode: value,
            },
          }).then(resultCode => {
            if (resultCode === 'AppUser-130004') {
              this.setFormError(form, verifyValue, searchType);
            }
          });
        } else if (searchType === 'email') {
          dispatch({
            type: 'forgetMgr/queryUsersByEmail',
            payload: {
              email: value,
            },
          }).then(usersLength => {
            if (usersLength === 0) {
              this.setFormError(form, verifyValue, searchType);
            }
          });
        }
      }
    });
  };

  setFormError = (form, verifyValue, searchType) => {
    const errorMsg =
      searchType === 'accountId'
        ? formatMessage({ id: 'ACCOUNT_ID_DOES_NOT_EXIST' })
        : formatMessage({ id: 'EMAIL_FORMAT_ERROR' });
    setTimeout(() => {
      form.setFields({
        verifyValue: {
          value: verifyValue,
          errors: [new Error(errorMsg)],
        },
      });
    }, 500);
  };

  render() {
    const {
      verifyLoading,
      form: { getFieldDecorator },
      forgetMgr: { searchType, verifySuccess = false, userCodeList = [], email },
    } = this.props;

    return (
      <React.Fragment>
        <header className={styles.head}>
          <div className={styles.headDiv}>
            <Link to="/userLogin/pamsLogin">
              <img src={pamsImage} title={formatMessage({ id: 'RETURN_TO_LOGIN' })} alt="" />
            </Link>
            <div className={styles.textDiv}>
              <Link to="/about?key=contactUs">{formatMessage({ id: 'CONTACT_US' })}</Link>
            </div>
          </div>
        </header>
        <section className={styles.main}>
          <Row type="flex" justify="space-around" id="forgetIdOrPassword">
            <Col span={24}>
              <Card
                className={styles.cardStyle}
                style={{ height: document.getElementById('root').offsetHeight - 104 }}
              >
                {verifySuccess && <VerifySuccess />}
                {!verifySuccess && userCodeList.length > 0 && (
                  <SelectAccount
                    userCodeList={userCodeList}
                    loading={verifyLoading}
                    email={email}
                  />
                )}
                {!verifySuccess && userCodeList.length === 0 && (
                  <React.Fragment>
                    <div className={styles.recoveryTitle}>
                      {formatMessage({ id: 'ACCOUNT_RECOVERY' })}
                    </div>
                    <div className={styles.enterTitle}>{formatMessage({ id: 'ENTER_TITLE' })}</div>
                    <div className={styles.radioStyle}>
                      <Radio.Group
                        disabled={!!verifyLoading}
                        value={searchType}
                        onChange={e => this.changeSearchType(e.target.value)}
                      >
                        <Radio value="accountId">Account ID</Radio>
                        <Radio value="email">Email</Radio>
                      </Radio.Group>
                    </div>
                    <div className={styles.accountInputDiv}>
                      <Form onSubmit={e => this.commitVerify(e, searchType)}>
                        <FormItem
                          colon={false}
                          label={searchType === 'accountId' ? 'Account ID' : 'Email'}
                        >
                          {getFieldDecorator('verifyValue', {
                            rules: [{ required: true, message: 'Required' }],
                          })(
                            <Input
                              disabled={!!verifyLoading}
                              placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                              size="default"
                              autoComplete="off"
                              allowClear
                            />
                          )}
                        </FormItem>
                        <FormItem>
                          <Button
                            loading={!!verifyLoading}
                            size="large"
                            type="primary"
                            htmlType="submit"
                            className={styles.verifyButton}
                          >
                            {formatMessage({ id: 'ACCOUNT_VERIFICATION' })}
                          </Button>
                        </FormItem>
                      </Form>
                    </div>
                  </React.Fragment>
                )}
              </Card>
            </Col>
          </Row>
        </section>
      </React.Fragment>
    );
  }
}

export default ForgetIdOrPassword;
