import React, { useRef } from 'react';
import FilterBanner from '@/pages/ReportCenter/PamsReport/components/FilterBanner';
import { EMPTY_ARR } from '@/pages/ReportCenter/consts/pamsReport';
import RenderFilterProcessor from '@/pages/ReportCenter/PamsReport/utils/Processor/Render/RenderFilterProcessor';
import RenderExtraFilterProcessor from '@/pages/ReportCenter/PamsReport/utils/Processor/Render/RenderExtraFilterProcessor';
import useCustomerGroupList from '@/pages/ReportCenter/PamsReport/hooks/useCustomerGroupList';

const BasicFilterBanner = ({
  handleSearch,
  handleReset,
  adhocReports: {
    filterList = EMPTY_ARR,
    categoryTypeList = EMPTY_ARR,
    customerGroupMap = EMPTY_ARR,
  },
}) => {
  const formRef = useRef();
  const [customerGroupList, setCustomerGroupListByCategoryType] = useCustomerGroupList(
    customerGroupMap
  );

  const store = {
    categoryType: { categoryTypeList, setCustomerGroupListByCategoryType },
    customerGroup: { customerGroupList },
    form: (formRef && formRef.current && formRef.current.form) || {},
  };

  const filterItems = filterList
    .map(filter => {
      const { filterKey, filterName } = filter;
      return {
        name: filterKey,
        text: filterName,
        WrappedComponent:
          RenderExtraFilterProcessor(store, filter) || RenderFilterProcessor(filter),
      };
    })
    .filter(({ WrappedComponent }) => {
      return !!WrappedComponent;
    });

  return (
    <>
      <FilterBanner
        formRef={formRef}
        filterItems={filterItems}
        handleSearch={handleSearch}
        handleReset={handleReset}
        showCardBoarder={false}
      />
    </>
  );
};

export default BasicFilterBanner;
