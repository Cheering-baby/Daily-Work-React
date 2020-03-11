import React, { PureComponent } from 'react';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from '../index.less';

const { Option } = Select;

const colLayout = {
  lg: 6,
  md: 8,
  sm: 12,
  xs: 24,
};

const formItemLayout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 24,
  },
  colon: false,
};

class NotificationSearchForm extends PureComponent {
  static defaultProps = {
    onSearch: () => {},
  };

  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
    form.validateFields((err, values) => {
      this.query(values);
    });
  };

  handleSubmit = e => {
    const { form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        const { onSearch } = this.props;
        onSearch(values);
      }
    });
  };

  render() {
    const { form, targetTypes = [], types = [], status = [] } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Card className={`as-shadow no-border ${styles.formCardClass}`}>
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={24}>
            <Col {...colLayout}>
              <Form.Item {...formItemLayout}>
                {getFieldDecorator(`title`, {
                  rules: [
                    {
                      require: false,
                      message: '',
                    },
                  ],
                })(
                  <Input
                    allowClear
                    placeholder={formatMessage({ id: 'SEARCH' })}
                    autoComplete="off"
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...colLayout}>
              <Form.Item {...formItemLayout}>
                {getFieldDecorator(`targetType`, {
                  rules: [
                    {
                      required: false,
                      message: '',
                    },
                  ],
                })(
                  <Select allowClear placeholder={formatMessage({ id: 'TARGET_TYPE' })}>
                    {targetTypes.map(item => (
                      <Option key={item.id} value={item.value}>
                        {item.dicName}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...colLayout}>
              <Form.Item {...formItemLayout}>
                {getFieldDecorator(`type`, {
                  rules: [
                    {
                      required: false,
                      message: '',
                    },
                  ],
                })(
                  <Select allowClear placeholder={formatMessage({ id: 'TYPE' })}>
                    {types.map(item => (
                      <Option key={item.id} value={item.value}>
                        {item.dicName}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...colLayout}>
              <Form.Item {...formItemLayout}>
                {getFieldDecorator(`status`, {
                  rules: [
                    {
                      required: false,
                      message: '',
                    },
                  ],
                })(
                  <Select allowClear placeholder={formatMessage({ id: 'STATUS' })}>
                    {status.map(item => (
                      <Option key={item.id} value={item.value}>
                        {item.dicName}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" style={{ marginRight: 15 }}>
                {formatMessage({ id: 'SEARCH' })}
              </Button>
              <Button htmlType="reset" onClick={this.handleReset}>
                {formatMessage({ id: 'RESET' })}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

const WrapperNotificationSearchForm = Form.create({ name: 'NotificationSearch' })(
  NotificationSearchForm
);

export default WrapperNotificationSearchForm;
