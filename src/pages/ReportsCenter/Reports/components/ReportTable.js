import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Table, Icon, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import PaginationComp from '../../components/PaginationComp';
import styles from '../index.less';

const schedulerIcon = require('../../../../assets/image/scheduler.svg');

@connect(({ report, loading, global }) => ({
  report,
  loading: loading.effects['report/fetch'],
  global,
}))
class PLUTable extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/fetch',
    });
  }

  download = (record = {}) => {
    router.push({
      pathname: `/ReportsCenter/Reports/DownloadAdhocReport`,
      query: { reportType: record.dictName, jobLogCode: record.jobLogCode, page: 'downloadAdhoc' },
    });
  };

  schedule = (record = {}) => {
    router.push({
      pathname: `/ReportsCenter/Reports/Schedule`,
      query: { reportType: record.dictName, reportType2: record.dictDesc },
    });
  };

  render() {
    const {
      loading,
      report: { currentPage, pageSize: nowPageSize, totalSize, dataList },
      global: {
        currentUser: { userType },
      },
    } = this.props;
    const pageOpts = {
      total: totalSize,
      current: currentPage,
      pageSize: nowPageSize,
      pageChange: (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
          type: 'report/search',
          payload: {
            pagination: {
              currentPage: page,
              pageSize,
            },
          },
        });
      },
    };

    const columns = [
      {
        title: formatMessage({ id: 'REPORT_NO' }),
        dataIndex: 'no',
        width: 80,
        render: (text, row, index) => index + (currentPage - 1) * nowPageSize + 1,
      },
      {
        title: formatMessage({ id: 'REPORT_TYPE' }),
        dataIndex: 'dictDesc',
        sorter: (a, b) => (a.dictName > b.dictName ? -1 : 1),
        sortDirections: ['descend', 'ascend'],
        className: styles.reportNameColumn,
      },
      {
        title: formatMessage({ id: 'REPORT_OPERATION' }),
        dataIndex: 'operation',
        width: 140,
        render: (_, record) => {
          return (
            <div>
              <Tooltip title={formatMessage({ id: 'REPORT_SCHEDULE' })}>
                <img
                  style={{ cursor: 'pointer' }}
                  src={schedulerIcon}
                  alt={formatMessage({ id: 'REPORT_SCHEDULE' })}
                  className={styles.scheulerStyle}
                  onClick={() => {
                    this.schedule(record);
                  }}
                  // className={userType !== '01' ? styles.hideIcon : undefined}
                />
              </Tooltip>
              <Tooltip title="Ad-hoc Download">
                <Icon
                  type="download"
                  onClick={() => {
                    this.download(record);
                  }}
                />
              </Tooltip>
            </div>
          );
        },
      },
    ];

    return (
      <div>
        <Table
          loading={loading}
          className={`tabs-no-padding ${styles.searchTitle}`}
          style={{ marginTop: 10 }}
          bordered={false}
          size="small"
          columns={columns}
          dataSource={dataList}
          pagination={false}
          rowKey={record => record.jobCode}
          scroll={{ x: 660 }}
        />
        <PaginationComp style={{ marginTop: 10 }} {...pageOpts} />
      </div>
    );
  }
}

export default PLUTable;
