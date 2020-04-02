import React from 'react';
import {Button, Icon} from "antd";
import { formatMessage } from 'umi/locale';
import styles from './index.less';

class MyOrderButton extends React.PureComponent {

  render() {

    const {
      tipVisible,
      tipString,
      orderAmount,
      onClickOrder
    } = this.props;

    return (
      <div className={styles.orderTitleStyles}>
        <div className={styles.orderTitleTipStyles}>
          {tipVisible && tipString}
        </div>
        <div className={styles.orderTitleButtonStyles}>
          <Button type="primary" onClick={() => onClickOrder()}>
            <Icon style={{ fontSize: 17 }} type="shopping-cart" /> {formatMessage({ id: 'MY_ORDER' })}
            <span className={styles.orderAmount}>{orderAmount}</span>
          </Button>
        </div>
      </div>
    )

  }

}

MyOrderButton.defaultProps = {
  tipVisible: false,
  tipString: '',
  orderAmount: 0,
};

export default MyOrderButton;
