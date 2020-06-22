import React, { Component } from 'react';
import { connect } from 'dva';
import { Checkbox, Col, Row } from 'antd';
import styles from './index.less';
import OrderItemCollapse from './components/OrderItemCollapse';

@connect(({ global, ticketOrderCartMgr, ticketBookingAndPayMgr }) => ({
  global,
  ticketOrderCartMgr,
  ticketBookingAndPayMgr,
}))
class ShoppingCartOffer extends Component {
  getOrderData = () => {
    let orderData = [];
    const { editModal } = this.props;
    if (editModal) {
      const {
        ticketOrderCartMgr: { generalTicketOrderData = [], onceAPirateOrderData = [] },
      } = this.props;
      orderData = [...generalTicketOrderData];
      if (onceAPirateOrderData && onceAPirateOrderData.length > 0) {
        const oapData = {
          themePark: 'OAP',
          themeParkName: 'Once A Pirate',
          orderOfferList: [...onceAPirateOrderData],
        };
        orderData.push(oapData);
      }
    } else {
      const {
        ticketBookingAndPayMgr: { generalTicketOrderData = [], onceAPirateOrderData = [] },
      } = this.props;
      orderData = [...generalTicketOrderData];
      if (onceAPirateOrderData && onceAPirateOrderData.length > 0) {
        const oapData = {
          themePark: 'OAP',
          themeParkName: 'Once A Pirate',
          orderOfferList: [...onceAPirateOrderData],
        };
        orderData.push(oapData);
      }
    }

    return orderData;
  };

  clickSelectAll = e => {
    const { checked } = e.target;
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketOrderCartMgr/changeSelectAllOrder',
      payload: {
        selectAllOrder: checked,
        selectAllIndeterminate: false,
      },
    });
  };

  render() {
    const {
      global: {
        userCompanyInfo: { companyType },
      },
      ticketOrderCartMgr: { selectAllOrder, selectAllIndeterminate },
      editModal,
    } = this.props;
    const orderData = this.getOrderData();

    return (
      <div className={companyType === '01' ? styles.cartOfferDiv : styles.cartOfferDiv2}>
        <Row className={styles.cartOfferTableRow}>
          <Col span={1} className={styles.checkboxCol}>
            {editModal && (
              <Checkbox
                value="SelectAll"
                onChange={this.clickSelectAll}
                checked={selectAllOrder}
                indeterminate={selectAllIndeterminate}
              />
            )}
          </Col>

          <Col span={4}>
            <span className={styles.titleSpan}>Offer Name</span>
          </Col>
          <Col span={3} className={styles.dateCol}>
            <span className={styles.titleSpan}>Visit Date</span>
          </Col>
          <Col span={2}>
            <span className={styles.titleSpan}>Session</span>
          </Col>
          <Col span={companyType === '01' ? 3 : 5}>
            <span className={styles.titleSpan}>Ticket Type</span>
          </Col>
          {companyType === '01' && (
            <Col span={3} className={styles.priceCol}>
              <span className={styles.titleSpan}>Price (SGD)</span>
            </Col>
          )}
          <Col span={companyType === '01' ? 2 : 4} className={styles.dateCol}>
            <span className={styles.titleSpan}>Quantity</span>
          </Col>
          {companyType === '01' && (
            <Col span={3} className={styles.priceCol}>
              <span className={styles.titleSpan}>Sub-Total (SGD)</span>
            </Col>
          )}
          {editModal && (
            <Col span={2} className={styles.operateCol}>
              <span className={styles.titleSpan}>Operation</span>
            </Col>
          )}
        </Row>
        {orderData &&
          orderData.map((orderDataItem, orderDataItemIndex) => {
            return (
              <OrderItemCollapse
                key={orderDataItem.themePark}
                bookingCategory={orderDataItem.themePark}
                orderDataItemIndex={orderDataItemIndex}
                orderData={orderDataItem}
                editModal={editModal}
              />
            );
          })}
      </div>
    );
  }
}

export default ShoppingCartOffer;
