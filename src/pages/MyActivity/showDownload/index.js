import React from 'react';
import { Col, Form, Icon, Input, Row, Switch } from 'antd';
import { formatMessage } from 'umi/locale';

class ShowDownload extends React.PureComponent {
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        md: { span: 12 },
        lg: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        md: { span: 12 },
        lg: { span: 16 },
      },
    };
    return (
      <div className="has-shadow no-border">
        <div>
          <span> {formatMessage({ id: 'REGIST_INFORMATION' })} </span>
        </div>
        <div>
          <span> {formatMessage({ id: 'COMMON_UPLOAD_APPROVAL' })} </span>
        </div>
        <Form className="ant-advanced-search-form">
          <div>
            <Row style={{ margin: '10px 0px' }}>
              <Col xs={24} md={12} lg={12} style={{ paddingRight: '0px' }}>
                <Form.Item label={formatMessage({ id: 'RE_ROUTE' })} {...formItemLayout}>
                  {getFieldDecorator('reRoute', {
                    rules: [
                      {
                        required: true,
                        message: 'Required',
                      },
                    ],
                  })(
                    <div>
                      <Switch
                        checkedChildren={<Icon type="check" />}
                        unCheckedChildren={<Icon type="close" />}
                      />
                    </div>
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={12} style={{ paddingLeft: '0px' }}>
                <Form.Item label={formatMessage({ id: 'STATUS' })} {...formItemLayout}>
                  {getFieldDecorator('cmsCode', {
                    rules: [
                      {
                        required: false,
                        message: 'Please input CMS campaign code',
                      },
                    ],
                  })(
                    <div>
                      <Input placeholder="" style={{ width: '100%' }} />
                    </div>
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row style={{ margin: '10px 0px', width: '100%' }}>
              <Col xs={24} md={12} lg={12} style={{ paddingRight: '0px' }}>
                <Form.Item label={formatMessage({ id: 'SAS_CAMPAIGN_CODE' })} {...formItemLayout}>
                  {getFieldDecorator('sasCode', {
                    rules: [
                      {
                        required: true,
                        message: 'Required',
                      },
                    ],
                  })(
                    <div>
                      <Input placeholder="" style={{ width: '100%' }} />
                    </div>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
    );
  }
}

export default ShowDownload;
