import React from 'react';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
// import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
// import { SCREEN } from '../../../../utils/screen';
import { connect } from 'dva';
import constants from '../constants';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 23,
  },
};

const colProps = {
  xs: 24,
  sm: 12,
  md: 6,
  xl: 6,
};

@Form.create()
@connect(({ userMgr, global }) => ({
  userMgr,
  global,
}))
class Index extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userMgr/queryAllCompany',
    });
  }

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.query(values);
      }
    });
  };

  query = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userMgr/saveData',
      payload: {
        queryParam: {
          ...values,
          pageSize: 10,
          currentPage: 1,
        },
      },
    }).then(() => {
      dispatch({
        type: 'userMgr/queryUsersByCondition',
      });
    });
  };

  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
    form.validateFields((err, values) => {
      this.query(values);
    });
  };

  getCompanyOptions = () => {
    const {
      userMgr: { companyList = [] },
    } = this.props;
    return companyList.map(item => (
      <Option key={item.id} value={item.id}>
        {item.companyName}
      </Option>
    ));
  };

  render() {
    const {
      global: { currentUser = {} },
      form: { getFieldDecorator },
    } = this.props;
    const { userType = '' } = currentUser;
    return (
      <Card className="has-shadow no-border">
        <Form onSubmit={e => this.handleSearch(e)}>
          <Row gutter={24}>
            <Col {...colProps}>
              <Form.Item {...formItemLayout}>
                {getFieldDecorator(`fuzzyUserCode`)(
                  <Input placeholder={formatMessage({ id: 'USER_LOGIN' })} allowClear />
                )}
              </Form.Item>
            </Col>
            <Col {...colProps}>
              {userType === constants.SUB_TA_USER_TYPE ? null : (
                <Form.Item {...formItemLayout}>
                  {getFieldDecorator(`companyIds`)(
                    <Select
                      placeholder={formatMessage({ id: 'COMPANY_NAME' })}
                      style={{ width: '100%' }}
                      allowClear
                    >
                      {this.getCompanyOptions()}
                    </Select>
                  )}
                </Form.Item>
              )}
            </Col>
            <Col {...colProps} />
            <Col {...colProps} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">
                {formatMessage({ id: 'BTN_SEARCH' })}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                {formatMessage({ id: 'BTN_RESET' })}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

export default Index;
