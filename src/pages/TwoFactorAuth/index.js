import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './twoFactorAuth.less';
import ValidationView from './components/ValidationView';

const logoImg = require('../../assets/image/login-logo.png');

@connect()
class TwoFactorAuth extends Component {
  render() {
    return (
      <div id="app" className={styles.containerMain}>
        <div className={styles.loginBackdropBackground} />
        <div className={styles.loginBackdrop} />
        <div className={styles.login}>
          <div className={styles.loginLogo}>
            <img src={logoImg} alt="logo" />
          </div>
          <ValidationView />
        </div>
      </div>
    );
  }
}

export default TwoFactorAuth;
