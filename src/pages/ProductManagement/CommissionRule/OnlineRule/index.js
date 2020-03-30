import React from 'react';
import { Button, Card, Col, Form, Icon, Input, Row, Select, Table, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import router from 'umi/router';
import MediaQuery from 'react-responsive';
import { isEqual } from 'lodash';
import detailStyles from './index.less';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '@/components/BreadcrumbComp';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 23,
  },
};

const ColProps = {
  xs: 4,
  sm: 4,
  md: 6,
  xl: 6,
};

@Form.create()
@connect(({ commissionRuleSetup, loading }) => ({
  commissionRuleSetup,
  loading: loading.effects['commissionRuleSetup/fetchCommissionRuleSetupList'],
}))
class CommissionRuleSetup extends React.PureComponent {
  columns = [
    {
      title: formatMessage({ id: 'PRODUCT_COMMISSION_NAME' }),
      dataIndex: 'commissionName',
    },
    {
      title: formatMessage({ id: 'PRODUCT_COMMISSION_TYPE' }),
      dataIndex: 'commissionType',
    },
    {
      title: formatMessage({ id: 'PRODUCT_COMMISSION_SCHEME' }),
      dataIndex: 'commissionScheme',
    },
    {
      title: formatMessage({ id: 'STATUS' }),
      dataIndex: 'status',
      render: text => {
        let flagClass = '';
        if (text === 'Active') flagClass = detailStyles.flagStyle1;
        if (text === 'Inactive') flagClass = detailStyles.flagStyle2;
        return (
          <div>
            <span className={flagClass} />
            {text}
          </div>
        );
      },
    },
    {
      title: formatMessage({ id: 'OPERATION' }),
      dataIndex: 'tplId',
      render: (text, record) => {
        return (
          <div>
            <Tooltip title={formatMessage({ id: 'COMMON_EDIT' })}>
              <Icon
                type="edit"
                onClick={() => {
                  this.edit(record);
                }}
              />
            </Tooltip>
            <Tooltip title={formatMessage({ id: 'COMMON_DETAIL' })}>
              <Icon
                type="eye"
                onClick={() => {
                  this.detail(record);
                }}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commissionRuleSetup/fetchCommissionRuleSetupList',
      payload: {},
    });
  }

  binding = () => {
    router.push({
      pathname: '/ProductManagement/CommissionRule/OnlineRule/Binding',
    });
  };

  edit = record => {
    router.push({
      pathname: '/ProductManagement/CommissionRule/OnlineRule/Edit/${row.taId}',
      query: { type: 'edit', tplId: record.tplId },
    });
  };

  new = record => {
    router.push({
      pathname: '/ProductManagement/CommissionRule/OnlineRule/New',
      query: { type: 'new', tplId: record.tplId },
    });
  };

  detail = record => {
    router.push(`/ProductManagement/CommissionRule/OnlineRule/Detail/${record.tplId}`);
  };

  onSelectChange = selectedRowKeys => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commissionRuleSetup/saveSelectOffer',
      payload: {
        selectedRowKeys,
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
          type: 'commissionRuleSetup/search',
          payload: {
            filter: {
              likeParam: {
                commissionName: values.commissionName,
                commissionType: values.commissionType,
                status: values.status,
              },
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
      type: 'commissionRuleSetup/reset',
      payload: {
        currentPage: 1,
        pageSize: 10,
      },
    });
  };

  handleTableChange = page => {
    const {
      dispatch,
      commissionRuleSetup: { pagination },
    } = this.props;

    // If the paging changes, call the query interface again
    if (!isEqual(page, pagination)) {
      dispatch({
        type: 'commissionRuleSetup/tableChanged',
        payload: {
          pagination: page,
        },
      });
    }
  };

  showTotal(total) {
    return <div>Total {total} items</div>;
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      commissionRuleSetup: { commissionList, currentPage, pageSize, totalSize, selectedRowKeys },
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
        breadcrumbName: formatMessage({ id: 'ONLINE_FIXED_COMMISSION' }),
        url: null,
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
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
                        placeholder={formatMessage({ id: 'PRODUCT_COMMISSION_NAME' })}
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
                        placeholder={formatMessage({ id: 'PRODUCT_COMMISSION_TYPE' })}
                        optionFilterProp="children"
                        style={{ width: '100%' }}
                        allowClear
                      >
                        <Option value="Attendance" key="Attendance">
                          Attendance
                        </Option>
                        <Option value="Tiered" key="Tiered">
                          Tiered
                        </Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col {...ColProps}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator(
                      `status`,
                      {}
                    )(
                      <Select
                        placeholder={formatMessage({ id: 'STATUS' })}
                        optionFilterProp="children"
                        style={{ width: '100%' }}
                        allowClear
                      >
                        <Option value="ACTIVE" key="ACTIVE">
                          ACTIVE
                        </Option>
                        <Option value="INACTIVE" key="INACTIVE">
                          INACTIVE
                        </Option>
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
                <Button
                  type="primary"
                  onClick={() => {
                    this.new();
                  }}
                >
                  {formatMessage({ id: 'COMMON_NEW' })}
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={() => this.binding()}>
                  {formatMessage({ id: 'ADD_BINDING' })}
                </Button>
              </Col>
            </Row>
            <Table
              rowKey={record => record.tplId}
              bordered={false}
              size="small"
              dataSource={commissionList}
              pagination={pagination}
              loading={loading}
              columns={this.columns}
              className="table-style"
              rowSelection={rowSelection}
              onChange={this.handleTableChange}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}

export default CommissionRuleSetup;
