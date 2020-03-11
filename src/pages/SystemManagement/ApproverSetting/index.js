/* eslint-disable */
import React from 'react';
import { Breadcrumb, Col, Form, Input, Row } from 'antd';
// import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
import detailStyles from './index.less';
import { connect } from 'dva';
import { isEqual } from 'lodash';

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 10,
  },
};

const ColProps = {
  xs: 24,
};

@Form.create()
@connect(({}) => ({}))
class ApproverSetting extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    const { getFieldDecorator } = this.props.form;
    const {} = this.props;
    return (
      <Col lg={24} md={24} id="smsReport">
        <Breadcrumb separator=" > " style={{ marginBottom: '10px' }}>
          <Breadcrumb.Item className={detailStyles.BreadcrumbStyle}>
            System Management
          </Breadcrumb.Item>
          <Breadcrumb.Item className={detailStyles.Breadcrumbbold}>
            Approver Setting
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="has-shadow no-border">
          <div className={detailStyles.titleHeader}>
            <span className={detailStyles.titleSpan}>Approval registration</span>
          </div>
          <div className={`${detailStyles.searchDiv} has-shadow no-border`}>
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
              <Row>
                <Col {...ColProps}>
                  <Form.Item {...formItemLayout} label={formatMessage({ id: 'APP_APPROVER' })}>
                    {getFieldDecorator(`approver`, {
                      rules: [
                        {
                          required: true,
                          msg: 'Required',
                        },
                      ],
                    })(<Input.TextArea placeholder="Please Enter" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Col>
    );
  }
}

export default ApproverSetting;
