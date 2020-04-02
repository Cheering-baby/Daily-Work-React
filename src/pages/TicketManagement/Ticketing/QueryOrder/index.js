import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Col, message, Modal, Row, Spin, Table, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '../../components/BreadcrumbComp';
import styles from './index.less';
import SearchCondition from './components/SearchCondition';
import Card from '../../components/Card';
import SendETicket from './components/SendETicket';
import Update from './components/Update';
import ExportVID from './components/ExPortVID';
import Detail from './components/Detail';
import PaymentModal from './components/PaymentModal';
import PaginationComp from './components/PaginationComp';

@connect(({ queryOrderMgr, loading, global }) => ({
  queryOrderMgr,
  global,
  tableLoading: loading.effects['queryOrderMgr/queryTransactions'],
  pageLoading:
    loading.effects['revalidationRequestMgr/queryBookingDetail'] ||
    loading.effects['refundRequestMgr/queryBookingDetail'],
}))
class QueryOrder extends Component {
  columns = [
    {
      title: (
        <span className={styles.tableTitle}>{formatMessage({ id: 'PAMS_TRANSACTION_NO' })}</span>
      ),
      dataIndex: 'bookingNo',
      key: 'bookingNo',
      width: '170px',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: (
        <span className={styles.tableTitle}>{formatMessage({ id: 'GALAXY_BOOKING_NO' })}</span>
      ),
      key: 'galaxyBookingNo',
      width: '160px',
      render: (_, record) => this.showGalaxyBookingNo(record),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'ORDER_TYPE' })}</span>,
      dataIndex: 'transType',
      key: 'transType',
      width: '100px',
      render: text => this.showOrderType(text),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'SALES_CHANNEL' })}</span>,
      dataIndex: 'salesChannel',
      key: 'salesChannel',
      width: '120px',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'TXN_DATE' })}</span>,
      dataIndex: 'createTime',
      key: 'createTime',
      width: '100px',
      render: text => this.showTxnDate(text),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'GUEST_NAME' })}</span>,
      key: 'guestName',
      width: '110px',
      render: (text, record) => {
        if (record.firstName || record.lastName) {
          let guestName = '';
          if (record.firstName && record.lastName) {
            guestName = `${record.firstName} ${record.lastName}`;
          } else {
            guestName = record.firstName ? record.firstName : record.lastName;
          }
          return (
            <Tooltip
              placement="topLeft"
              title={<span style={{ whiteSpace: 'pre-wrap' }}>{guestName}</span>}
            >
              <span>{guestName}</span>
            </Tooltip>
          );
        }
      },
    },
    {
      title: (
        <span className={styles.tableTitle}>{formatMessage({ id: 'ORIGINAL_ORDER_NO' })}</span>
      ),
      dataIndex: 'originalOrderNo',
      key: 'originalOrderNo',
      width: '160px',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span className={styles.tableSpan}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'STATUS' })}</span>,
      dataIndex: 'status',
      key: 'status',
      width: '100px',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span className={styles.tableSpan}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: (
        <span className={styles.tableTitle}>{formatMessage({ id: 'AR_PAYMENT_STATUS' })}</span>
      ),
      dataIndex: 'arPaymentStatus',
      key: 'arPaymentStatus',
      width: '170px',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span className={styles.tableSpan}>{text}</span>
        </Tooltip>
      ),
    },
  ];

  detailColumns = [
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'CONFIRMATION_NO' })}</span>,
      dataIndex: 'confirmationNo',
      key: 'confirmationNo',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span className={styles.tableSpan}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'SUB_SYSTEM' })}</span>,
      dataIndex: 'salesChannel',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span className={styles.tableSpan}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'TOTAL_AMOUNT' })}</span>,
      dataIndex: 'totalAmount',
      render: text => {
        if (text) {
          return `${text}(SGD)`;
        }
        return '';
      },
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'DATE_OF_VISIT' })}</span>,
      dataIndex: 'visitDate',
      render: text => this.showVisitDate(text),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'queryOrderMgr/queryTransactions',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'queryOrderMgr/resetData',
    });
  }

  showGalaxyBookingNo = record => {
    const { productInstances } = record;
    const galaxyBookingNoList = [];
    for (let i = 0; i < productInstances.length; i += 1) {
      galaxyBookingNoList.push(productInstances[i].confirmationNo);
    }
    return (
      <Tooltip
        placement="topLeft"
        title={<span style={{ whiteSpace: 'pre-wrap' }}>{galaxyBookingNoList.join(',')}</span>}
      >
        <span>{galaxyBookingNoList.join(',')}</span>
      </Tooltip>
    );
  };

  showOrderType = text => {
    let typeResult = text;
    if (text === 'booking') {
      typeResult = 'Booking';
    } else if (text === 'revalidation') {
      typeResult = 'Revalidation';
    } else if (text === 'refund') {
      typeResult = 'Refund';
    }
    return (
      <Tooltip
        placement="topLeft"
        title={<span style={{ whiteSpace: 'pre-wrap' }}>{typeResult}</span>}
      >
        <span>{typeResult}</span>
      </Tooltip>
    );
  };

  showTxnDate = text => {
    if (text) {
      const date = moment(text, 'YYYY-MM-DDTHH:mm:ss');
      const dateString = moment(date).format('DD-MMM-YYYY HH:mm:ss');
      return (
        <Tooltip
          placement="topLeft"
          title={<span style={{ whiteSpace: 'pre-wrap' }}>{dateString}</span>}
        >
          <span>{dateString}</span>
        </Tooltip>
      );
    }
    return null;
  };

  showVisitDate = text => {
    if (text) {
      const date = moment(text, 'YYYY-MM-DDTHH:mm:ss');
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
    return null;
  };

  expandedRowRender = record => {
    const { productInstances } = record;
    productInstances.map(e => {
      Object.assign(e, {
        key: e.confirmationNo,
      });
      return e;
    });
    return (
      <div>
        <Table
          size="small"
          columns={this.detailColumns}
          dataSource={productInstances}
          pagination={false}
          bordered={false}
        />
      </div>
    );
  };

  jumpToOperation = (bookingNo, isSubOrder, flag) => {
    if (flag === 'Revalidation') {
      Modal.destroyAll();
      router.push({
        pathname: `/TicketManagement/Ticketing/QueryOrder/RevalidationRequest`,
        query: { isSubOrder, bookingNo: bookingNo.toString() },
      });
    } else if (flag === 'Refund') {
      Modal.destroyAll();
      router.push({
        pathname: `/TicketManagement/Ticketing/QueryOrder/RefundRequest`,
        query: { isSubOrder, bookingNo: bookingNo.toString() },
      });
    }
  };

  ifShowAllowedModel = (bookingNo, isSubOrder, vidList, flag) => {
    let ifAllowed = false;
    for (let i = 0; i < vidList.length; i += 1) {
      if (vidList[i].status === 'ISSUED') {
        ifAllowed = true;
      }
    }
    if (ifAllowed) {
      this.jumpToOperation(bookingNo, isSubOrder, flag);
    } else {
      Modal.warning({
        title: flag === 'Revalidation' ? 'Revalidation is not allowed' : 'Refund is not allowed',
        centered: true,
        content: (
          <div>
            <div style={{ marginBottom: 32 }}>
              <span>The tickets in the order have already been used.</span>
            </div>
            <div className={styles.operateButtonDivStyle}>
              <Button
                onClick={() => {
                  Modal.destroyAll();
                }}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => this.jumpToOperation(bookingNo, isSubOrder, flag)}
                type="primary"
                style={{ width: 60 }}
              >
                OK
              </Button>
            </div>
          </div>
        ),
        okButtonProps: { style: { display: 'none' } },
        cancelButtonProps: { style: { display: 'none' } },
      });
    }
  };

  toOperation = (selectedBookings, flag) => {
    const { dispatch } = this.props;
    if (flag === 'Revalidation') {
      if (selectedBookings.length === 1) {
        const { bookingNo } = selectedBookings[0];
        dispatch({
          type: 'revalidationRequestMgr/queryBookingDetail',
          payload: {
            bookingNo,
          },
        }).then(vidList => {
          this.ifShowAllowedModel(bookingNo, 0, vidList, flag);
        });
      }
    } else if (flag === 'Refund') {
      if (selectedBookings.length === 1) {
        const { bookingNo } = selectedBookings[0];
        dispatch({
          type: 'refundRequestMgr/queryBookingDetail',
          payload: {
            bookingNo,
          },
        }).then(vidList => {
          this.ifShowAllowedModel(bookingNo, 0, vidList, flag);
        });
      }
    }
  };

  openExportVIDDrawer = selectedBookings => {
    const { dispatch } = this.props;
    if (selectedBookings.length === 1) {
      const { bookingNo } = selectedBookings[0];
      dispatch({
        type: 'exportVIDMgr/save',
        payload: {
          exportVIDVisible: true,
        },
      });
      dispatch({
        type: 'exportVIDMgr/queryVIDList',
        payload: {
          bookingNo,
        },
      });
    }
  };

  downloadETicket = selectedBookings => {
    const { dispatch } = this.props;
    if (selectedBookings.length === 1) {
      const { bookingNo } = selectedBookings[0];
      dispatch({
        type: 'queryOrderMgr/downloadETicket',
        payload: {
          forderNo: bookingNo,
        },
      }).then(resultCode => {
        if (resultCode === '0') {
          message.success(formatMessage({ id: 'DOWNLOADED_SUCCESSFULLY' }));
        } else {
          message.warning(resultCode);
        }
      });
    }
  };

  openSendETicketModel = selectedBookings => {
    const { dispatch } = this.props;
    if (selectedBookings.length === 1) {
      const { bookingNo } = selectedBookings[0];
      dispatch({
        type: 'sendETicketMgr/save',
        payload: {
          sendETicketVisible: true,
          bookingNo,
        },
      });
    }
  };

  openUpdateModel = selectedBookings => {
    const { dispatch } = this.props;
    if (selectedBookings.length === 1) {
      const { bookingNo, transType, activityId, status } = selectedBookings[0];
      if (transType === 'refund' && status === 'PendingRefund') {
        dispatch({
          type: 'updateOrderMgr/save',
          payload: {
            updateVisible: true,
            updateType: 'Refund',
            bookingNo,
            activityId,
          },
        });
      } else if (transType === 'revalidation' && status === 'PendingOrderNo.') {
        dispatch({
          type: 'updateOrderMgr/save',
          payload: {
            updateVisible: true,
            updateType: 'Revalidation',
            bookingNo,
            activityId,
          },
        });
      }
    }
  };

  approveOrder = selectedBookings => {
    const { dispatch } = this.props;
    if (selectedBookings.length === 1) {
      const { activityId } = selectedBookings[0];
      dispatch({
        type: 'queryOrderMgr/approve',
        payload: {
          activityId,
        },
      });
    }
  };

  openDetailDrawer = selectedBookings => {
    const { dispatch } = this.props;
    if (selectedBookings.length === 1) {
      const { bookingNo } = selectedBookings[0];
      dispatch({
        type: 'orderDetailMgr/save',
        payload: {
          orderDetailVisible: true,
          detailType: 'Booking',
        },
      });
      dispatch({
        type: 'orderDetailMgr/queryOrderDetail',
        payload: {
          bookingNo,
        },
      });
    }
  };

  onSelectChange = selectedRowKeys => {
    const { dispatch } = this.props;
    dispatch({
      type: 'queryOrderMgr/saveSelectBookings',
      payload: {
        selectedRowKeys,
      },
    });
  };

  // -------disable button------
  ifCanRevalidation = (selectedBookings, userType) => {
    if (selectedBookings.length === 1) {
      const selectedBooking = selectedBookings[0];
      return !(
        selectedBooking.transType === 'booking' &&
        selectedBooking.status === 'Confirmed' &&
        (userType === '02' || userType === '03')
      );
    }
    return true;
  };

  ifCanApprove = (selectedBookings, userType) => {
    if (selectedBookings.length === 1) {
      const selectedBooking = selectedBookings[0];
      return !(selectedBooking.status === 'PendingApproval' && userType === '02');
    }
    return true;
  };

  ifCanExportVID = selectedBookings => {
    if (selectedBookings.length === 1) {
      const selectedBooking = selectedBookings[0];
      if (
        selectedBooking.transType === 'booking' &&
        selectedBooking.status === 'Confirmed' &&
        selectedBooking.offInstances.length > 0 &&
        selectedBooking.offInstances[0].deliveryMode === 'VID'
      ) {
        return false;
      }
    }
    return true;
  };

  ifCanOperateETicket = selectedBookings => {
    if (selectedBookings.length === 1) {
      const selectedBooking = selectedBookings[0];
      if (
        selectedBooking.transType === 'booking' &&
        selectedBooking.status === 'Confirmed' &&
        selectedBooking.offInstances.length > 0 &&
        selectedBooking.offInstances[0].deliveryMode === 'e-Ticket'
      ) {
        return false;
      }
    }
    return true;
  };

  ifCanUpdate = (selectedBookings, userType) => {
    if (selectedBookings.length === 1 && userType === '01') {
      const { transType, status } = selectedBookings[0];
      if (transType === 'refund' && status === 'PendingRefund') {
        return false;
      }
      if (transType === 'revalidation' && status === 'PendingOrderNo.') {
        return false;
      }
    }
    return true;
  };

  paymentButtonDisable = (selectedBookings) => {

    const {
      global: {
        userCompanyInfo: { companyType },
      },
    } = this.props;

    let paymentButtonDisable = true;
    if (companyType && companyType==='01' && selectedBookings.length === 1) {
      const { transType, status } = selectedBookings[0];
      if (transType === 'booking' && status === 'WaitingForPaying') {
        return false;
      }
    }
    return paymentButtonDisable;

  };

  showPaymentModal = (selectedBookings) => {

    if (selectedBookings.length === 1) {
      const selectedBooking = selectedBookings[0];
      // console.log(selectedBooking);
      const { dispatch } = this.props;
      dispatch({
        type: 'queryOrderPaymentMgr/save',
        payload: {
          paymentModalVisible: true,
          selectedBooking,
          bookDetail: selectedBooking,
          bookingNo: selectedBooking.bookingNo
        },
      });
    }

  };

  render() {
    const {
      pageLoading,
      tableLoading,
      queryOrderMgr: {
        transactionList,
        searchConditions: { currentPage: current, pageSize: nowPageSize },
        totalSize: total,
        selectedRowKeys,
        selectedBookings,
      },
      global: {
        currentUser: { userType },
      },
    } = this.props;

    const dataSource = [...transactionList];

    const title = [{ name: 'Ticketing' }, { name: 'Query Order' }];

    const pageOpts = {
      total,
      current,
      pageSize: nowPageSize,
      pageChange: (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
          type: 'queryOrderMgr/queryTransactions',
          payload: {
            currentPage: page,
            pageSize,
          },
        });
      },
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      columnWidth: 40,
    };

    return (
      <Spin spinning={!!pageLoading}>
        <ExportVID />
        <SendETicket />
        <Update />
        <Detail />
        <PaymentModal />
        <div>
          <MediaQuery minWidth={SCREEN.screenSm}>
            <BreadcrumbComp title={title} />
          </MediaQuery>
          <Row type="flex">
            <Col span={24}>
              <SearchCondition />
            </Col>
            <Col span={24}>
              <Card>
                <Row>
                  <Col className={styles.inputColStyle} span={24}>
                    <Button
                      disabled={this.ifCanRevalidation(selectedBookings, userType)}
                      onClick={() => this.toOperation(selectedBookings, 'Revalidation')}
                    >
                      {formatMessage({ id: 'REVALIDATION' })}
                    </Button>
                    <Button
                      disabled={this.ifCanRevalidation(selectedBookings, userType)}
                      className={styles.buttonStyle}
                      onClick={() => this.toOperation(selectedBookings, 'Refund')}
                    >
                      {formatMessage({ id: 'REFUND' })}
                    </Button>
                    {userType === '02' &&
                    <Button
                      disabled={this.ifCanApprove(selectedBookings, userType)}
                      className={styles.buttonStyle}
                      onClick={() => this.approveOrder(selectedBookings)}
                    >
                      {formatMessage({id: 'APPROVE'})}
                    </Button>
                    }
                    <Button
                      disabled={this.ifCanExportVID(selectedBookings)}
                      className={styles.buttonStyle}
                      onClick={() => this.openExportVIDDrawer(selectedBookings)}
                    >
                      {formatMessage({ id: 'EXPORT_VID' })}
                    </Button>
                    <Button
                      disabled={this.ifCanOperateETicket(selectedBookings)}
                      className={styles.buttonStyle}
                      onClick={() => this.downloadETicket(selectedBookings)}
                    >
                      {formatMessage({ id: 'DOWNLOAD_ETICKET' })}
                    </Button>
                    <Button
                      disabled={this.ifCanOperateETicket(selectedBookings)}
                      className={styles.buttonStyle}
                      onClick={() => this.openSendETicketModel(selectedBookings)}
                    >
                      {formatMessage({ id: 'SEND_ETICKET' })}
                    </Button>
                    <Button
                      disabled={this.ifCanUpdate(selectedBookings, userType)}
                      className={styles.buttonStyle}
                      onClick={() => this.openUpdateModel(selectedBookings)}
                    >
                      {formatMessage({ id: 'UPDATE' })}
                    </Button>
                    <Button
                      disabled={selectedBookings.length !== 1}
                      className={styles.buttonStyle}
                      onClick={() => this.openDetailDrawer(selectedBookings)}
                    >
                      {formatMessage({ id: 'ORDER_DETAIL' })}
                    </Button>
                    <Button
                      disabled={this.paymentButtonDisable(selectedBookings, userType)}
                      className={styles.buttonStyle}
                      onClick={() => this.showPaymentModal(selectedBookings)}
                    >
                      {formatMessage({ id: 'PAYMENT' })}
                    </Button>
                  </Col>
                  <Col span={24}>
                    <Table
                      size="small"
                      className="components-table-demo-nested"
                      style={{ marginTop: 5 }}
                      columns={this.columns}
                      rowSelection={rowSelection}
                      loading={!!tableLoading}
                      expandedRowRender={record => this.expandedRowRender(record)}
                      dataSource={dataSource}
                      scroll={{ x: 1140 }}
                      pagination={false}
                    />
                    <PaginationComp style={{ marginTop: 10 }} {...pageOpts} />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </Spin>
    );
  }
}

export default QueryOrder;
