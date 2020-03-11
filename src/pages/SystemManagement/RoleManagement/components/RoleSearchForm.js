import React, { Fragment } from 'react';
import { Breadcrumb, Button, Card, Col, Form, Input, Row, Select, Table } from 'antd';
// import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
// import { SCREEN } from '../../../../utils/screen';
import { connect } from 'dva';
import TextArea from 'antd/es/input/TextArea';
import router from 'umi/router';
import styles from '../index.less';

const colProps = {
  xs: 24,
  sm: 12,
  md: 6,
  xl: 6,
};

const btnColProps = {
  xs: 24,
  sm: 24,
  md: 12,
};

@Form.create()
@connect()
class Index extends React.PureComponent {
  componentDidMount() {
    // TODO get ROLES
    // TODO get companies
    //
  }

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.query(values);
      }
    });
  };

  query = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleManagement/saveData',
      payload: {
        queryParam: {
          ...values,
          pageSize: 10,
          currentPage: 1,
        },
      },
    }).then(() => {
      dispatch({
        type: 'roleManagement/queryUserRolesByCondition',
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

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Card className="has-shadow no-border">
        <Form onSubmit={e => this.handleSearch(e)}>
          <Row gutter={24}>
            <Col {...colProps}>
              <Form.Item>
                {getFieldDecorator(`roleName`)(
                  <Input placeholder={formatMessage({ id: 'ROLE_NAME' })} allowClear />
                )}
              </Form.Item>
            </Col>
            <Col {...colProps}>
              <Form.Item>
                {getFieldDecorator(`roleType`)(
                  <Select
                    placeholder={formatMessage({ id: 'COMPANY_NAME' })}
                    optionFilterProp="children"
                    style={{ width: '100%' }}
                    allowClear
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...btnColProps} style={{ textAlign: 'right' }}>
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
