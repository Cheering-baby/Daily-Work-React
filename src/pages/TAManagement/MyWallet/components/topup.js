/* eslint-disable */
import React from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { Button, Form, Input, Modal } from 'antd';

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
@connect(({ myWallet, topup, loading }) => ({
  myWallet,
  topup,
  loading: loading.effects['topup/featchTopup'],
}))
class Arapply extends React.PureComponent {
  state = {
    visible: false,
  };

  componentDidMount() {}

  handleClick = () => {
    this.setState({ visible: true });
  };

  handleOk = e => {
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'topup/featchTopup',
          payload: values,
          callback: (result = {}) => {
            if (!result || !result.paymentPageUrl) return;
            const w = window.open('about:blank');
            w.location.href = result.paymentPageUrl;
            // this.setState({ visible: false });
          },
        });
      }
    });
  };

  // eslint-disable-next-line no-unused-vars
  handleCancel = e => {
    this.setState({ visible: false });
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
    } = this.props;
    const { visible } = this.state;
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
      <React.Fragment>
        <Button type="primary" className={styles.button} onClick={this.handleClick}>
          {formatMessage({ id: 'TOPUP' })}
        </Button>
        <Modal {...modelProps}>
          <Form {...formItemLayout}>
            <Form.Item {...formItemLayout} label="Ewallet Balanc">
              <span className={`${styles.labelValue} ${styles.colorOrange}`}>
                ${eWallet.balance}
              </span>
            </Form.Item>
            <Form.Item {...formItemLayout} label="Topup Amount">
              {getFieldDecorator(`topupAmount`, {
                rules: [
                  {
                    pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
                    message: 'Please enter the topup amountxx',
                  },
                  {
                    required: true,
                    message: 'Please enter the topup amount',
                  },
                ],
              })(<Input placeholder="Topup Amount" allowClear />)}
            </Form.Item>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Arapply;
