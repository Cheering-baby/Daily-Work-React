import { Select } from 'antd';
import React from 'react';
import { EXTRA_FILTER_TYPE } from '@/pages/ReportCenter/PamsReport/consts/filterType';
import styles from './RenderFilterProcessor.less';

const { Option } = Select;
const {
  SELECT_CATEGORY_TYPE,
  MULTIPLE_SELECT_CUSTOMER_GROUP,
} = EXTRA_FILTER_TYPE;

const renderCategoryTypeSelect = (store, filter) => {
  const { filterName } = filter;
  const {
    form: { setFieldsValue },
    categoryType: { categoryTypeList = [], setCustomerGroupListByCategoryType },
  } = store;
  return (
    <Select
      optionFilterProp="children"
      showSearch
      allowClear
      placeholder={`${filterName}`}
      onChange={val => {
        setCustomerGroupListByCategoryType(val);
        setFieldsValue({ customerGroup: undefined });
      }}
    >
      {categoryTypeList.map(({ value, text }) => (
        <Option key={value} value={value}>
          {text}
        </Option>
      ))}
    </Select>
  );
};

const renderCustomerGroupMultipleSelect = (store, filter) => {
  const { filterName } = filter;
  const {
    customerGroup: { customerGroupList = [] },
  } = store;
  return (
    <Select
      optionFilterProp="children"
      allowClear
      mode="multiple"
      className={styles.multipleSelect}
      placeholder={`${filterName}`}
    >
      {customerGroupList.map(({ value, text }) => (
        <Option key={value} value={value}>
          {text}
        </Option>
      ))}
    </Select>
  );
};

const BaseProcessor = {
  [SELECT_CATEGORY_TYPE]: renderCategoryTypeSelect,
  [MULTIPLE_SELECT_CUSTOMER_GROUP]: renderCustomerGroupMultipleSelect,
};

const RenderExtraFilterProcessor = (store, filter) => {
  const { filterKey, filterType } = filter;
  const baseProcessor = BaseProcessor[`${filterType}_${filterKey}`];
  if (!baseProcessor) return null;
  return baseProcessor(store, filter);
};

export default RenderExtraFilterProcessor;
