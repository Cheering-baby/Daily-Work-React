import React, { Component } from 'react';
import { connect } from 'dva';
import { Alert, Button, Col, Divider, Form, Input, Progress, Row } from 'antd';
import { Icon as MobileIcon, NavBar } from 'antd-mobile';
import { formatMessage } from 'umi/locale';
import MediaQuery from 'react-responsive';
import CommonModal from '@/components/CommonModal';
import { isMatchPwdRule } from '@/utils/utils';
import SCREEN from '@/utils/screen';
import styles from './ResetPwd.less';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const ColProps = {
  xs: 24,
  sm: 24,
  md: 24,
  xl: 24,
};

const checkPasswordSafe = (password, userCode) => {
  // 根据密码来判断安全等级
  const digitStr = /\d$/; // 所有数字
  const charStr = /\D$/; // 所有字符
  const specialStr = '@#$%!&*'; // 所有特殊字符
  const upperStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // 所有大写字符

  let allDigits = true;
  let allChars = true;
  let allSame = true;
  let specialFlag = true;
  let upperCaseFlag = true;

  if (password.indexOf(userCode) >= 0) {
    // 包含staffCode
    return 1;
  }
  if (password.length < 6) {
    // 密码长度小于6
    return 1;
  }
  const pwd = password.split('');
  pwd.forEach((item, index) => {
    if (digitStr.test(password.charAt(index))) {
      allDigits = false;
    }
    if (charStr.test(password.charAt(index))) {
      allChars = false;
    }
    if (specialStr.indexOf(password.charAt(index)) >= 0) {
      specialFlag = false;
    }
    if (upperStr.indexOf(password.charAt(index)) >= 0) {
      upperCaseFlag = false;
    }
    if (index > 0) {
      if (password.charAt(index) !== password.charAt(index - 1)) {
        allSame = false;
      }
    }
  });
  if (allSame) {
    return 1;
  }
  if (allDigits || allChars) {
    return 2;
  }
  if (password.length >= 8 && !specialFlag && !upperCaseFlag) {
    return 4;
  }
  return 3;
};

const judgeLevel = level => {
  if (level === 0) return '';
  if (level <= 25) return formatMessage({ id: 'PWD_SECURITY_LEVEL_LOW' });
  if (level <= 50) return formatMessage({ id: 'PWD_SECURITY_LEVEL_MEDIUM' });
  if (level <= 75) return formatMessage({ id: 'PWD_SECURITY_LEVEL_HIGH' });
  if (level <= 100) return formatMessage({ id: 'PWD_SECURITY_LEVEL_HIGHER' });
};

