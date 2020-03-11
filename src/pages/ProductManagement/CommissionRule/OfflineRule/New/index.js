import React from 'react';
import router from 'umi/router';
import { Breadcrumb, Col, Form, Input, Row, Select, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import classNames from 'classnames';
import detailStyles from './index.less';
import CommissionRulePark from '../components/CommissionRulePark';
import BindingTA from '../components/BindingTA';
import CommissionRulePLU from '../components/CommissionRulePLU';

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
@connect(({ offlineNew }) => ({
  offlineNew,
}))
class OfflineNew extends React.PureComponent {
  selectChange = e => {
    const { dispatch } = this.props;

    dispatch({
      type: 'offlineNew/save',
      payload: {
        value: e,
      },
    });
  };

  routerTo = () => {
    router.push('/ProductManagement/CommissionRule/OfflineRule');
  };

  render() {
    const {
      form: { getFieldDecorator },
      offlineNew: { value = '' },
    } = this.props;

    return (
      <Col lg={24} md={24} id="commissionNew">
        {/* <MediaQuery> */}
        <Breadcrumb separator=" > " style={{ marginBottom: '10px' }}>
          <Breadcrumb.Item className="breadcrumb-style">System Management</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-style">Commission Rule</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-style" onClick={this.routerTo}>
            Offine Rule
          </Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumbbold">New</Breadcrumb.Item>
        </Breadcrumb>
        {/* </MediaQuery> */}
        <Col lg={24} md={24}>
          <div className={classNames(detailStyles.formStyle, 'has-shadow no-border')}>
            <div className="title-header" style={{ padding: '16px' }}>
              <span>{formatMessage({ id: 'BASIC_FAILED_INFORMATION_BTN' })}</span>
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
                <Col span={24}>
                  {value === 'tiered' || value === 'fixed' ? <CommissionRulePark /> : null}
                  {value === 'attendance' ? <CommissionRulePLU /> : null}
                </Col>
                <Col span={24}>
                  <BindingTA />
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
      </Col>
    );
  }
}
export default OfflineNew;
