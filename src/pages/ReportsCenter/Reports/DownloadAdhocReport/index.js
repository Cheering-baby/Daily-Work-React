import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { connect } from 'dva';
import { Button, Form, Divider, Card, Table, Tooltip, Icon, message, Spin } from 'antd';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import moment from 'moment';
import SCREEN from '@/utils/screen';
import { REPORT_AUTHORITY_MAP } from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/consts/authority';
import BreadcrumbComp from '../../components/BreadcrumbComp';
import download from '../utils/downLoad';
import styles from './index.less';
import ShowPreviewModal from '../components/ShowPreviewModal';
import generateFilter from '../../components/FilterBanner';
import { exportReportUrl } from '../services/report';
import { hasAllPrivilege } from '@/utils/PrivilegeUtil';

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
@Form.create()
@connect(({ downloadAdHocReport, reportCenter, user }) => ({
  downloadAdHocReport,
  reportCenter,
  userAuthorities: user.userAuthorities,
}))
class DownloadAdHocReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingStatus: false,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      location: {
        query: { reportType, page },
      },
    } = this.props;

    dispatch({
      type: 'reportCenter/fetchReportFilterList',
      payload: {
        reportType,
      },
    });

    dispatch({
      type: 'reportCenter/fetchDisplay',
      payload: {
        reportType,
      },
    });

    dispatch({
      type: 'reportCenter/save',
      payload: {
        page,
        reportType,
      },
    });
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
      },
    });
  };

  preview = () => {
    const {
      form,
      form: { getFieldValue },
      dispatch,
      reportCenter: {
        startDate,
        endDate,
        filterList,
        fieldList,
        checkChannelValue,
        checkThemeParkValue,
        checkUserRoleValue,
        checkCustomerGroupValue,
        checkAccountManager,
      },
      location: {
        query: { reportType },
      },
    } = this.props;

    let date = [];
    if (Array.isArray(filterList)) {
      date = filterList.find(
        item => item.filterType === 'RANGE_PICKER' && item.isRequiredWhere === '1'
      );
    }

    if (+startDate === 0 || +endDate === 0) {
      message.warning(`Please fill in ${date.filterName}.`);
      return false;
    }

    let selectList = [];
    if (Array.isArray(fieldList)) {
      selectList = fieldList.filter(m => m.isChecked === '1');
    }
    if (+selectList.length === 0) {
      message.warning('Select at least one field.');
      return false;
    }

    const categoryTypeVal = getFieldValue('categoryType');

    const arr1 =
      filterList && filterList.length > 0 ? filterList.find(i => i.filterKey === 'themePark') : [];
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

    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      Object.keys(values).forEach(k => {
        let value = values[k];
        filterList.forEach(item => {
          if (item.filterKey === k) {
            if (item.filterType === 'RANGE_PICKER') {
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
                k === 'themePark' &&
                themeParkInfos &&
                themeParkInfos.length > 0 &&
                checkThemeParkValue &&
                checkThemeParkValue.length > 0
              ) {
                const res = themeParkInfos.filter(ii => checkThemeParkValue.includes(ii.itemName));
                value = res && res.length > 0 && res.map(i => i.itemValue);
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
      });
      const result = Object.entries(values).map(([key, value]) => {
        return { key, value };
      });
      const list = result.filter(item => item.value);

      dispatch({
        type: 'downloadAdHocReport/fetchPreviewReport',
        payload: {
          reportType,
          filterList: list,
          displayColumnList:
            selectList && selectList.length > 0 ? selectList.map(item => item.columnName) : [],
        },
      });
      dispatch({
        type: 'downloadAdHocReport/save',
        payload: {
          reportType,
          filterList: list,
          displayColumnList:
            selectList && selectList.length > 0 ? selectList.map(item => item.columnName) : [],
        },
      });
    });

    this.handleModal('previewModal', true);
  };

  handleModal = (key, flag = true) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'downloadAdHocReport/toggleModal',
      payload: {
        key,
        val: flag,
      },
    });
  };

  cancel = () => {
    router.push({
      pathname: '/ReportsCenter/Reports',
    });
  };

  downloadFileEvent = e => {
    e.preventDefault();
    const {
      form,
      form: { getFieldValue },
      location: {
        query: { reportType },
      },
      reportCenter: {
        filterList,
        fieldList,
        checkChannelValue,
        checkThemeParkValue,
        checkUserRoleValue,
        checkCustomerGroupValue,
        checkAccountManager,
      },
    } = this.props;

    const arr1 =
      filterList && filterList.length > 0 ? filterList.find(i => i.filterKey === 'themePark') : [];
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

    const categoryTypeVal = getFieldValue('categoryType');

    let selectList = [];
    if (Array.isArray(fieldList)) {
      selectList = fieldList.filter(m => m.isChecked === '1');
    }
    if (+selectList.length === 0) {
      message.warning('Select at least one field.');
      return false;
    }

    const displayColumnList =
      selectList && selectList.length > 0 ? selectList.map(item => item.columnName) : [];

    form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      Object.keys(values).forEach(k => {
        let value = values[k];
        filterList.forEach(item => {
          if (item.filterKey === k) {
            if (item.filterType === 'RANGE_PICKER') {
              values[`${item.filterKey}From`] = value
                ? Date.parse(
                    moment(value[0])
                      .format('YYYY-MM-DD 00:00:00')
                      .replace(/-/g, '/')
                  )
                : '';
              values[`${item.filterKey}To`] = value
                ? Date.parse(
                    moment(value[1])
                      .format('YYYY-MM-DD 23:59:59')
                      .replace(/-/g, '/')
                  )
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
                  checkThemeParkValue.includes(ii.attributeValue)
                );
                value = res && res.length > 0 && res.map(i => i.attributeKey);
              } else if (
                k === 'userRoleForCreated' &&
                userRoleInfos &&
                userRoleInfos.length > 0 &&
                checkUserRoleValue &&
                checkUserRoleValue.length > 0
              ) {
                const res = userRoleInfos.filter(ii => checkUserRoleValue.includes(ii.roleName));
                value = res && res.length > 0 && res.map(i => i.roleCode);
              } else if (
                k === 'customerGroup' &&
                customerGroupInfos &&
                customerGroupInfos.length > 0 &&
                checkCustomerGroupValue &&
                checkCustomerGroupValue.length > 0
              ) {
                const res = customerGroupInfos.filter(ii =>
                  checkCustomerGroupValue.includes(ii.dictName)
                );
                const arrs = res.filter(a => a.dictSubType === categoryTypeVal);
                value = arrs && arrs.length > 0 && arrs.map(i => i.dictId);
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
                channelInfos &&
                channelInfos.length > 0 &&
                checkChannelValue &&
                checkChannelValue.length > 0
              ) {
                const res = channelInfos.filter(ii => checkChannelValue.includes(ii.dictName));
                value = res && res.length > 0 && res.map(i => i.dictId);
              }
              values[k] = value ? value.join() : '';
              if (values[k] === 'All') {
                delete values[k];
              }
            } else if (item.filterType === 'SELECT' && Array.isArray(value)) {
              // values[k] = value ? value.join() : '';
            } else if (item.filterType === 'DATE_PICKER') {
              values[k] = value ? value.format('YYYY-MM-DD') : '';
            }
          }
        });
      });
      const result = Object.entries(values).map(([key, value]) => {
        return { key, value };
      });
      const list = result.filter(item => item.value);

      download({
        url: exportReportUrl,
        method: 'POST',
        body: { fileSuffixType: 'xlsx', filterList: list, reportType, displayColumnList },
        loading: {
          open: () => {
            this.setState({
              loadingStatus: true,
            });
          },
          close: () => {
            this.setState({
              loadingStatus: false,
            });
          },
        },
      });
    });
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

  getSelectedRowKes = fieldList => {
    const selectedRowKeys = [];
    for (let i = 0; i < fieldList.length; i += 1) {
      if (fieldList[i].isChecked === '1') {
        selectedRowKeys.push(fieldList[i].columnName);
      }
    }
    return selectedRowKeys;
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

  render() {
    const {
      form: { getFieldDecorator },
      downloadAdHocReport: { previewModal },
      reportCenter: { filterList, fieldList },
      location: {
        query: { reportType, jobLogCode },
      },
      displayLoading,
    } = this.props;

    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'MENU_REPORTS_CENTER' }),
        url: null,
      },
      {
        breadcrumbName: formatMessage({ id: 'MENU_REPORTS' }),
        url: '/ReportsCenter/Reports',
      },
      {
        breadcrumbName: formatMessage({ id: 'DOWNLOAD_ADHOC_REPORT' }),
        url: null,
      },
    ];

    const columns = [
      {
        title: formatMessage({ id: 'REPORT_NO' }),
        key: 'no',
        dataIndex: 'no',
        render: text =>
          text ? (
            <Tooltip placement="topLeft" title={text} overlayStyle={{ whiteSpace: 'pre-wrap' }}>
              {text}
            </Tooltip>
          ) : (
            '-'
          ),
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

    const rowSelection = {
      selectedRowKeys: this.getSelectedRowKes(fieldList),
      onChange: this.onSelectChange,
    };

    const { loadingStatus } = this.state;

    return (
      <div>
        <MediaQuery
          maxWidth={SCREEN.screenMdMax}
          minWidth={SCREEN.screenSmMin}
          minHeight={SCREEN.screenSmMin}
        >
          <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
        </MediaQuery>
        <MediaQuery minWidth={SCREEN.screenLgMin}>
          <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
        </MediaQuery>
        <Spin spinning={loadingStatus}>
          <Card className={styles.card}>
            <p className={styles.titleStyle}>{reportType}</p>
            <Form className={styles.formStyles} onSubmit={this.downloadFileEvent}>
              {filterList.map(item => generateFilter(this.props, item))}
              <Form.Item {...formItemLayout} label={formatMessage({ id: 'REPORT_FIELD' })}>
                {getFieldDecorator(
                  `field`,
                  {}
                )(
                  <Table
                    loading={displayLoading}
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
              <Divider />
              <div style={{ float: 'right' }}>
                <a onClick={this.preview} className={styles.preview}>
                  Preview
                </a>
                {previewModal ? (
                  <ShowPreviewModal reportType={reportType} jobLogCode={jobLogCode} />
                ) : null}
                <Button onClick={this.cancel}>{formatMessage({ id: 'COMMON_CANCEL' })}</Button>
                <Button
                  style={{ marginLeft: '10px' }}
                  disabled={!hasAllPrivilege([REPORT_AUTHORITY_MAP.REPORT_AUTHORITY_DOWNLOAD])}
                  type="primary"
                  htmlType="submit"
                >
                  {formatMessage({ id: 'REPORT_DOWNLOAD' })}
                </Button>
              </div>
            </Form>
          </Card>
        </Spin>
      </div>
    );
  }
}

export default DownloadAdHocReport;
