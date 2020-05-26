import React from 'react';
import { DatePicker, Input, Select } from 'antd';
import styles from './RenderFilterProcessor.less';
import { DATE_FORMAT, EMPTY_ARR } from '@/pages/ReportCenter/consts/pamsReport';
import { FILTER_TYPE } from '@/pages/ReportCenter/PamsReport/consts/filterType';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { INPUT, SELECT, MULTIPLE_SELECT, DATE_PICKER, RANGE_PICKER } = FILTER_TYPE;

const RenderFilterProcessor = _filter => {
  const { filterType, filterName, options = EMPTY_ARR } = _filter;

  const filterMap = {
    [INPUT]: <Input placeholder={filterName} allowClear />,
    [SELECT]: (
      <Select optionFilterProp="children" showSearch allowClear placeholder={filterName}>
        {options.map(({ value, text }) => (
          <Option key={value} value={value}>
            {text}
          </Option>
        ))}
      </Select>
    ),
    [MULTIPLE_SELECT]: (
      <Select
        optionFilterProp="children"
        allowClear
        mode="multiple"
        className={styles.multipleSelect}
        placeholder={filterName}
      >
        {options.map(({ value, text }) => (
          <Option key={value} value={value}>
            {text}
          </Option>
        ))}
      </Select>
    ),
    [DATE_PICKER]: (
      <DatePicker style={{ width: '100%' }} placeholder={filterName} format={DATE_FORMAT} />
    ),
    [RANGE_PICKER]: (
      <RangePicker
        placeholder={[`${filterName} From`, `${filterName} To`]}
        style={{ width: '100%' }}
        format={DATE_FORMAT}
      />
    ),
  };

  return filterMap[filterType];
};

export default RenderFilterProcessor;
