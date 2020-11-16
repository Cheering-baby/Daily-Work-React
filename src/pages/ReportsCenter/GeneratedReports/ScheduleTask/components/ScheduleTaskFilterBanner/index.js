import React from 'react';
import { DatePicker, Select, Spin } from 'antd';
import FilterBanner from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/components/FilterBanner';
import useFilterProps from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/hooks/useFilterProps';
import {
  DATE_FORMAT,
  EMPTY_ARR,
  PAGE_SIZE,
} from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/consts/common';
import styles from './index.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ScheduleTaskFilterBanner = props => {
  const {
    dispatch,
    fetchDataList,
    fetchReportNameListDataLoadingFlag = false,
    scheduleTask: {
      reportTypeOptions = EMPTY_ARR,
      cronTypeOptions = EMPTY_ARR,
      statusOptions = EMPTY_ARR,
      reportNameOptions = EMPTY_ARR,
    },
  } = props;

  let timeout;
  const onSearch = value => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (!value || value === '') {
      return;
    }
    timeout = setTimeout(() => {
      dispatch({
        type: 'scheduleTask/updateState',
        payload: { reportNameOptions: [] },
      });
      dispatch({
        type: 'scheduleTask/fetchReportNameListData',
        payload: {
          scheduleDesc: value ? value.trim() : '',
          reportTypes: reportTypeOptions
            ? reportTypeOptions.map(item => item.value).join(',')
            : undefined,
        },
      });
    }, 300);
  };

  const filterItems = [
    {
      name: 'reportName',
      text: 'Schedule Report Name',
      WrappedComponent: (
        <Select
          placeholder="Search Scheduled Report Name"
          allowClear
          showSearch
          showArrow={false}
          onSearch={onSearch}
          filterOption={false}
          defaultActiveFirstOption={false}
          loading={fetchReportNameListDataLoadingFlag}
          notFoundContent={fetchReportNameListDataLoadingFlag ? <Spin size="small" /> : null}
          dropdownClassName={styles.reportNameSelect}
        >
          {reportNameOptions.map(item => (
            <Option key={item.value} value={item.value}>
              {item.text}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      name: 'reportType',
      text: 'Report Type',
      WrappedComponent: (
        <Select placeholder="Report Type" allowClear dropdownClassName={styles.reportNameSelect}>
          {reportTypeOptions.map(item => (
            <Option key={item.value} value={item.value}>
              {item.text}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      name: 'cronType',
      text: 'Report Frequency',
      WrappedComponent: (
        <Select placeholder="Report Frequency" allowClear mode="multiple">
          {cronTypeOptions.map(item => (
            <Option key={item.dictId} value={item.dictId}>
              {item.dictName}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      name: 'processDate',
      text: 'Modified Date Time',
      WrappedComponent: (
        <RangePicker
          allowClear
          placeholder={['Process Date Start', 'Process Date End']}
          style={{ width: '100%' }}
          format={DATE_FORMAT}
        />
      ),
    },
    {
      name: 'status',
      text: 'Status',
      WrappedComponent: (
        <Select placeholder="Status" allowClear>
          {statusOptions.map(item => (
            <Option key={item.dictId} value={item.dictId}>
              {item.dictName}
            </Option>
          ))}
        </Select>
      ),
    },
  ];

  const filterProps = useFilterProps(fetchDataList, PAGE_SIZE, 1);
  return (
    <>
      <FilterBanner filterItems={filterItems} {...filterProps} />
    </>
  );
};

export default ScheduleTaskFilterBanner;
