/* eslint-disable */
import React from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { Modal, Form, Button, Input } from 'antd';

import styles from './topup.less';

const formItemLayout = {
  labelCol: {
    lg: { span: 6 },
    xs: { span: 6 },
    sm: { span: 6 },
  },
  wrapperCol: {
    lg: { span: 10 },
    xs: { span: 10 },
    sm: { span: 18 },
  },
};

@Form.create()
@connect(({ myWallet }) => ({
  myWallet,
}))
class Topup extends React.PureComponent {
  state = {
    loading: false,
    visible: false,
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  open = () => {
    this.setState({ visible: true });
  };

  handlerOk = e => {
    this.setState({ visible: false });
  };

  // eslint-disable-next-line no-unused-vars
  handleCancel = e => {
    this.setState({ visible: false });
  };

  render() {
    const vm = this;
    const { getFieldDecorator } = vm.props.form;
    const { visible, loading } = this.state;
    const {
      myWallet: { account = {} },
    } = this.props;
    const eWallet = account.eWallet || {};

    const modelProps = {
      title: formatMessage({ id: 'EWALLET_TOPUP_TITLE' }),
      visible,
      width: 595,
      onCancel: this.handleCancel,
      footer: [
        <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
          {formatMessage({ id: 'BTN_SEND' })}
        </Button>,
        <Button key="cancel" loading={loading} onClick={this.handleCancel}>
          {formatMessage({ id: 'BTN_CANCEL' })}
        </Button>,
      ],
    };
    return (
      <Modal {...modelProps}>
        <Form {...formItemLayout}>
          <Form.Item {...formItemLayout} label="Ewallet Balanc">
            {' '}
            <span className={`${styles.labelValue} ${styles.colorOrange}`}>${eWallet.balance}</span>
          </Form.Item>
          <Form.Item {...formItemLayout} label="Topup Amount">
            {getFieldDecorator(`topup_amount`, {
              rules: [
                {
                  required: true,
                  message: '',
                },
              ],
            })(<Input placeholder="amount" allowClear />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Topup;
