import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Icon, Tooltip } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { REPORT_AUTHORITY_MAP } from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/consts/authority';
import PaginationComp from '../../../components/PaginationComp';
import styles from '../index.less';
import download from '../../../Reports/utils/downLoad';
import { hasAllPrivilege } from '@/utils/PrivilegeUtil';

@connect(({ dailyAndMonthlyReport, adhoc, user, loading }) => ({
  dailyAndMonthlyReport,
  adhoc,
  userAuthorities: user.userAuthorities,
  loading: loading.effects['adhoc/fetch'],
}))
class DailyMonthlyTable extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'adhoc/reportTypeSelect',
    }).then(res => {
      const {
        adhoc: { reportTypeOptions },
      } = this.props;
      const reportTypes =
        reportTypeOptions && reportTypeOptions.length > 0 && reportTypeOptions.map(i => i.value);
      if (res) {
        dispatch({
          type: 'adhoc/fetch',
          payload: {
            reportTypes,
          },
        });
      }
    });
  }

  download = (record = {}) => {
    const { dispatch } = this.props;
    const dev = 'http://dev.c85eaf0d05d04465a81befded3f4f608b.cn-shenzhen.alicontainer.com';
    const rwsUrl = process.env.NODE_ENV === 'development' ? dev : window.location.origin;
    download({
      url: `${rwsUrl}/pams/b2c/report/v1/schedule/downloadScheduleReportFile?jobLogCode=${record.jobLogCode}`,
      method: 'GET',
      loading: {
        open: () => {
          dispatch({
            type: 'adhoc/save',
            payload: {
              loadingStatus: true,
            },
          });
        },
        close: () => {
          dispatch({
            type: 'adhoc/save',
            payload: {
              loadingStatus: false,
            },
          });
        },
      },
    });
  };

  render() {
    const {
      loading,
      adhoc: {
        currentPage,
        pageSize: nowPageSize,
        totalSize,
        dataList,
        loadingStatus,
        reportTypeOptions,
      },
      dispatch,
    } = this.props;

    const reportTypes =
      reportTypeOptions && reportTypeOptions.length > 0 && reportTypeOptions.map(i => i.value);

    const hasDownloadPriv = hasAllPrivilege([REPORT_AUTHORITY_MAP.REPORT_AUTHORITY_DOWNLOAD]);

    const columns = [
      {
        title: formatMessage({ id: 'REPORT_NO' }),
        dataIndex: 'no',
        render: (text, row, index) => index + (currentPage - 1) * nowPageSize + 1,
      },
      {
        title: formatMessage({ id: 'REPORT_NAME' }),
        dataIndex: 'taskName',
        sorter: true,
        render: text => {
          return (
            <Tooltip title={text} placement="topLeft">
              {text || '-'}
            </Tooltip>
          );
        },
      },
      {
        title: formatMessage({ id: 'REPORT_FREQUENCY' }),
        dataIndex: 'cronType',
        sorter: true,
        render: text => {
          return (
            <Tooltip title={text} placement="topLeft">
              {text || '-'}
            </Tooltip>
          );
        },
      },
      {
        title: formatMessage({ id: 'GENERATED_DATE' }),
        dataIndex: 'expectTime',
        sorter: true,
        render: text => {
          const timeText = text ? moment(text).format('DD-MMM-YYYY') : '';
          return (
            <Tooltip title={timeText} placement="topLeft">
              {timeText || '-'}
            </Tooltip>
          );
        },
      },
      {
        title: 'Request By',
        dataIndex: 'createBy',
        sorter: true,
        render: text => {
          return (
            <Tooltip title="Request By" placement="topLeft">
              {text || '-'}
            </Tooltip>
          );
        },
      },
      {
        title: formatMessage({ id: 'REPORT_OPERATION' }),
        dataIndex: 'operation',
        render: (_, record) => {
          return (
            <div>
              <Tooltip title="Download">
                <Icon
                  type="download"
                  className={hasDownloadPriv ? undefined : styles.iconStyle}
                  onClick={() => {
                    if (hasDownloadPriv) {
                      this.download(record);
                    }
                  }}
                />
              </Tooltip>
            </div>
          );
        },
      },
    ];

    const pageOpts = {
      total: totalSize,
      current: currentPage,
      pageSize: nowPageSize,
      pageChange: (page, pageSize) => {
        dispatch({
          type: 'adhoc/tableChanged',
          payload: {
            pagination: {
              currentPage: page,
              pageSize,
            },
          },
        });
      },
    };

    return (
      <div>
        <Table
          loading={loading || loadingStatus}
          className={`tabs-no-padding ${styles.searchTitle}`}
          style={{ marginTop: 10 }}
          bordered={false}
          size="small"
          columns={columns}
          dataSource={dataList}
          pagination={false}
          rowKey={record => record.dictId}
          scroll={{ x: 660 }}
          onChange={(pagination, filters, sorter) => {
            if (JSON.stringify(sorter) !== '{}') {
              dispatch({
                type: 'adhoc/fetch',
                payload: {
                  reportTypes,
                  sortOptions: [{ fieldName: sorter.field, orderBy: sorter.order }],
                },
              });
            } else {
              dispatch({
                type: 'adhoc/fetch',
                payload: {
                  reportTypes,
                },
              });
            }
          }}
        />
        <PaginationComp style={{ marginTop: 10 }} {...pageOpts} />
      </div>
    );
  }
}

export default DailyMonthlyTable;
