import React from 'react';
import { Button, Card, Col, message, Modal, Row, Spin } from 'antd';
import { connect } from 'dva';
import PaymentMode from '../PaymentMode';
import styles from './index.less';

@connect(({ queryOrderPaymentMgr, global }) => ({
  queryOrderPaymentMgr,
  global,
}))
class PaymentModal extends React.Component {
  componentDidMount() {
    const {
      dispatch,
      global: {
        currentUser: { userType },
      },
    } = this.props;
    if (userType === '02') {
      dispatch({
        type: 'queryOrderPaymentMgr/initPage',
        payload: {},
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'queryOrderPaymentMgr/resetData',
    });
  }

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'queryOrderPaymentMgr/save',
      payload: {
        paymentModalVisible: false,
        payPageLoading: false,
        bookingNo: null,
      },
    });
  };

  getBookingNo = selectedBooking => {
    if (selectedBooking && selectedBooking.bookingNo) {
      return selectedBooking.bookingNo;
    }

    return '-';
  };

  payTotal = () => {
    const {
      queryOrderPaymentMgr: { bookDetail },
    } = this.props;
    return Number(bookDetail.totalPrice).toFixed(2);
  };

  confirmEvent = () => {
    const {
      dispatch,
      queryOrderPaymentMgr: { payModeList, accountInfo, bookDetail },
    } = this.props;

    const payMode = payModeList.find(payModeItem => payModeItem.check);
    if (payMode.label === 'e-Wallet') {
      if (accountInfo.eWallet.balance >= bookDetail.totalPrice) {
        dispatch({
          type: 'queryOrderPaymentMgr/confirmEvent',
          payload: {},
        });
      }
    } else if (payMode.label === 'Credit Card') {
      dispatch({
        type: 'queryOrderPaymentMgr/sendTransactionPaymentOrder',
        payload: {},
      }).then(result => {
        if (result && result.url) {
          try {
            window.location.replace(result.url);
          } catch (e) {
            message.error('window location replace error!');
          }
        }
      });
    } else if (payMode.label === 'AR') {
      if (accountInfo.ar.balance >= bookDetail.totalPrice) {
        dispatch({
          type: 'queryOrderPaymentMgr/confirmEvent',
          payload: {},
        });
      }
    }
  };

  getConfirmEventStatus = () => {
    const {
      queryOrderPaymentMgr: { payModeList, accountInfo, bookDetail },
    } = this.props;

    let active = false;
    if (!payModeList) {
      return false;
    }
    const payMode = payModeList.find(payModeItem => payModeItem.check);

    if (payMode.label === 'Credit Card') {
      return true;
    }

    if (!accountInfo) {
      return false;
    }

    if (payMode.label === 'e-Wallet') {
      if (accountInfo.eWallet && accountInfo.eWallet.balance >= bookDetail.totalPrice) {
        active = true;
      }
    } else if (payMode.label === 'Credit Card') {
      // check balance
      active = true;
    } else if (payMode.label === 'AR') {
      if (accountInfo.ar && accountInfo.ar.balance >= bookDetail.totalPrice) {
        active = true;
      }
    }
    return active;
  };

  render() {
    const {
      queryOrderPaymentMgr: { paymentModalVisible, payPageLoading = false, selectedBooking },
    } = this.props;

    return (
      <Modal
        title={<span className={styles.modelTitleStyle}>Payment</span>}
        visible={paymentModalVisible}
        onCancel={this.handleCancel}
        footer={null}
      >
        <Spin spinning={payPageLoading}>
          <Row style={{ marginBottom: '16px', height: '26px', lineHeight: '26px' }}>
            <Col xs={24} md={12} lg={8}>
              <span className={styles.modelFormItem}>PARTNERS Order No.</span>
            </Col>
            <Col xs={24} md={12} lg={16}>
              <span>{this.getBookingNo(selectedBooking)}</span>
            </Col>
          </Row>
          <Row>
            <Col>
              <PaymentMode />
            </Col>
          </Row>
          <Row>
            <Col>
              <Card className={styles.cardStyles} style={{ marginTop: '0' }}>
                <div className={styles.checkOut}>
                  <div className={styles.checkOutPayDiv}>
                    <div className={styles.payFont}>
                      Total Amount Payable:{' '}
                      <span className={styles.priceFont}>${this.payTotal()}</span>
                    </div>
                  </div>
                  <Button
                    className={styles.checkOutButton}
                    htmlType="button"
                    size="large"
                    onClick={this.confirmEvent}
                    disabled={!this.getConfirmEventStatus()}
                  >
                    Confirm
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Spin>
      </Modal>
    );
  }
}

export default PaymentModal;
