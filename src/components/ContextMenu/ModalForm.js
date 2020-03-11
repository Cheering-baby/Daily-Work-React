import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Input, Modal } from 'antd';

const FormItem = Form.Item;

@Form.create()
class ModalForm extends Component {
  render() {
    const { visible, onCancel, onOk, form, partyName, compCode, privName, comments } = this.props;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
    };
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        width="calc(100% - 800px)"
        centered
        maskClosable={false}
        destroyOnClose
        title={formatMessage({ id: 'ADD_COMPONENT_PRIVILEGE' })}
        okText={formatMessage({ id: 'COMMON_CONFIRM' })}
        cancelText={formatMessage({ id: 'COMMON_CANCEL' })}
      >
        <Form layout="vertical">
          <FormItem label="Privilege Name" {...formItemLayout}>
            {getFieldDecorator('privName', {
              initialValue: privName,
              rules: [{ required: true, message: formatMessage({ id: 'PRIV_NAME_ERR' }) }],
            })(<Input />)}
          </FormItem>
          <FormItem label="Menu Name" {...formItemLayout}>
            {getFieldDecorator('partyName', {
              initialValue: partyName,
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="Privilege Code" {...formItemLayout}>
            {getFieldDecorator('compCode', {
              initialValue: compCode,
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="Remarks" {...formItemLayout}>
            {getFieldDecorator('comments', {
              initialValue: comments,
            })(<Input.TextArea />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default ModalForm;
