import React, { Component } from 'react';
import { Collapse, Form, Icon } from 'antd';
import { connect } from 'dva';
import styles from '../../index.less';
import OrderItemCollapse from './components/OrderItemCollapse';

@Form.create()
@connect(({ global, ticketBookingAndPayMgr }) => ({
  global,
  ticketBookingAndPayMgr,
}))
class GeneralTicketingCollapse extends Component {
  operateButtonEvent = (opType, orderIndex, offerIndex) => {
    if (opType === 'detail' && offerIndex !== null) {
      console.log('');
    }
  };

  getActiveKeyList = () => {
    const {
      ticketBookingAndPayMgr: { generalTicketOrderData = [] },
    } = this.props;
    const activeKeyList = generalTicketOrderData.map((orderData, orderIndex) => {
      return `${orderData.themeParkCode}_${orderIndex}`;
    });
    return activeKeyList;
  };

  render() {
    const {
      global: {
        userCompanyInfo: { companyType },
      },
      ticketBookingAndPayMgr: { generalTicketOrderData = [] },
      form,
    } = this.props;

    const activeKeyList = this.getActiveKeyList();

    return (
      <Collapse
        bordered={false}
        defaultActiveKey={activeKeyList}
        expandIcon={({ isActive }) => (
          <Icon
            style={{ color: '#FFF', right: 15, textAlign: 'right' }}
            type="up"
            rotate={isActive ? 0 : 180}
          />
        )}
      >
        {generalTicketOrderData.map((orderData, orderIndex) => {
          const keyV = `${orderData.themeParkCode}_${orderIndex}`;
          return (
            <Collapse.Panel
              className={styles.collapsePanelStyles}
              key={keyV}
              header={
                <span className={styles.collapsePanelHeaderStyles}>{orderData.themeParkName}</span>
              }
            >
              <OrderItemCollapse
                form={form}
                orderIndex={orderIndex}
                orderData={orderData}
                operateButtonEvent={(opType, orderIndexParam, onceAPirateOrder) => {
                  this.operateButtonEvent(opType, orderIndexParam, onceAPirateOrder);
                }}
                companyType={companyType}
              />
            </Collapse.Panel>
          );
        })}
      </Collapse>
    );
  }
}

export default GeneralTicketingCollapse;
