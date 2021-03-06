import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import {
  Button,
  Checkbox,
  Col,
  Input,
  message,
  Row,
  Spin,
  Table,
  Tooltip,
  Upload,
  Modal,
  Form,
} from 'antd';
import moment from 'moment';
import SCREEN from '@/utils/screen';
import { reBytesStr } from '@/utils/utils';
import BreadcrumbCompForPams from '@/components/BreadcrumbComp/BreadcurmbCompForPams';
import styles from './index.less';
import Card from '../../../components/Card';
import PaginationComp from '@/pages/TicketManagement/Ticketing/QueryOrder/components/PaginationComp';

const { Search } = Input;
const FormItem = Form.Item;

const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
  // colon: false,
};

@Form.create()
@connect(({ refundRequestMgr, loading, global }) => ({
  refundRequestMgr,
  global,
  tableLoading: loading.effects['refundRequestMgr/queryBookingDetail'],
  pageLoading: loading.effects['refundRequestMgr/refundTicket'],
}))
class RefundRequest extends Component {
  columns = [
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'NO' })}</span>,
      dataIndex: 'vidNo',
      width: '10%',
      key: 'vidNo',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span className={styles.tableSpan}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'VID_CODE' })}</span>,
      dataIndex: 'vidCode',
      width: '25%',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span className={styles.tableSpan}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'STATUS' })}</span>,
      dataIndex: 'status',
      width: '15%',
      render: (text, record) => {
        let status = text;
        const { hadRefunded } = record;
        if (text === 'false' && hadRefunded !== 'Yes') {
          status = 'VALID';
        } else {
          status = 'INVALID';
        }
        return (
          <div>
            <div
              className={styles.statusRadiusStyle}
              style={{ background: `${this.setStatusColor(text, hadRefunded)}` }}
            />
            <Tooltip
              placement="topLeft"
              title={<span style={{ whiteSpace: 'pre-wrap' }}>{status}</span>}
            >
              <span className={styles.tableSpan}>{status}</span>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'EXPIRY_DATE' })}</span>,
      dataIndex: 'expiryDate',
      width: '20%',
      render: text => {
        if (text) {
          const date = moment(text, 'YYYY-MM-DD');
          const dateString = moment(date).format('DD-MMM-YYYY');
          return (
            <Tooltip
              placement="topLeft"
              title={<span style={{ whiteSpace: 'pre-wrap' }}>{dateString || '-'}</span>}
            >
              <span className={styles.tableSpan}>{dateString || '-'}</span>
            </Tooltip>
          );
        }
      },
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'OFFER_NAME' })}</span>,
      dataIndex: 'offerName',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span className={styles.tableSpan}>{text}</span>
        </Tooltip>
      ),
    },
  ];

  componentDidMount() {
    const {
      location: {
        query: { bookingNo },
      },
    } = this.props;
    if (bookingNo !== undefined) {
      const { dispatch } = this.props;
      dispatch({
        type: 'refundRequestMgr/queryThemeParkRefundList',
        payload: {},
      });
      dispatch({
        type: 'refundRequestMgr/queryBookingDetail',
        payload: {
          bookingNo,
        },
      }).then(vidResultList => {
        dispatch({
          type: 'refundRequestMgr/saveSearchVidList',
          payload: {
            vidResultList,
            currentPage: 1,
            pageSize: 10,
            vidCode: null,
          },
        });
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'refundRequestMgr/resetData',
    });
  }

  setStatusColor = (status, hadRefunded) => {
    if (status === 'false' && hadRefunded !== 'Yes') {
      return '#40C940';
    }
    return '#C0C0C0';
  };

  changeSearchValue = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'refundRequestMgr/saveSearchList',
      payload: {
        vidCode: e.target.value,
      },
    });
  };

  searchByVidCode = (vidResultList, pageSize, value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'refundRequestMgr/saveSearchVidList',
      payload: {
        vidResultList,
        currentPage: 1,
        pageSize,
        vidCode: value,
      },
    });
  };

  refundTicket = (vidResultList, bookingNo, userType, submitVidList) => {
    const selectedVidList = vidResultList.filter(item => item.selected === true);
    if (selectedVidList.length < 1) {
      message.warning('Select at least one VID.');
    } else {
      const selectVidGroup = selectedVidList
        .filter((element, index, self) => {
          return self.findIndex(el => el.vidGroup === element.vidGroup) === index;
        })
        .map(obj => obj.vidGroup);
      const {
        dispatch,
        refundRequestMgr: { wholeVidList },
        form,
      } = this.props;
      const { reason } = form.getFieldsValue();
      const wholeSelectList = wholeVidList.filter(item => selectVidGroup.includes(item.vidGroup));
      const filterSelect = wholeSelectList.filter(
        item => !selectedVidList.map(obj => obj.vidCode).includes(item.vidCode) && !item.disabled
      );
      if (filterSelect.length > 0) {
        const unUnploadVidString = filterSelect.map(obj => obj.vidCode).join(', ');
        Modal.warning({
          title: 'Failed to refund',
          content: `Package needs to be refunded as a whole, together with the following vids: ${unUnploadVidString}`,
        });
      } else {
        const selectVidGroups = Array.from(new Set(selectedVidList.map(item => item.vidGroup)));
        const visualIds = submitVidList
          .filter(
            item =>
              selectVidGroups.filter(selectedItem => selectedItem === item.vidGroup).length > 0 &&
              !item.disabled
          )
          .map(item => item.vidCode);
        dispatch({
          type: 'refundRequestMgr/refundTicket',
          payload: {
            bookingNo,
            visualIds,
            reason,
          },
        }).then(resultCode => {
          if (resultCode === '0') {
            if (userType === '02') {
              message.success(formatMessage({ id: 'REFUNDED_SUCCESSFULLY' }));
            }
            if (userType === '03') {
              message.success(formatMessage({ id: 'SUB_TA_REQUESTED_SUCCESSFULLY' }));
            }
            form.resetFields();
          }
        });
      }
    }
  };

  getRefundUploadProps = (file, nowPageSize) => {
    const { dispatch } = this.props;
    const { name } = file;
    if (
      name &&
      name
        .toString()
        .substring(name.toString().length - 3, name.toString().length)
        .toLowerCase() === 'csv'
    ) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function() {
        dispatch({
          type: 'refundRequestMgr/uploadFile',
          payload: {
            uploadVidList: this.result,
            pageSize: nowPageSize,
          },
        }).then(uploadStatus => {
          if (uploadStatus) {
            message.success(formatMessage({ id: 'UPDATE_SUCCESSFULLY' }));
          } else {
            message.warning(formatMessage({ id: 'FAILED_TO_UPDATE' }));
          }
        });
      };
    } else {
      message.warning('Please upload the file in CSV format.');
    }
    return false;
  };

  showButtonText = userType => {
    if (userType === '02') {
      return formatMessage({ id: 'CONFIRM' });
    }
    if (userType === '03') {
      return formatMessage({ id: 'SUBMIT' });
    }
  };

  onSelectChange = (record, selected, vidResultList, currentPage, nowPageSize, vidCode) => {
    const selectVidGroup = vidResultList.filter(item => record.vidGroup === item.vidGroup);
    vidResultList.forEach(item => {
      selectVidGroup.forEach(selectedItem => {
        if (item.vidCode === selectedItem.vidCode && !item.disabled) {
          item.selected = selected;
        }
      });
    });
    this.saveResultList(vidResultList, currentPage, nowPageSize, vidCode);
  };

  onSelectAll = (selected, selectedRows, vidResultList, currentPage, nowPageSize, vidCode) => {
    selectedRows.forEach(e => {
      const selectVidGroup = vidResultList.filter(item => e.vidGroup === item.vidGroup);
      vidResultList.forEach(item => {
        selectVidGroup.forEach(selectedItem => {
          if (item.vidCode === selectedItem.vidCode && !item.disabled) {
            item.selected = selected;
          }
        });
      });
    });
    this.saveResultList(vidResultList, currentPage, nowPageSize, vidCode);
  };

  refundPay = vidResultList => {
    const selectedResultVidList = vidResultList.filter(item => item.selected === true);
    const selectedVidList = selectedResultVidList.filter((element, index, self) => {
      return self.findIndex(el => el.prodId === element.prodId) === index;
    });

    if (selectedVidList.length === 0) {
      return '0.00';
    }

    let refundPay = 0;

    selectedVidList.forEach(item => {
      if (item.netAmt !== null) {
        refundPay += item.netAmt;
      }
    });

    return Number(refundPay).toFixed(2);
  };

  saveResultList = (vidResultList, currentPage, pageSize, vidCode) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'refundRequestMgr/saveSearchVidList',
      payload: {
        vidResultList,
        currentPage,
        pageSize,
        vidCode,
      },
    });
  };

  selectAllVid = (value, vidResultList, currentPage, nowPageSize, vidCode) => {
    vidResultList.forEach(item => {
      if (!item.disabled) {
        item.selected = value;
      }
    });
    this.saveResultList(vidResultList, currentPage, nowPageSize, vidCode);
  };

  render() {
    const {
      tableLoading,
      pageLoading,
      refundRequestMgr: {
        vidList,
        total,
        vidResultList,
        searchList: { bookingNo, vidCode, currentPage: current, pageSize: nowPageSize },
        wholeVidList,
        submitVidList,
      },
      global: {
        currentUser: { userType },
      },
      form: { getFieldDecorator, setFieldsValue },
    } = this.props;

    const title = [
      { name: 'Ticketing' },
      { name: 'Order Query', href: '#/TicketManagement/Ticketing/QueryOrder' },
      { name: 'Refund Request' },
    ];

    const pageOpts = {
      total,
      current,
      pageSize: nowPageSize,
      pageChange: (page, pageSize) => this.saveResultList(vidResultList, page, pageSize, vidCode),
    };

    const rowSelection = {
      columnWidth: '5%',
      selectedRowKeys: vidList.filter(item => item.selected === true).map(item => item.vidCode),
      onSelect: (record, selected) =>
        this.onSelectChange(record, selected, vidResultList, current, nowPageSize, vidCode),
      onSelectAll: (selected, _, changeRows) =>
        this.onSelectAll(selected, changeRows, vidResultList, current, nowPageSize, vidCode),
      getCheckboxProps: record => ({ disabled: record.disabled }),
    };

    return (
      <Spin spinning={!!pageLoading}>
        <Row gutter={12}>
          <Col span={12}>
            <MediaQuery minWidth={SCREEN.screenSm}>
              <BreadcrumbCompForPams title={title} />
            </MediaQuery>
          </Col>
          <Col span={12}>
            <div className={styles.orderTitleStyles}>
              <div className={styles.orderTitleButtonStyles}>
                {userType !== '03' && (
                  <span className={styles.priceFont}>${this.refundPay(vidResultList)}</span>
                )}
                <Button
                  type="primary"
                  onClick={() =>
                    this.refundTicket(vidResultList, bookingNo, userType, submitVidList)
                  }
                >
                  {this.showButtonText(userType)}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
        <Row type="flex">
          <Col span={24}>
            <Card>
              <Row>
                <Col md={24} lg={18} className={styles.formContainer}>
                  {/* <Upload
                    action=""
                    beforeUpload={file => this.getRefundUploadProps(file, nowPageSize)}
                    showUploadList={false}
                  >
                    <Button type="primary" style={{ marginRight: 10, marginBottom: 10 }}>
                      {formatMessage({ id: 'UPLOAD' })}
                    </Button>
                  </Upload> */}
                  <Search
                    allowClear
                    placeholder={formatMessage({ id: 'VID_CODE' })}
                    value={vidCode}
                    onChange={this.changeSearchValue}
                    onSearch={value => this.searchByVidCode(vidResultList, nowPageSize, value)}
                    className={styles.inputStyle}
                  />
                  <Button
                    style={{ width: 60, marginBottom: 10 }}
                    onClick={() => this.saveResultList(wholeVidList, 1, 10, null)}
                  >
                    {formatMessage({ id: 'RESET' })}
                  </Button>
                  <FormItem
                    label={
                      <span className={styles.formLabelStyle}>
                        {formatMessage({ id: 'REASON' })}
                      </span>
                    }
                    {...formLayout}
                  >
                    {getFieldDecorator('reason', {
                      rules: [
                        { required: false, message: 'Required' },
                        {
                          validator: (rule, value, callback) => {
                            if (value && value.replace(/[\u0391-\uFFE5]/g, 'aa').length > 500) {
                              setFieldsValue({
                                reason: reBytesStr(value, 500),
                              });
                              message.warning('Max characters 500 for reason.');
                            }
                            callback();
                          },
                        },
                      ],
                    })(
                      <Input
                        placeholder="Please Enter"
                        allowClear
                        autoComplete={false}
                        style={{ width: '300px' }}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col md={24} lg={6}>
                  <div className={styles.selectedDiv}>
                    <Checkbox
                      disabled={vidResultList.filter(item => item.disabled === false).length === 0}
                      checked={
                        vidResultList.filter(item => item.selected === true).length ===
                          vidResultList.filter(item => item.disabled === false).length &&
                        vidResultList.filter(item => item.disabled === false).length > 0
                      }
                      onChange={e =>
                        this.selectAllVid(
                          e.target.checked,
                          vidResultList,
                          current,
                          nowPageSize,
                          vidCode
                        )
                      }
                    >
                      Select All
                    </Checkbox>
                    <span className={styles.selectedSpan}>
                      Selected {vidResultList.filter(item => item.selected === true).length} items.
                    </span>
                  </div>
                </Col>
                <Col span={24}>
                  <Table
                    loading={!!tableLoading}
                    size="small"
                    columns={this.columns}
                    dataSource={vidList}
                    rowSelection={rowSelection}
                    rowKey={record => record.vidCode}
                    pagination={false}
                    bordered={false}
                    scroll={{ x: 800 }}
                  />
                  <PaginationComp style={{ marginTop: 10 }} {...pageOpts} />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Spin>
    );
  }
}

export default RefundRequest;
