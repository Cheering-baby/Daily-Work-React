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

const { RangePicker } = DatePicker;
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
@connect(({ mapping, loading }) => ({
  mapping,
  loading: loading.effects['mapping/fetchMappingList'],
}))
class Index extends React.PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: formatMessage({ id: 'NO' }),
        dataIndex: 'number',
        key: 'number',
      },
      {
        title: formatMessage({ id: 'AGENT_ID' }),
        dataIndex: 'taId',
        key: 'taId',
      },
      {
        title: formatMessage({ id: 'TA_COMPANY_NAME' }),
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: formatMessage({ id: 'GST_REG_NO' }),
        dataIndex: 'gstRegNo',
        key: 'gstRegNo',
      },
      {
        title: formatMessage({ id: 'ADD_USER_EFFECTIVE_DATE' }),
        dataIndex: 'effectiveDate',
        key: 'effectiveDate',
        render: text => {
          const timeText = text ? moment(text, 'YYYYMMDD').format('YYYY-MM-DD') : '';
          return timeText ? (
            <div>
              <Tooltip
                title={text ? moment(text, 'YYYYMMDD').format('YYYY-MM-DD') : ''}
                placement="topLeft"
              >
                {text ? moment(text, 'YYYYMMDD').format('YYYY-MM-DD') : ''}
              </Tooltip>
            </div>
          ) : null;
        },
      },
      {
        title: formatMessage({ id: 'AR_CREDIT_BALANCE' }),
        dataIndex: 'AR',
        key: 'AR',
      },
      {
        title: formatMessage({ id: 'EWALLET_BALANCE' }),
        dataIndex: 'eWallet',
        key: 'eWallet',
      },
      {
        title: formatMessage({ id: 'STATUS' }),
        dataIndex: 'statusName',
        key: 'statusName',
        render: text => {
          let flagClass = '';
          if (text === 'PENDING OPERATION') flagClass = detailStyles.flagStyle1;
          if (text === 'FAIL') flagClass = detailStyles.flagStyle3;
          if (text === 'COMPLETE') flagClass = detailStyles.flagStyle2;
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
        dataIndex: 'operation',
        key: 'operation',
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
              <Tooltip title={formatMessage({ id: 'COMMON_DETAIL' })}>
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
                <Tooltip title={message}>
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
        query: { companyName: row.companyName },
      });
    } else if (type === 'block') {
      router.push({
        pathname: `/TAManagement/Mapping/Edit/${row.taId}`,
        query: { companyName: row.companyName },
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
    const {
      form,
      dispatch,
      // mapping: { salutationList },
    } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const likeParam = {
          idOrName: values.taId || '',
          applicationBeginDate: '',
          applicationEndDate: '',
          status: values.status || '',
        };
        if (Array.isArray(values.applicationDate)) {
          const begin = values.applicationDate[0];
          const end = values.applicationDate[1];
          likeParam.applicationBeginDate = begin.format('YYYY-MM-DD');
          likeParam.applicationEndDate = end.format('YYYY-MM-DD');
        }
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

  showTotal(total) {
    return <div>Total {total} items</div>;
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      mapping: { mappingList, currentPage, pageSize, totalSize, salutationList },
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
    return (
      <Row type="flex" justify="space-around" id="mapping">
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
            <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
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
                    {getFieldDecorator(`applicationDate`, {
                      rules: [
                        {
                          required: false,
                          message: '',
                        },
                      ],
                    })(
                      <RangePicker
                        style={{ display: 'block' }}
                        format="YYYY-MM-DD"
                        placeholder={['Start', 'End']}
                        // separator={null}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...ColProps}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator('status', {
                      // initialValue: this.handleInitVal('status'),
                    })(
                      <Select
                        placeholder={formatMessage({ id: 'STATUS' })}
                        optionFilterProp="children"
                        style={{ width: '100%' }}
                        allowClear
                      >
                        {salutationList.map(status => (
                          <Select.Option key={`option_${status.dictId}`} value={status.dictId}>
                            {status.dictName}
                          </Select.Option>
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
            <Table
              size="small"
              dataSource={mappingList}
              pagination={pagination}
              loading={loading}
              columns={this.columns}
              className={`tabs-no-padding ${detailStyles.searchTitle}`}
              onChange={this.handleTableChange}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}

export default Index;
