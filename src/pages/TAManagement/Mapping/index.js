import React from 'react';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  Row,
  Select,
  Table,
  Tooltip,
} from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { isEqual } from 'lodash';
import MediaQuery from 'react-responsive';
import detailStyles from './index.less';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import SCREEN from '@/utils/screen';
import SortSelect from '@/components/SortSelect';

const formItemLayout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 24,
  },
  colon: false,
};

const ColProps = {
  xs: 24,
  sm: 12,
  md: 6,
  xl: 6,
};

const BtnColProps = {
  xs: 24,
  sm: 12,
  md: 6,
  xl: 6,
};

@Form.create()
@connect(({ mapping, loading }) => ({
  mapping,
  loading: loading.effects['mapping/fetchMappingList'],
}))
class Index extends React.PureComponent {
  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
  };

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: formatMessage({ id: 'NO' }),
        dataIndex: 'number',
        key: 'number',
        width: 100,
        render: text =>
          text ? (
            <Tooltip placement="topLeft" title={text} overlayStyle={{ whiteSpace: 'pre-wrap' }}>
              {text}
            </Tooltip>
          ) : (
            '-'
          ),
      },
      {
        title: formatMessage({ id: 'AGENT_ID' }),
        dataIndex: 'taId',
        key: 'taId',
        width: 100,
        render: text =>
          text ? (
            <Tooltip placement="topLeft" title={text} overlayStyle={{ whiteSpace: 'pre-wrap' }}>
              {text}
            </Tooltip>
          ) : (
            '-'
          ),
      },
      {
        title: formatMessage({ id: 'TA_COMPANY_NAME' }),
        dataIndex: 'companyName',
        key: 'companyName',
        width: 160,
        render: text =>
          text ? (
            <Tooltip placement="topLeft" title={text} overlayStyle={{ whiteSpace: 'pre-wrap' }}>
              {text}
            </Tooltip>
          ) : (
            '-'
          ),
      },
      {
        title: formatMessage({ id: 'GST_REG_NO' }),
        dataIndex: 'gstRegNo',
        key: 'gstRegNo',
        width: 160,
        render: text =>
          text ? (
            <Tooltip placement="topLeft" title={text} overlayStyle={{ whiteSpace: 'pre-wrap' }}>
              {text}
            </Tooltip>
          ) : (
            '-'
          ),
      },
      {
        title: formatMessage({ id: 'ADD_USER_EFFECTIVE_DATE' }),
        dataIndex: 'effectiveDate',
        key: 'effectiveDate',
        width: 80,
        render: text => {
          const timeText = text ? moment(text).format('YYYY-MM-DD') : '';
          return timeText ? (
            <div>
              <Tooltip
                title={timeText}
                placement="topLeft"
                overlayStyle={{ whiteSpace: 'pre-wrap' }}
              >
                {timeText}
              </Tooltip>
            </div>
          ) : null;
        },
      },
      {
        title: formatMessage({ id: 'AR_CREDIT_BALANCE' }),
        dataIndex: 'arCredit',
        key: 'AR',
        width: 120,
        render: text =>
          text ? (
            <Tooltip placement="topLeft" title={text} overlayStyle={{ whiteSpace: 'pre-wrap' }}>
              {text}
            </Tooltip>
          ) : (
            '-'
          ),
      },
      {
        title: formatMessage({ id: 'EWALLET_BALANCE' }),
        dataIndex: 'eWallet',
        key: 'eWallet',
        width: 160,
        render: text =>
          text ? (
            <Tooltip placement="topLeft" title={text} overlayStyle={{ whiteSpace: 'pre-wrap' }}>
              {text}
            </Tooltip>
          ) : (
            '-'
          ),
      },
      // {
      //   title: formatMessage({ id: 'STATUS' }),
      //   dataIndex: 'statusName',
      //   key: 'statusName',
      //   width: 100,
      //   render: text => {
      //     let flagClass = '';
      //     if (text === 'PENDING OPERATION') flagClass = detailStyles.flagStyle1;
      //     if (text === 'FAIL') flagClass = detailStyles.flagStyle3;
      //     if (text === 'COMPLETE') flagClass = detailStyles.flagStyle2;
      //     return (
      //       <Tooltip placement="topLeft" title={text} overlayStyle={{ whiteSpace: 'pre-wrap' }}>
      //         <span className={flagClass} />
      //         {text}
      //       </Tooltip>
      //     );
      //   },
      // },
      {
        title: formatMessage({ id: 'OPERATION' }),
        dataIndex: 'operation',
        key: 'operation',
        width: 100,
        render: (value, row) => {
          let iconType = '';
          let message = {};
          if (row.statusName === 'FAIL' || row.statusName === 'PENDING OPERATION') {
            iconType = 'block';
            message = formatMessage({ id: 'COMMON_UPLOAD_MAPPING' });
          } else if (row.statusName === 'COMPLETE') {
            iconType = 'edit';
            message = formatMessage({ id: 'COMMON_EDIT' });
          }
          return (
            <div>
              <Tooltip
                title={formatMessage({ id: 'COMMON_DETAIL' })}
                overlayStyle={{ whiteSpace: 'pre-wrap' }}
              >
                {row.statusName === 'COMPLETE' ? (
                  <Icon
                    type="eye"
                    onClick={() => {
                      this.detail('eye', row);
                    }}
                  />
                ) : null}
              </Tooltip>
              {row.statusName ? (
                <Tooltip title={message} overlayStyle={{ whiteSpace: 'pre-wrap' }}>
                  <Icon
                    type={iconType}
                    onClick={() => {
                      this.mappingModal(iconType, row);
                    }}
                  />
                </Tooltip>
              ) : null}
            </div>
          );
        },
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'mapping/fetchMappingList',
    });

    dispatch({
      type: 'mapping/fetchqueryDictionary',
    });
    dispatch({
      type: 'mapping/fetchEWalletTypeDictionary',
    });
    dispatch({
      type: 'mapping/fetchArCreditTypeDictionary',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'mapping/clear',
      payload: {},
    });
  }

  mappingModal = (type = 'eye', row = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mapping/save',
      payload: { type },
    });
    if (type === 'edit') {
      router.push({
        pathname: `/TAManagement/Mapping/Edit/${row.taId}`,
        query: { companyName: row.companyName, arAllowed: row.arAllowed },
      });
    } else if (type === 'block') {
      router.push({
        pathname: `/TAManagement/Mapping/New/${row.taId}`,
        query: { companyName: row.companyName, arAllowed: row.arAllowed },
      });
    }
  };

  detail = (type = 'eye', row = {}) => {
    if (type === 'eye') {
      router.push({
        pathname: `/TAManagement/Mapping/${row.taId}`,
        query: { companyName: row.companyName },
      });
    }
  };

  handleSubmit = e => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const likeParam = {
          idOrName: values.taId || '',
          applicationBeginDate: values.applicationBeginDate
            ? values.applicationBeginDate.format('YYYY-MM-DD')
            : '',
          applicationEndDate: values.applicationBeginDate
            ? values.applicationEndDate.format('YYYY-MM-DD')
            : '',
          status: values.status || '',
          ewalletType: values.ewalletType || '',
          arCreditType: values.arCreditType || '',
        };
        // if (Array.isArray(values.applicationDate)) {
        //   const begin = values.applicationDate[0];
        //   const end = values.applicationDate[1];
        //   likeParam.applicationBeginDate = begin.format('YYYY-MM-DD');
        //   likeParam.applicationEndDate = end.format('YYYY-MM-DD');
        // }
        dispatch({
          type: 'mapping/search',
          payload: {
            filter: {
              likeParam,
            },
          },
        });
      }
    });
  };

  handleTableChange = page => {
    const {
      dispatch,
      mapping: { pagination },
    } = this.props;

    // page change
    if (!isEqual(page, pagination)) {
      dispatch({
        type: 'mapping/tableChanged',
        payload: {
          pagination: {
            currentPage: page.current,
            pageSize: page.pageSize,
          },
        },
      });
    }
  };

  handleReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'mapping/fetchSelectReset',
      payload: {
        currentPage: 1,
        pageSize: 10,
      },
    });
  };

  disabledStartDate = startValue => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = value => {
    this.onChange('startValue', value);
  };

  onEndChange = value => {
    this.onChange('endValue', value);
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };

  showTotal = total => {
    return <div>Total {total} items</div>;
  };

  getTableHeight = () => {
    const { offsetHeight: layoutHeight } = document.getElementById('layout');
    if (document.getElementById('pageHeaderTitle') && document.getElementById('pageSearchCard')) {
      const { offsetHeight: pageHeaderTitleHeight } = document.getElementById('pageHeaderTitle');
      const { offsetHeight: pageSearchCardHeight } = document.getElementById('pageSearchCard');
      return layoutHeight - pageHeaderTitleHeight - pageSearchCardHeight - 240;
    }
    return layoutHeight;
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      mapping: {
        mappingList,
        currentPage,
        pageSize,
        totalSize,
        salutationList,
        arCreditTypeList,
        eWalletTypeList,
      },
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
        breadcrumbName: formatMessage({ id: 'MENU_TA_MANAGEMENT' }),
        url: null,
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_TA_MAPPING' }),
        url: null,
      },
    ];
    const tableOpts = {
      size: 'small',
      bordered: false,
      scroll: { x: 750 },
    };
    const { endOpen } = this.state;
    return (
      <Row type="flex" justify="space-around" id="mapping">
        <Col id="pageHeaderTitle" span={24} className={detailStyles.pageHeaderTitle}>
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
        <Col id="pageSearchCard" span={24} className={detailStyles.pageSearchCard}>
          <Card>
            <Form onSubmit={this.handleSubmit}>
              <Row gutter={24}>
                <Col {...ColProps}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator(`taId`, {
                      rules: [
                        {
                          required: false,
                          message: '',
                        },
                      ],
                    })(<Input placeholder="Agent ID/Company Name" allowClear />)}
                  </Form.Item>
                </Col>
                <Col {...ColProps}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator(`applicationBeginDate`, {
                      rules: [
                        {
                          required: false,
                          message: '',
                        },
                      ],
                    })(
                      <DatePicker
                        style={{ display: 'block' }}
                        format="YYYY-MM-DD"
                        placeholder="Start Date"
                        onChange={this.onStartChange}
                        onOpenChange={this.handleStartOpenChange}
                        disabledDate={this.disabledStartDate}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...ColProps}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator(`applicationEndDate`, {
                      rules: [
                        {
                          required: false,
                          message: '',
                        },
                      ],
                    })(
                      <DatePicker
                        style={{ display: 'block' }}
                        format="YYYY-MM-DD"
                        placeholder="End Date"
                        onChange={this.onEndChange}
                        open={endOpen}
                        onOpenChange={this.handleEndOpenChange}
                        disabledDate={this.disabledEndDate}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...ColProps}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('arCreditType', {
                      // initialValue: this.handleInitVal('status'),
                    })(
                      <SortSelect
                        placeholder={formatMessage({ id: 'AR_CREDIT_BALANCE' })}
                        optionFilterProp="children"
                        style={{ width: '100%' }}
                        allowClear
                        options={arCreditTypeList.map(arCreditType => (
                          <Select.Option
                            key={`arCreditTypeList${arCreditType.dictId}`}
                            value={arCreditType.dictId}
                          >
                            {arCreditType.dictName}
                          </Select.Option>
                        ))}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...ColProps}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('ewalletType', {
                      // initialValue: this.handleInitVal('status'),
                    })(
                      <SortSelect
                        placeholder={formatMessage({ id: 'EWALLET_BALANCE' })}
                        optionFilterProp="children"
                        style={{ width: '100%' }}
                        allowClear
                        options={eWalletTypeList.map(eWalletType => (
                          <Select.Option
                            key={`eWalletTypeList_${eWalletType.dictId}`}
                            value={eWalletType.dictId}
                          >
                            {eWalletType.dictName}
                          </Select.Option>
                        ))}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...BtnColProps} className={detailStyles.buttonStyle}>
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
            <MediaQuery maxWidth={SCREEN.screenXsMax}>
              <Table
                {...tableOpts}
                dataSource={mappingList}
                pagination={pagination}
                loading={loading}
                columns={this.columns}
                className={`tabs-no-padding ${detailStyles.searchTitle}`}
                onChange={this.handleTableChange}
                rowKey={record => record.taId}
                scroll={{ x: 660 }}
              />
            </MediaQuery>
            <MediaQuery minWidth={SCREEN.screenSmMin}>
              <Table
                {...tableOpts}
                dataSource={mappingList}
                pagination={pagination}
                loading={loading}
                columns={this.columns}
                className={`tabs-no-padding ${detailStyles.searchTitle}`}
                onChange={this.handleTableChange}
                rowKey={record => record.taId}
                scroll={{ x: 660, y: this.getTableHeight() }}
              />
            </MediaQuery>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default Index;
