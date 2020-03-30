import React from 'react';
import { Col, Form, Input, Row, Select, Button, Radio } from 'antd';
import { formatMessage } from 'umi/locale';
// import { connect } from 'dva';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 9,
  },
  wrapperCol: {
    span: 14,
  },
};
const ColProps = {
  xs: 8,
  sm: 8,
  md: 12,
  xl: 12,
};
const COMMONRule = {
  required: true,
  msg: 'Required',
};

@Form.create()
// @connect(({}) => ({}))
class EditForAttendance extends React.PureComponent {
  selectChange = e => {
    const { dispatch } = this.props;

    dispatch({
      type: 'offlineNew/save',
      payload: {
        value: e,
      },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Col lg={24} md={24} id="commissionNew">
        <div className="has-shadow no-border">
          <div style={{ paddingLeft: 16 }}>
            <span className="detail-title">
              {formatMessage({ id: 'BASIC_FAILED_INFORMATION_BTN' })}
            </span>
          </div>
          <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
            <Row>
              <Col {...ColProps}>
                <FormItem
                  {...formItemLayout}
                  label={formatMessage({ id: 'PRODUCT_COMMISSION_NAME' })}
                >
                  {getFieldDecorator('commissionName', {
                    rules: [COMMONRule],
                  })(<Input type="text" placeholder={formatMessage({ id: 'PLEASE_ENTER' })} />)}
                </FormItem>
              </Col>
              <Col {...ColProps}>
                <FormItem
                  {...formItemLayout}
                  label={formatMessage({ id: 'PRODUCT_COMMISSION_TYPE' })}
                >
                  {getFieldDecorator('commissionType', {
                    rules: [COMMONRule],
                  })(
                    <Select
                      placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                      allowClear
                      onChange={this.selectChange}
                    >
                      <Select.Option value="tiered">
                        {formatMessage({ id: 'TIERED_COMMISSION' })}
                      </Select.Option>
                      <Select.Option value="attendance">
                        {formatMessage({ id: 'ATTENDANCE_COMMISSION' })}
                      </Select.Option>
                      <Select.Option value="fixed">
                        {formatMessage({ id: 'COMMISSION_FIXED' })}
                      </Select.Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...ColProps}>
                <FormItem
                  {...formItemLayout}
                  label={formatMessage({ id: 'PRODUCT_COMMISSION_SCHEME' })}
                >
                  {getFieldDecorator('commissionScheme', {
                    rules: [COMMONRule],
                  })(
                    <Radio.Group style={{ marginTop: '5px' }}>
                      <Radio value="amount">{formatMessage({ id: 'COMMISSION_AMOUNT' })}</Radio>
                      <Radio value="percentage">
                        {formatMessage({ id: 'COMMISSION_PERCENTAGE' })}
                      </Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="button-style">
            <Button
              style={{
                height: '32px',
                marginLeft: '15px',
                backgroundColor: '#FFFFFF',
                fontSize: '15px',
                fontFamily: 'Calibri',
                color: '#000000',
              }}
              // onClick={() => this.returnToTelemarketing()}
            >
              {formatMessage({ id: 'COMMON_CANCEL' })}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                height: '32px',
                marginLeft: '15px',
                backgroundColor: '#259DDB',
                fontSize: '15px',
                fontFamily: 'Calibri',
                color: '#FFFFFF',
              }}
            >
              {formatMessage({ id: 'COMMON_CONFIRM' })}
            </Button>
          </div>
        </div>
      </Col>
    );
  }
}
export default EditForAttendance;
