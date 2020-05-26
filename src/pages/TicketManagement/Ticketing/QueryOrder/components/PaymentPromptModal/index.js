import React from 'react';
import { Button, Col, Icon, message, Modal, Row } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

@connect(({ queryOrderPaymentMgr, global }) => ({
  queryOrderPaymentMgr,
  global,
}))
class PaymentPromptModal extends React.Component {
  componentDidMount() {}

  componentWillUnmount() {}

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'queryOrderPaymentMgr/save',
      payload: {
        paymentPromptVisible: false,
        downloadFileLoading: false,
      },
    });
  };

  downloadFileEvent = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'queryOrderPaymentMgr/fetchTicketDownload',
      payload: {},
    }).then(result => {
      if (result) {
        const openWindow = window.open(result);
        if (!openWindow) {
          message.error('Open window error!');
        }
      }
    });
  };

  getDownloadBtnName = () => {
    const {
      queryOrderPaymentMgr: { selectedBooking },
    } = this.props;
    let deliveryMode = null;
    if (selectedBooking && selectedBooking.offInstances) {
      selectedBooking.offInstances.forEach(offInstance => {
        // eslint-disable-next-line prefer-destructuring
        deliveryMode = offInstance.deliveryMode;
      });
    }
    if (deliveryMode === 'BOCA') {
      return 'Download Collection Letter';
    }
    if (deliveryMode === 'VID') {
      return 'Export VID';
    }
    if (deliveryMode === 'e-Ticket' || deliveryMode === 'eTicket') {
      return 'Download e-Ticket';
    }
  };

  render() {
    const {
      queryOrderPaymentMgr: { paymentPromptVisible, downloadFileLoading },
    } = this.props;

    return (
      <Modal title={null} visible={paymentPromptVisible} onCancel={this.handleCancel} footer={null}>
        <div className={styles.payModelIconDiv}>
          <Icon
            className={styles.payModelIcon}
            type="check-circle"
            theme="twoTone"
            twoToneColor="#52c41a"
          />
        </div>
        <p className={styles.payModelP}>Payment Successfully</p>
        <Row className={styles.payModelBtnRow}>
          <Col>
            <Button className={styles.payModelOneBtn} key="back" onClick={this.handleCancel}>
              OK
            </Button>
            <Button
              className={styles.payModelTwoBtn}
              key="submit"
              type="primary"
              loading={downloadFileLoading}
              onClick={this.downloadFileEvent}
            >
              {this.getDownloadBtnName()}
            </Button>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default PaymentPromptModal;
