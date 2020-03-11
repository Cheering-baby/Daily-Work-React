import React from 'react';
import { Col, Form, Row, Input, Radio, Select, Transfer, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from '../Edit/$detail/index.less';
import detailStyles from '../New/index.less';
import TiredCommissionRulePark from './TiredCommissionRulePark';

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
class ModifyTieredCommission extends React.PureComponent {
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Col lg={24} md={24}>
        <div>
          <div className="title-header" style={{ paddingLeft: 16 }}>
            <span className={styles.DetailTitle}>
              {formatMessage({ id: 'BASIC_FAILED_INFORMATION_BTN' })}
            </span>
          </div>
          <div>
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
                    {getFieldDecorator('operationName', {
                      rules: [COMMONRule],
                    })(
                      <Select
                        placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                        allowClear
                        onChange={this.optionChange}
                      >
                        <Select.Option value="tiered">
                          {formatMessage({ id: 'TIERED_COMMISSION' })}
                        </Select.Option>
                        <Select.Option value="attendance">
                          {formatMessage({ id: 'ATTENDANCE_COMMISSION' })}
                        </Select.Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col {...ColProps}>
                  <FormItem
                    {...formItemLayout}
                    label={formatMessage({ id: 'PRODUCT_COMMISSION_SCHEME' })}
                    className={detailStyles.radioStyle}
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
          </div>
          <TiredCommissionRulePark detailTitle />
          <div className="title-header" style={{ paddingLeft: 16 }}>
            <span className={styles.DetailTitle}>
              {formatMessage({ id: 'COMMISSION_OFFER_UNDER_RULE' })}
            </span>
          </div>
          <Transfer
            style={{ paddingLeft: 16 }}
            // dataSource={this.state.mockData}
            showSearch
            className={styles.transferStyle}
          />
          <div className="button-style" style={{ marginTop: 50 }}>
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
export default ModifyTieredCommission;
