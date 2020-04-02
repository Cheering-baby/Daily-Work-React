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
class PackageTicketingCollapse extends Component {
  operateButtonEvent = (opType, orderIndex, offerIndex) => {
    if (opType === 'detail' && offerIndex !== null) {
      // console.log('detail');
    }
  };

  render() {
    const {
      global: {
        userCompanyInfo: { companyType },
      },
      ticketBookingAndPayMgr: { packageOrderData = [] },
      form,
    } = this.props;

    return (
      <Collapse
        bordered={false}
        defaultActiveKey={['PackageCollapsePanel']}
        expandIcon={({ isActive }) => (
          <Icon
            style={{ color: '#FFF', right: 15, textAlign: 'right' }}
            type="up"
            rotate={isActive ? 0 : 180}
          />
        )}
      >
        <Collapse.Panel
          className={styles.collapsePanelStyles}
          key="PackageCollapsePanel"
          header={<span className={styles.collapsePanelHeaderStyles}>Attraction Package</span>}
        >
          {packageOrderData.map((orderData, orderIndex) => (
            <OrderItemCollapse
              key={`PackageOrderItemCollapse_${Math.random()}`}
              form={form}
              orderIndex={orderIndex}
              orderData={orderData}
              operateButtonEvent={(opType, orderIndexParam, onceAPirateOrder) => {
                this.operateButtonEvent(opType, orderIndexParam, onceAPirateOrder);
              }}
              companyType={companyType}
            />
          ))}
        </Collapse.Panel>
      </Collapse>
    );
  }
}

export default PackageTicketingCollapse;
