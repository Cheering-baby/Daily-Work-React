import React, { Component } from 'react';
import { Icon, Collapse, Form } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import styles from '../../index.less';
import OrderItemCollapse from './components/OrderItemCollapse';

@Form.create()
@connect(({ ticketBookingAndPayMgr }) => ({
  ticketBookingAndPayMgr,
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
      ticketBookingAndPayMgr: { onceAPirateOrderData = [] },
      form,
      form: { getFieldDecorator },
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
          header={<span className={styles.collapsePanelHeaderStyles}>Once A Pirate</span>}
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
              />
            );
          })}
        </Collapse.Panel>
      </Collapse>
    );
  }
}

export default OnceAPirateCollapse;
