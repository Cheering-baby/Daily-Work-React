import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import {
  Button,
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
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span className={styles.tableSpan}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'STATUS' })}</span>,
      dataIndex: 'status',
      render: (text, record) => {
        let status = text;
        const { hadRefunded } = record;
        if (text === 'false' && hadRefunded !== 'Yes') {
          status = 'ISSUED';
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

  onSelectChange = selectedRowKeys => {
    const { dispatch } = this.props;
    dispatch({
      type: 'revalidationRequestMgr/saveSelectVid',
      payload: {
        selectedRowKeys,
      },
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

  revalidationTicket = (deliveryMode, collectionDate, selectedVidList, bookingNo, userType) => {
    const { form } = this.props;
    if (selectedVidList.length < 1) {
      message.warning('Select at least one VID.');
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
                        userType
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
  };

  wantRevalidate = (deliveryMode, collectionDate, selectedVidList, bookingNo, userType) => {
    const {
      dispatch,
      revalidationRequestMgr: { bookingDetail },
    } = this.props;
    Modal.destroyAll();
    const visualIds = [];
    const selectOfferGroupList = [];
    selectedVidList.forEach(selectedVid => {
      const index = selectOfferGroupList.findIndex(
        selectOfferGroup => selectOfferGroup === selectedVid.offerGroup
      );
      if (index < 0) {
        selectOfferGroupList.push(selectedVid.offerGroup);
      }
    });
    const { offers = [] } = bookingDetail;
    for (let i = 0; i < offers.length; i += 1) {
      const index = selectOfferGroupList.findIndex(
        selectOfferGroup => selectOfferGroup === offers[i].offerGroup
      );
      if (index < 0) {
        // eslint-disable-next-line no-continue
        continue;
      }
      const { attraction = [] } = offers[i];
      if (attraction) {
        for (let j = 0; j < attraction.length; j += 1) {
          visualIds.push(attraction[j].visualID);
        }
      }
    }
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

  onSelectAll = (selected, selectedRows) => {
    const { dispatch } = this.props;
    if (selected) {
      const selectedRowKeys = selectedRows.map(selectedRow => selectedRow.key);
      dispatch({
        type: 'revalidationRequestMgr/saveSelectVid',
        payload: {
          selectedRowKeys,
        },
      });
    } else {
      dispatch({
        type: 'revalidationRequestMgr/save',
        payload: {
          selectedRowKeys: [],
          selectedVidList: [],
        },
      });
    }
  };

  onSelect = (record, selected) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'revalidationRequestMgr/settingSelectVid',
      payload: {
        selected,
        record,
      },
    });
  };

  getCheckboxProps = record => {
    const {
      revalidationRequestMgr: { disabledKeyList, disabledVidList = [] },
    } = this.props;
    const index = disabledKeyList.findIndex(disabledKey => disabledKey === record.offerGroup);
    const vidCodeIndex = disabledVidList.findIndex(
      disabledVid => disabledVid.vidCode === record.vidCode
    );
    let disabledResult = false;
    if (vidCodeIndex > -1 || index > -1) {
      disabledResult = true;
    }
    return {
      disabled: disabledResult,
    };
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
        selectedRowKeys,
        selectedVidList,
      },
      global: {
        currentUser: { userType },
      },
    } = this.props;

    const title = [
      { name: 'Ticketing' },
      { name: 'Query Order', href: '#/TicketManagement/Ticketing/QueryOrder' },
      { name: 'Revalidation Request' },
    ];

    const pageOpts = {
      total,
      current: currentPage,
      pageSize: nowPageSize,
      pageChange: (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
          type: 'revalidationRequestMgr/saveSearchVidList',
          payload: {
            vidResultList,
            currentPage: page,
            pageSize,
            vidCode,
          },
        });
      },
    };

    const rowSelection = {
      selectedRowKeys,
      onSelectAll: this.onSelectAll,
      onSelect: this.onSelect,
      getCheckboxProps: this.getCheckboxProps,
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
                      selectedVidList,
                      bookingNo,
                      userType
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
                          <Select
                            allowClear
                            placeholder="Please Select"
                            className={styles.selectStyle}
                            value={deliveryMode !== null ? deliveryMode : undefined}
                            onChange={value => this.changeDeliveryMode(value)}
                          >
                            <Option value="BOCA">BOCA</Option>
                            <Option value="VID">VID</Option>
                            <Option value="e-Ticket">e-Ticket</Option>
                          </Select>
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
                <Col span={24}>
                  <Upload
                    action=""
                    beforeUpload={file => this.getUploadProps(file, nowPageSize)}
                    showUploadList={false}
                  >
                    <Button type="primary">{formatMessage({ id: 'UPLOAD' })}</Button>
                  </Upload>
                  <Search
                    allowClear
                    placeholder={formatMessage({ id: 'VID_CODE' })}
                    value={vidCode}
                    onChange={this.changeSearchValue}
                    onSearch={value => this.searchByVidCode(vidResultList, nowPageSize, value)}
                    className={styles.inputStyle}
                  />
                </Col>
                <Col span={24}>
                  <Table
                    loading={!!tableLoading}
                    size="small"
                    style={{ marginTop: 10 }}
                    columns={this.columns}
                    dataSource={vidList}
                    rowSelection={rowSelection}
                    pagination={false}
                    bordered={false}
                    scroll={{ x: 660 }}
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
