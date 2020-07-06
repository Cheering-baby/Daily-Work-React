import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Button, Form, Select, DatePicker, Input, Col, Row } from 'antd';
import _ from 'lodash';
import moment from 'moment';

const { Option } = Select;

const Filter = props => {
  const { loading, transactionTypes, form, dispatch } = props;
  const { getFieldDecorator } = form;

  const search = () => {
    form.validateFields(err => {
      if (!err) {
        dispatch({ type: 'myWallet/fetchAccountFlowList' });
      }
    });
  };

  const reset = () => {
    dispatch({ type: 'myWallet/resetFilter' });
    dispatch({ type: 'myWallet/fetchAccountFlowList' });
  };

  return (
    <Form>
      <Row type="flex" justify="space-around" gutter={24}>
        <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
          <Form.Item>
            {getFieldDecorator(
              'transactionId',
              {}
            )(
              <Input
                allowClear
                disabled={loading}
                placeholder={formatMessage({
                  id: 'MyWallet.flow.filter.transactionId.placeholder',
                })}
              />
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
          <Form.Item>
            {getFieldDecorator(
              'transactionType',
              {}
            )(
              <Select
                allowClear
                disabled={loading}
                placeholder={formatMessage({
                  id: 'MyWallet.flow.filter.transactionType.placeholder',
                })}
              >
                {transactionTypes.map(({ label, value }) => (
                  <Option key={value} value={value}>
                    {label}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
          <Form.Item>
            {getFieldDecorator(
              'dateRange',
              {}
            )(
              <DatePicker.RangePicker
                allowClear
                disabled={loading}
                placeholder={formatMessage({ id: 'MyWallet.flow.filter.dateRange.placeholder' })}
                format="DD-MMM-YYYY"
                disabledDate={current => current && current > moment().endOf('day')}
              />
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            onClick={search}
            loading={loading}
            style={{ backgroundColor: '#1890FF', width: '73px', borderRadius: '4px' }}
          >
            {formatMessage({ id: 'BTN_SEARCH' })}
          </Button>
          <Button
            onClick={reset}
            loading={loading}
            style={{ marginLeft: 8, width: '66px', borderRadius: '4px' }}
          >
            {formatMessage({ id: 'BTN_RESET' })}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

const mapStateToProps = ({ myWallet, loading }) => ({
  filter: myWallet.filter,
  filterFields: myWallet.filterFields,
  transactionTypes: myWallet.transactionTypes,
  loading: loading.effects['myWallet/fetchAccountFlowList'],
});

export default connect(mapStateToProps)(
  Form.create({
    onValuesChange(props, values) {
      const { filter } = props;
      props.dispatch({
        type: 'myWallet/save',
        payload: { filter: _.omitBy({ ...filter, ...values }, _.isEmpty) },
      });
    },
    onFieldsChange(props, changedFields) {
      const { filterFields } = props;
      props.dispatch({
        type: 'myWallet/save',
        payload: { filterFields: { ...filterFields, ...changedFields } },
      });
    },
    mapPropsToFields({ filter, filterFields }) {
      const fields = {};
      Object.keys(filter).forEach(key => {
        fields[key] = Form.createFormField({
          ...filterFields[key],
          value: filter[key],
        });
      });
      return fields;
    },
  })(Filter)
);
