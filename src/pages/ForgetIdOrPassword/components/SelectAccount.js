import React, { PureComponent } from 'react';
import { Icon, List, Radio, Button } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import styles from '../index.less';

@connect()
class SelectAccount extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedAccount: undefined,
    };
  }

  continueToReset = selectedAccount => {
    const { dispatch } = this.props;
    dispatch({
      type: 'forgetMgr/forgetPassword',
      payload: {
        userCode: selectedAccount,
      },
    });
  };

  changeAccountId = e => {
    this.setState({
      selectedAccount: e.target.value,
    });
  };

  backToVerify = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'forgetMgr/clear',
    });
  };

  render() {
    const { selectedAccount } = this.state;
    const { userCodeList = [], loading, email } = this.props;

    return (
      <React.Fragment>
        <div className={styles.selectAccountTitle}>
          <Icon type="left" onClick={() => this.backToVerify()} style={{ marginRight: 10 }} />
          {formatMessage({ id: 'SELECT_ACCOUNT' })}
        </div>
        <div className={styles.selectDetail}>
          To continue, please select your account ID under {email} to retrieve the password.
        </div>
        <div className={styles.userCodeItemList}>
          <Radio.Group disabled={!!loading} value={selectedAccount} onChange={this.changeAccountId}>
            <List
              bordered
              dataSource={userCodeList}
              renderItem={item => (
                <List.Item>
                  <Radio value={item}>{item}</Radio>
                </List.Item>
              )}
            />
          </Radio.Group>
        </div>
        <div className={styles.continueDiv}>
          <Button
            disabled={selectedAccount === undefined}
            loading={!!loading}
            size="large"
            type="primary"
            className={styles.continueButton}
            onClick={() => this.continueToReset(selectedAccount)}
          >
            {formatMessage({ id: 'CONTINUE' })}
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default SelectAccount;
