import React from 'react';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
// import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
// import { SCREEN } from '../../../../utils/screen';
import { connect } from 'dva';
import constants from '../constants';
import styles from '../index.less';

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

const colProps1 = {
  xs: 24,
  sm: 24,
  md: 24,
  xl: 24,
};

@Form.create()
@connect(({ userMgr, global }) => ({
  userMgr,
  global,
}))
class Index extends React.PureComponent {
  componentDidMount() {
    const {
      dispatch,
      global: { currentUser = {} },
    } = this.props;
    dispatch({
      type: 'userMgr/queryAllCompany',
    });

    const { userType = '' } = currentUser;
    if (userType === constants.RWS_USER_TYPE) {
      dispatch({
        type: 'userMgr/queryCategories',
      });
    }
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
    const { form, dispatch } = this.props;
    dispatch({
      type: 'userMgr/saveData',
      payload: {
        searchUserCode: undefined,
        searchCompanyId: undefined,
        searchCategoryId: undefined,
        searchCustomerGroupId: undefined,
      },
    }).then(() => {
      form.resetFields();
      form.validateFields((err, values) => {
        this.query(values);
      });
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

  getCategoryOptions = () => {
    const {
      userMgr: { categories = [] },
    } = this.props;
    return categories.map(item => (
      <Option key={item.dictId} value={item.dictId}>
        {item.dictName}
      </Option>
    ));
  };

  getCustomerGroupOptions = () => {
    const {
      userMgr: { customerGroups = [] },
    } = this.props;
    return customerGroups.map(item => (
      <Option key={item.dictId} value={item.dictId}>
        {item.dictName}
      </Option>
    ));
  };

  categoryChange = value => {
    const {
      dispatch,
      form: { setFields },
    } = this.props;
    if (value) {
      dispatch({
        type: 'userMgr/queryCustomerGroups',
        payload: {
          categoryId: value,
        },
      });
    } else {
      dispatch({
        type: 'userMgr/saveData',
        payload: {
          customerGroups: [],
        },
      });
    }
    setFields({
      customerGroupId: {
        value: undefined,
      },
    });
    dispatch({
      type: 'userMgr/saveData',
      payload: {
        searchCategoryId: value,
      },
    });
  };

  userCodeChange = e => {
    const { value } = e.target;
    const { dispatch } = this.props;
    dispatch({
      type: 'userMgr/saveData',
      payload: {
        searchUserCode: value,
      },
    });
  };

  companyChange = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userMgr/saveData',
      payload: {
        searchCompanyId: value,
      },
    });
    if (value) {
      dispatch({
        type: 'userMgr/saveData',
        payload: {
          categoryId: undefined,
          customerGroupId: undefined,
        },
      });
    }
  };

  customerGroupChange = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userMgr/saveData',
      payload: {
        searchCustomerGroupId: value,
      },
    });
  };

  render() {
    const {
      global: { currentUser = {} },
      form: { getFieldDecorator },
      userMgr: { searchUserCode = '', searchCompanyId, searchCategoryId, searchCustomerGroupId },
    } = this.props;
    const { userType = '' } = currentUser;
    const btnColProps = userType === constants.RWS_USER_TYPE ? colProps1 : colProps;
    return (
      <Card className="has-shadow no-border">
        <Form onSubmit={e => this.handleSearch(e)} className={styles.formWrapperClass}>
          <Row gutter={24}>
            <Col {...colProps}>
              <Form.Item {...formItemLayout} style={{ width: '100%' }}>
                {getFieldDecorator(`fuzzyUserCode`, {
                  initialValue: searchUserCode,
                })(
                  <Input
                    placeholder={formatMessage({ id: 'USER_LOGIN' })}
                    onChange={this.userCodeChange}
                    allowClear
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...colProps}>
              {userType === constants.SUB_TA_USER_TYPE ? null : (
                <Form.Item {...formItemLayout} style={{ width: '100%' }}>
                  {getFieldDecorator(`companyIds`, {
                    initialValue: searchCompanyId,
                  })(
                    <Select
                      onChange={this.companyChange}
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
            {userType !== constants.RWS_USER_TYPE ? <Col {...colProps} /> : null}
            {userType === constants.SUB_TA_USER_TYPE ? <Col {...colProps} /> : null}
            <Col {...colProps}>
              {userType !== constants.RWS_USER_TYPE || searchCompanyId ? null : (
                <Form.Item {...formItemLayout} style={{ width: '100%' }}>
                  {getFieldDecorator(`categoryId`, {
                    initialValue: searchCategoryId,
                  })(
                    <Select
                      onChange={this.categoryChange}
                      placeholder={formatMessage({ id: 'CATEGORY' })}
                      style={{ width: '100%' }}
                      allowClear
                    >
                      {this.getCategoryOptions()}
                    </Select>
                  )}
                </Form.Item>
              )}
            </Col>
            <Col {...colProps}>
              {userType !== constants.RWS_USER_TYPE || searchCompanyId ? null : (
                <Form.Item {...formItemLayout} style={{ width: '100%' }}>
                  {getFieldDecorator(`customerGroupId`, {
                    initialValue: searchCustomerGroupId,
                  })(
                    <Select
                      onChange={this.customerGroupChange}
                      placeholder={formatMessage({ id: 'CUSTOMER_GROUP' })}
                      style={{ width: '100%' }}
                      allowClear
                    >
                      {this.getCustomerGroupOptions()}
                    </Select>
                  )}
                </Form.Item>
              )}
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
