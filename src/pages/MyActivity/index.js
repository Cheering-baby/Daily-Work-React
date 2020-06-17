import React from 'react';
import router from 'umi/router';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
  Tooltip,
} from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import moment from 'moment';
import detailStyles from './index.less';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import UploadContract from '@/pages/MyActivity/components/UploadContract';
import PrivilegeUtil from '@/utils/PrivilegeUtil';
import { isNvl } from '@/utils/utils';
import SortSelect from "@/components/SortSelect";

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
  span: 6,
};

const BtnColProps = {
  span: 12,
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
        width: '6%',
        dataIndex: 'index',
        key: 'index',
        render: (text, record, index) => (index < 9 ? `0${index + 1}` : `${index + 1}`),
      },
      {
        title: formatMessage({ id: 'ACTIVITY_ID' }),
        width: '11%',
        dataIndex: 'activityId',
        sorter: (a, b) => (a.activityId > b.activityId ? -1 : 1),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: formatMessage({ id: 'ACTIVITY_TYPE' }),
        width: '16%',
        dataIndex: 'activityTypeName',
        sorter: (a, b) => (a.activityTypeName > b.activityTypeName ? -1 : 1),
        sortDirections: ['descend', 'ascend'],
        render: text => {
          return !isNvl(text) ? <Tooltip title={text}>{text}</Tooltip> : '-';
        },
      },
      {
        title: formatMessage({ id: 'AGENT_ID' }),
        width: '10%',
        dataIndex: 'agentId',
        sorter: (a, b) => (a.agentId > b.agentId ? -1 : 1),
        sortDirections: ['descend', 'ascend'],
        render: (text, record) => {
          if (record.activityTplCode === 'TA-SIGN-UP' && record.status !== '00') {
            return '-';
          }
          return !isNvl(text) ? <Tooltip title={text}>{text}</Tooltip> : '-';
        },
      },
      {
        title: formatMessage({ id: 'COMPANY_NAME' }),
        width: '25%',
        dataIndex: 'companyName',
        sorter: (a, b) => (a.companyName > b.companyName ? -1 : 1),
        sortDirections: ['descend', 'ascend'],
        render: text => {
          return !isNvl(text) ? <Tooltip title={text}>{text}</Tooltip> : '-';
        },
      },
      {
        title: formatMessage({ id: 'REMARKS' }),
        width: '30%',
        dataIndex: 'remarks',
        render: text => {
          return !isNvl(text) ? <Tooltip title={text}>{text}</Tooltip> : '-';
        },
      },
      {
        title: formatMessage({ id: 'CREATE_DATE' }),
        width: '12%',
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
        width: '16%',
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
              <Tooltip title={record.statusName}>{record.statusName}</Tooltip>
            </div>
          );
        },
      },
      {
        title: formatMessage({ id: 'OPERATION' }),
        width: '10%',
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
              {record.status === '02' && !this.checkIsTransactionType(record) ? (
                <Tooltip title={formatMessage({ id: 'COMMON_OPERATION' })}>
                  <Icon
                    type="audit"
                    onClick={() => {
                      this.detail('audit', record);
                    }}
                  />
                </Tooltip>
              ) : null}
              {record.activityTplCode === 'ACCOUNT_AR_APPLY' &&
              (record.status === '00' || record.status === '01') &&
              PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.AR_ACCOUNT_PRIVILEGE]) ? (
                <Tooltip title={formatMessage({ id: 'COMMON_UPLOAD' })}>
                  <Icon
                    type="upload"
                    onClick={() => {
                      this.detail('upload_credit_application_documents', record);
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

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'myActivity/clear',
      payload: {},
    });
  }

  checkIsTransactionType = record => {
    if (!record) {
      return false;
    }
    let result = false;
    if (record.activityTplCode === 'TRANSACTION_PAMS_BOOKING') {
      result = true;
    } else if (record.activityTplCode === 'TRANSACTION_PAMS_MAIN_BOOKING') {
      result = true;
    } else if (record.activityTplCode === 'TRANSACTION_PAMS_BOOKING_AUDIT') {
      result = true;
    } else if (record.activityTplCode === 'TRANSACTION_PAMS_REFUND') {
      result = true;
    } else if (record.activityTplCode === 'TRANSACTION_PAMS_MAIN_REVALIDATION') {
      result = true;
    } else if (record.activityTplCode === 'TRANSACTION_PAMS_MAIN_REFUND') {
      result = true;
    } else if (record.activityTplCode === 'TRANSACTION_PAMS_REVALIDATION') {
      result = true;
    }
    return result;
  };

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
              agentId: values.agentId,
              companyName: values.companyName,
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
      const feeId = record && record.content ? JSON.parse(record.content).feeId : ''
      dispatch({
        type: 'activityDetail/save',
        payload: {
          isOperationApproval: false,
        },
      });
      router.push({
        pathname: `/MyActivity/${record.activityId}`,
        query: { feeId: feeId, activityTypeName: record.activityTypeName },
      });
    } else if (type === 'audit') {
      const feeId = record && record.content ? JSON.parse(record.content).feeId : ''
      dispatch({
        type: 'activityDetail/save',
        payload: {
          isOperationApproval: true,
        },
      });
      router.push({
        pathname: `/MyActivity/${record.activityId}`,
        query: { feeId: feeId },
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
    } else if (type === 'upload_credit_application_documents') {
      this.uploadProps = {
        ...this.uploadProps,
        title: formatMessage({
          id: 'UPLOAD_CREDIT_APPLICATION_DOCUMENTS',
        }),
        type: 'upload',
        record,
        onCancel: () => {
          this.handleModal('uploadVisible', false);
        },
      };
      this.handleModal('uploadVisible', true);
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
        <Col id="pageHeaderTitle" span={24} className={detailStyles.pageHeaderTitle}>
          <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
        </Col>
        <Col id="pageSearchCard" span={24} className={detailStyles.pageSearchCard}>
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
                      <SortSelect
                        placeholder={formatMessage({ id: 'ACTIVITY_TYPE' })}
                        optionFilterProp="children"
                        style={{ width: '100%' }}
                        allowClear
                        options={templateList.map(record => (
                          <Option
                            key={`status_option_${record.templateCode}`}
                            value={record.templateCode}
                          >
                            {record.templateName}
                          </Option>
                        ))}
                      />
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
                      <SortSelect
                        placeholder={formatMessage({ id: 'STATUS' })}
                        optionFilterProp="children"
                        style={{ width: '100%' }}
                        allowClear
                        options={statusList.map(record => (
                          <Option key={`status_option_${record.code}`} value={record.code}>
                            {record.value}
                          </Option>
                        ))}
                      />
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
                      'agentId',
                      {}
                    )(
                      <Input
                        allowClear
                        placeholder={formatMessage({ id: 'AGENT_ID' })}
                        autoComplete="off"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...ColProps}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator(
                      'companyName',
                      {}
                    )(
                      <Input
                        allowClear
                        placeholder={formatMessage({ id: 'COMPANY_NAME' })}
                        autoComplete="off"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...BtnColProps} style={{ textAlign: 'right', paddingRight: '24px' }}>
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
              scroll={{ x: 660, y: this.getTableHeight() }}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}

export default MyActivity;
