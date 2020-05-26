import React from 'react';
import { Badge, Button, Card, Col, Icon, Row, Tooltip } from 'antd';
import MediaQuery from 'react-responsive';
import styles from './index.less';
import SCREEN from '@/utils/screen';

const ReportCard = ({
  reportName,
  reportType,
  updateDate,
  color,
  onClick,
  onDownload,
  updateTime,
}) => {
  const updateDateText = `Update Date ${updateDate || ''}`;

  return (
    <div className={styles.card}>
      <Card hoverable>
        <div className={styles.border} style={{ borderLeft: `6px solid ${color}` }}>
          <Row className={styles.top} onClick={() => onClick(reportType)}>
            <Col span={24}>
              <span className={styles.reportName}>{reportName}</span>
            </Col>
          </Row>
          <Row type="flex" justify="space-between" className={styles.bottom}>
            <Col span={20}>
              <Tooltip title={updateDateText}>
                <div className={styles.ellipsis}>
                  <Badge status="success" color={color} />
                  {updateDateText}
                </div>
              </Tooltip>
            </Col>
            <Col span={4}>
              <MediaQuery minWidth={SCREEN.screenSm}>
                <div className={styles.download} style={{ float: 'right' }}>
                  <Button
                    className={styles.noBorder}
                    onClick={() => onDownload(reportType, updateTime)}
                    size="small"
                  >
                    <Icon type="download" />
                  </Button>
                </div>
              </MediaQuery>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default ReportCard;
