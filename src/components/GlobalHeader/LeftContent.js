import React, { PureComponent } from 'react';
import { Icon, Spin, Tooltip } from 'antd';
import styles from './index.less';

export default class GlobalHeaderLeft extends PureComponent {
  reload = () => {
    window.location.reload();
  };

  render() {
    const { currentUser } = this.props;
    return currentUser ? (
      <span className={styles.left}>
        <Tooltip
          placement="bottomRight"
          overlayClassName={styles.tooltipMgTop}
          arrowPointAtCenter
          title="Refresh Page"
        >
          <Icon className={styles.icon} type="reload" onClick={this.reload} />
        </Tooltip>
      </span>
    ) : (
      <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
    );
  }
}
