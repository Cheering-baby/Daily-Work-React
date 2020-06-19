import React from 'react';
import { formatMessage } from 'umi/locale';
import { Button, Form, Input, Modal, Spin } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const FormItem = Form.Item;

@Form.create()
@connect(({ sendETicketMgr, loading }) => ({
  sendETicketMgr,
  pageLoading: loading.effects['sendETicketMgr/sendEmail'],
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
            busiType: 'e-Ticket',
          },
        }).then(() => {
          this.handleCancel();
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
    // eslint-disable-next-line no-useless-escape
    const emailCorrect = !/^[A-Za-zd0-9]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/.test(
      value
    );
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
      pageLoading,
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
        maskClosable={false}
        onCancel={this.handleCancel}
        footer={
          <div>
            <Button
              style={{ width: 70 }}
              disabled={emailCorrect}
              loading={!!pageLoading}
              onClick={() => this.handleOk(bookingNo, email)}
              type="primary"
            >
              {!pageLoading ? formatMessage({ id: 'CONFIRM' }) : null}
            </Button>
            <Button onClick={this.handleCancel}>{formatMessage({ id: 'CANCEL' })}</Button>
          </div>
        }
      >
        <Spin spinning={!!pageLoading}>
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
        </Spin>
      </Modal>
    );
  }
}

export default SendETicket;
