import React, { PureComponent } from 'react';
import { Col, Form, Input, Row } from 'antd';
import { formatMessage } from 'umi/locale';

class BankReferenceToFrom extends PureComponent {
  render() {
    const { form, formItemLayout, otherInfo = {}, onHandleChange } = this.props;
    const { getFieldDecorator } = form;
    const bankReference = (otherInfo || {}).bankReference || {};
    const numFormat = formatMessage({ id: 'INPUT_MAX_NUM' });
    return (
      <Col span={24}>
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item label={formatMessage({ id: 'BANK_NAME' })} colon={false} {...formItemLayout}>
              {getFieldDecorator('bankName', {
                initialValue: bankReference.bankName || null,
                rules: [
                  { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e => onHandleChange('bankName', e.target.value, 'bankName')}
                  onPressEnter={e => onHandleChange('bankName', e.target.value, 'bankName')}
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'BANK_BRANCH' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('bankBranch', {
                initialValue: bankReference.bankBranch || null,
                rules: [
                  { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e => onHandleChange('bankBranch', e.target.value, 'bankBranch')}
                  onPressEnter={e => onHandleChange('bankBranch', e.target.value, 'bankBranch')}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'BANK_ADDRESS' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('bankAddress', {
                initialValue: bankReference.bankAddress || null,
                rules: [
                  { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e => onHandleChange('bankAddress', e.target.value, 'bankAddress')}
                  onPressEnter={e => onHandleChange('bankAddress', e.target.value, 'bankAddress')}
                />
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={formatMessage({ id: 'BANK_CURRENT_ACCOUNT_NO' })}
              colon={false}
              {...formItemLayout}
            >
              {getFieldDecorator('bankAccountNo', {
                initialValue: bankReference.accountNo || null,
                rules: [
                  { required: true, message: formatMessage({ id: 'REQUIRED' }) },
                  { max: 200, message: numFormat },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={e => onHandleChange('accountNo', e.target.value, 'bankAccountNo')}
                  onPressEnter={e => onHandleChange('accountNo', e.target.value, 'bankAccountNo')}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Col>
    );
  }
}

export default BankReferenceToFrom;
