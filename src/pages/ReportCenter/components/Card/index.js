import React from 'react';
import { Icon } from 'antd';
import styles from './index.less';

class Card extends React.Component {
  render() {
    const { className, height, title, type, rightContent, children } = this.props;
    return (
      <div className={`${styles.card} ${className}`} style={{ height }}>
        <div className={styles.cardBody}>
          <div className={styles.cardTitle}>{title}</div>
          {type && (
            <div className={styles.cardIcon}>
              <Icon type={type} />
            </div>
          )}
          <a className={styles.rightContent} onClick={this.showModal}>
            {rightContent}
          </a>
          {children}
        </div>
      </div>
    );
  }
}

export default Card;
