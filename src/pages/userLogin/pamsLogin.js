import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import { Button, message, Tabs } from 'antd';
import classNames from 'classnames';
import LoginForm from './components/LoginForm';
import SubLoginForm from './components/SubLoginForm';
import UAAService from '@/uaa-npm';
import loginStyles from './login.less';
// eslint-disable-next-line import/no-unresolved
import Copyright from './components/Copyright';

const {
  containerMain,
  loginBackdropBg,
  loginBackdrop,
  login,
  loginLogo,
  loginContent,
  loginBox,
  name,
  signUpBox,
  signUpBtn,
} = loginStyles;
const logoImg = require('../../assets/image/login-logo.png');
const projImg = require('../../assets/image/PAMS-black.png');

class PamsLogin extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'global/getLocale' }).then(() =>
      dispatch({ type: 'global/getSupportLanguage' })
    );
  }

  getLanguageItems = () => {
    const local = localStorage.getItem('locale');
    const {
      global: { languages },
    } = this.props;
    const items = [];
    let selectedItem = '';
    if (languages)
      languages.forEach(v => {
        if (v.key !== local) items.push(v);
        else selectedItem = v;
      });
    return { selectedItem, items };
  };

  goSignUp = e => {
    e.preventDefault();
    let pathname = '/TAManagement/SignUp';
    const {
      loginModel: { orgType, agentId },
    } = this.props;
    const queryParams = {};
    if (String(orgType) === '02') {
      // 01: TA 02: Sub TA 03: Normal Org
      pathname = '/SubTAManagement/SignUp';
      if (!agentId) {
        message.warn(formatMessage({ id: 'SIGN_UP_CHECK' }), 10);
        return;
      }
      queryParams.taId = agentId;
    }
    router.push({
      pathname,
      query: {
        ...queryParams,
      },
    });
  };

  saveOrgType = orgType => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/save',
      payload: {
        orgType,
      },
    });
  };

  render() {
    const {
      loginModel: { orgType = null },
      location: {
        query: { redirect },
      },
    } = this.props;
    const appCode = `${UAAService.defaults.appCode}`;
    return (
      <div id="pams" className={classNames(containerMain, 'login-wrap')}>
        <div className={loginBackdropBg} />
        <div className={loginBackdrop} />
        <div className={login}>
          <div className={loginLogo}>
            <img src={logoImg} alt="logo" />
          </div>
          <div className={loginContent}>
            <div className={loginBox}>
              <div className={name}>
                <img src={projImg} alt="logo" />
              </div>
              <Tabs
                activeKey={orgType || null}
                onChange={activeKey => {
                  this.saveOrgType(activeKey);
                }}
              >
                <Tabs.TabPane tab={formatMessage({ id: 'TA_RWS_USER' })} key="01">
                  <LoginForm appcode={appCode} redirect={redirect} />
                </Tabs.TabPane>
                <Tabs.TabPane tab={formatMessage({ id: 'SUB_TA' })} key="02">
                  <SubLoginForm appcode={appCode} redirect={redirect} />
                </Tabs.TabPane>
              </Tabs>
              {String(orgType) === '01' && (
                <div className={signUpBox}>
                  <Button type="link" className={signUpBtn} onClick={e => this.goSignUp(e)}>
                    {formatMessage({ id: 'SIGN_UP' })}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <Copyright />
      </div>
    );
  }
}

export default connect(({ global, login: loginModel }) => ({
  global,
  loginModel,
}))(PamsLogin);
