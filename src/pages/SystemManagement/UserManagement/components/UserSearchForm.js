import React from 'react';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
// import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
// import { SCREEN } from '../../../../utils/screen';
import { connect } from 'dva';
import constants from '../constants';
import styles from '../index.less';
import PrivilegeUtil from '@/utils/PrivilegeUtil';
import SortSelect from '@/components/SortSelect';

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
    const { dispatch } = this.props;
    dispatch({
      type: 'userMgr/queryAllCompany',
    });

    if (PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.PAMS_ADMIN_PRIVILEGE])) {
      dispatch({
        type: 'userMgr/querySubTAList',
      });
    }

    if (
      PrivilegeUtil.hasAnyPrivilege([
        PrivilegeUtil.PAMS_ADMIN_PRIVILEGE,
        PrivilegeUtil.SALES_SUPPORT_PRIVILEGE,
      ])
    ) {
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
        searchSubCompanyId: undefined,
        searchCategoryId: undefined,
        searchCustomerGroupId: undefined,
        subTaCompanyList: [],
        subCompanyMap: new Map([]),
        customerGroups: [],
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

  getSubCompanyOptions = () => {
    const {
      userMgr: { subTaCompanyList = [] },
    } = this.props;
    return subTaCompanyList.map(item => (
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
        searchCustomerGroupId: undefined,
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
    const {
      dispatch,
      form: { setFields },
    } = this.props;
    setFields({
      subCompanyIds: {
        value: undefined,
      },
    });
    dispatch({
      type: 'userMgr/saveData',
      payload: {
        searchCompanyId: value,
        searchSubCompanyId: undefined,
        searchCategoryId: undefined,
        searchCustomerGroupId: undefined,
        subTaCompanyList: [],
        subCompanyMap: new Map([]),
      },
    });
    if (value) {
      // have privilege and  not  rws company
      if (
        PrivilegeUtil.hasAnyPrivilege([
          PrivilegeUtil.PAMS_ADMIN_PRIVILEGE,
          PrivilegeUtil.MAIN_TA_ADMIN_PRIVILEGE,
        ]) &&
        value !== -1
      ) {
        dispatch({
          type: 'userMgr/querySubTACompanies',
          payload: {
            companyId: value,
          },
        });
      }
    }
  };

  subCompanyChange = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userMgr/saveData',
      payload: {
        searchSubCompanyId: value,
      },
    });
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
      userMgr: {
        searchUserCode = '',
        searchCompanyId,
        searchSubCompanyId,
        searchCategoryId,
        searchCustomerGroupId,
      },
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
              {PrivilegeUtil.hasAnyPrivilege([
                PrivilegeUtil.PAMS_ADMIN_PRIVILEGE,
                PrivilegeUtil.SALES_SUPPORT_PRIVILEGE,
                PrivilegeUtil.MAIN_TA_ADMIN_PRIVILEGE,
              ]) ? (
                <Form.Item {...formItemLayout} style={{ width: '100%' }}>
                  {getFieldDecorator(`companyIds`, {
                    initialValue: searchCompanyId,
                  })(
                    <SortSelect
                      showSearch
                      onChange={this.companyChange}
                      placeholder={formatMessage({ id: 'COMPANY_NAME' })}
                      style={{ width: '100%' }}
                      allowClear
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      options={this.getCompanyOptions()}
                    />
                  )}
                </Form.Item>
              ) : null}
            </Col>
            {PrivilegeUtil.hasAnyPrivilege([
              PrivilegeUtil.PAMS_ADMIN_PRIVILEGE,
              PrivilegeUtil.MAIN_TA_ADMIN_PRIVILEGE,
            ]) && searchCompanyId !== -1 ? (
              <Col {...colProps}>
                <Form.Item {...formItemLayout} style={{ width: '100%' }}>
                  {getFieldDecorator(`subCompanyIds`, {
                    initialValue: searchSubCompanyId,
                  })(
                    <SortSelect
                      showSearch
                      onChange={this.subCompanyChange}
                      placeholder={formatMessage({ id: 'SUB_COMPANY_NAME' })}
                      style={{ width: '100%' }}
                      allowClear
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      options={this.getSubCompanyOptions()}
                    />
                  )}
                </Form.Item>
              </Col>
            ) : null}
            {userType !== constants.RWS_USER_TYPE ? <Col {...colProps} /> : null}
            {userType === constants.SUB_TA_USER_TYPE ? <Col {...colProps} /> : null}
            <Col {...colProps}>
              {userType !== constants.RWS_USER_TYPE || searchCompanyId ? null : (
                <Form.Item {...formItemLayout} style={{ width: '100%' }}>
                  {getFieldDecorator(`categoryId`, {
                    initialValue: searchCategoryId,
                  })(
                    <SortSelect
                      onChange={this.categoryChange}
                      placeholder={formatMessage({ id: 'CATEGORY' })}
                      style={{ width: '100%' }}
                      allowClear
                      options={this.getCategoryOptions()}
                    />
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
                    <SortSelect
                      onChange={this.customerGroupChange}
                      placeholder={formatMessage({ id: 'CUSTOMER_GROUP' })}
                      style={{ width: '100%' }}
                      allowClear
                      options={this.getCustomerGroupOptions()}
                    />
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
