import React from 'react';
import { Button, Card, Col, Form, Icon, Input, Row, Select, Table, Tooltip, Popover } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import router from 'umi/router';
import MediaQuery from 'react-responsive';
import moment from 'moment';
import detailStyles from './index.less';
import SCREEN from '@/utils/screen';
import Edit from './components/Edit';
import { isNvl } from '@/utils/utils';
import BreadcrumbCompForPams from '@/components/BreadcrumbComp/BreadcurmbCompForPams';
import PaginationComp from '@/pages/ProductManagement/components/PaginationComp';
import { formatPrice } from '../../utils/tools';

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
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
  colon: false,
};

const ColProps = {
  xs: 24,
  sm: 12,
  md: 6,
  xl: 6,
};

const inflate = {
  position: 'relative',
  zIndex: 1,
};

@Form.create()
@connect(({ offline, loading }) => ({
  offline,
  loading: loading.effects['offline/fetchOfflineList'],
}))
class Offline extends React.PureComponent {
  columns = [
    {
      title: formatMessage({ id: 'NUMBER' }),
      dataIndex: 'no',
    },
    {
      title: formatMessage({ id: 'PLU_CODE' }),
      dataIndex: 'commoditySpecId',
      key: 'commoditySpecId',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'PLU_DESCRIPTION' }),
      dataIndex: 'commodityDescription',
      key: 'commodityDescription',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'THEME_PARK' }),
      dataIndex: 'themeParkCode',
      render: text => this.showThemeParkName(text),
    },
    {
      title: formatMessage({ id: 'PRODUCT_COMMISSION_SCHEME' }),
      key: 'commissionScheme',
      render: (_, record) => this.commissionSchemeValue(record),
    },
    {
      title: 'Price',
      dataIndex: 'commodityPrice',
      render: text => {
        const timeText = text ? formatPrice(text) : '';
        return timeText ? (
          <div>
            <Tooltip title={timeText} placement="topLeft">
              {timeText}
            </Tooltip>
          </div>
        ) : null;
      },
    },
    {
      title: formatMessage({ id: 'OPERATION' }),
      key: 'operation',
      render: (_, record) => this.showOperation(record),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'offline/queryThemeParks' });
    dispatch({
      type: 'offline/fetchOfflineList',
      payload: {
        usageScope: 'Offline',
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'offline/clear',
    });
  }

  commissionSchemeValue = record => {
    if (!isNvl(record && record.commissionList && record.commissionList.Fixed)) {
      const { commissionScheme, commissionValue } = record.commissionList.Fixed;
      const commissionValue2 = parseFloat(commissionValue * 100).toFixed();
      if (commissionScheme === 'Amount') {
        return (
          <Tooltip
            placement="topLeft"
            title={<span style={{ whiteSpace: 'pre-wrap' }}>${commissionValue} / Ticket</span>}
          >
            <span>${commissionValue} / Ticket</span>
          </Tooltip>
        );
      }
      if (commissionScheme === 'Percentage') {
        return (
          <Tooltip
            placement="topLeft"
            title={<span style={{ whiteSpace: 'pre-wrap' }}>${commissionValue2} % / Ticket</span>}
          >
            <span>{commissionValue2}% / Ticket</span>
          </Tooltip>
        );
      }
    }
    return null;
  };

  showOperation = record => {
    if (record.subCommodityList !== null) {
      return null;
    }
    return (
      <div>
        <Popover trigger="click" placement="leftTop" content={this.getContent(record)}>
          <Tooltip title={formatMessage({ id: 'COMMON_DETAIL' })}>
            <Icon type="eye" />
          </Tooltip>
        </Popover>
        <Tooltip title={formatMessage({ id: 'COMMON_EDIT' })}>
          <Icon type="edit" onClick={() => this.edit(record)} />
        </Tooltip>
      </div>
    );
  };

  showThemeParkName = text => {
    const {
      offline: { themeParkList },
    } = this.props;
    for (let i = 0; i < themeParkList.length; i += 1) {
      if (themeParkList[i].itemValue === text) {
        return (
          <Tooltip
            placement="topLeft"
            title={<span style={{ whiteSpace: 'pre-wrap' }}>{themeParkList[i].itemName}</span>}
          >
            <span>{themeParkList[i].itemName}</span>
          </Tooltip>
        );
      }
    }
    return null;
  };

  getContent = record => {
    let commissionSchemeValue = '-';
    let createBy = '-';
    let createTimeValue = '-';
    if (!isNvl(record && record.commissionList && record.commissionList.Fixed)) {
      const {
        commissionScheme,
        createStaff,
        createTime,
        commissionValue,
      } = record.commissionList.Fixed;
      if (commissionScheme === 'Amount') {
        commissionSchemeValue = `$${commissionValue} / Ticket`;
      } else if (commissionScheme === 'Percentage') {
        commissionSchemeValue = `${parseFloat(commissionValue * 100).toFixed()}%`;
      }
      createBy = createStaff !== null ? createStaff : '-';
      createTimeValue = createTime !== null ? moment(createTime).format('DD-MMM-YYYY') : '-';
    }
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
            <Tooltip
              placement="topLeft"
              title={<span style={{ whiteSpace: 'pre-wrap' }}>{commissionSchemeValue}</span>}
            >
              <span className={detailStyles.infoStyle}>{commissionSchemeValue}</span>
            </Tooltip>
          </FormItem>
          <FormItem
            {...formItemLayout2}
            label={
              <span className={detailStyles.labelStyle}>
                {formatMessage({ id: 'ACCOUNTING_CREATED_BY' })}
              </span>
            }
          >
            <Tooltip
              placement="topLeft"
              title={<span style={{ whiteSpace: 'pre-wrap' }}>{createBy}</span>}
            >
              <span className={detailStyles.infoStyle}>{createBy}</span>
            </Tooltip>
          </FormItem>
          <FormItem
            {...formItemLayout2}
            label={
              <span className={detailStyles.labelStyle}>
                {formatMessage({ id: 'COMMISSION_CREATED_TIME' })}
              </span>
            }
          >
            <Tooltip
              placement="topLeft"
              title={<span style={{ whiteSpace: 'pre-wrap' }}>{createTimeValue}</span>}
            >
              <span className={detailStyles.infoStyle}>{createTimeValue}</span>
            </Tooltip>
          </FormItem>
        </Form>
      </div>
    );
  };

  new = () => {
    const {
      offline: { offlineList },
    } = this.props;
    router.push({
      pathname: '/ProductManagement/CommissionRule/OfflineRule/New',
      query: { type: 'new', offlineList },
    });
  };

  edit = record => {
    const { dispatch } = this.props;
    let commissionSchemeValue = 'Amount';
    let commissionShowValue = null;
    let tplIdValue = null;
    let commissionValueAmount = null;
    let commissionValuePercent = null;
    if (record && record.commissionList && record.commissionList.Fixed) {
      const { commissionScheme, commissionValue, tplId } = record.commissionList.Fixed;
      commissionSchemeValue = commissionScheme;
      commissionShowValue = commissionValue;
      tplIdValue = tplId;
    }
    if (commissionSchemeValue === 'Amount') {
      commissionValueAmount = commissionShowValue;
    }
    if (commissionSchemeValue === 'Percentage') {
      commissionValuePercent = parseFloat(commissionShowValue * 100).toFixed();
    }
    dispatch({
      type: 'offline/save',
      payload: {
        drawerVisible: true,
      },
    });

    Object.entries(record).map(([key, value]) => {
      if(key === 'commissionList') {
        delete record[key];
      }
    });

    dispatch({
      type: 'offline/saveModifyParams',
      payload: {
        commissionScheme: commissionSchemeValue,
        commissionValue: commissionShowValue,
        tplId: tplIdValue,
        commissionValueAmount,
        commissionValuePercent,
        commodityList: record
      },
    });
  };

  handleSearch = e => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'offline/search',
          payload: {
            commonSearchText: values.commonSearchText,
            themeParkCode: values.themeParkCode,
            usageScope: 'Offline',
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
        commonSearchText: null,
        themeParkCode: null,
        usageScope: 'Offline',
        currentPage: 1,
        pageSize: 10,
      },
    });
  };

  showTotal = total => {
    return <div>Total {total} items</div>;
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      offline: {
        offlineList,
        totalSize,
        themeParkList,
        searchCondition: { currentPage, pageSize: nowPageSize },
      },
    } = this.props;

    const title = [
      { name: formatMessage({ id: 'PRODUCT_MANAGEMENT' }) },
      { name: formatMessage({ id: 'COMMISSION_RULE_TITLE' }) },
      { name: formatMessage({ id: 'OFFLINE_FIXED_COMMISSION' }) },
    ];

    const pageOpts = {
      total: totalSize,
      current: currentPage,
      pageSize: nowPageSize,
      pageChange: (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
          type: 'offline/search',
          payload: {
            currentPage: page,
            pageSize,
          },
        });
      },
    };

    return (
      <Row>
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
                      `commonSearchText`,
                      {}
                    )(
                      <Input
                        style={inflate}
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
                        style={{ width: '100%', ...inflate }}
                        allowClear
                      >
                        {themeParkList &&
                          themeParkList.map(item => (
                            <Option key={item.itemValue} value={item.itemValue}>
                              {item.itemName}
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
              dataSource={offlineList}
              pagination={false}
              loading={!!loading}
              columns={this.columns}
            />
            <PaginationComp style={{ marginTop: 10 }} {...pageOpts} />
          </Card>
        </Col>
        <Edit />
      </Row>
    );
  }
}

export default Offline;
