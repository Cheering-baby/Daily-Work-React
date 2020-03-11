import React from 'react';
import router from 'umi/router';
import { Button, Card, Col, DatePicker, Form, Icon, Row, Select, Table, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import moment from 'moment';
import MediaQuery from 'react-responsive';
import detailStyles from './index.less';
import MyActivityDownload from './components/MyActivityDownload';
import UploadModal from '@/components/Upload/Upload';
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
  xs: 24,
  md: 6,
};

@Form.create()
@connect(({ myActivity, loading }) => ({
  myActivity,
  loading: loading.effects['myActivity/fetchApprovalList'],
}))
class MyActivity extends React.PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: formatMessage({ id: 'ACTIVITY_ID' }),
        dataIndex: 'activityId',
      },
      {
        title: formatMessage({ id: 'ACTIVITY_TYPE' }),
        dataIndex: 'activityTypeName',
      },
      {
        title: formatMessage({ id: 'REMARKS' }),
        dataIndex: 'remarks',
      },
      {
        title: formatMessage({ id: 'CREATE_DATE' }),
        dataIndex: 'createTime',
        sorter: true,
        render: text => {
          const timeText = text ? moment(text).format('DD-MMM-YYYY') : '';
          return timeText ? (
            <div className={detailStyles.tableColDiv}>
              <Tooltip title={timeText} placement="topLeft">
                {timeText}
              </Tooltip>
            </div>
          ) : null;
        },
      },
      {
        title: formatMessage({ id: 'STATUS' }),
        dataIndex: 'status',
        render: (text, record) => {
          let flagClass = '';
          if (text === '02' || text === '03') flagClass = detailStyles.flagStyle1;
          if (text === '00') flagClass = detailStyles.flagStyle2;
          if (text === '01') flagClass = detailStyles.flagStyle3;
          return (
            <div>
              <span className={flagClass} />
              {record.statusName}
            </div>
          );
        },
      },
      {
        title: formatMessage({ id: 'OPERATION' }),
        dataIndex: 'operation',
        render: (text, record) => {
          let iconType = '';
          let message = {};
          if (record.statusName === 'Pending Others Operation') {
            iconType = 'upload';
            message = formatMessage({ id: 'COMMON_UPLOAD' });
          }
          // if (record.statusName === 'Pending Operation') {
          //   iconType = 'block';
          //   message = formatMessage({ id: 'COMMON_UPLOAD_MAPPING' });
          // }
          if (record.statusName === 'Pending Operation') {
            iconType = 'audit';
            message = formatMessage({ id: 'COMMON_UPLOAD_APPROVAL' });
          }
          return (
            <div>
              <Tooltip title={formatMessage({ id: 'COMMON_DETAIL' })}>
                <Icon
                  type="eye"
                  onClick={() => {
                    this.detail('eye', record);
                  }}
                />
              </Tooltip>
              {record.statusName ? (
                <Tooltip title={message}>
                  <Icon
                    type={iconType}
                    onClick={() => {
                      this.detail(iconType, record);
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
      type: 'myActivity/fetchApprovalList',
      payload: {},
    });

    dispatch({
      type: 'myActivity/statusList',
      payload: {},
    });

    dispatch({
      type: 'myActivity/templateList',
      payload: {},
    });
  }

  handleReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'myActivity/fetchSelectReset',
      payload: {
        currentPage: 1,
        pageSize: 10,
      },
    });
  };

  handleSearch = ev => {
    ev.preventDefault();
    const { form } = this.props;
    const { dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let startDate;
        let endDate;
        if (Array.isArray(values.createDate)) {
          startDate = values.createDate[0].format('YYYY-MM-DD');
          endDate = values.createDate[1].format('YYYY-MM-DD');
        }
        dispatch({
          type: 'myActivity/search',
          payload: {
            filter: {
              startDate,
              endDate,
              activityTplCode: values.activityTplCode,
              status: values.status,
            },
          },
        });
      }
    });
  };

  handleModal = (key, flag = true) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'myActivity/toggleModal',
      payload: {
        key,
        val: flag,
      },
    });
  };

  handleTableChange = page => {
    const {
      dispatch,
      myActivity: { pagination },
    } = this.props;

    if (page.current !== pagination.currentPage || page.pageSize !== pagination.pageSize) {
      pagination.currentPage = page.current;
      pagination.pageSize = page.pageSize;
      dispatch({
        type: 'myActivity/tableChanged',
        payload: {
          pagination,
        },
      });
    }
  };

  detail = (type = 'eye', record = {}) => {
    if (type === 'eye') {
      router.push({
        pathname: `/MyActivity/${record.activityId}`,
        query: { activityTplCode: record.activityTplCode },
      });
    } else if (type === 'upload') {
      this.uploadProps = {
        ...this.uploadProps,
        title: formatMessage({
          id: 'UPLOAD_CONTRACT',
        }),
        type: 'upload',
        record,
        onCancel: () => {
          this.handleModal('uploadVisible', false);
        },
      };
      this.handleModal('uploadVisible', true);
    } else if (type === 'block') {
      router.push({
        pathname: '/TAManagement/Mapping',
      });
    } else if (type === 'audit') {
      this.downloadProps = {
        ...this.downloadProps,
        title: formatMessage({
          id: 'COMMON_DOWNLOAD',
        }),
        type: 'audit',
        record,
        onCancel: () => {
          this.handleModal('downloadVisible', false);
        },
        onNext: () => {
          this.handleModal('downloadVisible', false);
        },
      };
      this.handleModal('downloadVisible', true);
    }
  };

  showTotal(total) {
    return <div>Total {total} items</div>;
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {
      loading,
      myActivity: {
        approvalList,
        pagination: { currentPage, pageSize, totalSize },
        uploadVisible,
        statusList,
        templateList,
        downloadVisible,
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
        breadcrumbName: formatMessage({ id: 'MENU_TA_MYACTIVITY' }),
        url: null,
      },
    ];
    return (
      <Row type="flex" justify="space-around" id="myActivity">
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
                    {getFieldDecorator(`activityTplCode`, {
                      rules: [
                        {
                          required: false,
                          message: '',
                        },
                      ],
                    })(
                      <Select
                        placeholder={formatMessage({ id: 'ACTIVITY_TYPE' })}
                        optionFilterProp="children"
                        style={{ width: '100%' }}
                        // allowClear=true
                      >
                        {templateList.map(record => (
                          <Option
                            key={`status_option_${record.templateCode}`}
                            value={record.templateCode}
                          >
                            {record.templateName}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col {...ColProps}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator(`createDate`, {
                      rules: [
                        {
                          required: false,
                          message: '',
                        },
                      ],
                    })(
                      <DatePicker.RangePicker
                        style={{ display: 'block' }}
                        format="YYYY-MM-DD"
                        placeholder="Create Date"
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
                        {statusList.map(record => (
                          <Option key={`status_option_${record.status}`} value={record.status}>
                            {record.statusName}
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
        {uploadVisible && <UploadModal {...this.uploadProps} />}
        {downloadVisible && <MyActivityDownload {...this.downloadProps} />}
        <Col span={24} className={detailStyles.pageTableCard}>
          <Card>
            <Table
              rowKey="id"
              bordered={false}
              size="small"
              dataSource={approvalList}
              pagination={pagination}
              loading={loading}
              columns={this.columns}
              className={detailStyles.tableStyle}
              onChange={this.handleTableChange}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}

export default MyActivity;
