import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Spin,
  Table,
  Tooltip,
  Upload,
} from 'antd';
import SCREEN from '@/utils/screen';
import BreadcrumbCompForPams from '@/components/BreadcrumbComp/BreadcurmbCompForPams';
import styles from './index.less';
import Card from '../../../components/Card';
import PaginationComp from '@/pages/TicketManagement/Ticketing/QueryOrder/components/PaginationComp';
import SortSelect from '@/components/SortSelect';

const FormItem = Form.Item;
const { Option } = Select;
const { Search } = Input;

const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
  colon: false,
};

@Form.create()
@connect(({ revalidationRequestMgr, loading, global }) => ({
  revalidationRequestMgr,
  global,
  tableLoading: loading.effects['revalidationRequestMgr/queryBookingDetail'],
  pageLoading: loading.effects['revalidationRequestMgr/revalidationTicket'],
}))
class RevalidationRequest extends Component {
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
              title={<span style={{ whiteSpace: 'pre-wrap' }}>{dateString}</span>}
            >
              <span className={styles.tableSpan}>{dateString}</span>
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
        type: 'revalidationRequestMgr/queryBookingDetail',
        payload: {
          bookingNo,
        },
      }).then(vidResultList => {
        dispatch({
          type: 'revalidationRequestMgr/saveSearchVidList',
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
      type: 'revalidationRequestMgr/resetData',
    });
  }

  setStatusColor = (status, hadRefunded) => {
    if (status === 'false' && hadRefunded !== 'Yes') {
      return '#40C940';
    }
    return '#C0C0C0';
  };

  changeDeliveryMode = value => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'revalidationRequestMgr/save',
      payload: {
        deliveryMode: value !== undefined ? value : null,
        collectionDate: null,
      },
    });
    form.setFieldsValue({
      deliveryMode: value !== undefined ? value : null,
      collectionDate: null,
    });
  };

  disabledCollectionDate = (current, orderCreateTime) => {
    return (
      current && current < moment(orderCreateTime.substring(0, 10), 'YYYY-MM-DD').add(3, 'days')
    );
  };

  showCollectionDate = collectionDate => {
    if (collectionDate !== null) {
      return moment(collectionDate, 'DD-MMM-YYYY');
    }
    return null;
  };

  collectionDateChange = date => {
    const { dispatch, form } = this.props;
    const dateString = date !== null ? moment(date).format('YYYY-MM-DD') : null;
    dispatch({
      type: 'revalidationRequestMgr/save',
      payload: {
        collectionDate: dateString,
      },
    });
    form.setFieldsValue({
      collectionDate: dateString,
    });
  };

  changeSearchValue = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'revalidationRequestMgr/saveSearchList',
      payload: {
        vidCode: e.target.value,
      },
    });
  };

  searchByVidCode = (vidResultList, pageSize, value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'revalidationRequestMgr/saveSearchVidList',
      payload: {
        vidResultList,
        currentPage: 1,
        pageSize,
        vidCode: value,
      },
    });
  };

  revalidationTicket = (
    deliveryMode,
    collectionDate,
    vidResultList,
    bookingNo,
    userType,
    submitVidList
  ) => {
    const { form } = this.props;
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
        revalidationRequestMgr: { wholeVidList },
      } = this.props;
      const wholeSelectList = wholeVidList.filter(item => selectVidGroup.includes(item.vidGroup));
      const filterSelect = wholeSelectList.filter(
        item => !selectedVidList.map(obj => obj.vidCode).includes(item.vidCode)
      );
      if (filterSelect.length > 0) {
        const unUnploadVidString = filterSelect.map(obj => obj.vidCode).join(', ');
        Modal.warning({
          title: 'Failed to revalidation',
          content: `Package needs to be revalidated as a whole, together with the following vids: ${unUnploadVidString}`,
        });
      } else {
        form.validateFields(err => {
          if (!err) {
            Modal.warning({
              title:
                'There’s $2 modification service fee. Revalidation only allowed once per order. Proceed or Not?',
              centered: true,
              content: (
                <div style={{ marginBottom: 20 }}>
                  <div className={styles.operateButtonDivStyle}>
                    <Button
                      onClick={() => {
                        Modal.destroyAll();
                      }}
                      style={{ marginRight: 8, width: 40 }}
                    >
                      No
                    </Button>
                    <Button
                      onClick={() =>
                        this.wantRevalidate(
                          deliveryMode,
                          collectionDate,
                          selectedVidList,
                          bookingNo,
                          userType,
                          submitVidList
                        )
                      }
                      type="primary"
                      style={{ width: 40 }}
                    >
                      Yes
                    </Button>
                  </div>
                </div>
              ),
              okButtonProps: { style: { display: 'none' } },
              cancelButtonProps: { style: { display: 'none' } },
            });
          }
        });
      }
    }
  };

  wantRevalidate = (
    deliveryMode,
    collectionDate,
    selectedVidList,
    bookingNo,
    userType,
    submitVidList
  ) => {
    const { dispatch } = this.props;
    Modal.destroyAll();
    const selectVidGroups = Array.from(new Set(selectedVidList.map(item => item.vidGroup)));
    const visualIds = submitVidList
      .filter(
        item => selectVidGroups.filter(selectedItem => selectedItem === item.vidGroup).length > 0
      )
      .map(item => item.vidCode);
    dispatch({
      type: 'revalidationRequestMgr/revalidationTicket',
      payload: {
        bookingNo,
        visualIds,
        deliveryInfo: {
          deliveryMode,
          collectionDate,
        },
      },
    }).then(resultCode => {
      if (resultCode === '0') {
        if (userType === '02') {
          message.success(formatMessage({ id: 'REVALIDATED_SUCCESSFULLY' }));
        }
        if (userType === '03') {
          message.success(formatMessage({ id: 'SUB_TA_REQUESTED_SUCCESSFULLY' }));
        }
      } else {
        message.warning(resultCode);
      }
    });
  };

  getUploadProps = (file, nowPageSize) => {
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
          type: 'revalidationRequestMgr/uploadFile',
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
        if (item.vidCode === selectedItem.vidCode) {
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
          if (item.vidCode === selectedItem.vidCode) {
            item.selected = selected;
          }
        });
      });
    });
    this.saveResultList(vidResultList, currentPage, nowPageSize, vidCode);
  };

  saveResultList = (vidResultList, currentPage, pageSize, vidCode) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'revalidationRequestMgr/saveSearchVidList',
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
      form: { getFieldDecorator },
      revalidationRequestMgr: {
        orderCreateTime,
        deliveryMode,
        collectionDate,
        vidList,
        total,
        vidResultList,
        searchList: { bookingNo, vidCode, currentPage, pageSize: nowPageSize },
        wholeVidList,
        submitVidList,
      },
      global: {
        currentUser: { userType },
      },
    } = this.props;

    const title = [
      { name: 'Ticketing' },
      { name: 'Order Query', href: '#/TicketManagement/Ticketing/QueryOrder' },
      { name: 'Revalidation Request' },
    ];

    const pageOpts = {
      total,
      current: currentPage,
      pageSize: nowPageSize,
      pageChange: (page, pageSize) => this.saveResultList(vidResultList, page, pageSize, vidCode),
    };

    const rowSelection = {
      columnWidth: '5%',
      selectedRowKeys: vidList.filter(item => item.selected === true).map(item => item.vidCode),
      onSelect: (record, selected) =>
        this.onSelectChange(record, selected, vidResultList, currentPage, nowPageSize, vidCode),
      onSelectAll: (selected, _, changeRows) =>
        this.onSelectAll(selected, changeRows, vidResultList, currentPage, nowPageSize, vidCode),
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
                <Button
                  type="primary"
                  onClick={() =>
                    this.revalidationTicket(
                      deliveryMode,
                      collectionDate,
                      vidResultList,
                      bookingNo,
                      userType,
                      submitVidList
                    )
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
              <span className={styles.cardTitleStyle}>
                {formatMessage({ id: 'DELIVERY_INFORMATION' })}
              </span>
              <Form>
                <Row>
                  <Col md={24} lg={12}>
                    <FormItem
                      label={
                        <span className={styles.formLabelStyle}>
                          {formatMessage({ id: 'DELIVERY_MODE' })}
                        </span>
                      }
                      {...formLayout}
                    >
                      {getFieldDecorator('deliveryMode', {
                        rules: [{ required: true, message: 'Required' }],
                        initialValue: deliveryMode !== null ? deliveryMode : undefined,
                      })(
                        <div>
                          <SortSelect
                            allowClear
                            placeholder="Please Select"
                            className={styles.selectStyle}
                            value={deliveryMode !== null ? deliveryMode : undefined}
                            onChange={value => this.changeDeliveryMode(value)}
                            options={[<Option value="VID">VID</Option>]}
                          />
                        </div>
                      )}
                    </FormItem>
                  </Col>
                  {deliveryMode === 'BOCA' ? (
                    <Col md={24} lg={12}>
                      <FormItem
                        label={
                          <span className={styles.formLabelStyle}>
                            {formatMessage({ id: 'COLLECTION_DATE' })}
                          </span>
                        }
                        {...formLayout}
                      >
                        {getFieldDecorator('collectionDate', {
                          rules: [{ required: true, message: 'Required' }],
                          initialValue: this.showCollectionDate(collectionDate),
                        })(
                          <DatePicker
                            allowClear
                            placeholder="Please Select"
                            className={styles.selectStyle}
                            format="DD-MMM-YYYY"
                            disabledDate={current =>
                              this.disabledCollectionDate(current, orderCreateTime)
                            }
                            onChange={this.collectionDateChange}
                          />
                        )}
                      </FormItem>
                    </Col>
                  ) : null}
                </Row>
              </Form>
            </Card>
          </Col>
          <Col span={24}>
            <Card>
              <Row>
                <Col md={24} lg={12}>
                  <Upload
                    action=""
                    beforeUpload={file => this.getUploadProps(file, nowPageSize)}
                    showUploadList={false}
                  >
                    <Button type="primary" style={{ marginRight: 10, marginBottom: 10 }}>
                      {formatMessage({ id: 'UPLOAD' })}
                    </Button>
                  </Upload>
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
                </Col>
                <Col md={24} lg={12}>
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
                          currentPage,
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

export default RevalidationRequest;
