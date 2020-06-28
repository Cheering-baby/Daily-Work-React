import React, { PureComponent } from 'react';
import { Icon as MobileIcon, NavBar } from 'antd-mobile';
import Notification from '../Notification';

class PageHeader extends PureComponent {
  render() {
    const { children, hideNotification, noShowLeft, onLeftClick } = this.props;
    let { rightContent } = this.props;
    const defaultProps = {
      mode: 'light',
      rightContent: [],
    };
    if (!noShowLeft) {
      defaultProps.icon = <MobileIcon type="left" />;
      defaultProps.onLeftClick = () => window.history.go(-1);
    }
    if (!noShowLeft && onLeftClick) {
      defaultProps.onLeftClick = () => onLeftClick();
    }
    if (!rightContent) {
      rightContent = [];
    }
    if (!hideNotification) {
      rightContent.unshift(<Notification key="0" isPageHeader />);
    }
    return (
      <NavBar
        {...defaultProps}
        {...this.props}
        rightContent={rightContent}
        style={{
          position: 'fixed',
          width: '100%',
          zIndex: '500',
          top: '0px',
          left: '0px',
          height: '56px',
        }}
      >
        {children}
      </NavBar>
    );
  }
}

export default PageHeader;
