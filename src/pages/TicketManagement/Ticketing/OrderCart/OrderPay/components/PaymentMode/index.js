import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from './index.less';

import { toThousandsByRound } from '@/pages/TicketManagement/utils/orderCartUtil';

@Form.create()
@connect(({ ticketBookingAndPayMgr }) => ({
  ticketBookingAndPayMgr,
}))
class PaymentModel extends Component {
  changePayModel = payModelInfo => {
    const {
      dispatch,
      ticketBookingAndPayMgr: { payModeList },
    } = this.props;
    const newList = payModeList.map(info => {
      let check = false;
      if (info.value === payModelInfo.value) {
        check = true;
      }
      return Object.assign(
        {},
        {
          ...info,
          check,
        }
      );
    });
    dispatch({
      type: 'ticketBookingAndPayMgr/save',
      payload: {
        payModeList: newList,
      },
    });
  };

  checkAccountInfo = () => {
    const {
      ticketBookingAndPayMgr: { payModeList, accountInfo, bookDetail },
    } = this.props;

    const checkAccountInfo = {
      accountType: null,
      tipInfo: null,
      balance: 0.0,
      balanceDesc: '',
    };

    if (!accountInfo) {
      return checkAccountInfo;
    }

    const payMode = payModeList.find(payModeItem => payModeItem.check);
    if (payMode.label === 'eWallet' && accountInfo.eWallet) {
      checkAccountInfo.accountType = 'ew';
      checkAccountInfo.balance = accountInfo.eWallet.balance;
      if (accountInfo.eWallet.balance < bookDetail.totalPrice) {
        checkAccountInfo.tipInfo = 'e-Wallet balance is insufficient.';
      }
      checkAccountInfo.balanceDesc = 'e-Wallet Balance';
    } else if (payMode.label === 'Credit Card') {
      checkAccountInfo.accountType = 'cc';
    } else if (payMode.label === 'AR' && accountInfo.ar) {
      checkAccountInfo.accountType = 'ar';
      checkAccountInfo.balance = accountInfo.ar.balance;
      if (accountInfo.ar.balance < bookDetail.totalPrice) {
        checkAccountInfo.tipInfo =
          "You don't have enough balance,Please change another payment mode.";
      }
      checkAccountInfo.balanceDesc = 'AR Balance';
    }
    checkAccountInfo.balance = toThousandsByRound(Number(checkAccountInfo.balance).toFixed(2));
    return checkAccountInfo;
  };

  refreshAccount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketBookingAndPayMgr/fetchAccountDetail',
      payload: {},
    });
  };

  accountToUp = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'ticketBookingAndPayMgr/fetchAccountTopUp',
          payload: {
            topupAmount: values.topupAmount,
          },
        }).then(result => {
          if (!result || !result.paymentPageUrl) return;
          const w = window.open('about:blank');
          w.location.href = result.paymentPageUrl;
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      ticketBookingAndPayMgr: { payModeList, accountInfo },
    } = this.props;

    let payModeListNew = [...payModeList];
    if (
      !accountInfo ||
      !accountInfo.eWallet ||
      (accountInfo.eWallet && accountInfo.eWallet.status !== 'A')
    ) {
      payModeListNew = payModeListNew.filter(payMode => payMode.key !== 'eWallet');
    }
    if (!accountInfo || !accountInfo.ar || (accountInfo.ar && accountInfo.ar.status !== 'A')) {
      payModeListNew = payModeListNew.filter(payMode => payMode.key !== 'AR');
    }

    const checkAccountInfo = this.checkAccountInfo();

    const accountTypeColGrid = { xs: 18, sm: 16, md: 12, lg: 6, xl: 4, xxl: 4 };
    const accountTopupColGrid = { xs: 6, sm: 8, md: 12, lg: 18, xl: 20, xxl: 20 };

    return (
      <div>
        <Row>
          <Col span={24}>
            <span className={styles.titleBlack}>{formatMessage({ id: 'PAYMENT_MODE' })}</span>
          </Col>
        </Row>
        <Row style={{ margin: '20px 0 5px 0' }}>
          <Col span={24}>
            {payModeListNew &&
              payModeListNew.map(payModelInfo => {
                if (payModelInfo.check) {
                  return (
                    <div
                      key={`payModelInfo_${payModelInfo.value}`}
                      className={styles.payModelActiveBtn}
                      onClick={() => {
                        this.changePayModel(payModelInfo);
                      }}
                    >
                      <span className={styles.payModelSpan}>{payModelInfo.label}</span>
                      <div className={styles.payModelActiveIconDiv} />
                      <Icon className={styles.payModelActiveIcon} type="check" />
                    </div>
                  );
                }
                return (
                  <div
                    key={`payModelInfo_${payModelInfo.value}`}
                    className={styles.payModelBtn}
                    onClick={() => {
                      this.changePayModel(payModelInfo);
                    }}
                  >
                    <span className={styles.payModelSpan}>{payModelInfo.label}</span>
                  </div>
                );
              })}
          </Col>
        </Row>

        {checkAccountInfo.tipInfo && (
          <Row className={styles.infoIconDiv}>
            <Col span={24}>
              <Icon className={styles.infoIcon} type="info-circle" theme="filled" />
              <span className={styles.infoIconSpan}>{checkAccountInfo.tipInfo}</span>
            </Col>
          </Row>
        )}

        {checkAccountInfo.accountType !== 'cc' &&
          accountInfo &&
          (accountInfo.eWallet || accountInfo.ar) && (
            <Row className={styles.balanceDiv}>
              <Col span={24}>
                <span className={styles.balanceSpan}>{checkAccountInfo.balanceDesc}: </span>
                <span className={styles.balancePriceSpan}>${checkAccountInfo.balance}</span>
                <Tooltip title="Refresh">
                  <Icon
                    className={styles.balanceIcon}
                    type="reload"
                    onClick={this.refreshAccount}
                  />
                </Tooltip>
              </Col>
            </Row>
          )}

        {checkAccountInfo.accountType === 'ew' && checkAccountInfo.tipInfo && (
          <Row className={styles.topUpDiv}>
            <Col {...accountTypeColGrid} style={{ maxWidth: '200px' }}>
              <Form>
                <Form.Item label="">
                  {getFieldDecorator(`topupAmount`, {
                    rules: [
                      {
                        pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
                        message: 'Please enter the topup amount number',
                      },
                      {
                        required: true,
                        message: 'Required',
                      },
                    ],
                  })(<Input className={styles.topUpInput} placeholder="Please Input" allowClear />)}
                </Form.Item>
              </Form>
            </Col>
            <Col {...accountTopupColGrid}>
              <Button className={styles.topUpBtn} onClick={this.accountToUp}>
                Top Up
              </Button>
            </Col>
          </Row>
        )}
      </div>
    );
  }
}

export default PaymentModel;
