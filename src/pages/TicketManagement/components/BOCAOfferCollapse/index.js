import React from 'react';
import { Icon, Collapse } from 'antd';
import styles from './index.less';
import OrderItemCollapse from './components/OrderItemCollapse';

class BOCAOfferCollapse extends React.PureComponent {

  render() {
    const { companyType = '01', quantity = 0, pricePax = 0 } = this.props;

    return (
      <Collapse
        bordered={false}
        defaultActiveKey={['BOCAOfferCollapsePanel']}
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
          key="BOCAOfferCollapsePanel"
          header={<span className={styles.collapsePanelHeaderStyles}>ADDITIONAL INFORMATION</span>}
        >
          <OrderItemCollapse
            key="BOCAOfferCollapse"
            companyType={companyType}
            quantity={quantity}
            pricePax={pricePax}
          />
        </Collapse.Panel>
      </Collapse>
    );
  }
}

export default BOCAOfferCollapse;
