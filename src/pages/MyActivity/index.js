import React from 'react';
import router from 'umi/router';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Icon,
  message,
  Modal,
  Row,
  Select,
  Table,
  Tooltip,
  Input,
} from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import moment from 'moment';
import MediaQuery from 'react-responsive';
import detailStyles from './index.less';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import UploadContract from '@/pages/MyActivity/components/UploadContract';
import PrivilegeUtil from '@/utils/PrivilegeUtil';

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
  sm: 12,
  md: 6,
  xl: 6,
};

@Form.create()
@connect(({ myActivity, loading }) => ({
  myActivity,
  loading: loading.effects['myActivity/queryActivityList'],
  contractFileUploading: loading.effects['myActivity/registerContractFile'],
}))
class MyActivity extends React.PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'No.',
        width: '8%',
        dataIndex: 'index',
        key: 'index',
        render: (text, record, index) => (index < 9 ? `0${index + 1}` : `${index + 1}`),
      },
      {
        title: formatMessage({ id: 'ACTIVITY_ID' }),
        width: '15%',
        dataIndex: 'activityId',
        sorter: (a, b) => (a.activityId > b.activityId ? -1 : 1),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: formatMessage({ id: 'ACTIVITY_TYPE' }),
        width: '15%',
        dataIndex: 'activityTypeName',
        sorter: (a, b) => (a.activityTypeName > b.activityTypeName ? -1 : 1),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: formatMessage({ id: 'REMARKS' }),
        width: '18%',
        dataIndex: 'remarks',
      },
      {
        title: formatMessage({ id: 'CREATE_DATE' }),
        width: '15%',
        dataIndex: 'createTime',
        sorter: (a, b) => (a.createTime > b.createTime ? -1 : 1),
        sortDirections: ['descend', 'ascend'],
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
        width: '20%',
        dataIndex: 'status',
        sorter: (a, b) => (a.status > b.status ? -1 : 1),
        sortDirections: ['descend', 'ascend'],
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
        width: '15%',
        dataIndex: 'operation',
        render: (text, record) => {
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
              {record.status === '02' &&
              record.pendingStep.stepCode === 'TA_SALES_SUPPORT_APPROVAL' ? (
                <Tooltip title={formatMessage({ id: 'COMMON_UPLOAD' })}>
                  <Icon
                    type="upload"
                    onClick={() => {
                      this.detail('upload', record);
                    }}
                  />
                </Tooltip>
              ) : null}
              {record.activityTplCode === 'TA-SIGN-UP' &&
              record.status === '00' &&
              (PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.SALES_SUPPORT_PRIVILEGE]) ||
                PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.AR_ACCOUNT_PRIVILEGE])) ? (
                  <Tooltip title={formatMessage({ id: 'COMMON_REDIRECT_MAPPING' })}>
                    <Icon
                      type="block"
                      onClick={() => {
                      this.detail('block', record);
                    }}
                    />
                  </Tooltip>
              ) : null}
              {record.status === '02' ? (
                <Tooltip title={formatMessage({ id: 'COMMON_OPERATION' })}>
                  <Icon
                    type="audit"
                    onClick={() => {
                      this.detail('audit', record);
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
      type: 'myActivity/queryActivityList',
      payload: {},
    });

    dispatch({
      type: 'myActivity/queryActivityDict',
      payload: {},
    });

    dispatch({
      type: 'myActivity/queryTemplateList',
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
        if (Array.isArray(values.createDate) && values.createDate.length > 0) {
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
              activityId: values.activityId,
              keyword: values.keyword,
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

  handleModalCancel = () => {
    const {
      dispatch,
      myActivity: { pagination },
    } = this.props;
    dispatch({
      type: 'myActivity/save',
      payload: {
        contractFileList: [],
        selectTaId: null,
        uploadVisible: false,
      },
    });
    this.qryMainTAList(pagination.currentPage, pagination.pageSize);
  };

  qryMainTAList = (currentPage, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'myActivity/queryActivityList',
      payload: {
        pagination: {
          currentPage,
          pageSize,
        },
      },
    });
  };

  handleTableChange = page => {
    const {
      dispatch,
      myActivity: { pagination },
    } = this.props;

    if (page.current !== pagination.currentPage || page.pageSize !== pagination.pageSize) {
      dispatch({
        type: 'myActivity/tableChanged',
        payload: {
          pagination: {
            currentPage: page.current,
            pageSize: page.pageSize,
          },
        },
      });
    }
  };

  detail = (type = 'eye', record = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'myActivity/save',
      payload: {
        selectTaId: record.businessId,
        businessId: record.businessId,
      },
    });
    if (type === 'eye') {
      dispatch({
        type: 'activityDetail/save',
        payload: {
          isOperationApproval: false,
        },
      });
      router.push({
        pathname: `/MyActivity/${record.activityId}`,
      });
    } else if (type === 'audit') {
      dispatch({
        type: 'activityDetail/save',
        payload: {
          isOperationApproval: true,
        },
      });
      router.push({
        pathname: `/MyActivity/${record.activityId}`,
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
      dispatch({
        type: 'myActivity/fetchCompanyDetail',
        payload: {
          companyId: record.businessId,
        },
      }).then(() => {
        const {
          myActivity: { companyDetailInfo },
        } = this.props;
        router.push({
          pathname: `/TAManagement/Mapping/Edit/${record.businessId}`,
          query: { companyName: companyDetailInfo.companyName },
        });
      });
    }
  };

  handleModalOk = () => {
    const {
      dispatch,
      myActivity: { contractFileList, selectTaId, pagination },
    } = this.props;
    const newContractList = [];
    if (!contractFileList || contractFileList.length <= 0) {
      message.warn(formatMessage({ id: 'TA_UPLOAD_FILE_MSG' }), 10);
      dispatch({
        type: 'myActivity/save',
        payload: {
          contractFileList: newContractList,
        },
      });
      return;
    }
    contractFileList.forEach(n => {
      if (String(n.status) === 'done') {
        newContractList.push({
          name: n.name,
          path: n.path,
          sourceName: n.sourceName,
        });
      }
    });
    dispatch({
      type: 'myActivity/registerContractFile',
      payload: {
        taId: selectTaId,
        contractList: newContractList || [],
      },
    }).then(flag => {
      if (flag) {
        this.qryMainTAList(pagination.currentPage, pagination.pageSize);
        dispatch({
          type: 'myActivity/save',
          payload: {
            contractFileList: [],
            selectTaId: null,
            modalVisible: false,
            contractFileUploading: false,
            uploadVisible: false,
          },
        });
      }
    });
  };

  onHandleContractFileChange = (contractFile, isDel) => {
    const { dispatch, contractFileList = [] } = this.props;
    let newContractFileList = [];
    if (contractFileList && contractFileList.length > 0) {
      newContractFileList = [...contractFileList].filter(
        n => String(n.uid) !== String(contractFile.uid)
      );
    }
    if (!isDel && String(contractFile.status) !== 'removed') {
      newContractFileList.push(contractFile);
    }
    dispatch({
      type: 'myActivity/save',
      payload: {
        contractFileList: newContractFileList,
      },
    });
  };

  onHandleDelContactFile = (file, fileType) => {
    const { dispatch, contractFileList = [] } = this.props;
    dispatch({
      type: 'myActivity/fetchDeleteTAFile',
      payload: {
        fileName: file.name,
        path: file.filePath,
        filePath: file.filePath,
      },
    }).then(flag => {
      if (flag && String(fileType) === 'contractFile') {
        this.onHandleContractFileChange(file, true);
      }
      if (!flag && String(fileType) === 'contractFile') {
        let newContractFileList = [];
        if (contractFileList && contractFileList.length > 0) {
          newContractFileList = [...contractFileList].filter(
            n => String(n.uid) !== String(file.uid)
          );
        }
        file.status = 'error';
        newContractFileList.push(file);
        dispatch({
          type: 'myActivity/save',
          payload: {
            contractFileList: newContractFileList,
          },
        });
      }
    });
  };

  showTotal = total => {
    return <div>Total {total} items</div>;
  };

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
        contractFileList = [],
        contractFileUploading = false,
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
    const myFileProps = {
      contractFileList,
      contractFileUploading,
      onHandleContractFileChange: this.onHandleContractFileChange,
      onHandleDelContactFile: this.onHandleDelContactFile,
    };
    const tableOpts = {
      size: 'small',
      bordered: false,
      scroll: { x: 750 },
    };
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
            <Form onSubmit={this.handleSearch} className={detailStyles.formWrapperClass}>
              <Row gutter={24}>
                <Col {...ColProps}>
                  <Form.Item {...formItemLayout} style={{ width: '100%' }}>
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
                        allowClear
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
                  <Form.Item {...formItemLayout} style={{ width: '100%' }}>
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
                  <Form.Item {...formItemLayout} style={{ width: '100%' }}>
                    {getFieldDecorator(
                      'status',
                      {}
                    )(
                      <Select
                        placeholder={formatMessage({ id: 'STATUS' })}
                        optionFilterProp="children"
                        style={{ width: '100%' }}
                        allowClear
                      >
                        {statusList.map(record => (
                          <Option key={`status_option_${record.code}`} value={record.code}>
                            {record.value}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col {...ColProps}>
                  <Form.Item {...formItemLayout} style={{ width: '100%' }}>
                    {getFieldDecorator(
                      'activityId',
                      {}
                    )(
                      <Input
                        allowClear
                        placeholder={formatMessage({ id: 'ACTIVITY_ID' })}
                        autoComplete="off"
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24} style={{ paddingTop: '15px' }}>
                <Col {...ColProps}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator(
                      'keyword',
                      {}
                    )(
                      <Input
                        allowClear
                        placeholder={formatMessage({ id: 'KEYWORD' })}
                        autoComplete="off"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={18} style={{ textAlign: 'right', paddingRight: '24px' }}>
                  <Button type="primary" htmlType="submit" style={{ marginRight: 15 }}>
                    {formatMessage({ id: 'BTN_SEARCH' })}
                  </Button>
                  <Button onClick={this.handleReset}>{formatMessage({ id: 'BTN_RESET' })}</Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
        <Modal
          title={formatMessage({ id: 'TA_UPLOAD_CONTRACT' })}
          visible={uploadVisible}
          onOk={this.handleModalOk}
          confirmLoading={contractFileUploading}
          onCancel={this.handleModalCancel}
          footer={[
            <Button key="back" onClick={this.handleModalCancel}>
              {formatMessage({ id: 'COMMON_CANCEL' })}
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={contractFileUploading}
              onClick={this.handleModalOk}
            >
              {formatMessage({ id: 'COMMON_OK' })}
            </Button>,
          ]}
        >
          <UploadContract {...myFileProps} />
        </Modal>
        <Col span={24} className={detailStyles.pageTableCard}>
          <Card>
            <Table
              {...tableOpts}
              rowKey={record => `activityList${record.activityId}`}
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
