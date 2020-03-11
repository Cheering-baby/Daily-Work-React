import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import styles from './index.less';

class BreadcrumbComp extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    const { title = [] } = this.props;

    return (
      <div>
        <Breadcrumb separator=">" style={{ marginBottom: 10 }}>
          {title.map((e, index) => {
            const { name, href } = e;
            return (
              <Breadcrumb.Item
                key={`breadcrumb_${name}`}
                className={`${styles.BreadcrumbFontStyles} ${index === title.length - 1 ? styles.BreadcrumbBold : styles.kpiBreadcrumb}`}
              >
                {href ? <a href={href}>{name}</a> : <React.Fragment>{name}</React.Fragment>}
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
      </div>
    );
  }
}

export default BreadcrumbComp;
