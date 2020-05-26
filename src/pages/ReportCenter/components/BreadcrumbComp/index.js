import React, { Component } from 'react';
import { Breadcrumb, Tooltip } from 'antd';
import NavLink from 'umi/navlink';
import { isNvl, isString } from '../../../../utils/utils';
import styles from './index.less';

class BreadcrumbComp extends Component {
  getPath = breadcrumbArr =>
    breadcrumbArr.map((item, index) => {
      if (isString(item)) {
        return index === breadcrumbArr.length - 1 ? (
          <Breadcrumb.Item className={styles.boldBreadcrumb} key={`breadcrumb${item.key}`}>
            <Tooltip title={item}>{item}</Tooltip>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item className={styles.normalBreadcrumb} key={`breadcrumb${item.key}`}>
            <Tooltip title={item}>{item}</Tooltip>
          </Breadcrumb.Item>
        );
      }
      if (index === breadcrumbArr.length - 1) {
        return (
          <Breadcrumb.Item className={styles.boldBreadcrumb} key={`breadcrumb${item.key}`}>
            <Tooltip title={item.breadcrumbName}>{item.breadcrumbName}</Tooltip>
          </Breadcrumb.Item>
        );
      }
      if (!isNvl(item.url)) {
        return (
          <Breadcrumb.Item className={styles.normalBreadcrumb} key={`breadcrumb${item.key}`}>
            <NavLink to={`${item.url}`}>
              <Tooltip title={item.breadcrumbName}>{item.breadcrumbName}</Tooltip>
            </NavLink>
          </Breadcrumb.Item>
        );
      }
      return (
        <Breadcrumb.Item className={styles.normalBreadcrumb} key={`breadcrumb${item.key}`}>
          <Tooltip title={item.breadcrumbName}>{item.breadcrumbName}</Tooltip>
        </Breadcrumb.Item>
      );
    });

  render() {
    const { breadcrumbArr = [] } = this.props;
    const extraBreadcrumbItems = this.getPath(breadcrumbArr);
    return (
      <Breadcrumb separator=">" style={{ lineHeight: '32px', verticalAlign: 'middle' }}>
        {extraBreadcrumbItems}
      </Breadcrumb>
    );
  }
}

export default BreadcrumbComp;
