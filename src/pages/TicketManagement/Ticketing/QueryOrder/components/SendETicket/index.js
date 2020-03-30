import React from 'react';
import { formatMessage } from 'umi/locale';
import { Button, Form, Input, message, Modal } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const FormItem = Form.Item;

@Form.create()
@connect(({ sendETicketMgr }) => ({
  sendETicketMgr,
}))
class SendETicket extends React.Component {
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sendETicketMgr/resetData',
    });
  }

  handleOk = (bookingNo, email) => {
    const { dispatch, form } = this.props;
    form.validateFields(err => {
      if (!err) {
        dispatch({
          type: 'sendETicketMgr/sendEmail',
          payload: {
            forderNo: bookingNo,
            email,
            busiType: 'eTicket',
          },
        }).then(resultCode => {
          if (resultCode === '0') {
            message.success('Send successfully.');
            this.handleCancel();
          } else {
            message.warning(resultCode);
          }
        });
      }
    });
  };

  handleCancel = () => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'sendETicketMgr/effectSave',
      payload: {
        sendETicketVisible: false,
      },
    }).then(() => {
      setTimeout(() => {
        dispatch({
          type: 'sendETicketMgr/save',
          payload: {
            bookingNo: null,
            email: null,
          },
        });
      }, 500);
      form.setFieldsValue({
        email: null,
      });
    });
  };

  emailChange = value => {
    const { dispatch, form } = this.props;
    const emailCorrect = !/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/.test(value);
    dispatch({
      type: 'sendETicketMgr/save',
      payload: {
        email: value,
        emailCorrect,
      },
    });
    form.setFieldsValue({
      email: value,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      sendETicketMgr: { sendETicketVisible, bookingNo, email, emailCorrect },
    } = this.props;
    return (
      <Modal
        title={
          <span className={styles.modelTitleStyle}>
            {formatMessage({ id: 'SEND_ETICKET_TITLE' })}
          </span>
        }
        visible={sendETicketVisible}
        centered
        onCancel={this.handleCancel}
        footer={
          <div>
            <Button
              disabled={emailCorrect}
              onClick={() => this.handleOk(bookingNo, email)}
              type="primary"
            >
              {formatMessage({ id: 'CONFIRM' })}
            </Button>
            <Button onClick={this.handleCancel}>{formatMessage({ id: 'CANCEL' })}</Button>
          </div>
        }
      >
        <FormItem
          label={
            <span className={styles.modelFormItem}>{formatMessage({ id: 'EMAIL_ADDRESS' })}</span>
          }
          colon={false}
        >
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Required' }],
            initialValue: email,
          })(
            <div className={styles.modelInputStyle}>
              <Input
                allowClear
                placeholder="Please Enter"
                onChange={e => this.emailChange(e.target.value)}
                value={email}
              />
            </div>
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default SendETicket;
