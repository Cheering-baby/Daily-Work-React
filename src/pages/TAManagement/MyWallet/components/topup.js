import React from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { Button, Form, Input, Modal } from 'antd';
import CurrencyFormatter from 'currencyformatter.js';
import styles from './topup.less';

const CURRENCY_FORMATTER_OPTIONS_DECIMAL = {
  // currency: 	'USD', 		// If currency is not supplied, defaults to USD
  symbol: '', // Overrides the currency's default symbol
  // thousand: ',',
  // locale: 	'en',			  // Overrides the currency's default locale (see supported locales)
  decimal: '.', // Overrides the locale's decimal character
  group: ',', // Overrides the locale's group character (thousand separator)
  pattern: '#,##0.00', // Overrides the locale's default display pattern
};

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

  handleOk = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'topup/featchTopup',
          payload: values,
          callback: (result = {}) => {
            if (!result || !result.paymentPageUrl) return;
            window.location.href = result.paymentPageUrl;
            this.setState({ visible: false });
            // Modal.confirm({
            //   content: formatMessage({ id: 'TOPUP_COMPLETED_TIPS' }),
            //   cancelText: formatMessage({ id: 'TOPUP_COMPLETED_TIPS_CANCEL_TEXT' }),
            //   okText: formatMessage({ id: 'TOPUP_COMPLETED_TIPS_OK_TEXT' }),
            //   onCancel: () => {
            //     dispatch({ type: 'myWallet/fetchAccountDetail' });
            //     dispatch({ type: 'myWallet/fetchAccountFlowList' });
            //   },
            //   onOk: () => {
            //     dispatch({ type: 'myWallet/fetchAccountDetail' });
            //     dispatch({ type: 'myWallet/fetchAccountFlowList' });
            //   },
            // });
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
            <Form.Item {...formItemLayout} label="Ewallet Balance">
              <span className={`${styles.labelValue} ${styles.colorOrange}`}>
                {CurrencyFormatter.format(eWallet.balance, CURRENCY_FORMATTER_OPTIONS_DECIMAL)}
              </span>
            </Form.Item>
            <Form.Item {...formItemLayout} label="Topup Amount">
              {getFieldDecorator(`topupAmount`, {
                rules: [
                  {
                    min: 0,
                    max: 21000000,
                    pattern: /^(([1-9]{1}\d*)|(0{1}))$/,
                    message: formatMessage({ id: 'TOPUP_AMOUNT_VALIDATE_MAX_VAL_MESSAGE' }),
                    validator: (rule, value) => {
                      if (!rule.pattern.test(value)) {
                        return false;
                      }
                      const v = Number(value);
                      return v > rule.min && v <= rule.max;
                    },
                  },
                ],
              })(<Input prefix="$" placeholder="Topup Amount" allowClear />)}
            </Form.Item>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Arapply;
