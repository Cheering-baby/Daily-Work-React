import React, { Component } from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import NewOnlineOffer from './NewOnlineOffer';
import NewOfflineplu from './NewOfflineplu';

@Form.create()
@connect(({ commissionNew }) => ({
  commissionNew,
}))
class newBinding extends Component {
  render() {
    const { type, tplId } = this.props;
    return (
      <div>
        <NewOnlineOffer type={type} tplId={tplId} />
        <NewOfflineplu type={type} />
      </div>
    );
  }
}

export default newBinding;
