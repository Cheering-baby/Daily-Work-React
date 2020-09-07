import React from 'react';
import { Drawer, Row, Col, Form, Icon } from 'antd';
import styles from './index.less';
import useMobileDetector from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/hooks/useMobileDetector';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
  colon: false,
  labelAlign: 'left',
};

const ScheduleDetailForm = ({ formItems }) => {
  return (
    <>
      <div className={styles.form}>
        {formItems.map(
          ({ label, texts = [], type }) =>
            type !== 'filter' && (
              <Col span={24} key={label}>
                <Form.Item {...formItemLayout} label={label} style={{ marginBottom: '-15px' }}>
                  <ul className={styles.ul}>
                    {texts &&
                      texts.length > 0 &&
                      texts.map(item => (
                        <li className={styles.text} key={item}>
                          {item || <Icon type="minus" />}
                        </li>
                      ))}
                  </ul>
                </Form.Item>
              </Col>
            )
        )}
      </div>
    </>
  );
};

const ScheduleTaskDetailDrawer = ({
  visible,
  setVisible,
  reportType = '',
  detailFormItems = [],
}) => {
  const [isMobile] = useMobileDetector(window.innerWidth);
  return (
    <div>
      <Drawer
        destroyOnClose
        className={styles.drawer}
        title={<span className={styles.title}>{reportType.toUpperCase()}</span>}
        placement="right"
        closable
        maskClosable={false}
        onClose={() => setVisible(false)}
        visible={visible}
        width={isMobile ? window.innerWidth - 40 : 520}
      >
        <Row style={{ padding: '16px 24px' }}>
          <Row style={{ marginBottom: 5 }}>
            <span className={styles.title}>SCHEDULE DETAILS</span>
          </Row>
          <Row>
            <ScheduleDetailForm formItems={detailFormItems} />
          </Row>
        </Row>
      </Drawer>
    </div>
  );
};

export default ScheduleTaskDetailDrawer;
