import React from 'react';
import { Button, Card, Col, Form, Icon, Input, Row, Select, Table, Tooltip, Popover } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import router from 'umi/router';
import MediaQuery from 'react-responsive';
import detailStyles from './index.less';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import Edit from './components/Edit';

const { Option } = Select;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 23,
  },
};

const formItemLayout2 = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
  colon: false,
};

const ColProps = {
  xs: 4,
  sm: 4,
  md: 6,
  xl: 6,
};

@Form.create()
@connect(({ offline, loading }) => ({
  offline,
  loading: loading.effects['offline/fetchOfflineList'],
}))
class Offline extends React.PureComponent {
  columns = [
    {
      title: formatMessage({ id: 'NO' }),
      dataIndex: 'PLUName',
    },
    {
      title: formatMessage({ id: 'PLU_CODE' }),
      dataIndex: 'PLUName',
    },
    {
      title: formatMessage({ id: 'PLU_DESCRIPTION' }),
      dataIndex: 'PLUDescription',
    },
    {
      title: formatMessage({ id: 'THEME_PARK' }),
      dataIndex: 'themePark',
    },
    {
      title: formatMessage({ id: 'PRODUCT_COMMISSION_SCHEME' }),
      dataIndex: 'commissionScheme',
    },
    {
      title: formatMessage({ id: 'OPERATION' }),
      dataIndex: 'createStaff',
      key: 'createStaff',
      render: (text, record) => {
        return (
          <div>
            <Popover trigger="click" placement="leftTop" content={this.getContent()}>
              <Tooltip title={formatMessage({ id: 'COMMON_DETAIL' })}>
                <Icon
                  type="eye"
                  onClick={() => {
                    // this.detail(record);
                  }}
                />
              </Tooltip>
            </Popover>
            <Tooltip title={formatMessage({ id: 'COMMON_EDIT' })}>
              <Icon type="edit" onClick={() => this.edit(record, 'edit')} />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'offline/fetchOfflineList',
      payload: {},
    });
    dispatch({
      type: 'offline/queryPluAttribute',
      payload: {
        attributeItem: 'THEME_PARK',
      },
    });
  }

  getContent = () => {
    return (
      <div className={detailStyles.msgBodyStyle}>
        <div>
          <span className={detailStyles.detailMsgStyle}>
            {formatMessage({ id: 'FIXED_COMMISSION' })}
          </span>
        </div>
        <Form className={detailStyles.formStyle}>
          <FormItem
            {...formItemLayout2}
            label={
              <span className={detailStyles.labelStyle}>
                {formatMessage({ id: 'PRODUCT_COMMISSION_SCHEME' })}
              </span>
            }
          >
            <span className={detailStyles.infoStyle}>dfgdg</span>
          </FormItem>
          <FormItem
            {...formItemLayout2}
            label={
              <span className={detailStyles.labelStyle}>
                {formatMessage({ id: 'ACCOUNTING_CREATED_BY' })}
              </span>
            }
          >
            <span className={detailStyles.infoStyle}>dfgdg</span>
          </FormItem>
          <FormItem
            {...formItemLayout2}
            label={
              <span className={detailStyles.labelStyle}>
                {formatMessage({ id: 'COMMISSION_CREATED_TIME' })}
              </span>
            }
          >
            <span className={detailStyles.infoStyle}>dfgdg</span>
          </FormItem>
        </Form>
      </div>
    );
  };

  detail = record => {
    router.push(`/ProductManagement/CommissionRule/OfflineRule/Detail/${record.type}`);
  };

  new = () => {
    router.push({
      pathname: '/ProductManagement/CommissionRule/OfflineRule/New',
      query: { type: 'new' },
    });
  };

  edit = (record, type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'offline/save',
      payload: {
        drawerVisible: true,
        type,
      },
    });
  };

  handleSearch = ev => {
    ev.preventDefault();
    const { form } = this.props;
    const { dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'offline/search',
          payload: {
            filter: {
              commissionName: values.commissionName,
              commissionType: values.commissionType,
              status: values.status,
            },
          },
        });
      }
    });
  };

  handleReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'offline/fetchSelectReset',
      payload: {
        currentPage: 1,
        pageSize: 10,
      },
    });
  };

  showTotal(total) {
    return <div>Total {total} items</div>;
  }

  render() {
    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'PRODUCT_MANAGEMENT' }),
        url: null,
      },
      {
        breadcrumbName: formatMessage({ id: 'COMMISSION_RULE_TITLE' }),
        url: null,
      },
      {
        breadcrumbName: formatMessage({ id: 'OFFLINE_FIXED_COMMISSION' }),
        url: null,
      },
    ];
    const {
      form: { getFieldDecorator },
      loading,
      offline: { offlineList, currentPage, pageSize, totalSize, themeParkList },
    } = this.props;
    const pagination = {
      current: currentPage,
      pageSize,
      total: totalSize,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['20', '50', '100'],
      showTotal: this.showTotal,
    };
    return (
      <Row type="flex" justify="space-around" id="mainTaView">
        <Col span={24} className={detailStyles.pageHeaderTitle}>
          <MediaQuery
            maxWidth={SCREEN.screenMdMax}
            minWidth={SCREEN.screenSmMin}
            minHeight={SCREEN.screenSmMin}
          >
            <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
          </MediaQuery>
          <MediaQuery minWidth={SCREEN.screenLgMin}>
            <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
          </MediaQuery>
        </Col>
        <Col span={24} className={detailStyles.pageSearchCard}>
          <Card>
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
              <Row gutter={24}>
                <Col {...ColProps}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator(
                      `commissionName`,
                      {}
                    )(
                      <Input
                        placeholder={formatMessage({ id: 'PLU_CODE_AND_DESCRIPTION' })}
                        allowClear
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...ColProps}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator(
                      `commissionType`,
                      {}
                    )(
                      <Select
                        placeholder={formatMessage({ id: 'THEME_PARK' })}
                        optionFilterProp="children"
                        style={{ width: '100%' }}
                        allowClear
                      >
                        {themeParkList.map(role => (
                          <Option key={`roleCode_option_${role}`} value={role}>
                            {role}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col {...ColProps} style={{ textAlign: 'right' }}>
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
        </Col>
        <Col span={24} className={detailStyles.pageTableCard}>
          <Card>
            <Row gutter={24}>
              <Col {...ColProps} style={{ padding: '12px' }}>
                <Button type="primary" onClick={() => this.new()}>
                  {formatMessage({ id: 'COMMON_NEW' })}
                </Button>
              </Col>
            </Row>
            <Table
              rowKey="id"
              bordered={false}
              size="small"
              dataSource={offlineList}
              pagination={pagination}
              loading={loading}
              columns={this.columns}
              className="table-style"
              // onChange={this.handleTableChange}
            />
          </Card>
        </Col>
        <Edit />
      </Row>
    );
  }
}

export default Offline;