@Form.create()
@connect(({ login, loading }) => ({
  login,
  lodaing: loading.effects['login/changeUserPwd'],
}))
class Restmodal extends Component {
  static defaultProps = {
    onOk: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      securityPer: 0,
      securityTxt: '',
    };
    this.rules = {
      userPwdMinLength: 8, // 默认为1
      pwdComposition: '3', // 默认组成规则为1
      userPwdMaxLength: 30,
    };
  }

  checkPwd = (rule, value, callback) => {
    const {
      login: { securityRule },
      form,
    } = this.props;
    const { confirmDirty } = this.state;
    const newRules = {
      ...this.rules,
      ...securityRule,
      userPwdMaxLength: this.rules.userPwdMaxLength,
    };
    if (value && value === form.getFieldValue('OLD_PWD')) {
      callback(formatMessage({ id: 'PWD_NEW_PWD_SAME_ERROR' }));
    }
    const msg = isMatchPwdRule(value, newRules);
    if (value && msg === true) {
      if (confirmDirty) form.validateFields(['NEW_PWD_CONFIR'], { force: true });
      callback();
    } else callback(msg);
  };

  compareToPwd = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('NEW_PWD')) {
      callback(formatMessage({ id: 'PWD_CONFIRM_PWD_ERROR' }));
    } else callback();
  };

  calculate = e => {
    const { value } = e.target;
    const {
      login: { userMsg },
    } = this.props;
    let levelId = 0;
    const password = value.replace(/\s/g, ''); // 删除空格
    if (password !== '') {
      levelId = checkPasswordSafe(password, userMsg.userCode);
    }
    this.setState({
      securityPer: levelId * 25,
      securityTxt: judgeLevel(levelId * 25),
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const {
      form,
      dispatch,
      login: { userMsg },
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'login/changeUserPwd',
          payload: {
            newPwd: values.NEW_PWD,
            oldPwd: values.OLD_PWD,
            userCode: userMsg.username,
          },
        });
      }
    });
  };

  handleClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/closeModal',
    });
  };

  handleFormat = percent => {
    const { securityTxt } = this.state;
    return `${percent}% ${securityTxt}`;
  };

  getFooter = (needChangePassword, loading) => {
    if (String(needChangePassword) === '01' || String(needChangePassword) === '02') {
      return [
        <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
          {formatMessage({ id: 'COMMON_OK' })}
        </Button>,
      ];
    }
    return [
      <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
        {formatMessage({ id: 'COMMON_OK' })}
      </Button>,
      <Button key="cancel" loading={loading} onClick={this.handleClose}>
        {formatMessage({ id: 'COMMON_CANCEL' })}
      </Button>,
    ];
  };

  getMobileFooter = (needChangePassword, loading) => {
    if (String(needChangePassword) === '01' || String(needChangePassword) === '02') {
      return (
        <Row gutter={8}>
          <Col span={24}>
            <Button type="primary" block loading={loading} onClick={this.handleSubmit}>
              {formatMessage({ id: 'COMMON_OK' })}
            </Button>
          </Col>
        </Row>
      );
    }
    return (
      <Row gutter={8}>
        <Col span={12}>
          <Button type="primary" block loading={loading} onClick={this.handleSubmit}>
            {formatMessage({ id: 'COMMON_OK' })}
          </Button>
        </Col>
        <Col span={12}>
          <Button block loading={loading} onClick={this.handleClose}>
            {formatMessage({ id: 'COMMON_CANCEL' })}
          </Button>
        </Col>
      </Row>
    );
  };

  render() {
    const {
      data,
      loading,
      onOk,
      iconArr,
      needChangePassword,
      form: { getFieldDecorator },
      ...modalProps
    } = this.props;
    const modalOpts = {
      ...modalProps,
      onCancel: this.handleClose,
      width: 700,
      className: styles.resetModal,
      title: formatMessage({ id: 'PWD_CHANGE_PWD' }),
      footer: this.getFooter(needChangePassword, loading),
      closable: !(String(needChangePassword) === '01' || String(needChangePassword) === '02'),
    };
    const { securityPer } = this.state;
    const mobileModalOpts = {
      mode: 'light',
      icon:
        String(needChangePassword) === '01' || String(needChangePassword) === '02' ? null : (
          <MobileIcon type="left" />
        ),
      onLeftClick: this.handleClose,
      rightContent: [],
    };
    const childrenHtml = (
      <React.Fragment>
        <Alert
          message={formatMessage({ id: 'PWD_CONDITIONS_ALERT' })}
          type="warning"
          showIcon
          style={{ marginBottom: '1rem' }}
        />
        <Row gutter={24}>
          <div className={styles.resetContent}>
            <Col {...ColProps}>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'PWD_SECURITY_LEVEL' })}>
                <Progress percent={securityPer} format={this.handleFormat} />
              </FormItem>
            </Col>
            <Col {...ColProps}>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'PWD_OLD_PWD' })}>
                {getFieldDecorator('OLD_PWD', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'PWD_OLD_PWD_REQUIRED' }),
                    },
                  ],
                })(<Input type="password" />)}
              </FormItem>
            </Col>
            <Col {...ColProps}>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'PWD_NEW_PWD' })}>
                {getFieldDecorator('NEW_PWD', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'PWD_NEW_PWD_REQUIRED' }),
                    },
                    {
                      validator: this.checkPwd,
                    },
                  ],
                })(<Input type="password" onKeyUp={this.calculate} />)}
              </FormItem>
            </Col>
            <Col {...ColProps}>
              <FormItem {...formItemLayout} label={formatMessage({ id: 'PWD_CONFIRM_PWD' })}>
                {getFieldDecorator('NEW_PWD_CONFIR', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'PWD_CONFIRM_PWD_REQUIRED' }),
                    },
                    {
                      validator: this.compareToPwd,
                    },
                  ],
                })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
              </FormItem>
            </Col>
          </div>
        </Row>
        <Divider className={styles.resetDivider} style={{ height: '1px !important' }} />
        <Row type="flex" justify="space-around">
          <Col span={24} className={styles.resetHeadTop}>
            <p>{formatMessage({ id: 'PWD_CONDITIONS' })}</p>
          </Col>
          <Col span={24} className={styles.resetHeadBottom}>
            <ul>
              <li>
                <p className={styles.resetHeadBottomP}>
                  {formatMessage({ id: 'PWD_CONDITIONS_ONE' })}
                </p>
              </li>
              <li>
                <p className={styles.resetHeadBottomP}>
                  {formatMessage({ id: 'PWD_CONDITIONS_TWO' })}
                </p>
              </li>
            </ul>
          </Col>
        </Row>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <MediaQuery
          maxWidth={SCREEN.screenMdMax}
          minWidth={SCREEN.screenSmMin}
          maxHeight={SCREEN.screenXsMax}
        >
          <div className={styles.mobileModelWrapper}>
            <NavBar {...mobileModalOpts}>{formatMessage({ id: 'PWD_CHANGE_PWD' })}</NavBar>
            <div className={styles.contentWrapper}>{childrenHtml}</div>
            <div className={styles.buttonWrapper}>
              {this.getMobileFooter(needChangePassword, loading)}
            </div>
          </div>
        </MediaQuery>
        <MediaQuery
          maxWidth={SCREEN.screenMdMax}
          minWidth={SCREEN.screenSmMin}
          minHeight={SCREEN.screenSmMin}
        >
          <CommonModal modalOpts={modalOpts}>{childrenHtml}</CommonModal>
        </MediaQuery>
        <MediaQuery minWidth={SCREEN.screenLgMin}>
          <CommonModal modalOpts={modalOpts}>{childrenHtml}</CommonModal>
        </MediaQuery>
        <MediaQuery maxWidth={SCREEN.screenXsMax}>
          <div className={styles.mobileModelWrapper}>
            <NavBar {...mobileModalOpts}>{formatMessage({ id: 'PWD_CHANGE_PWD' })}</NavBar>
            <div className={styles.contentWrapper}>{childrenHtml}</div>
            <div className={styles.buttonWrapper}>
              {this.getMobileFooter(needChangePassword, loading)}
            </div>
          </div>
        </MediaQuery>
      </React.Fragment>
    );
  }
}

export default Restmodal;
