import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Icon, Tooltip } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { Resizable } from 'react-resizable';
import { REPORT_AUTHORITY_MAP } from '../../ScheduleTask/consts/authority';
import PaginationComp from '../../../components/PaginationComp';
import styles from '../index.less';
import download from '../../../Reports/utils/downLoad';
import { hasAllPrivilege } from '@/utils/PrivilegeUtil';

const ResizeableTitle = props => {
  const { setResize, onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
      onResizeStart={() => setResize(true)}
      onResizeStop={() => setResize(false)}
    >
      <th {...restProps} />
    </Resizable>
  );
};

const columnsInitial = [
  {
    title: formatMessage({ id: 'REPORT_NO' }),
    dataIndex: 'no',
    width: 60,
    minConstraints: [30, 50],
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
    title: formatMessage({ id: 'SCHEDULE_REPORT_NAME' }),
    dataIndex: 'reportName',
    width: 180,
    sorter: true,
    className: styles.reportNameColumn,
  },
  {
    title: formatMessage({ id: 'REPORT_NAME' }),
    dataIndex: 'taskName',
    width: 200,
    sorter: true,
    className: styles.reportNameColumn,
  },
  {
    title: formatMessage({ id: 'REPORT_FREQUENCY' }),
    dataIndex: 'cronType',
    width: 150,
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
    width: 180,
    sorter: true,
    render: text => {
      const timeText = text ? moment(text).format('DD-MMM-YYYY HH:mm:ss') : '';
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
    width: 120,
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
    // width: 100,
  },
];

@connect(({ dailyAndMonthlyReport, user, loading }) => ({
  dailyAndMonthlyReport,
  userAuthorities: user.userAuthorities,
  loading: loading.effects['dailyAndMonthlyReport/fetch'],
}))
class DailyMonthlyTable extends Component {
  components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      resize: false,
      columns: columnsInitial,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dailyAndMonthlyReport/reportTypeSelect',
    }).then(res => {
      const {
        dailyAndMonthlyReport: { reportTypeOptions },
      } = this.props;
      const reportTypes =
        reportTypeOptions && reportTypeOptions.length > 0 && reportTypeOptions.map(i => i.value);
      if (res) {
        dispatch({
          type: 'dailyAndMonthlyReport/fetch',
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
            type: 'dailyAndMonthlyReport/save',
            payload: {
              loadingStatus: true,
            },
          });
        },
        close: () => {
          dispatch({
            type: 'dailyAndMonthlyReport/save',
            payload: {
              loadingStatus: false,
            },
          });
        },
      },
    });
  };

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  render() {
    const {
      loading,
      dailyAndMonthlyReport: {
        currentPage,
        pageSize: nowPageSize,
        totalSize,
        dataList,
        loadingStatus,
        reportTypeOptions,
      },
      dispatch,
    } = this.props;
    const { resize, columns } = this.state;
    const reportTypes =
      reportTypeOptions && reportTypeOptions.length > 0 && reportTypeOptions.map(i => i.value);
    const pageOpts = {
      total: totalSize,
      current: currentPage,
      pageSize: nowPageSize,
      pageChange: (page, pageSize) => {
        dispatch({
          type: 'dailyAndMonthlyReport/tableChanged',
          payload: {
            reportTypes,
            pagination: {
              currentPage: page,
              pageSize,
            },
          },
        });
      },
    };

    const hasDownloadPriv = hasAllPrivilege([REPORT_AUTHORITY_MAP.REPORT_AUTHORITY_DOWNLOAD]);
    const columnsShow = columns.map((i, zIndex) => {
      i.onHeaderCell = column => ({
        width: column.width,
        setResize: value =>
          this.setState({
            resize: value,
          }),
        onResize: this.handleResize(zIndex),
        minConstraints: column.minConstraints ? column.minConstraints : [60, 50],
      });
      if (i.dataIndex === 'no') {
        return {
          ...i,
          render: (text, row, index) => index + (currentPage - 1) * nowPageSize + 1,
        };
      }
      if (i.dataIndex === 'operation') {
        return {
          ...i,
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
        };
      }
      return i;
    });
    return (
      <div>
        <Table
          loading={loading || loadingStatus}
          className={`tabs-no-padding ${styles.searchTitle} ${resize ? styles.resize : null}`}
          style={{ marginTop: 10 }}
          components={this.components}
          size="small"
          columns={columnsShow}
          dataSource={dataList}
          pagination={false}
          rowKey={record => record.dictId}
          scroll={{ x: 920 }}
          onChange={(pagination, filters, sorter) => {
            if (!resize) {
              if (JSON.stringify(sorter) !== '{}') {
                dispatch({
                  type: 'dailyAndMonthlyReport/fetch',
                  payload: { sortOptions: [{ fieldName: sorter.field, orderBy: sorter.order }] },
                });
              } else {
                dispatch({
                  type: 'dailyAndMonthlyReport/fetch',
                });
              }
            }
          }}
        />
        <PaginationComp style={{ marginTop: 10 }} {...pageOpts} />
      </div>
    );
  }
}

export default DailyMonthlyTable;
