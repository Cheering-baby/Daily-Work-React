import React from 'react';
import {Button, Form, Input, Modal} from 'antd';
import {connect} from 'dva';
import styles from './index.less';

const FormItem = Form.Item;

@Form.create()
@connect(({sendETicketMgr}) => ({
  sendETicketMgr,
}))
class SendETicket extends React.Component {
  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'sendETicketMgr/resetData',
    });
  }

  handleOk = () => {
    const {dispatch, form} = this.props;
    form.validateFields(err => {
      if (!err) {
        dispatch({
          type: 'sendETicketMgr/save',
          payload: {
            sendETicketVisible: false,
          },
        });
      }
    });
  };

  handleCancel = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'sendETicketMgr/resetData',
    });
  };

  emailChange = value => {
    const {dispatch, form} = this.props;
    dispatch({
      type: 'sendETicketMgr/save',
      payload: {
        email: value,
      },
    });
    form.setFieldsValue({
      email: value,
    });
  };

  render() {
    const {
      form: {getFieldDecorator},
      sendETicketMgr: {sendETicketVisible, email},
    } = this.props;
    return (
      <Modal
        title={<span className={styles.modelTitleStyle}>SEND E-TICKET</span>}
        visible={sendETicketVisible}
        centered
        onCancel={this.handleCancel}
        footer={
          <div>
            <Button onClick={() => this.handleOk()} type="primary">
              Confirm
            </Button>
            <Button onClick={this.handleCancel}>Cancel</Button>
          </div>
        }
      >
        <FormItem label={<span className={styles.modelFormItem}>Email Address</span>} colon={false}>
          {getFieldDecorator('email', {
            rules: [{required: true, message: 'Required'}],
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
