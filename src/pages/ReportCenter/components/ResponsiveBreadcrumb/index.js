import React from 'react';
import { Breadcrumb } from 'antd';
import styles from './index.less';

const ResponsiveBreadcrumb = props => {
  const { routers = [] } = props;
  return (
    <>
      <Breadcrumb separator=">" style={{ marginBottom: 10 }}>
        {routers.map((e, index) => {
          const { name, href } = e;
          return (
            <Breadcrumb.Item
              key={`breadcrumb_${name}`}
              className={`${styles.BreadcrumbFontStyles} ${
                index === routers.length - 1 ? styles.BreadcrumbBold : styles.kpiBreadcrumb
              }`}
            >
              {href ? <a href={href}>{name}</a> : <React.Fragment>{name}</React.Fragment>}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    </>
  );
};

export default ResponsiveBreadcrumb;
