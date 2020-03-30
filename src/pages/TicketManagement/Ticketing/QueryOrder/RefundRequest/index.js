import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Button, Col, Input, message, Row, Table, Upload } from 'antd';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '../../../components/BreadcrumbComp';
import styles from './index.less';
import Card from '../../../components/Card';
import PaginationComp from '@/pages/TicketManagement/Ticketing/QueryOrder/components/PaginationComp';

const { Search } = Input;

@connect(({ refundRequestMgr, loading, global }) => ({
  refundRequestMgr,
  global,
  tableLoading: loading.effects['refundRequestMgr/queryBookingDetail'],
}))
class RefundRequest extends Component {
  columns = [
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'NO' })}</span>,
      dataIndex: 'vidNo',
      key: 'vidNo',
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'VID_CODE' })}</span>,
      dataIndex: 'vidCode',
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'STATUS' })}</span>,
      dataIndex: 'status',
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'EXPIRY_DATE' })}</span>,
      dataIndex: 'expiryDate',
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'OFFER_NAME' })}</span>,
      dataIndex: 'offerName',
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

  onSelectChange = selectedRowKeys => {
    const { dispatch } = this.props;
    dispatch({
      type: 'refundRequestMgr/saveSelectVid',
      payload: {
        selectedRowKeys,
      },
    });
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

  refundTicket = (selectedVidList, bookingNo) => {
    const { dispatch } = this.props;
    if (selectedVidList.length < 1) {
      message.warning('Select at least one VID.');
    } else {
      const visualIds = [];
      for (let i = 0; i < selectedVidList.length; i += 1) {
        visualIds.push(selectedVidList[i].vidCode);
      }
      dispatch({
        type: 'refundRequestMgr/refundTicket',
        payload: {
          bookingNo,
          visualIds,
        },
      }).then(resultCode => {
        if (resultCode === '0') {
          message.success('Submit successfully.');
        } else {
          message.warning(resultCode);
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
          message.success('Update successfully.');
        } else {
          message.warning('Failed to update.');
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

  render() {
    const {
      tableLoading,
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
      onChange: this.onSelectChange,
    };

    return (
      <div>
        <Row gutter={12}>
          <Col span={12}>
            <MediaQuery minWidth={SCREEN.screenSm}>
              <BreadcrumbComp title={title} />
            </MediaQuery>
          </Col>
          <Col span={12}>
            <div className={styles.orderTitleStyles}>
              <div className={styles.orderTitleButtonStyles}>
                <Button
                  type="primary"
                  onClick={() => this.refundTicket(selectedVidList, bookingNo)}
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
                  />
                  <PaginationComp style={{ marginTop: 10 }} {...pageOpts} />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default RefundRequest;
