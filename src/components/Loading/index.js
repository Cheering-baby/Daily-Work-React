import React from 'react';
import { Spin } from 'antd';
import * as styles from './index.less';

// 加载中组件
function Loading(props) {
  const { loading, children, size = 'large', tip = 'Loading...' } = props;
  return (
    <Spin spinning={loading} tip={tip} size={size} className={styles.activityLoading}>
      {children}
    </Spin>
  );
}

export default Loading;
