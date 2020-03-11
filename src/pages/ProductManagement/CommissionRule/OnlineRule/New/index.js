import React from 'react';
import router from 'umi/router';
import { Breadcrumb, Col, Form, Input, InputNumber, Radio, Row, Select, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import classNames from 'classnames';
import detailStyles from './index.less';
import TiredCommissionRulePark from '../components/TiredCommissionRulePark';

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
@connect(({ commissionNew }) => ({
  commissionNew,
}))
class CommissionNew extends React.PureComponent {
  optionChange = e => {
    const { dispatch } = this.props;

    dispatch({
      type: 'commissionNew/save',
      payload: {
        value: e,
      },
    });
  };

  routerTo = () => {
    router.push('/ProductManagement/CommissionRule/OnlineRule');
  };

  render() {
    const {
      form: { getFieldDecorator },
      commissionNew: { value },
    } = this.props;

    return (
      <Col lg={24} md={24} id="commissionNew">
        {/* <MediaQuery> */}
        <Breadcrumb separator=" > " style={{ marginBottom: '10px' }}>
          <Breadcrumb.Item className="breadcrumb-style">System Management</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-style">Commission Rule</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-style" onClick={this.routerTo}>
            Online Rule
          </Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumbbold">New</Breadcrumb.Item>
        </Breadcrumb>
        {/* </MediaQuery> */}
        <Col lg={24} md={24}>
          <div className={classNames(detailStyles.formStyle, 'has-shadow no-border')}>
            <div className="title-header" style={{ padding: 16 }}>
              <span>{formatMessage({ id: 'BASIC_FAILED_INFORMATION_BTN' })}</span>
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
                    {value === 'tiered' ? (
                      <FormItem
                        {...formItemLayout}
                        label={formatMessage({ id: 'PRODUCT_COMMISSION_SCHEME' })}
                        className={detailStyles.radioStyle}
                      >
                        {getFieldDecorator('commissionScheme', {
                          rules: [COMMONRule],
                        })(
                          <Radio.Group style={{ marginTop: '5px' }}>
                            <Radio value="amount">
                              {formatMessage({ id: 'COMMISSION_AMOUNT' })}
                            </Radio>
                            <Radio value="percentage">
                              {formatMessage({ id: 'COMMISSION_PERCENTAGE' })}
                            </Radio>
                          </Radio.Group>
                        )}
                      </FormItem>
                    ) : (
                      <FormItem
                        {...formItemLayout}
                        label={formatMessage({ id: 'PRODUCT_COMMISSION_SCHEME' })}
                        className={detailStyles.commissionSchemeDivStyle}
                      >
                        {getFieldDecorator('commissionScheme', {
                          rules: [COMMONRule],
                        })(
                          <Radio.Group style={{ marginTop: '5px' }}>
                            <div className={detailStyles.commissionSchemeRadioStyle}>
                              <Radio value="amount">
                                {formatMessage({ id: 'COMMISSION_AMOUNT' })}
                              </Radio>
                              {getFieldDecorator('amountInput')(
                                <InputNumber
                                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                  formatter={value =>
                                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                  }
                                />
                              )}
                            </div>
                            <div
                              className={detailStyles.commissionSchemeRadioStyle}
                              style={{ marginTop: 20 }}
                            >
                              <Radio value="percentage">
                                {formatMessage({ id: 'COMMISSION_PERCENTAGE' })}
                              </Radio>
                              {getFieldDecorator('percentageInput')(
                                <InputNumber
                                  parser={value => value.replace('%', '')}
                                  formatter={value => `${value}%`}
                                />
                              )}
                            </div>
                          </Radio.Group>
                        )}
                      </FormItem>
                    )}
                  </Col>
                </Row>
              </Form>
              {value === 'tiered' ? <TiredCommissionRulePark /> : null}
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
          </div>
        </Col>
      </Col>
    );
  }
}
export default CommissionNew;
