import React from 'react';
import { Button, Card, Col, Form, Icon, Input, Row, Select, Table, Tooltip, Popover } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import router from 'umi/router';
import MediaQuery from 'react-responsive';
import moment from 'moment';
import detailStyles from './index.less';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import Edit from './components/Edit';
import { isNvl } from '@/utils/utils';

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
  xs: 24,
  sm: 12,
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
      title: formatMessage({ id: 'PLU_CODE' }),
      dataIndex: 'commodityCode',
    },
    {
      title: formatMessage({ id: 'PLU_DESCRIPTION' }),
      dataIndex: 'commodityDescription',
    },
    {
      title: formatMessage({ id: 'THEME_PARK' }),
      dataIndex: 'themeParkCode',
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
                <Icon type="eye" onClick={() => this.detail(record)} />
              </Tooltip>
            </Popover>
            <Tooltip title={formatMessage({ id: 'COMMON_EDIT' })}>
              <Icon type="edit" onClick={() => this.edit(record)} />
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
        attributeType: 'Attraction',
      },
    });
  }

  detail = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'offline/detail',
      payload: {
        commoditySpecType: 'PackagePlu',
        commoditySpecId: !isNvl(record.commoditySpecId) ? record.commoditySpecId : null,
      },
    });
  };

  getContent = () => {
    const {
      offline: { commissionList },
    } = this.props;
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
            <span className={detailStyles.infoStyle}>
              {!isNvl(commissionList.commissionScheme) && commissionList.createStaff !== 'null'
                ? commissionList.commissionScheme
                : '-'}
            </span>
          </FormItem>
          <FormItem
            {...formItemLayout2}
            label={
              <span className={detailStyles.labelStyle}>
                {formatMessage({ id: 'ACCOUNTING_CREATED_BY' })}
              </span>
            }
          >
            <span className={detailStyles.infoStyle}>
              {!isNvl(commissionList.createStaff) && commissionList.createStaff !== 'null'
                ? commissionList.createStaff
                : '-'}
            </span>
          </FormItem>
          <FormItem
            {...formItemLayout2}
            label={
              <span className={detailStyles.labelStyle}>
                {formatMessage({ id: 'COMMISSION_CREATED_TIME' })}
              </span>
            }
          >
            <span className={detailStyles.infoStyle}>
              {!isNvl(commissionList.createTime)
                ? moment(commissionList.createTime, 'YYYY-MM-DD').format('YYYY-MM-DD hh:mm:ss')
                : '-'}
            </span>
          </FormItem>
        </Form>
      </div>
    );
  };

  new = () => {
    router.push({
      pathname: '/ProductManagement/CommissionRule/OfflineRule/New',
      query: { type: 'new' },
    });
  };

  edit = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'offline/save',
      payload: {
        drawerVisible: true,
        commoditySpecId: !isNvl(record.commoditySpecId) ? record.commoditySpecId : null,
      },
    });
    dispatch({
      type: 'offline/detail',
      payload: {
        commoditySpecType: 'PackagePlu',
        commoditySpecId: !isNvl(record.commoditySpecId) ? record.commoditySpecId : null,
      },
    });
  };

  handleSearch = e => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const likeParam = {
          commonSearchText: values.commonSearchText || '',
          themeParkCode: values.themeParkCode || '',
        };
        dispatch({
          type: 'offline/search',
          payload: {
            filter: {
              likeParam,
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

  showTotal = total => {
    return <div>Total {total} items</div>;
  };

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
    const tableOpts = {
      size: 'small',
      bordered: false,
      scroll: { x: 750 },
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
                      `commonSearchText`,
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
                      `themeParkCode`,
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
                <Col style={{ textAlign: 'right' }}>
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
              {...tableOpts}
              rowKey="id"
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
