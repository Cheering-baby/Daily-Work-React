import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { Icon, Card, Checkbox, Collapse, Form, Button } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import SCREEN from '@/utils/screen';
import styles from '../../index.less';
import OrderItemCollapse from './components/OrderItemCollapse';

class GeneralTicketingCollapse extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    const {
      onceAPirateOrderData = [],
      form,
      form: { getFieldDecorator }
    } = this.props;

    return (
      <Collapse
        bordered={false}
        defaultActiveKey={['OnceAPirateCollapsePanel']}
        expandIcon={({ isActive }) =>
          <Icon
            style={{ color: '#FFF', right: 15, textAlign: 'right' }}
            type='up'
            rotate={isActive ? 0 : 180}
          />}
      >
        <Collapse.Panel
          className={styles.collapsePanelStyles}
          key='OnceAPirateCollapsePanel'
          header={<span className={styles.collapsePanelHeaderStyles}>Universal Studios Singapore</span>}
        >
          {
            onceAPirateOrderData.map((onceAPirateOrder,orderIndex)=>{
              const {offerList} = onceAPirateOrder;
            })
          }
          <OrderItemCollapse
            form = {form}
          />
        </Collapse.Panel>
      </Collapse>
    );

  }

}

export default GeneralTicketingCollapse;
