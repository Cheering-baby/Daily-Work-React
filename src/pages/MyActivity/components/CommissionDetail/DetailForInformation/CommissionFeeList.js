import React from 'react';
import { Card, Col, Row } from 'antd';
import styles from '../index.less';
import {colLayOut, rowLayOut} from "../../constants";

class CommissionFeeList extends React.PureComponent {
  render() {
    const { tieredList } = this.props;
    return (
      <React.Fragment>
        <Row {...rowLayOut}>
          <Col span={24}>
            <span className={styles.titleHeader}>COMMISSION FEE LIST</span>
          </Col>
        </Row>
        {tieredList &&
          tieredList.map(step => (
            <Row {...rowLayOut} className={styles.contentDetail}>
              <Col {...colLayOut} className={styles.colStyle}>
                <div className={styles.detailLabelStyle}>
                  <span>
                    {step.maxmum
                      ? `${step.minimum}~${step.maxmum}`
                      : `${step.minimum}-`}
                  </span>
                </div>
                <div className={styles.detailLeftStyle} style={{ marginBottom: '8px' }}>
                  <span>
                     {+step.amountFee >= 0 ? `$ ${+step.amountFee}` : '-'}
                  </span>
                </div>
              </Col>
            </Row>
        ))}
      </React.Fragment>
    );
  }
}
export default CommissionFeeList;
