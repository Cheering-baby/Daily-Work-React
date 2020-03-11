import React, {Component} from 'react';
import MediaQuery from 'react-responsive';
import {connect} from 'dva';
import {Button, Col, Input, Row, Table} from 'antd';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '../../../components/BreadcrumbComp';
import styles from './index.less';
import Card from '../../../components/Card';
import PaginationComp from '@/pages/TicketManagement/Ticketing/QueryOrder/components/PaginationComp';

const {Search} = Input;

@connect(({refundRequestMgr, loading}) => ({
  refundRequestMgr,
  tableLoading: loading.effects['refundRequestMgr/queryBookingDetail'],
}))
class RefundRequest extends Component {
  columns = [
    {
      title: <span className={styles.tableTitle}>No.</span>,
      dataIndex: 'vidNo',
      key: 'vidNo',
    },
    {
      title: <span className={styles.tableTitle}>VID Code</span>,
      dataIndex: 'vidCode',
    },
    {
      title: <span className={styles.tableTitle}>Status</span>,
      dataIndex: 'status',
    },
    {
      title: <span className={styles.tableTitle}>Expiry Date</span>,
      dataIndex: 'expiryDate',
    },
    {
      title: <span className={styles.tableTitle}>Offer Name</span>,
      dataIndex: 'offerName',
    },
  ];

  componentDidMount() {
    const {
      location: {
        query: {isSubOrder, bookingNo},
      },
    } = this.props;
    if (isSubOrder !== undefined && bookingNo !== undefined) {
      const {dispatch} = this.props;
      dispatch({
        type: 'refundRequestMgr/queryBookingDetail',
        payload: {
          bookingNo,
          isSubOrder,
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
    const {dispatch} = this.props;
    dispatch({
      type: 'refundRequestMgr/resetData',
    });
  }

  onSelectChange = selectedRowKeys => {
    const {dispatch} = this.props;
    dispatch({
      type: 'refundRequestMgr/saveSelectVid',
      payload: {
        selectedRowKeys,
      },
    });
  };

  changeSearchValue = e => {
    const {dispatch} = this.props;
    dispatch({
      type: 'refundRequestMgr/saveSearchList',
      payload: {
        vidCode: e.target.value,
      },
    });
  };

  searchByVidCode = (vidResultList, currentPage, pageSize, value) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'refundRequestMgr/saveSearchVidList',
      payload: {
        vidResultList,
        currentPage,
        pageSize,
        vidCode: value,
      },
    });
  };

  render() {
    const {
      tableLoading,
      refundRequestMgr: {
        vidList,
        total,
        vidResultList,
        searchList: {vidCode, currentPage: current, pageSize: nowPageSize},
        selectedRowKeys,
      },
    } = this.props;

    const title = [
      {name: 'Ticketing'},
      {name: 'Query Order', href: '#/TicketManagement/Ticketing/QueryOrder'},
      {name: 'Refund Request'},
    ];

    const pageOpts = {
      total,
      current,
      pageSize: nowPageSize,
      pageChange: (page, pageSize) => {
        const {dispatch} = this.props;
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
              <BreadcrumbComp title={title}/>
            </MediaQuery>
          </Col>
          <Col span={12}>
            <div className={styles.orderTitleStyles}>
              <div className={styles.orderTitleButtonStyles}>
                <Button type="primary">Submit</Button>
              </div>
            </div>
          </Col>
        </Row>
        <Row type="flex">
          <Col span={24}>
            <Card>
              <Row>
                <Col span={24}>
                  <Button type="primary">Upload</Button>
                  <Search
                    allowClear
                    placeholder="VID Code"
                    value={vidCode}
                    onChange={this.changeSearchValue}
                    onSearch={value =>
                      this.searchByVidCode(vidResultList, current, nowPageSize, value)
                    }
                    className={styles.inputStyle}
                  />
                </Col>
                <Col span={24}>
                  <Table
                    loading={!!tableLoading}
                    size="small"
                    style={{marginTop: 10}}
                    columns={this.columns}
                    dataSource={vidList}
                    rowSelection={rowSelection}
                    pagination={false}
                    bordered={false}
                  />
                  <PaginationComp style={{marginTop: 10}} {...pageOpts} />
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
