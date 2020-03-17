import React, { Component } from 'react';
import { Icon, Collapse, Form } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import styles from '../../index.less';
import OrderItemCollapse from './components/OrderItemCollapse';

@Form.create()
@connect(({ global, ticketBookingAndPayMgr }) => ({
  global, ticketBookingAndPayMgr,
}))
class OnceAPirateCollapse extends Component {

  constructor(props) {
    super(props);
  }

  operateButtonEvent = (opType, orderIndex, onceAPirateOrder) => {
    if (opType === 'detail' && orderIndex !== null) {
    }
  };

  render() {
    const {
      global: {
        userCompanyInfo: { companyType },
      },
      ticketBookingAndPayMgr: { onceAPirateOrderData = [] },
      form,
    } = this.props;

    return (
      <Collapse
        bordered={false}
        defaultActiveKey={['OnceAPirateCollapsePanel']}
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
          key="OnceAPirateCollapsePanel"
          header={<span className={styles.collapsePanelHeaderStyles}>ONCE A PIRATE</span>}
        >
          {onceAPirateOrderData.map((onceAPirateOrder, orderIndex) => {
            return (
              <OrderItemCollapse
                key={`OrderItemCollapse_${orderIndex}`}
                form={form}
                orderIndex={orderIndex}
                onceAPirateOrder={onceAPirateOrder}
                operateButtonEvent={(opType, orderIndex, onceAPirateOrder) => {
                  this.operateButtonEvent(opType, orderIndex, onceAPirateOrder);
                }}
                companyType={companyType}
              />
            );
          })}
        </Collapse.Panel>
      </Collapse>
    );
  }
}

export default OnceAPirateCollapse;
