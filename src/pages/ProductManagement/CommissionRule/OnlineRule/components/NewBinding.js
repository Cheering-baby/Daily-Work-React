import React, { Component } from 'react';
import { connect } from 'dva';
import { router } from 'umi';
import { Form, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import NewOnlineOffer from './NewOnlineOffer';
import NewOfflineplu from './NewOfflineplu';
import ExcludedTA from './ExcludedTA';
import styles from '../New/index.less';

@Form.create()
@connect(({ commissionNew }) => ({
  commissionNew,
}))
class newBinding extends Component {
  render() {
    const { type, tplId = null, handleOk, add } = this.props;
    return (
      <div>
        <NewOnlineOffer type={type} tplId={tplId} add={add} />
        <NewOfflineplu type={type} tplId={tplId} />
        <ExcludedTA />
        <div className={styles.operateButtonDivStyle}>
          <Button
            style={{ marginRight: 8 }}
            onClick={() =>
              router.push({
                pathname: '/ProductManagement/CommissionRule/OnlineRule',
              })
            }
          >
            {formatMessage({ id: 'COMMON_CANCEL' })}
          </Button>
          <Button style={{ width: 60 }} onClick={() => handleOk()} type="primary">
            {formatMessage({ id: 'COMMON_OK' })}
          </Button>
        </div>
      </div>
    );
  }
}

export default newBinding;
