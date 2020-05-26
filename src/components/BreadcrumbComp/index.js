import React, { Component } from 'react';
import { Breadcrumb, Tooltip } from 'antd';
import NavLink from 'umi/navlink';
import { isNvl, isString } from '../../utils/utils';
import styles from './index.less';

class BreadcrumbComp extends Component {
  breadcrumbNameDeal = name => {
    if (!isNvl(name)) {
      // const len = name.length;
      // if (len > 20) {
      //   const start = name.substr(0, 5);
      //   const end = name.substr(-5);
      //   return `${start}...${end}`;
      // }
      return name;
    }
    return null;
  };

  getPath = breadcrumbArr =>
    breadcrumbArr.map((item, index) => {
      if (isString(item)) {
        return index === breadcrumbArr.length - 1 ? (
          <Breadcrumb.Item className={styles.boldBreadcrumb} key={`breadcrumb${item.key}`}>
            <Tooltip title={item}>{this.breadcrumbNameDeal(item)}</Tooltip>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item className={styles.normalBreadcrumb} key={`breadcrumb${item.key}`}>
            <Tooltip title={item}>{this.breadcrumbNameDeal(item)}</Tooltip>
          </Breadcrumb.Item>
        );
      }
      if (index === breadcrumbArr.length - 1) {
        return (
          <Breadcrumb.Item className={styles.boldBreadcrumb} key={`breadcrumb${item.key}`}>
            <Tooltip title={item.breadcrumbName}>
              {this.breadcrumbNameDeal(item.breadcrumbName)}
            </Tooltip>
          </Breadcrumb.Item>
        );
      }
      if (!isNvl(item.url)) {
        return (
          <Breadcrumb.Item className={styles.normalBreadcrumb} key={`breadcrumb${item.key}`}>
            <NavLink to={`${item.url}`}>
              <Tooltip title={item.breadcrumbName}>
                {this.breadcrumbNameDeal(item.breadcrumbName)}
              </Tooltip>
            </NavLink>
          </Breadcrumb.Item>
        );
      }
      return (
        <Breadcrumb.Item className={styles.normalBreadcrumb} key={`breadcrumb${item.key}`}>
          <Tooltip title={item.breadcrumbName}>
            {this.breadcrumbNameDeal(item.breadcrumbName)}
          </Tooltip>
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
