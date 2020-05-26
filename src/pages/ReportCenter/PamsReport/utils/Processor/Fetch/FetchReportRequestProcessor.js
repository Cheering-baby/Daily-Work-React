import { isEmpty } from 'lodash';
import { FILTER_TYPE } from '@/pages/ReportCenter/PamsReport/consts/filterType';

const transformInputVal = (key, value) => {
  if (!isEmpty(value)) return [{ key, value: value.trim() }];
};

const transformSelectVal = (key, value) => {
  if (!isEmpty(value)) return [{ key, value }];
};

const transformMultipleSelectVal = (key, value) => {
  if (!isEmpty(value) && value instanceof Array) return [{ key, value: value.join(',') }];
};

const transformDatePickerVal = (key, value) => {
  if (!isEmpty(value)) {
    return [
      {
        key: `${key}`,
        value: value.startOf('date').valueOf(),
      },
    ];
  }
};

const transformRangePickerVal = (key, value) => {
  if (!isEmpty(value)) {
    return [
      { key: `${key}From`, value: value[0].startOf('date').valueOf() },
      { key: `${key}To`, value: value[1].endOf('date').valueOf() },
    ];
  }
};

const BaseProcessor = {
  [FILTER_TYPE.INPUT]: transformInputVal,
  [FILTER_TYPE.SELECT]: transformSelectVal,
  [FILTER_TYPE.MULTIPLE_SELECT]: transformMultipleSelectVal,
  [FILTER_TYPE.DATE_PICKER]: transformDatePickerVal,
  [FILTER_TYPE.RANGE_PICKER]: transformRangePickerVal,
};

const transformVal = (filter, filterVal) => {
  const baseProcessor = BaseProcessor[filter.filterType];
  if (baseProcessor) return baseProcessor(filter.filterKey, filterVal);
  return [];
};

const transform2FilterList = (filterOptions, _filterList) => {
  if (isEmpty(_filterList)) return [];
  const filterList = [];
  _filterList.forEach(filter => {
    const filterVal = filterOptions[filter.filterKey];
    if (!isEmpty(filterVal)) {
      const params = transformVal(filter, filterVal);
      if (!isEmpty(params))
        params.forEach(param => {
          filterList.push(param);
        });
    }
  });
  return filterList;
};

// const transform2SortList = (sortOptions) => {
//   return [];
// };

const transform2ListReqParams = ({
  filterOptions = {},
  // sortOptions = {},
  currentPage,
  pageSize,
  filterList = [],
}) => {
  const { reportType } = filterOptions;
  return {
    reportType,
    filterList: transform2FilterList(filterOptions, filterList),
    // sortList: transform2SortList(sortOptions),
    pageInfo: {
      pageSize,
      currentPage,
    },
  };
};

const transform2DownloadReqParams = ({ filterOptions = {}, filterList = [] }) => {
  const { reportType } = filterOptions;
  return {
    reportType,
    filterList: transform2FilterList(filterOptions, filterList),
    fileSuffixType: 'xlsx',
  };
};

export default {
  transform2ListReqParams,
  transform2DownloadReqParams,
};
