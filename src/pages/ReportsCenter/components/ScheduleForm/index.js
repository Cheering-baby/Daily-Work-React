import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Button,
  Tooltip,
  DatePicker,
  Form,
  Input,
  Divider,
  Card,
  Radio,
  Icon,
  Table,
  Select,
  message,
  Spin,
} from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import styles from './index.less';
import generateFilter from '../FilterBanner';

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
  colon: false,
};
const formItemHalfLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 9 },
  },
  colon: false,
};

@Form.create()
@connect(({ scheduleTransaction, reportCenter, scheduleTask, user, loading }) => ({
  scheduleTransaction,
  reportCenter,
  scheduleTask,
  user,
  displayLoading: loading.effects['reportCenter/fetchDisplay'],
  addLoading: loading.effects['reportCenter/add'],
  editLoading: loading.effects['reportCenter/edit'],
  configFilterLoadingFlag: loading.effects['reportCenter/fetchReportFilterList'],
}))
class ScheduleTransaction extends Component {
  componentDidMount() {
    const { dispatch, reportType, jobCode, type } = this.props;
    if (reportType) {
      dispatch({
        type: 'reportCenter/fetchDisplay',
        payload: {
          reportType: reportType.replace(/\s+/g, ''),
        },
      });

      dispatch({
        type: 'reportCenter/fetchReportFilterList',
        payload: {
          reportType: reportType.replace(/\s+/g, ''),
        },
      });
    }

    dispatch({
      type: 'reportCenter/queryReportType',
    });

    dispatch({
      type: 'scheduleTransaction/queryCronType',
    });

    if (type === 'edit') {
      dispatch({
        type: 'reportCenter/fetchReportDetail',
        payload: { jobCode },
      });
    }
    window.addEventListener('click', this.hideAdminAssignedOpen);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.hideAdminAssignedOpen);
  }

  hideAdminAssignedOpen = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportCenter/save',
      payload: {
        openThemePark: false,
        openChannel: false,
        openCustomerGroup: false,
        openUserRoleForCreated: false,
        openAccountManager: false,
        openAgeGroup: false,
        openCustomerName: false,
      },
    });
  };

  cancel = () => {
    const { sourcePage } = this.props;
    if (sourcePage === 'reports') {
      router.push({
        pathname: '/ReportsCenter/Reports',
      });
    } else {
      router.push({
        pathname: '/ReportsCenter/GeneratedReports/ScheduleTask',
      });
    }
  };

  changeReport = (type, orderNumber) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportCenter/modifySorting',
      payload: {
        type,
        orderNumber,
      },
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const {
      form,
      dispatch,
      reportType,
      reportCenter: {
        filterList,
        fieldList,
        checkChannelValue,
        checkThemeParkValue,
        checkUserRoleValue,
        checkCustomerGroupValue,
        checkAccountManager,
        checkAgeGroup,
        checkCustomerName,
      },
      type,
      sourcePage,
      jobCode,
      form: { getFieldValue },
    } = this.props;

    const arr1 =
      filterList && filterList.length > 0
        ? filterList.find(i => i.filterKey === 'themeParkCode')
        : [];
    const themeParkInfos = arr1 && arr1.themeParkOptions;

    const arr2 =
      filterList && filterList.length > 0 ? filterList.find(i => i.filterKey === 'taMarket') : [];
    const channelInfos = arr2 && arr2.taMarketOptions;

    const arr3 =
      filterList && filterList.length > 0
        ? filterList.find(i => i.filterKey === 'userRoleForCreated')
        : [];
    const userRoleInfos = arr3 && arr3.userRoleOptions;

    const arr4 =
      filterList && filterList.length > 0
        ? filterList.find(i => i.filterKey === 'customerGroup')
        : [];
    const customerGroupInfos = arr4 && arr4.customerGroupOptions;

    const arr5 =
      filterList && filterList.length > 0
        ? filterList.find(i => i.filterKey === 'accountManager')
        : [];
    const accountManagerInfos = arr5 && arr5.accountManagerOptions;

    const arr6 =
      filterList && filterList.length > 0 ? filterList.find(i => i.filterKey === 'ageGroup') : [];
    const ageGroupInfos = arr6 && arr6.ageGroupOptions;

    const arr7 =
      filterList && filterList.length > 0
        ? filterList.find(i => i.filterKey === 'customerName')
        : [];
    const customerNameInfos = arr7 && arr7.customerNameOptions;

    let cType = '';
    // let types = '';

    const report = getFieldValue('reportName');
    const executeOnce = getFieldValue('executeOnceTime');
    const cronTypeVal = getFieldValue('cronType');
    const scheduleDesc = getFieldValue('scheduleDesc');
    const monthlyExecuteDay = getFieldValue('monthlyExecuteDay');
    const reportTypeVal = getFieldValue('reportType');
    const categoryTypeVal = getFieldValue('categoryType');

    form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      let selectList = [];
      if (Array.isArray(fieldList)) {
        selectList = fieldList.filter(m => m.isChecked === '1');
      }
      if (selectList.length === 0) {
        message.warning('Select at least one field.');
        return false;
      }
      Object.keys(values).forEach(k => {
        let value = values[k];
        filterList.forEach(item => {
          if (item.filterKey === k) {
            if (item.filterType === 'RANGE_PICKER' && +item.isRequiredWhere === 1) {
              if (cronTypeVal === 'Monthly') {
                values[`${item.filterKey}From`] = new Date(
                  moment()
                    .startOf('month')
                    .format('YYYY-MM-DD 00:00:00')
                    .replace(/-/g, '/')
                ).getTime();
                values[`${item.filterKey}To`] = new Date(
                  moment()
                    .endOf('month')
                    .format('YYYY-MM-DD 23:59:59')
                    .replace(/-/g, '/')
                ).getTime();
              } else if (cronTypeVal === 'Daily') {
                values[`${item.filterKey}From`] = new Date(
                  moment()
                    .format('YYYY-MM-DD 00:00:00')
                    .replace(/-/g, '/')
                ).getTime();
                values[`${item.filterKey}To`] = new Date(
                  moment()
                    .format('YYYY-MM-DD 23:59:59')
                    .replace(/-/g, '/')
                ).getTime();
              } else {
                values[`${item.filterKey}From`] = value
                  ? new Date(
                      moment(value[0])
                        .format('YYYY-MM-DD 00:00:00')
                        .replace(/-/g, '/')
                    ).getTime()
                  : '';
                values[`${item.filterKey}To`] = value
                  ? new Date(
                      moment(value[1])
                        .format('YYYY-MM-DD 23:59:59')
                        .replace(/-/g, '/')
                    ).getTime()
                  : '';
              }
              delete values[k];
            } else if (item.filterType === 'RANGE_PICKER' && +item.isRequiredWhere === 0) {
              values[`${item.filterKey}From`] = value
                ? new Date(
                    moment(value[0])
                      .format('YYYY-MM-DD 00:00:00')
                      .replace(/-/g, '/')
                  ).getTime()
                : '';
              values[`${item.filterKey}To`] = value
                ? new Date(
                    moment(value[1])
                      .format('YYYY-MM-DD 23:59:59')
                      .replace(/-/g, '/')
                  ).getTime()
                : '';
              delete values[k];
            } else if (item.filterType === 'MULTIPLE_SELECT' && Array.isArray(value)) {
              if (
                k === 'themeParkCode' &&
                themeParkInfos &&
                themeParkInfos.length > 0 &&
                checkThemeParkValue &&
                checkThemeParkValue.length > 0
              ) {
                const res = themeParkInfos.filter(ii =>
                  checkThemeParkValue.includes(ii.bookingCategoryName)
                );
                value = res && res.length > 0 && res.map(i => i.bookingCategoryCode);
              } else if (k === 'taMarket' && checkChannelValue && checkChannelValue.length > 0) {
                const res = channelInfos.filter(ii => checkChannelValue.includes(ii.dictName));
                value = res && res.length > 0 && res.map(i => i.dictId);
              } else if (
                k === 'userRoleForCreated' &&
                checkUserRoleValue &&
                checkUserRoleValue.length > 0
              ) {
                const list = userRoleInfos.filter(ii => checkUserRoleValue.includes(ii.roleName));
                value = list && list.length > 0 && list.map(i => i.roleCode);
              } else if (
                k === 'accountManager' &&
                checkAccountManager &&
                checkAccountManager.length > 0
              ) {
                const list = accountManagerInfos.filter(ii =>
                  checkAccountManager.includes(ii.userCode)
                );
                value = list && list.length > 0 && list.map(i => i.userType);
              } else if (
                k === 'customerGroup' &&
                checkCustomerGroupValue &&
                checkCustomerGroupValue.length > 0
              ) {
                const list = customerGroupInfos.filter(ii =>
                  checkCustomerGroupValue.includes(ii.dictName)
                );
                const arrs = list.filter(s => s.dictSubType === categoryTypeVal);
                value = arrs && arrs.length > 0 && arrs.map(i => i.dictId);
              } else if (k === 'ageGroup' && checkAgeGroup && checkAgeGroup.length > 0) {
                const list = ageGroupInfos.filter(ii => checkAgeGroup.includes(ii.name));
                value = list && list.length > 0 && list.map(i => i.identifier);
              } else if (
                k === 'customerName' &&
                checkCustomerName &&
                checkCustomerName.length > 0
              ) {
                const list = customerNameInfos.filter(ii => checkCustomerName.includes(ii.taId));
                value = list && list.length > 0 && list.map(i => i.taId);
              }
              values[k] = value ? value.join() : '';
              if (values[k] === 'All') {
                delete values[k];
              }
            } else if (item.filterType === 'SELECT') {
              // values[k] = value ? value.join() : '';
            } else if (item.filterType === 'DATE_PICKER') {
              values[k] = value ? value.format('YYYY-MM-DD') : '';
            }
          }
        });
        if (k === 'cronType') {
          if (value === 'Ad-hoc') {
            cType = '03';
          } else if (value === 'Daily') {
            cType = '01';
          } else {
            cType = '02';
          }
          delete values[k];
        }

        if (
          k === 'reportName' ||
          k === 'executeOnceTime' ||
          k === 'reportType' ||
          k === 'scheduleDesc' ||
          k === 'monthlyExecuteDay'
        ) {
          delete values[k];
        }
      });
      const result = Object.entries(values).map(([key, value]) => {
        return { key, value };
      });

      if (cType === '03' && !executeOnce) {
        message.warning('Please select the generated date and time.');
        return false;
      }

      if (cType === '02' && !monthlyExecuteDay) {
        message.warning('Please select the Monthly Execute Day.');
        return false;
      }

      const list = result.filter(item => item.value);

      let sortList = [];
      if (
        reportType === 'ARAccountBalanceSummaryReport' ||
        reportType === 'E-WalletBalanceSummaryReport'
      ) {
        sortList = [
          { key: 'customerName', value: 'ASC' },
          { key: 'transactionDate', value: 'DESC' },
        ];
      }

      if (type === 'edit') {
        dispatch({
          type: 'reportCenter/edit',
          payload: {
            sortList,
            jobCode,
            reportName: report,
            reportType: reportTypeVal.replace(/\s+/g, ''),
            scheduleDesc,
            executeOnceTime: executeOnce ? executeOnce.valueOf() : '',
            monthlyExecuteDay: monthlyExecuteDay ? monthlyExecuteDay.valueOf() : '',
            filterList: list,
            cronType: cType,
            updateBy: window.AppGlobal.userCode,
            displayColumnList:
              selectList && selectList.length > 0 ? selectList.map(item => item.columnName) : [],
          },
        });
      } else if (sourcePage === 'reports') {
        dispatch({
          type: 'reportCenter/add',
          payload: {
            sortList,
            sourcePage,
            reportName: report,
            reportType,
            scheduleDesc,
            executeOnceTime: executeOnce ? executeOnce.valueOf() : '',
            monthlyExecuteDay: monthlyExecuteDay ? monthlyExecuteDay.valueOf() : '',
            filterList: list,
            cronType: cType,
            createBy: window.AppGlobal.userCode,
            displayColumnList:
              selectList && selectList.length > 0 ? selectList.map(item => item.columnName) : [],
          },
        });
      } else {
        dispatch({
          type: 'reportCenter/add',
          payload: {
            sortList,
            sourcePage,
            reportName: report,
            reportType: reportTypeVal,
            scheduleDesc,
            executeOnceTime: executeOnce ? executeOnce.valueOf() : '',
            monthlyExecuteDay: monthlyExecuteDay ? monthlyExecuteDay.valueOf() : '',
            filterList: list,
            cronType: cType,
            createBy: window.AppGlobal.userCode,
            displayColumnList:
              selectList && selectList.length > 0 ? selectList.map(item => item.columnName) : [],
          },
        });
      }
    });
  };

  radioChange = e => {
    const {
      type,
      sourcePage,
      form: { setFieldsValue, getFieldValue },
      dispatch,
      reportType,
      reportCenter: { startDate, endDate, reportName2, filterList },
      detailList,
    } = this.props;

    const whereColumnList = detailList ? detailList.whereColumnList : [];
    const result = whereColumnList.filter(
      item => item.filterType === 'RANGE_PICKER' && item.isRequiredWhere === '1'
    );
    let startInit = '';
    let endInit = '';
    if (Array.isArray(result) && result.length > 0) {
      startInit = moment(+result[0].filterValue).format('YYYY-MM-DD');
      endInit = moment(+result[1].filterValue).format('YYYY-MM-DD');
    }

    if (e.target.value === 'Daily' || e.target.value === 'Monthly') {
      setFieldsValue({ executeOnceTime: '' });
      dispatch({
        type: 'reportCenter/save',
        payload: {
          executeOnceTime: '',
        },
      });
    }
    let reportName = '';

    let start = '';
    let end = '';
    if (filterList && filterList.length > 0) {
      const dateKey = filterList.find(
        item => item.filterType === 'RANGE_PICKER' && item.isRequiredWhere === '1'
      );
      const date = dateKey ? dateKey.filterKey : '';
      const dateValue = getFieldValue(date);
      start = dateValue ? moment(dateValue[0]).format('YYYY-MM-DD') : '';
      end = dateValue ? moment(dateValue[1]).format('YYYY-MM-DD') : '';
    }

    if (type === 'new') {
      if (reportName2 && e.target.value !== 'Ad-hoc') {
        reportName = `${reportName2}_${e.target.value}_V1`;
      } else if (e.target.value === 'Ad-hoc' && reportName2 && !start && !end) {
        reportName = `${reportName2}_V1`;
      } else if (e.target.value === 'Ad-hoc' && !start && !end) {
        reportName = 'V1';
      } else if (e.target.value === 'Ad-hoc' && startDate && endDate && !reportName2) {
        reportName = `${startDate}-${endDate}_V1`;
      } else if (e.target.value === 'Ad-hoc' && start && end && reportName2) {
        reportName = `${reportName2}_${start}-${end}_V1`;
      } else if (reportName2 && e.target.value === 'Ad-hoc' && startDate && endDate) {
        reportName = `${reportName2}_${startDate}-${endDate}_V1`;
      }
    } else if (type === 'edit' || sourcePage === 'reports') {
      if (e.target.value === 'Ad-hoc' && startInit && endInit && !startDate) {
        reportName = `${reportType}_${startInit}-${endInit}_V1`;
      } else if (e.target.value === 'Ad-hoc' && startDate && endDate) {
        reportName = `${reportType}_${startDate}-${endDate}_V1`;
      } else if (e.target.value === 'Ad-hoc' && !start && !end) {
        reportName = `${reportType}_V1`;
      } else {
        reportName = `${reportType}_${e.target.value}_V1`;
      }
    }

    setFieldsValue({ reportName });
    dispatch({
      type: 'reportCenter/save',
      payload: {
        reportName,
        reportName2,
        reportFrequency: e.target.value,
      },
    });
  };

  onDateChange = value => {
    let sHours = '';
    let sMinute = '';
    if (value) {
      sHours = value.hours() - 1 || 0;
      sMinute = value.minute() - 1 || 0;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'reportCenter/save',
      payload: {
        executeOnceTime: value,
        sHours,
        sMinute,
      },
    });
  };

  onSelectChange = selectedRowKeys => {
    const {
      reportCenter: { fieldList },
    } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'reportCenter/saveSelectList',
      payload: {
        selectedRowKeys,
        fieldList,
      },
    });
  };

  reportNameChange = values => {
    const {
      form: { setFieldsValue },
      dispatch,
      reportCenter: { reportTypeList, reportFrequency, startDate, endDate },
    } = this.props;
    const report = reportTypeList.find(item => item.value === values);
    let reportName1;
    if (reportFrequency) {
      if (reportFrequency === 'Ad-hoc') {
        reportName1 = `${report.text}_V1`;
      } else if (reportFrequency !== 'Ad-hoc') {
        reportName1 = `${report.text}_${reportFrequency}_V1`;
      } else if (reportFrequency === 'Ad-hoc' && startDate && endDate) {
        reportName1 = `${report.text}_${startDate}-${endDate}_V1`;
      }
    } else if (startDate && endDate) {
      reportName1 = `${report.text}_${startDate}-${endDate}_V1`;
    } else if (startDate && endDate && reportFrequency) {
      reportName1 = `${report.text}_${reportFrequency}_${startDate}-${endDate}_V1`;
    }
    setFieldsValue({ reportName: reportName1 });

    dispatch({
      type: 'reportCenter/save',
      payload: {
        reportName2: report.text,
        reportName1,
      },
    });
    dispatch({
      type: 'reportCenter/fetchDisplay',
      payload: {
        reportType: report.value,
      },
    });

    dispatch({
      type: 'reportCenter/fetchReportFilterList',
      payload: {
        reportType: report.value,
      },
    });
  };

  getSelectedRowKes = fieldList => {
    const selectedRowKeys = [];
    for (let i = 0; i < fieldList.length; i += 1) {
      if (fieldList[i].isChecked === '1') {
        selectedRowKeys.push(fieldList[i].columnName);
      }
    }
    return selectedRowKeys;
  };

  disabledDate = current =>
    current <
    moment()
      .endOf('day')
      .subtract(1, 'days');

  range = (start, end) => {
    const result = [];
    for (let i = start; i <= end; i += 1) {
      result.push(i);
    }
    return result;
  };

  disabledDateTime = datetime => {
    const selectDay = moment(datetime);
    const nowDay = moment();
    const timeProps = {};
    const rangeArray = (start, end) =>
      Array(end - start + 1)
        .fill(0)
        .map((v, i) => i + start);
    if (nowDay.isSame(selectDay.format('YYYY-MM-DD'), 'day')) {
      timeProps.disabledHours = () => rangeArray(0, nowDay.hours() - 1);
      if (selectDay.hours() <= nowDay.hours()) {
        timeProps.disabledMinutes = () => rangeArray(0, nowDay.minute() - 1);
        if (selectDay.minute() <= nowDay.minute()) {
          timeProps.disabledSeconds = () => rangeArray(0, nowDay.second() - 1);
        } else {
          timeProps.disabledSeconds = () => [];
        }
      } else {
        timeProps.disabledMinutes = () => [];
        timeProps.disabledSeconds = () => [];
      }
    } else if (nowDay.isBefore(selectDay.format('YYYY-MM-DD'), 'day')) {
      timeProps.disabledHours = () => [];
      timeProps.disabledMinutes = () => [];
      timeProps.disabledSeconds = () => [];
    } else {
      timeProps.disabledHours = () => rangeArray(0, 23);
      timeProps.disabledMinutes = () => rangeArray(0, 59);
      timeProps.disabledSeconds = () => rangeArray(0, 59);
    }
    return timeProps;
  };

  render() {
    const {
      displayLoading,
      form: { getFieldDecorator },
      reportCenter: { fieldList, filterList, reportTypeList },
      // reportType,
      reportType2,
      sourcePage,
      type,
      detailList,
      editLoading,
      addLoading,
      configFilterLoadingFlag,
      form: { getFieldValue },
    } = this.props;
    const cronTypes = getFieldValue('cronType');

    const rowSelection = {
      selectedRowKeys: this.getSelectedRowKes(fieldList),
      onChange: this.onSelectChange,
    };

    const columns = [
      {
        title: formatMessage({ id: 'REPORT_NO' }),
        dataIndex: 'no',
        render: text => {
          return (
            <div>
              <Tooltip title={text} placement="topLeft">
                {text || '-'}
              </Tooltip>
            </div>
          );
        },
      },
      {
        title: formatMessage({ id: 'REPORTS_NAME' }),
        dataIndex: 'displayName',
        render: text => {
          return (
            <div>
              <Tooltip title={text} placement="topLeft">
                {text || '-'}
              </Tooltip>
            </div>
          );
        },
      },
      {
        title: formatMessage({ id: 'REPORT_OPERATION' }),
        key: 'key',
        dataIndex: 'no',
        render: (text, record) => {
          const { no } = record;
          return (
            <div>
              <Tooltip title="Up">
                <Icon
                  type="to-top"
                  style={{ marginRight: '5px' }}
                  className={text === 1 ? styles.noDrop : null}
                  onClick={() => {
                    this.changeReport('UP', no);
                  }}
                />
              </Tooltip>
              <Tooltip title="Down">
                <Icon
                  type="vertical-align-bottom"
                  style={{ marginRight: '5px' }}
                  className={text === fieldList.length ? styles.noDrop : null}
                  onClick={() => {
                    this.changeReport('DOWN', no);
                  }}
                />
              </Tooltip>
            </div>
          );
        },
      },
    ];

    const selectArr = [];
    for (let i = 0; i < 31; i += 1) {
      selectArr.push(i + 1);
    }

    return (
      <Spin spinning={!!configFilterLoadingFlag}>
        <Card className={styles.card}>
          {sourcePage === 'reports' ? (
            <p className={styles.titleStyle}>{formatMessage({ id: 'SCHEDULED_REPORTS_NAME' })}</p>
          ) : (
            <p className={styles.titleStyle}>Basic Information</p>
          )}
          <Form className={styles.formStyles} onSubmit={this.handleSubmit}>
            <Form.Item
              style={{ display: 'none' }}
              {...formItemLayout}
              label={formatMessage({ id: 'SCHEDULED_REPORTS_NAME' })}
            >
              {getFieldDecorator(`reportName`, {
                initialValue: detailList && detailList.taskName ? detailList.taskName : '',
                rules: [
                  {
                    required: true,
                    message: 'Required',
                  },
                ],
              })(<Input placeholder="Please Enter" disabled />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label={formatMessage({ id: 'SCHEDULED_REPORTS_NAME' })}>
              {getFieldDecorator(`scheduleDesc`, {
                initialValue: detailList && detailList.reportName ? detailList.reportName : '',
                rules: [
                  {
                    required: true,
                    message: 'Required',
                  },
                ],
              })(<Input placeholder="Please Enter" />)}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              className={styles.AdhocSchedule}
              label={formatMessage({ id: 'REPORT_FREQUENCY' })}
            >
              {getFieldDecorator(`cronType`, {
                initialValue: detailList && detailList.cronType ? detailList.cronType : '',
                rules: [
                  {
                    required: true,
                    message: 'Required',
                  },
                ],
              })(
                <Radio.Group onChange={this.radioChange}>
                  <div className={styles.AdhocScheduleStyle}>
                    <Radio value="Ad-hoc" name="03">
                      {formatMessage({ id: 'REPORT_ADHOC_REPORT' })}
                    </Radio>
                    {cronTypes === 'Ad-hoc'
                      ? getFieldDecorator(`executeOnceTime`, {
                          initialValue:
                            detailList && detailList.executeOnceTime
                              ? moment(detailList.executeOnceTime)
                              : '',
                        })(
                          <DatePicker
                            showToday={false}
                            style={{ width: '60%' }}
                            format="DD-MMM-YYYY HH:mm:ss"
                            placeholder="Generated Date&Time"
                            onChange={this.onDateChange}
                            disabledDate={this.disabledDate}
                            disabledTime={this.disabledDateTime}
                            showTime={{ format: 'HH:mm:ss' }}
                          />
                        )
                      : null}
                  </div>
                  <div className={styles.dailyStyle}>
                    <Radio value="Daily" name="01">
                      {formatMessage({ id: 'REPORT_DAILY' })}
                    </Radio>
                  </div>
                  <div>
                    <Radio value="Monthly" name="02">
                      {formatMessage({ id: 'REPORT_MONTHLY' })}
                    </Radio>
                    {cronTypes === 'Monthly'
                      ? getFieldDecorator('monthlyExecuteDay', {
                          initialValue:
                            detailList && detailList.monthlyExecuteDay
                              ? detailList.monthlyExecuteDay
                              : '',
                        })(
                          <Select
                            allowClear
                            placeholder="Monthly Execute Day"
                            style={{ width: '15%' }}
                          >
                            {selectArr.map(i => (
                              <Option value={i} key={i}>
                                {i}
                              </Option>
                            ))}
                          </Select>
                        )
                      : null}
                  </div>
                </Radio.Group>
              )}
            </Form.Item>
            {sourcePage === 'reports' || type === 'edit' ? (
              <Form.Item
                {...formItemHalfLayout}
                label={formatMessage({ id: 'REPORTS_TYPE' })}
                style={{ paddingTop: '10px' }}
              >
                {getFieldDecorator(`reportType`, {
                  initialValue: reportType2,
                })(<Input placeholder="Please Enter" disabled />)}
              </Form.Item>
            ) : (
              <Form.Item
                {...formItemHalfLayout}
                label={formatMessage({ id: 'REPORTS_TYPE' })}
                style={{ paddingTop: '10px' }}
              >
                {getFieldDecorator(`reportType`, {
                  initialValue: type === 'edit' ? reportType2 : '',
                  rules: [
                    {
                      required: true,
                      message: 'Required',
                    },
                  ],
                })(
                  <Select placeholder="Please Enter" onChange={this.reportNameChange}>
                    {reportTypeList &&
                      reportTypeList.map(item => (
                        <Option key={item.value} value={item.value}>
                          {item.text}
                        </Option>
                      ))}
                  </Select>
                )}
              </Form.Item>
            )}
            <div
              className={
                sourcePage !== 'reports' && filterList && filterList.length > 0
                  ? styles.grayBg
                  : undefined
              }
            >
              {filterList.length > 0 && filterList.map(item => generateFilter(this.props, item))}
            </div>
            {fieldList && fieldList.length > 0 ? (
              <Form.Item {...formItemLayout} label={formatMessage({ id: 'REPORT_FIELD' })}>
                {getFieldDecorator(
                  `field`,
                  {}
                )(
                  <Table
                    loading={displayLoading || editLoading || addLoading}
                    className={`tabs-no-padding ${styles.searchTitle}`}
                    style={{ marginTop: 10 }}
                    bordered={false}
                    size="small"
                    columns={columns}
                    dataSource={fieldList}
                    pagination={false}
                    scroll={{ x: 660 }}
                    rowKey={record => record.columnName}
                    rowSelection={rowSelection}
                  />
                )}
              </Form.Item>
            ) : null}
            <Divider />
            <div style={{ float: 'right' }}>
              <Button onClick={this.cancel}>{formatMessage({ id: 'COMMON_CANCEL' })}</Button>
              <Button style={{ marginLeft: '10px' }} type="primary" htmlType="submit">
                {formatMessage({ id: 'COMMON_OK' })}
              </Button>
            </div>
          </Form>
        </Card>
      </Spin>
    );
  }
}

export default ScheduleTransaction;
