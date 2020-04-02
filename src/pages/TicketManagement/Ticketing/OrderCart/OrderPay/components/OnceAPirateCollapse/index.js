import React, {Component} from 'react';
import {Collapse, Form, Icon} from 'antd';
import {connect} from 'dva';
import styles from '../../index.less';
import OrderItemCollapse from './components/OrderItemCollapse';

@Form.create()
@connect(({ global, ticketBookingAndPayMgr }) => ({
  global,
  ticketBookingAndPayMgr,
}))
class OnceAPirateCollapse extends Component {
  operateButtonEvent = (opType, orderIndex, onceAPirateOrder) => {
    if (opType === 'detail' && orderIndex !== null) {
      console.log(onceAPirateOrder);
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
          header={<span className={styles.collapsePanelHeaderStyles}>Once A Pirate</span>}
        >
          {onceAPirateOrderData.map((onceAPirateOrder, orderIndex) => {
            return (
              <OrderItemCollapse
                key={`OrderItemCollapse_${Math.random()}`}
                form={form}
                orderIndex={orderIndex}
                onceAPirateOrder={onceAPirateOrder}
                operateButtonEvent={(opType, orderIndexParam, onceAPirateOrderParam) => {
                  this.operateButtonEvent(opType, orderIndexParam, onceAPirateOrderParam);
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
