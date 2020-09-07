import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import styles from '../index.less';

const verifySuccess = require('../../../assets/pams/signup/success.svg');

class VerifySuccess extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <div className={styles.recoverySuccessImg}>
          <img src={verifySuccess} alt="" />
        </div>
        <div className={styles.recoverySuccessTitle}>
          {formatMessage({ id: 'ACCOUNT_VERIFICATION_SUCCESS' })}
        </div>
        <div className={styles.enterTitle}>{formatMessage({ id: 'SUCCESS_TEXT' })}</div>
      </React.Fragment>
    );
  }
}

export default VerifySuccess;
