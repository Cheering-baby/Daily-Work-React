import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Button, Col, Input, message, Row, Spin, Table, Tooltip, Upload } from 'antd';
import moment from 'moment';
import SCREEN from '@/utils/screen';
import BreadcrumbCompForPams from '@/components/BreadcrumbComp/BreadcurmbCompForPams';
import styles from './index.less';
import Card from '../../../components/Card';
import PaginationComp from '@/pages/TicketManagement/Ticketing/QueryOrder/components/PaginationComp';

const { Search } = Input;

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

  refundTicket = (selectedVidList, bookingNo, userType) => {
    const {
      dispatch,
      refundRequestMgr: { bookingDetail },
    } = this.props;
    if (selectedVidList.length < 1) {
      message.warning('Select at least one VID.');
    } else {
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
            if (attraction[j].visualIdStatus === 'false') {
              visualIds.push(attraction[j].visualID);
            }
          }
        }
      }
      dispatch({
        type: 'refundRequestMgr/refundTicket',
        payload: {
          bookingNo,
          visualIds,
        },
      }).then(resultCode => {
        if (resultCode === '0') {
          if (userType === '02') {
            message.success(formatMessage({ id: 'REFUNDED_SUCCESSFULLY' }));
          }
          if (userType === '03') {
            message.success(formatMessage({ id: 'SUB_TA_REQUESTED_SUCCESSFULLY' }));
          }
        }
      });
    }
  };

  getRefundUploadProps = (file, nowPageSize) => {
    const { dispatch } = this.props;
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

  getCheckboxProps = record => {
    const {
      refundRequestMgr: { disabledKeyList, themeParkRefundList = [], disabledVidList = [] },
    } = this.props;
    const index = disabledKeyList.findIndex(disabledKey => disabledKey === record.offerGroup);
    if (record.themePark && themeParkRefundList.length > 0) {
      const themeParkRefundIndex = themeParkRefundList.findIndex(
        themeParkRefund => themeParkRefund === record.themePark
      );
      if (themeParkRefundIndex > -1 && index > -1) {
        return {
          disabled: false,
        };
      }
    }
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

  onSelectChange = selectedRowKeys => {
    const { dispatch } = this.props;
    dispatch({
      type: 'refundRequestMgr/saveSelectVid',
      payload: {
        selectedRowKeys,
      },
    });
  };

  onSelectAll = (selected, selectedRows) => {
    const { dispatch } = this.props;
    if (selected) {
      const selectedRowKeys = selectedRows.map(selectedRow => selectedRow.key);
      dispatch({
        type: 'refundRequestMgr/saveSelectVid',
        payload: {
          selectedRowKeys,
        },
      });
    } else {
      dispatch({
        type: 'refundRequestMgr/save',
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
      type: 'refundRequestMgr/settingSelectVid',
      payload: {
        selected,
        record,
      },
    });
  };

  refundPay = () => {
    const {
      refundRequestMgr: { selectedVidList = [], bookingDetail },
    } = this.props;

    if (selectedVidList.length === 0) {
      return '0.00';
    }

    let refundPay = 0;
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
          refundPay += attraction[j].netAmt;
        }
      }
    }

    return Number(refundPay).toFixed(2);
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
      { name: 'Refund Request' },
    ];

    const pageOpts = {
      total,
      current,
      pageSize: nowPageSize,
      pageChange: (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
          type: 'refundRequestMgr/saveSearchVidList',
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
                {userType !== '03' && <span className={styles.priceFont}>${this.refundPay()}</span>}
                <Button
                  type="primary"
                  onClick={() => this.refundTicket(selectedVidList, bookingNo, userType)}
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
                <Col span={24}>
                  <Upload
                    action=""
                    beforeUpload={file => this.getRefundUploadProps(file, nowPageSize)}
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

export default RefundRequest;
