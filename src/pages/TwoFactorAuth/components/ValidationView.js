import React, { Component } from 'react';
// eslint-disable-next-line import/extensions
import { formatMessage } from 'umi/locale';
import { Form, Icon, Input, Button } from 'antd';
import { connect } from 'dva';
import styles from '../twoFactorAuth.less';

const FormItem = Form.Item;
const projImg = require('../../../assets/image/PAMS-black.png');

@Form.create()
@connect(({ twoFactorAuth }) => ({
  twoFactorAuth,
}))
class NormalLoginForm extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'twoFactorAuth/sendCode',
    }).then(res => {
      const { countDown = 0 } = res;
      if (countDown > 0) {
        const {
          twoFactorAuth: { timeChange = 0 },
        } = this.props;
        clearInterval(timeChange);
        this.beginCountDown();
      }
    });
  }

  componentWillUnmount() {
    const {
      dispatch,
      twoFactorAuth: { timeChange = 0 },
    } = this.props;
    clearInterval(timeChange);
    dispatch({
      type: 'twoFactorAuth/resetData',
    });
  }

  beginCountDown = () => {
    const {
      dispatch,
      twoFactorAuth: { timeChange = 0 },
    } = this.props;
    clearInterval(timeChange);
    const newTimeChange = setInterval(this.countClock, 1000);
    dispatch({
      type: 'twoFactorAuth/saveData',
      payload: {
        timeChange: newTimeChange,
      },
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const {
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'twoFactorAuth/validation',
          payload: {
            ...values,
          },
        });
      }
    });
  };

  updateCountDown = (countDown, retrieveCaptchaAvailable) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'twoFactorAuth/updateCountDown',
      payload: {
        countDown,
        retrieveCaptchaAvailable,
      },
    });
  };

  backToLogin = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/logout',
    });
  };

  countClock = () => {
    const {
      twoFactorAuth: { countDown = 0, timeChange = 0 },
    } = this.props;
    let leftTime = countDown;
    if (leftTime > 0) {
      leftTime -= 1;
      this.updateCountDown(leftTime, false);
    } else {
      this.updateCountDown(0, true);
      clearInterval(timeChange);
    }
  };

  sendCode = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'twoFactorAuth/sendCode',
    }).then(res => {
      const { reSend = false } = res;
      if (reSend) {
        this.beginCountDown();
      }
    });
  };

  checkValidationCode = (rule, value, callback) => {
    if (!value || value.length !== 6 || Number.isFinite(value)) {
      callback(formatMessage({ id: 'VALIDATION_CODE_CHECK_MESSAGE' }));
    }
    return callback();
  };

  render() {
    const {
      form: { getFieldDecorator },
      twoFactorAuth: { countDown = 0, retrieveCaptchaAvailable = false },
    } = this.props;

    return (
      <div className={styles.loginContent}>
        <div className={styles.loginBox}>
          <div>
            <div className={styles.name}>
              <Icon type="left" className={styles.backIcon} onClick={this.backToLogin} />
              <img src={projImg} alt="logo" />
            </div>
          </div>
          <div
            className={`${styles.loginBoxTitle} ${styles['js-can-choose']} ${styles.validationTitle}`}
          >
            {formatMessage({ id: 'TWO_FACTOR_VALIDATION_SENT' })}
          </div>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              label={formatMessage({ id: 'TWO_FACTOR_VALIDATION_CODE' })}
              style={{ minHeight: 82 }}
            >
              {getFieldDecorator('validationCode', {
                rules: [{ validator: this.checkValidationCode }],
              })(
                <Input
                  size="default"
                  autoComplete="off"
                  maxLength={6}
                  onChange={e => {
                    e.target.value = e.target.value.replace(/[^\d]/g, '');
                  }}
                />
              )}
              <a
                disabled={!retrieveCaptchaAvailable}
                onClick={this.sendCode}
                className={styles.validationButton}
              >
                {retrieveCaptchaAvailable ? (
                  <span>{formatMessage({ id: 'RETRIEVE_VALIDATION_CODE' })}</span>
                ) : (
                  <span>
                    {formatMessage({ id: 'DISABLED_RETRIEVE_VALIDATION_CODE' })}
                    <span className={styles.countNum}>{countDown}s</span>
                  </span>
                )}
              </a>
            </FormItem>
            <FormItem>
              <Button type="default" htmlType="submit" className={styles.btn}>
                <Icon type="arrow-right" />
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default NormalLoginForm;
