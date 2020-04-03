import React from 'react';
import {Button, Card, Col, message, Modal, Row, Spin} from 'antd';
import {connect} from 'dva';
import PaymentMode from '../PaymentMode';
import styles from './index.less';

@connect(({ queryOrderPaymentMgr }) => ({
  queryOrderPaymentMgr,
}))
class PaymentModal extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'queryOrderPaymentMgr/initPage',
      payload: {},
    });
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
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
    if (payMode.label === 'eWallet') {
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
          const openWindow = window.open('about:blank');
          if (openWindow) {
            openWindow.location.href = result.url;
          } else {
            message.error('Open window error!');
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

    if (!accountInfo) {
      return false;
    }

    let active = false;
    const payMode = payModeList.find(payModeItem => payModeItem.check);
    if (payMode.label === 'eWallet') {
      if (accountInfo.eWallet && accountInfo.eWallet.balance >= bookDetail.totalPrice) {
        active = true;
      }
    } else if (payMode.label === 'Credit Card') {
      if (accountInfo.cc && accountInfo.cc.balance >= bookDetail.totalPrice) {
        active = true;
      }
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
              <span className={styles.modelFormItem}>PAMS Transaction No.</span>
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
                      TOTAL PAY: <span className={styles.priceFont}>${this.payTotal()}</span>
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
