import React, { PureComponent } from 'react';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
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

@connect(({ notificationSearchForm }) => ({
  notificationSearchForm,
}))
class NotificationSearchForm extends PureComponent {
  static defaultProps = {
    onSearch: () => {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'notificationSearchForm/queryNotificationTypeList',
    });
    dispatch({
      type: 'notificationSearchForm/queryTargetTypeList',
    });
    dispatch({
      type: 'notificationSearchForm/queryStatusList',
    });
  }

  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
    form.validateFields((err, values) => {
      this.query(values);
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, onSearch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let startDate;
        let endDate;
        if (Array.isArray(values.createDate)) {
          startDate = values.createDate[0].format('YYYY-MM-DD');
          endDate = values.createDate[1].format('YYYY-MM-DD');
        }
        values.startDate = startDate;
        values.endDate = endDate;
        onSearch(values);
      }
    });
  };

  render() {
    const {
      form,
      notificationSearchForm: { notificationTypeList = [], targetTypeList = [], statusList = [] },
    } = this.props;
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
                    placeholder={formatMessage({ id: 'TITLE' })}
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
                    {targetTypeList.map(item => (
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
                    {notificationTypeList.map(item => (
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
                    {statusList.map(item => (
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
