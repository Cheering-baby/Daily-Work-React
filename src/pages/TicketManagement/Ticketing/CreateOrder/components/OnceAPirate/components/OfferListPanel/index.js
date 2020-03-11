import React, { Component } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import { Form, Table, Tooltip, Icon, InputNumber } from 'antd';
import styles from './index.less';
import OfferDetail from './components/OfferDetail';

@Form.create()
@connect(({ ticketMgr, loading, onceAPirateTicketMgr }) => ({
  ticketMgr,
  onceAPirateTicketMgr,
  showLoading: loading.effects['ticketMgr/queryOfferList'],
}))
class OfferListPanel extends Component {

  componentDidMount() {

  }

  showOperation = (record) => {
    return (
      <div>
        <Tooltip title="Detail" placement="top">
          <Icon type="eye" onClick={() => this.showDetail(record)} />
        </Tooltip>
      </div>
    );
  };

  showDetail = (offerDetail) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'onceAPirateTicketMgr/save',
      payload: {
        showDetail: true,
        offerDetail,
      },
    });
  };

  changeOrderQuantity = (offerInfo,quantityValue) => {

    const {
      dispatch,
      ticketMgr: {
        activeGroupSelectData,
      },
      onceAPirateTicketMgr: {
        onceAPirateOfferData = [],
      }
    } = this.props;

    let orderQuantity = 0;
    for (const onceAPirateOffer of onceAPirateOfferData) {
      if (onceAPirateOffer.offerNo === offerInfo.offerNo) {
        onceAPirateOffer.orderQuantity = quantityValue;
      }
      orderQuantity+=onceAPirateOffer.orderQuantity;
    }

    if (orderQuantity>activeGroupSelectData.numOfGuests) {
      message.warn('Offer order quantity more than No. of Guests');
      return ;
    }

    dispatch({
      type: 'onceAPirateTicketMgr/save',
      payload: {
        onceAPirateOfferData,
      },
    });

  };

  render() {

    const {
      onceAPirateTicketMgr: {
        onceAPirateOfferData = [],
        showCategoryLoading,
      }
    } = this.props;

    const columns = [
      {
        title: 'Offer Name',
        dataIndex: 'offerName',
        key: 'offerName',
        render: text => (
          <div className={styles.tableColDiv}>
            <Tooltip title={text} placement="topLeft">
              {text||'-'}
            </Tooltip>
          </div>
        )
      },
      {
        title: 'Price',
        dataIndex: 'showPrice',
        align: 'right',
        render: text => (
          <div className={styles.tableColDiv}>
            <Tooltip title={text} placement="topLeft">
              {text||'-'}
            </Tooltip>
          </div>
        )
      },
      {
        title: '',
        dataIndex: 'offerNo',
        width:'16%',
        render: () => (
          <div className={styles.tableColDiv} />
        )
      },
      {
        title: 'Quantity',
        dataIndex: 'orderQuantity',
        render: (text,record) => (
          <div className={styles.tableColDiv}>
            <InputNumber value={text} min={0} max={record.offerMaxAvailable} onChange={value => this.changeOrderQuantity(record,value)} />
          </div>
        )
      },
      {
        title: 'Operation',
        render: (text,record) => (this.showOperation(record)),
      },
    ];

    return (
      <div>
        <Table
          className={styles.tablePanel}
          style={{ marginTop: 10 }}
          bordered={false}
          size="small"
          columns={columns}
          dataSource={onceAPirateOfferData}
          pagination={false}
          rowKey='offerNo'
          loading={showCategoryLoading}
        />
        <OfferDetail/>
      </div>
    );
  }
}

export default OfferListPanel;
