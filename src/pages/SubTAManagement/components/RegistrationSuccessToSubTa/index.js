import React, { PureComponent } from 'react';
import { Button, Col, Row } from 'antd';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import successURL from '../../../../assets/pams/signup/success.svg';
import styles from './index.less';

class RegistrationSuccessToSubTa extends PureComponent {
  closeSignUp = e => {
    e.preventDefault();
    router.push('/userLogin/pamsLogin');
  };

  render() {
    const { showViewInformation } = this.props;
    return (
      <React.Fragment>
        <Row type="flex" justify="space-around" className={styles.registrationSuccessfullyRow}>
          <Col span={24} className={styles.registrationSuccessfullyTop}>
            <img src={successURL} alt="" />
          </Col>
          <Col span={24} className={styles.registrationSuccessfullyContent}>
            <h3>{formatMessage({ id: 'SUB_TA_REGISTRATION_SUBMITTED_SUCCESS' })}</h3>
            <p>{formatMessage({ id: 'SUB_TA_SUCCESS_MESSAGE' })}</p>
          </Col>
          <Col span={24} className={styles.registrationSuccessfullyBottom}>
            <Button htmlType="button" loading={false} onClick={e => this.closeSignUp(e)}>
              {formatMessage({ id: 'SUB_TA_LOSE' })}
            </Button>
            <Button
              htmlType="button"
              type="primary"
              loading={false}
              onClick={e => showViewInformation(e)}
            >
              {formatMessage({ id: 'SUB_TA_VIEW_INFORMATION' })}
            </Button>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default RegistrationSuccessToSubTa;
