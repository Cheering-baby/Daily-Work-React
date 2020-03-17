import React, { Component } from 'react';
import { Icon, Collapse, Form } from 'antd';
import { connect } from 'dva';
import styles from '../../index.less';
import OrderItemCollapse from './components/OrderItemCollapse';
import ToCart from '@/pages/TicketManagement/Ticketing/CreateOrder/components/AttractionToCart';
import { arrToString, calculateTicketPrice } from '@/pages/TicketManagement/utils/utils';

@Form.create()
@connect(({ global, ticketBookingAndPayMgr }) => ({
  global, ticketBookingAndPayMgr,
}))
class PackageTicketingCollapse extends Component {

  constructor(props) {
    super(props);
  }

  operateButtonEvent = (opType, orderIndex, offerIndex ) => {
    if (opType === 'detail' && offerIndex !== null) {
      console.log('detail');
    }
  };

  render() {

    const {
      global: {
        userCompanyInfo: { companyType },
      },
      ticketBookingAndPayMgr: {
        packageOrderData = [],
      },
      form,
    } = this.props;

    return (
      <Collapse
        bordered={false}
        defaultActiveKey={['PackageCollapsePanel']}
        expandIcon={({ isActive }) =>
          <Icon
            style={{ color: '#FFF', right: 15, textAlign: 'right' }}
            type='up'
            rotate={isActive ? 0 : 180}
          />}
      >
        <Collapse.Panel
          className={styles.collapsePanelStyles}
          key='PackageCollapsePanel'
          header={<span className={styles.collapsePanelHeaderStyles}>Attraction Package</span>}
        >
          {
            packageOrderData.map((orderData,orderIndex)=>(
              <OrderItemCollapse
                key={`PackageOrderItemCollapse_${orderIndex}`}
                form = {form}
                orderIndex = {orderIndex}
                orderData = {orderData}
                operateButtonEvent={(opType, orderIndex, onceAPirateOrder) => {
                  this.operateButtonEvent(opType, orderIndex, onceAPirateOrder);
                }}
                companyType={companyType}
              />
            ))
          }
        </Collapse.Panel>
      </Collapse>
    );

  }

}

export default PackageTicketingCollapse;
