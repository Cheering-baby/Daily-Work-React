import React from 'react';
import { Button, Card, Col, Form, Icon, Input, Row, Select, Table, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import router from 'umi/router';
import MediaQuery from 'react-responsive';
import detailStyles from './index.less';
import SCREEN from '@/utils/screen';
import BreadcrumbCompForPams from '@/components/BreadcrumbComp/BreadcurmbCompForPams';
import PaginationComp from '../../components/PaginationComp';
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
      key: 'commissionName',
      width: '35%',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'PRODUCT_COMMISSION_TYPE' }),
      dataIndex: 'commissionType',
      key: 'commissionType',
      width: '15%',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'PRODUCT_COMMISSION_SCHEME' }),
      dataIndex: 'commissionScheme',
      key: 'commissionScheme',
      width: '15%',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'STATUS' }),
      dataIndex: 'status',
      key: 'status',
      width: '8%',
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
      width: '10%',
      render: (text, record) => {
        return (
          <div>
            <Tooltip title={formatMessage({ id: 'COMMON_DETAIL' })}>
              <Icon
                type="eye"
                onClick={() => {
                  this.detail(record);
                }}
              />
            </Tooltip>
            {record && record.status && record.status === 'Active' ? (
              <Tooltip title={formatMessage({ id: 'COMMON_EDIT' })}>
                <Icon
                  type="edit"
                  onClick={() => {
                    this.edit(record);
                  }}
                />
              </Tooltip>
            ) : null}
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

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'commissionRuleSetup/clear' });
    dispatch({ type: 'commissionNew/clear' });
    dispatch({ type: 'detail/clear' });
  }

  binding = () => {
    router.push({
      pathname: '/ProductManagement/CommissionRule/OnlineRule/Binding',
    });
  };

  edit = record => {
    router.push({
      pathname: `/ProductManagement/CommissionRule/OnlineRule/Edit/${record.id}`,
      query: { type: 'edit', tplId: record.tplId },
    });
  };

  new = () => {
    router.push({
      pathname: '/ProductManagement/CommissionRule/OnlineRule/New',
      query: { type: 'new' },
    });
  };

  detail = record => {
    router.push({
      pathname: `/ProductManagement/CommissionRule/OnlineRule/Detail/${record.id}`,
      query: { tplId: record.tplId },
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

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      commissionRuleSetup: { commissionList, currentPage, pageSize: nowPageSize, totalSize },
    } = this.props;

    const title = [
      { name: formatMessage({ id: 'PRODUCT_MANAGEMENT' }) },
      { name: formatMessage({ id: 'COMMISSION_RULE_TITLE' }) },
      { name: formatMessage({ id: 'ONLINE_FIXED_COMMISSION' }) },
    ];

    const pageOpts = {
      total: totalSize,
      current: currentPage,
      pageSize: nowPageSize,
      pageChange: (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
          type: 'commissionRuleSetup/search',
          payload: {
            pagination: {
              currentPage: page,
              pageSize,
            },
          },
        });
      },
    };

    return (
      <Row id="mainTaView">
        <MediaQuery minWidth={SCREEN.screenSm}>
          <BreadcrumbCompForPams title={title} />
        </MediaQuery>
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
                      <SortSelect
                        placeholder={formatMessage({ id: 'PRODUCT_COMMISSION_TYPE' })}
                        optionFilterProp="children"
                        style={{ width: '100%' }}
                        allowClear
                        options={[
                          <Option value="attendance" key="Attendance">
                            Attendance Commission
                          </Option>,
                          <Option value="tiered" key="Tiered">
                            Tiered Commission
                          </Option>,
                        ]}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...ColProps}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator(
                      `status`,
                      {}
                    )(
                      <SortSelect
                        placeholder={formatMessage({ id: 'STATUS' })}
                        optionFilterProp="children"
                        style={{ width: '100%' }}
                        allowClear
                        options={[
                          <Option value="Active" key="Active">
                            Active
                          </Option>,
                          <Option value="Inactive" key="Inactive">
                            InActive
                          </Option>,
                        ]}
                      />
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
              <Col {...ColProps} style={{ paddingLeft: 12 }}>
                <Button type="primary" onClick={() => this.new()}>
                  {formatMessage({ id: 'COMMON_NEW' })}
                </Button>
              </Col>
            </Row>
            <Table
              style={{ marginTop: 10 }}
              className={`components-table-demo-nested ${detailStyles.searchTitle}`}
              rowKey={record => record.commoditySpecId}
              bordered={false}
              size="small"
              dataSource={commissionList}
              pagination={false}
              loading={!!loading}
              columns={this.columns}
              scroll={{ x: 660 }}
            />
            <PaginationComp style={{ marginTop: 10 }} {...pageOpts} />
          </Card>
        </Col>
      </Row>
    );
  }
}

export default CommissionRuleSetup;
