import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Col, message, Modal, Row, Spin, Table, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import { isNullOrUndefined } from 'util';
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
import PrivilegeUtil from '@/utils/PrivilegeUtil';

function transferModeOfPayment(type) {
  if (type && type.toUpperCase() === 'EWALLET') {
    return 'e-Wallet';
  }
  if (type && type.toUpperCase() === 'CREDITCARD') {
    return 'Credit Card';
  }
  if (type && type.toUpperCase() === 'AR') {
    return 'AR';
  }
  return type;
}

@connect(({ revalidationRequestMgr, queryOrderMgr, loading, global }) => ({
  bookingDetail: revalidationRequestMgr.bookingDetail,
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
    loading.effects['orderDetailMgr/queryOrderDetail'] ||
    loading.effects['auditOrderMgr/audit'],
  downloadFileLoading: loading.effects['queryOrderMgr/download'],
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
      width: '160px',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span className={styles.tableSpan}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'MODE_OF_PAYMENT' })}</span>,
      dataIndex: 'paymentModel',
      key: 'paymentModel',
      width: '140px',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{transferModeOfPayment(text)}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'TOTAL_AMOUNT' })}</span>,
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      align: 'right',
      width: '150px',
      render: (_, record) => {
        const { totalPrice, transType } = record;
        if (transType !== 'revalidation') {
          return (
            <Tooltip
              placement="topLeft"
              title={<span style={{ whiteSpace: 'pre-wrap' }}>{totalPrice}</span>}
            >
              <span>
                {!isNullOrUndefined(totalPrice)
                  ? `${String(Number(totalPrice).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                  : totalPrice}
              </span>
            </Tooltip>
          );
        }
        return null;
      },
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'ORDER_DATE' })}</span>,
      dataIndex: 'createTime',
      key: 'createTime',
      width: '160px',
      render: text => this.showTxnDate(text),
    },
    {
      title: <span className={styles.tableTitle}>Offer Name & Visit Date</span>,
      key: 'firstName',
      width: '190px',
      render: (_, record) => {
        const { offInstances = [] } = record;
        let text = '';
        let firstOffer = '';
        const offerNos = [];
        const offInstancesFilter = [];
        offInstances.forEach(item => {
          const { offerNo, visitDate, bundleName } = item;
          if (!offerNos.includes(offerNo)) {
            if (
              !offInstancesFilter.find(
                itemOffer =>
                  itemOffer.bundleName === bundleName && itemOffer.visitDate === visitDate
              )
            ) {
              offInstancesFilter.push(item);
            }
          } else if (
            offerNos.find(
              itemOffer => itemOffer.offNo === offerNo && itemOffer.visitDate !== visitDate
            )
          ) {
            offInstancesFilter.push(item);
          }
        });
        offInstancesFilter.forEach((item, index) => {
          const { offerName, visitDate, bundleName } = item;
          if (index === 0) {
            firstOffer = `${bundleName || offerName}${visitDate ? ': ' : ' '}${
              visitDate ? moment(visitDate).format('DD-MMM-YYYY') : ''
            }`;
          }
          text += `${bundleName || offerName}${visitDate ? ': ' : ' '}${
            visitDate ? moment(visitDate).format('DD-MMM-YYYY') : ''
          }\n`;
        });
        return (
          <Tooltip
            placement="topLeft"
            title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}
          >
            <span>{offInstancesFilter.length > 1 ? `${firstOffer}...` : firstOffer}</span>
          </Tooltip>
        );
      },
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'COMPANY_NAME' })}</span>,
      key: 'companyName',
      width: '150px',
      render: (_, record) => {
        const { patronInfo = {} } = record;
        return (
          <Tooltip
            placement="topLeft"
            title={<span style={{ whiteSpace: 'pre-wrap' }}>{patronInfo.mainTaName}</span>}
          >
            <span>{patronInfo.mainTaName}</span>
          </Tooltip>
        );
      },
    },
    {
      title: (
        <span className={styles.tableTitle}>{formatMessage({ id: 'SUB_AGENT_COMPANY_NAME' })}</span>
      ),
      key: 'subTaCompanyName',
      width: '200px',
      render: (_, record) => {
        const { patronInfo = {} } = record;
        return (
          <Tooltip
            placement="topLeft"
            title={<span style={{ whiteSpace: 'pre-wrap' }}>{patronInfo.taName}</span>}
          >
            <span>{patronInfo.taName}</span>
          </Tooltip>
        );
      },
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'CREATE_BY' })}</span>,
      key: 'createBy',
      dataIndex: 'createBy',
      width: '100px',
      render: text => {
        return (
          <Tooltip
            placement="topLeft"
            title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}
          >
            <span>{text}</span>
          </Tooltip>
        );
      },
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
      }).then(() => {
        const {
          queryOrderMgr: { transactionList },
        } = this.props;
        const findIndex =
          transactionList && transactionList.findIndex(i => i.bookingNo === orderNo);
        const selectedBooking =
          transactionList && transactionList.find(i => i.bookingNo === orderNo);
        if (findIndex !== undefined) {
          dispatch({
            type: 'queryOrderMgr/save',
            payload: {
              selectedRowKeys: [findIndex],
              selectedBookings: [selectedBooking],
            },
          });
        }
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
    const { offInstances, productInstances, transType } = record;
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
        align: 'right',
        render: text => {
          if (text !== null && transType !== 'revalidation') {
            return `${String(Number(text).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
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
            if (deliveryMode === 'BOCA' && userType !== '03' && deliveryFee !== null ) {
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
    const { bookingDetail, dispatch } = this.props;
    let ifAllowed = false;
    let contentText = 'The tickets in the order have already been used.';
    for (let i = 0; i < vidList.length; i += 1) {
      if (vidList[i].status === 'false' && vidList[i].hadRefunded !== 'Yes') {
        ifAllowed = true;
      }
    }
    if (flag === 'Revalidation' && bookingDetail && bookingDetail.refundSuccessFlag === 'Yes') {
      ifAllowed = false;
      contentText = `The tickets in the order have already been ${
        vidList.find(i => i.status === 'false' && i.hadRefunded !== 'Yes') ? 'used' : 'refunded'
      }.`;
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
              <span>{contentText}</span>
            </div>
            <div className={styles.operateButtonDivStyle}>
              <Button
                onClick={() => {
                  Modal.destroyAll();
                  dispatch({
                    type: 'revalidationRequestMgr/save',
                    payload: {
                      bookingDetail: null,
                    },
                  });
                }}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  Modal.destroyAll();
                  dispatch({
                    type: 'revalidationRequestMgr/save',
                    payload: {
                      bookingDetail: null,
                    },
                  });
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
      dispatch({ type: 'exportVIDMgr/queryThemePark' });
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
      } else if (
        transType === 'revalidation' &&
        (status === 'Confirmed' || status === 'Complete')
      ) {
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
      dispatch({ type: 'orderDetailMgr/queryThemePark' }).then(() => {
        const { bookingNo, productInstances = [], transType } = selectedBookings[0];
        dispatch({
          type: 'orderDetailMgr/save',
          payload: {
            orderDetailVisible: true,
            detailType: 'Booking',
            revalidationVidListVisible: transType === 'revalidation' && productInstances.length > 0,
          },
        });
        dispatch({
          type: 'orderDetailMgr/queryOrderDetail',
          payload: {
            bookingNo,
          },
        });
        if (transType === 'revalidation' && productInstances.length > 0) {
          dispatch({
            type: 'orderDetailMgr/queryVid',
            payload: {
              orderNo: bookingNo,
            },
          });
        }
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
        ['booking', 'revalidation'].includes(selectedBooking.transType) &&
        selectedBooking.status === 'Complete' &&
        selectedBooking.offInstances.length > 0 &&
        selectedBooking.offInstances[0].deliveryMode === 'e-Ticket'
      ) {
        return false;
      }
    }
    return true;
  };

  ifCanOperateCollectionLetter = selectedBookings => {
    if (selectedBookings.length === 1) {
      const selectedBooking = selectedBookings[0];
      if (
        ['booking', 'revalidation'].includes(selectedBooking.transType) &&
        selectedBooking.status === 'Complete' &&
        selectedBooking.offInstances.length > 0 &&
        selectedBooking.offInstances[0].deliveryMode === 'BOCA'
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
      if (transType === 'revalidation' && status === 'Confirmed') {
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
      if (
        selectedBooking.transType === 'revalidation' &&
        selectedBooking.status === 'Complete' &&
        selectedBooking.offInstances[0].deliveryMode === 'VID'
      ) {
        return false;
      }
    }
    return true;
  };

  redressBCInPCCDisable = selectedBookings => {
    if (selectedBookings.length >= 1) {
      return selectedBookings.find(
        ({ transType, status }) =>
          !['booking', 'refund'].includes(transType) || status !== 'Complete'
      );
    }
    return true;
  };

  redressBCInPCC = selectedBookings => {
    const { dispatch } = this.props;
    const orderNoList = selectedBookings.map(i => i.bookingNo);
    dispatch({
      type: 'queryOrderMgr/redressBCInPCC',
      payload: {
        orderNoList,
        redressType: "redressBCInPCC",
      },
    });
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
      downloadFileLoading,
      queryOrderMgr: {
        transactionList,
        searchConditions: { currentPage: current, pageSize: nowPageSize },
        totalSize: total,
        selectedRowKeys,
        selectedBookings,
        expandTableKeys,
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
        <div id="Ticketing-Query-Order">
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
                    {PrivilegeUtil.hasAnyPrivilege(['QUERY_ORDER_EXPORT_VID']) && (
                      <Button
                        disabled={this.ifCanExportVID(selectedBookings)}
                        className={styles.buttonStyle}
                        onClick={() => this.openExportVIDDrawer(selectedBookings)}
                      >
                        {formatMessage({ id: 'EXPORT_VID' })}
                      </Button>
                    )}
                    {PrivilegeUtil.hasAnyPrivilege(['QUERY_ORDER_DOWNLOAD_E_TICKET']) && (
                      <Button
                        disabled={this.ifCanOperateETicket(selectedBookings)}
                        className={styles.buttonStyle}
                        onClick={() => this.downloadETicket(selectedBookings)}
                        loading={!!downloadFileLoading}
                      >
                        {formatMessage({ id: 'DOWNLOAD_ETICKET' })}
                      </Button>
                    )}
                    {PrivilegeUtil.hasAnyPrivilege(['QUERY_ORDER_SEND_E_TICKET']) && (
                      <Button
                        disabled={this.ifCanOperateETicket(selectedBookings)}
                        className={styles.buttonStyle}
                        onClick={() => this.openSendETicketModel(selectedBookings)}
                      >
                        {formatMessage({ id: 'SEND_ETICKET' })}
                      </Button>
                    )}
                    {PrivilegeUtil.hasAnyPrivilege(['QUERY_ORDER_DOWNLOAD_COLLECTION_LETTER']) && (
                      <Button
                        disabled={this.ifCanOperateCollectionLetter(selectedBookings)}
                        className={styles.buttonStyle}
                        onClick={() => this.downloadETicket(selectedBookings)}
                      >
                        {formatMessage({ id: 'DOWNLOAD_COLLECTION_LETTER' })}
                      </Button>
                    )}
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
                    {userType === '01' && (
                      PrivilegeUtil.hasAnyPrivilege(['TRAN_ORDER_REDRESS_BCINPCC_PRIVILEGE']) &&
                      <Button
                        disabled={this.redressBCInPCCDisable(selectedBookings)}
                        className={styles.buttonStyle}
                        onClick={() => this.redressBCInPCC(selectedBookings)}
                      >
                        {formatMessage({ id: 'REDRESS_BCINPCC' })}
                      </Button>
                    )}
                  </Col>
                  <Col span={24}>
                    <Table
                      tableLayout="fixed"
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
                      scroll={{ x: 1140, y: 400 }}
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
