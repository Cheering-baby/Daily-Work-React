import React, {Component} from 'react';
import MediaQuery from 'react-responsive';
import {connect} from 'dva';
import {Button, Col, Modal, Row, Spin, Table, Tooltip} from 'antd';
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
import PaginationComp from './components/PaginationComp';

@connect(({queryOrderMgr, loading}) => ({
  queryOrderMgr,
  tableLoading: loading.effects['queryOrderMgr/queryTransactions'],
  pageLoading: loading.effects['revalidationRequestMgr/queryBookingDetail'],
}))
class QueryOrder extends Component {
  columns = [
    {
      title: <span className={styles.tableTitle}>PAMS Transaction No.</span>,
      dataIndex: 'bookingNo',
      key: 'bookingNo',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{whiteSpace: 'pre-wrap'}}>{text}</span>}>
          <span className={styles.tableSpan} style={{width: 160}}>
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>Order Type</span>,
      dataIndex: 'transType',
      key: 'transType',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{whiteSpace: 'pre-wrap'}}>{text}</span>}>
          <span className={styles.tableSpan} style={{width: 160}}>
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>Sales Channel</span>,
      dataIndex: 'salesChannel',
      key: 'salesChannel',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{whiteSpace: 'pre-wrap'}}>{text}</span>}>
          <span className={styles.tableSpan} style={{width: 160}}>
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>Txn Date</span>,
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{whiteSpace: 'pre-wrap'}}>{text}</span>}>
          <span className={styles.tableSpan} style={{width: 160}}>
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>Guest Name</span>,
      key: 'guestName',
      render: (text, record) => {
        if (record.firstName || record.lastName) {
          return (
            <Tooltip
              placement="topLeft"
              title={
                <span style={{whiteSpace: 'pre-wrap'}}>
                  {`${record.firstName} ${record.lastName}`}
                </span>
              }
            >
              <span className={styles.tableSpan} style={{width: 160}}>
                {`${record.firstName} ${record.lastName}`}
              </span>
            </Tooltip>
          );
        }
      },
    },
    {
      title: <span className={styles.tableTitle}>Original Order No.</span>,
      dataIndex: 'originalOrderNo',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{whiteSpace: 'pre-wrap'}}>{text}</span>}>
          <span className={styles.tableSpan} style={{width: 160}}>
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>Status</span>,
      dataIndex: 'status',
    },
    {
      title: <span className={styles.tableTitle}>AR Payment Status</span>,
      dataIndex: 'arPaymentStatus',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{whiteSpace: 'pre-wrap'}}>{text}</span>}>
          <span className={styles.tableSpan} style={{width: 160}}>
            {text}
          </span>
        </Tooltip>
      ),
    },
  ];

  detailColumns = [
    {
      title: <span className={styles.tableTitle}>Confirmation No.</span>,
      dataIndex: 'confirmationNo',
      key: 'confirmationNo',
    },
    {
      title: <span className={styles.tableTitle}>Sub-System</span>,
      dataIndex: 'salesChannel',
    },
    {
      title: <span className={styles.tableTitle}>Total Amount</span>,
      dataIndex: 'totalAmount',
      render: text => {
        if (text) {
          return `${text}(SGD)`;
        }
        return '';
      },
    },
    {
      title: <span className={styles.tableTitle}>Date of Visit</span>,
      dataIndex: 'visitDate',
    },
  ];

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'queryOrderMgr/queryTransactions',
    });
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'queryOrderMgr/resetData',
    });
  }

  expandedRowRender = (record, subSelectedRowKeys) => {
    const {productInstances} = record;
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
          rowSelection={{
            selectedRowKeys: subSelectedRowKeys,
            onChange: selectedRowKeys => this.onSubSelectChange(selectedRowKeys, productInstances),
          }}
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
        query: {isSubOrder, bookingNo: bookingNo.toString()},
      });
    } else if (flag === 'Refund') {
      Modal.destroyAll();
      router.push({
        pathname: `/TicketManagement/Ticketing/QueryOrder/RefundRequest`,
        query: {isSubOrder, bookingNo: bookingNo.toString()},
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
            <div style={{marginBottom: 32}}>
              <span>The tickets in the order have already been used.</span>
            </div>
            <div className={styles.operateButtonDivStyle}>
              <Button
                onClick={() => {
                  Modal.destroyAll();
                }}
                style={{marginRight: 8}}
              >
                Cancel
              </Button>
              <Button
                onClick={() => this.jumpToOperation(bookingNo, isSubOrder, flag)}
                type="primary"
                style={{width: 60}}
              >
                OK
              </Button>
            </div>
          </div>
        ),
        okButtonProps: {style: {display: 'none'}},
        cancelButtonProps: {style: {display: 'none'}},
      });
    }
  };

  toOperation = (selectedBookings, subSelectedBookings, flag) => {
    const {dispatch} = this.props;
    if (flag === 'Revalidation') {
      if (selectedBookings.length === 1 && subSelectedBookings.length === 0) {
        const {bookingNo} = selectedBookings[0];
        dispatch({
          type: 'revalidationRequestMgr/queryBookingDetail',
          payload: {
            bookingNo,
            isSubOrder: null,
          },
        }).then(vidList => {
          this.ifShowAllowedModel(bookingNo, 0, vidList, flag);
        });
      } else if (selectedBookings.length === 0 && subSelectedBookings.length === 1) {
        const {confirmationNo} = subSelectedBookings[0];
        dispatch({
          type: 'revalidationRequestMgr/queryBookingDetail',
          payload: {
            bookingNo: confirmationNo,
            isSubOrder: 1,
          },
        }).then(vidList => {
          this.ifShowAllowedModel(confirmationNo, 1, vidList, flag);
        });
      }
    } else if (flag === 'Refund') {
      if (selectedBookings.length === 1 && subSelectedBookings.length === 0) {
        const {bookingNo} = selectedBookings[0];
        dispatch({
          type: 'refundRequestMgr/queryBookingDetail',
          payload: {
            bookingNo,
            isSubOrder: null,
          },
        }).then(vidList => {
          this.ifShowAllowedModel(bookingNo, 0, vidList, flag);
        });
      } else if (selectedBookings.length === 0 && subSelectedBookings.length === 1) {
        const {confirmationNo} = subSelectedBookings[0];
        dispatch({
          type: 'refundRequestMgr/queryBookingDetail',
          payload: {
            bookingNo: confirmationNo,
            isSubOrder: 1,
          },
        }).then(vidList => {
          this.ifShowAllowedModel(confirmationNo, 1, vidList, flag);
        });
      }
    }
  };

  openExportVIDDrawer = (selectedBookings, subSelectedBookings) => {
    const {dispatch} = this.props;
    if (selectedBookings.length === 1 && subSelectedBookings.length === 0) {
      const {bookingNo} = selectedBookings[0];
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
    } else if (selectedBookings.length === 0 && subSelectedBookings.length === 1) {
      const {confirmationNo} = subSelectedBookings[0];
      dispatch({
        type: 'exportVIDMgr/save',
        payload: {
          exportVIDVisible: true,
        },
      });
      dispatch({
        type: 'exportVIDMgr/queryVIDList',
        payload: {
          bookingNo: confirmationNo,
          isSubOrder: 1,
        },
      });
    }
  };

  openSendETicketModel = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'sendETicketMgr/save',
      payload: {
        sendETicketVisible: true,
      },
    });
  };

  openUpdateModel = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'updateOrderMgr/save',
      payload: {
        updateVisible: true,
        updateType: 'Refund',
      },
    });
  };

  openDetailDrawer = (selectedBookings, subSelectedBookings) => {
    const {dispatch} = this.props;
    if (selectedBookings.length === 1 && subSelectedBookings.length === 0) {
      const {bookingNo} = selectedBookings[0];
      dispatch({
        type: 'orderDetailMgr/save',
        payload: {
          orderDetailVisible: true,
          detailType: 'Revalidation',
        },
      });
      dispatch({
        type: 'orderDetailMgr/queryOrderDetail',
        payload: {
          bookingNo,
        },
      });
    } else if (selectedBookings.length === 0 && subSelectedBookings.length === 1) {
      const {confirmationNo} = subSelectedBookings[0];
      dispatch({
        type: 'orderDetailMgr/save',
        payload: {
          orderDetailVisible: true,
          detailType: 'Revalidation',
        },
      });
      dispatch({
        type: 'orderDetailMgr/queryOrderDetail',
        payload: {
          bookingNo: confirmationNo,
          isSubOrder: 1,
        },
      });
    }
  };

  onSelectChange = selectedRowKeys => {
    const {dispatch} = this.props;
    dispatch({
      type: 'queryOrderMgr/saveSelectBookings',
      payload: {
        selectedRowKeys,
      },
    });
  };

  onSubSelectChange = (selectedRowKeys, productInstances) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'queryOrderMgr/saveSubSelectBookings',
      payload: {
        subSelectedRowKeys: selectedRowKeys,
        productInstances,
      },
    });
  };

  render() {
    const {
      pageLoading,
      tableLoading,
      queryOrderMgr: {
        transactionList,
        searchConditions: {currentPage: current, pageSize: nowPageSize},
        totalSize: total,
        selectedRowKeys,
        selectedBookings,
        subSelectedRowKeys,
        subSelectedBookings,
      },
    } = this.props;

    const dataSource = [...transactionList];

    const title = [{name: 'Ticketing'}, {name: 'Query Order'}];

    const pageOpts = {
      total,
      current,
      pageSize: nowPageSize,
      pageChange: (page, pageSize) => {
        const {dispatch} = this.props;
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
    };

    return (
      <Spin spinning={!!pageLoading}>
        <ExportVID/>
        <SendETicket/>
        <Update/>
        <Detail/>
        <div>
          <MediaQuery minWidth={SCREEN.screenSm}>
            <BreadcrumbComp title={title}/>
          </MediaQuery>
          <Row type="flex">
            <Col span={24}>
              <SearchCondition/>
            </Col>
            <Col span={24}>
              <Card>
                <Row>
                  <Col className={styles.inputColStyle} span={24}>
                    <Button
                      onClick={() =>
                        this.toOperation(selectedBookings, subSelectedBookings, 'Revalidation')
                      }
                    >
                      Revalidation
                    </Button>
                    <Button
                      className={styles.buttonStyle}
                      onClick={() =>
                        this.toOperation(selectedBookings, subSelectedBookings, 'Refund')
                      }
                    >
                      Refund
                    </Button>
                    <Button className={styles.buttonStyle}>Approve</Button>
                    <Button
                      className={styles.buttonStyle}
                      onClick={() =>
                        this.openExportVIDDrawer(selectedBookings, subSelectedBookings)
                      }
                    >
                      Export VID
                    </Button>
                    <Button className={styles.buttonStyle}>Download e-Ticket</Button>
                    <Button
                      className={styles.buttonStyle}
                      onClick={() => this.openSendETicketModel()}
                    >
                      Send e-Ticket
                    </Button>
                    <Button className={styles.buttonStyle} onClick={() => this.openUpdateModel()}>
                      Update
                    </Button>
                    <Button
                      className={styles.buttonStyle}
                      onClick={() => this.openDetailDrawer(selectedBookings, subSelectedBookings)}
                    >
                      Order Detail
                    </Button>
                  </Col>
                  <Col span={24}>
                    <Table
                      size="small"
                      className="components-table-demo-nested"
                      style={{marginTop: 5}}
                      columns={this.columns}
                      rowSelection={rowSelection}
                      loading={!!tableLoading}
                      expandedRowRender={record =>
                        this.expandedRowRender(record, subSelectedRowKeys)
                      }
                      dataSource={dataSource}
                      pagination={false}
                    />
                    <PaginationComp style={{marginTop: 10}} {...pageOpts} />
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
