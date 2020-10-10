import moment from 'moment';
import { FILTER_TYPE } from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/consts/filterType';
import {
  DATE_FORMAT,
  PAGE_SIZE,
} from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/consts/common';

const sortMap = {
  scheduleReportName: 'schedule_desc',
  reportsName: 'task_name',
  reportType: 'report_type',
  cronType: 'report_frequency',
  updateBy: 'update_by',
  modifiedDateTime: 'update_time',
  generationDateTime: 'expect_time',
  status: 'status',
};

const sortValueMap = {
  ascend: 'ASC',
  descend: 'DESC',
};

export const transform2ListParams = ({
  calendarOptions = {},
  filterOptions = {},
  sortOptions = {},
  currentPage = 1,
  pageSize = PAGE_SIZE,
  reportTypeOptions,
}) => {
  const {
    reportName,
    reportType,
    cronType,
    processDate,
    status,
    jobCode,
    parentTaskId,
  } = filterOptions;

  const { isCalendar, month, year } = calendarOptions;

  const params = {};

  if (!isCalendar) {
    Object.assign(params, {
      pageInfo: {
        pageSize,
        currentPage,
      },
    });

    if (processDate instanceof Array && processDate.length > 0) {
      Object.assign(params, {
        startCreateTime: processDate[0].startOf('date').valueOf(),
      });
      if (processDate.length >= 2) {
        Object.assign(params, {
          endCreateTime: processDate[1].endOf('date').valueOf(),
        });
      }
    }
  } else {
    let startCreateTime = moment()
      .year(year)
      .month(month)
      .date(15)
      .subtract(1, 'months')
      .startOf('date')
      .valueOf();
    let endCreateTime = moment()
      .year(year)
      .month(month)
      .date(15)
      .add(1, 'months')
      .endOf('date')
      .valueOf();

    if (processDate instanceof Array && processDate.length > 0) {
      const processDateFrom = processDate[0]
        .clone()
        .startOf('date')
        .valueOf();
      const processDateTo = processDate[1]
        .clone()
        .endOf('date')
        .valueOf();
      if (startCreateTime < processDateFrom) {
        startCreateTime = processDateFrom;
      }
      if (endCreateTime > processDateTo) {
        endCreateTime = processDateTo;
      }
    }

    Object.assign(params, { startCreateTime });
    Object.assign(params, { endCreateTime });
  }

  if (reportName) {
    Object.assign(params, { reportName: reportName.trim() });
  }

  if (reportType) {
    Object.assign(params, { reportTypes: [reportType] });
  } else {
    const reportTypes = [];
    reportTypeOptions.forEach(item => {
      reportTypes.push(item.value);
    });
    Object.assign(params, { reportTypes });
  }

  if (cronType) {
    Object.assign(params, { cronTypeList: [cronType] });
  }

  if (status) {
    Object.assign(params, { jobStatus: status });
  }

  if (jobCode) {
    Object.assign(params, { jobCode });
  }

  if (parentTaskId) {
    Object.assign(params, { parentTaskId });
  }

  const sortKeys = Object.keys(sortOptions);
  for (let i = 0; i < sortKeys.length; i += 1) {
    const sortValue = sortOptions[sortKeys[i]];
    const fieldName = sortMap[sortKeys[i]];
    const orderBy = sortValueMap[sortValue];
    if (fieldName && orderBy) {
      Object.assign(params, { sortOptions: [{ fieldName, orderBy }] });
      break;
    }
  }

  return params;
};

const indexOfKey = filterKey => {
  const isFrom = filterKey.indexOf('From');
  const isTo = filterKey.indexOf('To');
  if (isFrom > -1) return 'from';
  if (isTo > -1) return 'to';
  return 'ILLEGAL_KEY';
};

export const doFilter = _filterList => {
  const filterMap = {};
  _filterList.forEach(({ filterName = '', filterKey = '', filterValue, filterType }) => {
    if (filterType === FILTER_TYPE.RANGE_PICKER) {
      if (filterMap[filterName]) {
        Object.assign(filterMap[filterName], { [indexOfKey(filterKey)]: filterValue });
      } else {
        filterMap[filterName] = { [indexOfKey(filterKey)]: filterValue };
      }
    }
  });

  const filterList = [];
  _filterList.forEach(item => {
    if (item.filterType === FILTER_TYPE.RANGE_PICKER) {
      const filter = filterMap[item.filterName];
      if (filter) {
        const { from, to } = filter;
        const formatFrom = from ? moment(parseInt(from, 10)).format(DATE_FORMAT) : '';
        const formatTo = to ? moment(parseInt(to, 10)).format(DATE_FORMAT) : '';
        filterList.push({
          isRequiredWhere: item.isRequiredWhere,
          filterType: item.filterType,
          filterName: item.filterName,
          filterValue: `${formatFrom} ~ ${formatTo}`,
          type: from === 'All' || to === 'All' ? 'filter' : '',
        });
        delete filterMap[item.filterName];
      }
    } else if (item.filterType === FILTER_TYPE.DATE_PICKER) {
      filterList.push({ ...item, filterValue: moment(item.filterValue).format(DATE_FORMAT) });
    } else {
      filterList.push(item);
    }
  });
  return filterList;
};
