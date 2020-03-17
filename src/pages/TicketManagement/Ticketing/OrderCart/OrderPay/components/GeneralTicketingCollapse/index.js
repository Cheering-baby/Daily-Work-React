import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { Icon, Card, Checkbox, Collapse, Form, Button } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import SCREEN from '@/utils/screen';
import styles from '../../index.less';
import OrderItemCollapse from './components/OrderItemCollapse';
import ToCart from '@/pages/TicketManagement/Ticketing/CreateOrder/components/AttractionToCart';

@Form.create()
@connect(({ global, ticketBookingAndPayMgr }) => ({
  global, ticketBookingAndPayMgr,
}))
class GeneralTicketingCollapse extends Component {
  constructor(props) {
    super(props);
  }

  operateButtonEvent = (opType, orderIndex, offerIndex) => {
    if (opType === 'detail' && offerIndex !== null) {
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
        {generalTicketOrderData.map((orderData, orderIndex) => (
          <Collapse.Panel
            className={styles.collapsePanelStyles}
            key={`${orderData.themeParkCode}_${orderIndex}`}
            header={
              <span className={styles.collapsePanelHeaderStyles}>{orderData.themeParkName}</span>
            }
          >
            <OrderItemCollapse
              form={form}
              orderIndex={orderIndex}
              orderData={orderData}
              operateButtonEvent={(opType, orderIndex, onceAPirateOrder) => {
                this.operateButtonEvent(opType, orderIndex, onceAPirateOrder);
              }}
              companyType={companyType}
            />
          </Collapse.Panel>
        ))}
      </Collapse>
    );
  }
}

export default GeneralTicketingCollapse;
