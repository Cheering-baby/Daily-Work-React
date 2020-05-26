import React from 'react';
import { Card, Col } from 'antd';
import styles from './index.less';

const BasicCard = ({ colStyle = {}, cardOpt = {}, children = null }) => (
  <Col span={24} className={styles.basicCard} style={{ ...colStyle }}>
    <Card {...cardOpt}>{children}</Card>
  </Col>
);

export default BasicCard;
