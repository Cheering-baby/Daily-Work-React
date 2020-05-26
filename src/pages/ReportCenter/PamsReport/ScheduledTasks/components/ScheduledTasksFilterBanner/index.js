import React, { useState } from 'react';
import { Input, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import FilterBanner from '@/pages/ReportCenter/PamsReport/components/FilterBanner';
import SelectReceiverModal from '@/pages/ReportCenter/PamsReport/ScheduledTasks/components/SelectReceiverModal';
import styles from './index.less';

const { Option } = Select;

const ScheduledTasksFilterBanner = props => {
  const {
    dispatch,
    handleSearch,
    handleReset,
    scheduledTasks: { selectedReceivers },
  } = props;

  const [receiverModalVisible, setReceiverModalVisible] = useState(false);
  const selectedItems = selectedReceivers.map(item => item.userCode);

  const ReceiverSelect = ({ onChange }) => {
    const handleChange = changedValue => {
      onChange(changedValue);
      const tempArr = selectedReceivers.filter(item => changedValue.includes(item.userCode));
      dispatch({
        type: 'scheduledTasks/updateState',
        payload: { selectedReceivers: tempArr },
      });
    };

    return (
      <div onClick={() => setReceiverModalVisible(true)}>
        <Select
          allowClear
          placeholder={formatMessage({ id: 'RECEIVER' })}
          mode="multiple"
          open={false}
          onChange={handleChange}
          value={selectedItems}
          className={styles.multipleSelect}
        >
          {selectedReceivers.map(item => (
            <Option key={item.userCode} value={item.userCode}>
              {item.userCode}
            </Option>
          ))}
        </Select>
      </div>
    );
  };

  const filterItems = [
    {
      key: '1',
      name: 'reportName',
      text: 'Report Name',
      WrappedComponent: <Input placeholder={formatMessage({ id: 'REPORT_NAME' })} allowClear />,
    },
    {
      key: '2',
      name: 'receiver',
      text: 'Receiver',
      WrappedComponent: <ReceiverSelect />,
    },
  ];

  return (
    <>
      <FilterBanner
        filterItems={filterItems}
        handleSearch={handleSearch}
        handleReset={handleReset}
      />
      <SelectReceiverModal
        {...props}
        visible={receiverModalVisible}
        setVisible={setReceiverModalVisible}
      />
    </>
  );
};

export default ScheduledTasksFilterBanner;
