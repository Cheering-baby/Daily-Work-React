import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Col, message, Modal, Row, Spin, Table, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import SCREEN from '@/utils/screen';
import BreadcrumbCompForPams from '@/components/BreadcrumbComp/BreadcurmbCompForPams';
import styles from './index.less';
import SearchCondition from './components/SearchCondition';
import Card from '../../components/Card';
import SendETicket from './components/SendETicket';
import Update from './components/Update';
import ExportVID from './components/ExPortVID';
import Detail from './components/Detail';
import PaymentModal from './components/PaymentModal';
import PaginationComp from './components/PaginationComp';
import Audit from './components/Audit';
import PaymentPromptModal from '@/pages/TicketManagement/Ticketing/QueryOrder/components/PaymentPromptModal';

@connect(({ queryOrderMgr, loading, global }) => ({
  queryOrderMgr,
  global,
  tableLoading: loading.effects['queryOrderMgr/queryTransactions'],
  pageLoading:
    loading.effects['revalidationRequestMgr/queryBookingDetail'] ||
    loading.effects['refundRequestMgr/queryBookingDetail'] ||
    loading.effects['queryOrderMgr/download'] ||
    loading.effects['queryOrderMgr/resubmit'] ||
    loading.effects['exportVIDMgr/downloadETicket'] ||
    loading.effects['updateOrderMgr/update'] ||
    loading.effects['sendETicketMgr/sendEmail'] ||
    loading.effects['auditOrderMgr/audit'],
}))
class QueryOrder extends Component {
  columns = [
    {
      title: (
        <span className={styles.tableTitle}>
          {formatMessage({ id: 'PARTNERS_TRANSACTION_NO' })}
        </span>
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
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'GALAXY_ORDER_NO' })}</span>,
      key: 'galaxyBookingNo',
      width: '160px',
      render: (_, record) => this.showGalaxyBookingNo(record),
    },
    {
      title: (
        <span className={styles.tableTitle}>{formatMessage({ id: 'ORIGINAL_ORDER_NO' })}</span>
      ),
      dataIndex: 'originalOrderNo',
      key: 'originalOrderNo',
      width: '220px',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span className={styles.tableSpan}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'ORDER_TYPE' })}</span>,
      dataIndex: 'transType',
      key: 'transType',
      width: '100px',
      render: text => this.showOrderType(text),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'STATUS' })}</span>,
      dataIndex: 'status',
      key: 'status',
      width: '100px',
      render: (_, record) => this.showStatus(record),
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
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'ORDER_DATE' })}</span>,
      dataIndex: 'createTime',
      key: 'createTime',
      width: '160px',
      render: text => this.showTxnDate(text),
    },
    {
      title: <span className={styles.tableTitle}>First Name</span>,
      key: 'firstName',
      width: '110px',
      render: (_, record) => this.showOrderDeliveryName(record, 'firstName'),
    },
    {
      title: <span className={styles.tableTitle}>Last Name</span>,
      key: 'lastName',
      width: '110px',
      render: (_, record) => this.showOrderDeliveryName(record, 'lastName'),
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      location: {
        query: { orderNo },
      },
      queryOrderMgr: { searchConditions },
    } = this.props;

    if (orderNo) {
      dispatch({
        type: 'queryOrderMgr/save',
        payload: {
          searchConditions: {
            ...searchConditions,
            bookingId: orderNo,
          },
        },
      });
      dispatch({
        type: 'queryOrderMgr/queryTransactions',
      });
    } else {
      dispatch({
        type: 'queryOrderMgr/queryTransactions',
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'queryOrderMgr/resetData',
    });
  }

  showOrderDeliveryName = (record, flag) => {
    const { offInstances = [] } = record;
    if (offInstances.length > 0) {
      let text = '';
      const { deliveryFirstName, deliveryLastName } = offInstances[0];
      if (flag === 'firstName') {
        text = deliveryFirstName;
      } else if (flag === 'lastName') {
        text = deliveryLastName;
      }
      return (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      );
    }
  };

  showStatus = record => {
    const { status, transType } = record;
    let statusDisplay = status;
    if (status === 'Complete') {
      statusDisplay = 'Confirmed';
    }
    if (status === 'Confirmed') {
      if (transType === 'revalidation') {
        statusDisplay = 'Pending order No.';
      }
      if (transType === 'refund') {
        statusDisplay = 'Pending Refund';
      }
    }
    if (status === 'PendingApproval') {
      statusDisplay = 'Pending Approval';
    }
    if (status === 'WaitingForPaying') {
      statusDisplay = 'Pending Payment';
    }
    if (status === 'PendingTopup') {
      statusDisplay = 'Pending Topup';
    }
    return (
      <Tooltip
        placement="topLeft"
        title={<span style={{ whiteSpace: 'pre-wrap' }}>{statusDisplay}</span>}
      >
        <span className={styles.tableSpan}>{statusDisplay}</span>
      </Tooltip>
    );
  };

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

  expandedRowRender = (record, userType) => {
    const { offInstances, productInstances } = record;
    if (productInstances.length === 0) {
      return null;
    }
    productInstances.map(e => {
      Object.assign(e, {
        key: e.confirmationNo,
      });
      return e;
    });
    let deliveryMode = 'VID';
    let deliveryFee = 0;
    offInstances.forEach(offInstance => {
      // eslint-disable-next-line prefer-destructuring
      deliveryMode = offInstance.deliveryMode;
      deliveryFee += !offInstance.deliveryFee ? 0 : Number.parseFloat(offInstance.deliveryFee);
    });
    deliveryFee = Number(deliveryFee).toFixed(2);

    const detailColumns = [
      {
        title: (
          <span className={styles.tableTitle}>{formatMessage({ id: 'CONFIRMATION_NO' })}</span>
        ),
        dataIndex: 'confirmationNo',
        key: 'confirmationNo',
        render: text => (
          <Tooltip
            placement="topLeft"
            title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}
          >
            <span className={styles.tableSpan}>{text}</span>
          </Tooltip>
        ),
      },
      {
        title: <span className={styles.tableTitle}>{formatMessage({ id: 'SUB_SYSTEM' })}</span>,
        dataIndex: 'salesChannel',
        render: text => (
          <Tooltip
            placement="topLeft"
            title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}
          >
            <span className={styles.tableSpan}>{text}</span>
          </Tooltip>
        ),
      },
      {
        title: <span className={styles.tableTitle}>{formatMessage({ id: 'DATE_OF_VISIT' })}</span>,
        dataIndex: 'visitDate',
        render: text => this.showVisitDate(text),
      },
      {
        title: <span className={styles.tableTitle}>{formatMessage({ id: 'TOTAL_AMOUNT' })}</span>,
        dataIndex: 'totalAmount',
        render: text => {
          if (text !== null) {
            return `${Number(text).toFixed(2)}(SGD)`;
          }
          return '';
        },
      },
    ];

    if (userType === '03') {
      // delete totalAmount column
      detailColumns.splice(2, 1);
    }

    return (
      <div style={{ margin: '-9px -9px -9px 24px' }}>
        <Table
          size="small"
          columns={detailColumns}
          dataSource={productInstances}
          pagination={false}
          bordered={false}
          rowClassName={styles.tableRowStyle}
          footer={() => {
            if (deliveryMode === 'BOCA' && userType !== '03') {
              return (
                <div className={styles.tableFooterDiv}>
                  <div style={{ width: '25%', float: 'right' }}>
                    <span className={styles.tableFooterSpan}>BOCA FEE:</span>
                    <span className={styles.tableTotalPrice}>${deliveryFee}</span>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
      </div>
    );
  };

  expandTable = (expanded, record, expandTableKeys) => {
    if (expanded) {
      expandTableKeys.push(record.key);
    } else {
      expandTableKeys = expandTableKeys.filter(item => {
        return item !== record.key;
      });
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'queryOrderMgr/save',
      payload: {
        expandTableKeys,
      },
    });
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
      if (vidList[i].status === 'false' && vidList[i].hadRefunded !== 'Yes') {
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
                // onClick={() => this.jumpToOperation(bookingNo, isSubOrder, flag)}
                onClick={() => {
                  Modal.destroyAll();
                }}
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
        type: 'queryOrderMgr/download',
        payload: {
          forderNo: bookingNo,
        },
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
      if (transType === 'refund' && status === 'Confirmed') {
        dispatch({
          type: 'updateOrderMgr/save',
          payload: {
            updateVisible: true,
            updateType: 'Refund',
            bookingNo,
            activityId,
            status,
          },
        });
      } else if (transType === 'revalidation' && (status === 'Confirmed' || status === 'Complete')) {
        dispatch({
          type: 'updateOrderMgr/save',
          payload: {
            updateVisible: true,
            updateType: 'Revalidation',
            bookingNo,
            activityId,
            status,
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
        type: 'auditOrderMgr/save',
        payload: {
          auditVisible: true,
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
      dispatch({ type: 'orderDetailMgr/queryThemePark' });
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
  ifCanRevalidation = (selectedBookings, userType, functionActive) => {
    if (!functionActive) {
      return true;
    }
    if (selectedBookings.length === 1) {
      const selectedBooking = selectedBookings[0];
      return !(
        selectedBooking.transType === 'booking' &&
        selectedBooking.status === 'Complete' &&
        selectedBooking.revalidationFlag === 'No' &&
        (userType === '02' || userType === '03')
      );
    }
    return true;
  };

  ifCanApprove = (selectedBookings, userType, functionActive) => {
    if (!functionActive) {
      return true;
    }
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
        selectedBooking.status === 'Complete' &&
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
        selectedBooking.status === 'Complete' &&
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
      if (transType === 'refund' && status === 'Confirmed') {
        return false;
      }
      if (transType === 'revalidation' && (status === 'Confirmed' || status === 'Complete')) {
        return false;
      }
    }
    return true;
  };

  paymentButtonDisable = (selectedBookings, userType, functionActive) => {
    if (!functionActive) {
      return true;
    }
    if (userType === '02' && selectedBookings.length === 1) {
      const { transType, status } = selectedBookings[0];
      if (transType === 'booking' && status === 'WaitingForPaying') {
        return false;
      }
    }
    return true;
  };

  showPaymentModal = selectedBookings => {
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
          bookingNo: selectedBooking.bookingNo,
        },
      });
    }
  };

  resubmitButtonDisable = (selectedBookings, functionActive) => {
    if (!functionActive) {
      return true;
    }
    if (selectedBookings.length === 1) {
      const { transType, status } = selectedBookings[0];
      if (transType === 'refund' && status === 'PendingTopup') {
        return false;
      }
    }
    return true;
  };

  resubmitOrder = selectedBookings => {
    if (selectedBookings.length === 1) {
      const { bookingNo } = selectedBookings[0];
      const { dispatch } = this.props;
      dispatch({
        type: 'queryOrderMgr/resubmit',
        payload: {
          bookingNo,
        },
      }).then(resultCode => {
        if (resultCode === '0') {
          message.success(formatMessage({ id: 'RESUBMIT_SUCCESSFULLY' }));
        } else {
          // message.warning(formatMessage({ id: 'FAILED_TO_RESUBMIT' }));
        }
      });
    }
  };

  reprintButtonDisable = selectedBookings => {
    if (selectedBookings.length === 1) {
      const selectedBooking = selectedBookings[0];
      if (selectedBooking.transType === 'booking' && selectedBooking.status === 'Complete') {
        return false;
      }
    }
    return true;
  };

  reprint = selectedBookings => {
    const { dispatch } = this.props;
    if (selectedBookings.length === 1) {
      const { bookingNo } = selectedBookings[0];
      dispatch({
        type: 'queryOrderMgr/download',
        payload: {
          forderNo: bookingNo,
          ifReprint: true,
        },
      }).then(resultCode => {
        if (resultCode === '0') {
          message.success(formatMessage({ id: 'REPRINT_SUCCESSFULLY' }));
        } else {
          message.warning(resultCode);
        }
      });
    }
  };

  revalidationVIDDisable = selectedBookings => {
    if (selectedBookings.length === 1) {
      const selectedBooking = selectedBookings[0];
      if (selectedBooking.transType === 'revalidation' && selectedBooking.status === 'Complete') {
        return false;
      }
    }
    return true;
  };

  exportRevalidationVID = selectedBookings => {
    if (selectedBookings.length === 1) {
      const selectedBooking = selectedBookings[0];
      if (selectedBooking.transType === 'revalidation' && selectedBooking.status === 'Complete') {
        const { dispatch } = this.props;
        dispatch({
          type: 'exportVIDMgr/downloadETicket',
          payload: {
            forderNo: selectedBooking.bookingNo,
          },
        }).then(resultCode => {
          if (resultCode === '0') {
            message.success(formatMessage({ id: 'EXPORTED_SUCCESSFULLY' }));
          } else {
            message.warning(resultCode);
          }
        });
      }
    }
    return true;
  };

  checkTAStatus = () => {
    const {
      global: {
        currentUser: { userType },
        userCompanyInfo,
      },
    } = this.props;
    let taStatus = false;
    if (userType === '02') {
      if (userCompanyInfo.status === '0') {
        taStatus = true;
      }
    } else if (userType === '03') {
      if (userCompanyInfo.status === '0') {
        taStatus = true;
      }
      if (userCompanyInfo.mainTAInfo && userCompanyInfo.mainTAInfo.status !== '0') {
        taStatus = false;
      }
    }
    return taStatus;
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
        expandTableKeys,
        downloadFileLoading = false,
      },
      global: {
        currentUser: { userType },
      },
    } = this.props;

    const functionActive = this.checkTAStatus();

    const dataSource = [...transactionList];

    const title = [{ name: 'Ticketing' }, { name: 'Order Query' }];

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
        <PaymentPromptModal />
        <Audit />
        <div>
          <MediaQuery minWidth={SCREEN.screenSm}>
            <BreadcrumbCompForPams title={title} />
          </MediaQuery>
          <Row type="flex">
            <Col span={24}>
              <SearchCondition />
            </Col>
            <Col span={24}>
              <Card>
                <Row>
                  <Col className={styles.inputColStyle} span={24}>
                    {(userType === '02' || userType === '03') && (
                      <Button
                        disabled={this.ifCanRevalidation(
                          selectedBookings,
                          userType,
                          functionActive
                        )}
                        className={styles.buttonStyle}
                        onClick={() => this.toOperation(selectedBookings, 'Revalidation')}
                      >
                        {formatMessage({ id: 'REVALIDATION' })}
                      </Button>
                    )}
                    <Button
                      disabled={this.revalidationVIDDisable(selectedBookings, userType)}
                      className={styles.buttonStyle}
                      onClick={() => this.exportRevalidationVID(selectedBookings)}
                    >
                      {formatMessage({ id: 'REVALIDATION_VID' })}
                    </Button>
                    {(userType === '02' || userType === '03') && (
                      <Button
                        disabled={this.ifCanRevalidation(
                          selectedBookings,
                          userType,
                          functionActive
                        )}
                        className={styles.buttonStyle}
                        onClick={() => this.toOperation(selectedBookings, 'Refund')}
                      >
                        {formatMessage({ id: 'REFUND' })}
                      </Button>
                    )}
                    {userType === '02' && (
                      <Button
                        disabled={this.ifCanApprove(selectedBookings, userType, functionActive)}
                        className={styles.buttonStyle}
                        onClick={() => this.approveOrder(selectedBookings)}
                      >
                        {formatMessage({ id: 'AUDIT' })}
                      </Button>
                    )}
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
                      loading={downloadFileLoading}
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
                    {userType === '01' && (
                      <Button
                        disabled={this.ifCanUpdate(selectedBookings, userType)}
                        className={styles.buttonStyle}
                        onClick={() => this.openUpdateModel(selectedBookings)}
                      >
                        {formatMessage({ id: 'UPDATE' })}
                      </Button>
                    )}
                    <Button
                      disabled={selectedBookings.length !== 1}
                      className={styles.buttonStyle}
                      onClick={() => this.openDetailDrawer(selectedBookings)}
                    >
                      {formatMessage({ id: 'ORDER_DETAIL' })}
                    </Button>
                    {userType === '02' && (
                      <Button
                        disabled={this.paymentButtonDisable(
                          selectedBookings,
                          userType,
                          functionActive
                        )}
                        className={styles.buttonStyle}
                        onClick={() => this.showPaymentModal(selectedBookings)}
                      >
                        {formatMessage({ id: 'PAYMENT' })}
                      </Button>
                    )}
                    <Button
                      disabled={this.resubmitButtonDisable(selectedBookings, functionActive)}
                      className={styles.buttonStyle}
                      onClick={() => this.resubmitOrder(selectedBookings)}
                    >
                      {formatMessage({ id: 'RESUBMIT' })}
                    </Button>
                    {(userType === '01' || userType === '02') && (
                      <Button
                        disabled={this.reprintButtonDisable(selectedBookings)}
                        className={styles.buttonStyle}
                        onClick={() => this.reprint(selectedBookings)}
                      >
                        {formatMessage({ id: 'REPRINT' })}
                      </Button>
                    )}
                  </Col>
                  <Col span={24}>
                    <Table
                      size="small"
                      className={`components-table-demo-nested ${styles.searchTitle}`}
                      columns={this.columns}
                      rowSelection={rowSelection}
                      rowClassName={record =>
                        record.productInstances === null || record.productInstances.length === 0
                          ? styles.hideIcon
                          : styles.tableRowStyle
                      }
                      expandedRowKeys={expandTableKeys}
                      onExpand={(expanded, record) =>
                        this.expandTable(expanded, record, expandTableKeys)
                      }
                      loading={!!tableLoading}
                      expandedRowRender={record => this.expandedRowRender(record, userType)}
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
