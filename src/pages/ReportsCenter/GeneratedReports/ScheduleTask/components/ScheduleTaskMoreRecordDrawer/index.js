import React, { useState } from 'react';
import { Drawer } from 'antd';
import ScheduleTaskRecordCard from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/components/ScheduleTaskRecordCard';
import useMobileDetector from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/hooks/useMobileDetector';
import styles from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/components/ScheduleTaskDetailDrawer/index.less';

const ScheduleTaskMoreRecordDrawer = ({
  recordList,
  createDate = '-',
  visible = false,
  setVisible,
  operation,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [isMobile] = useMobileDetector(window.innerWidth);
  return (
    <div className={styles.drawer}>
      <Drawer
        destroyOnClose
        className={styles.drawer}
        title={<span className={styles.title}>{createDate.toUpperCase()}</span>}
        placement="right"
        closable
        maskClosable={false}
        onClose={() => {
          setVisible(false);
        }}
        visible={visible}
        width={isMobile ? window.innerWidth - 40 : 520}
      >
        <div style={{ padding: 10 }}>
          {recordList.map((task, index) => {
            return (
              <div key={task.jobLogCode} onClick={() => setSelectedIndex(index)}>
                <ScheduleTaskRecordCard
                  isDrawer
                  selected={selectedIndex === index}
                  task={task}
                  operation={operation}
                />
              </div>
            );
          })}
        </div>
      </Drawer>
    </div>
  );
};

export default ScheduleTaskMoreRecordDrawer;
