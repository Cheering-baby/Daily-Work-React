import React, { PureComponent } from 'react';
import { Icon, Tooltip } from 'antd';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';
import LeftContent from './LeftContent';

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  render() {
    const { collapsed } = this.props;
    return (
      <div className={styles.header}>
        <Tooltip
          placement="bottomRight"
          arrowPointAtCenter
          overlayClassName={styles.tooltipMgTop}
          title={collapsed ? 'Maximise Menu' : 'Minimise Menu'}
        >
          <Icon
            className={styles.trigger}
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={this.toggle}
          />
        </Tooltip>
        <LeftContent {...this.props} />

        <RightContent {...this.props} />
      </div>
    );
  }
}
