import React from 'react';
import { connect } from 'dva';
import { Modal, Table, Button, Form } from 'antd';
import { formatMessage } from 'umi/locale';
import download from '../utils/downLoad';
import styles from './ShowPreviewModal.less';
import PaginationComp from '../../components/PaginationComp';
import { exportReportUrl } from '../services/report';
import { REPORT_AUTHORITY_MAP } from '../../GeneratedReports/ScheduleTask/consts/authority';
import { hasAllPrivilege } from '@/utils/PrivilegeUtil';
import {
  sortListByReportTypeForCommon,
  sortListByReportTypeForPreview,
} from '@/pages/ReportsCenter/utils/reportTypeUtil';

const drawWidth = '60%';
@Form.create()
@connect(({ downloadAdHocReport, loading }) => ({
  downloadAdHocReport,
  loading: loading.effects['downloadAdHocReport/fetchPreviewReport'],
}))
class ShowPreviewModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loadingStatus: false,
    };
  }

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'downloadAdHocReport/clear',
    });
  };

  tableChange = (pagination, filters, sorter) => {
    const {
      dispatch,
      downloadAdHocReport: { reportType, filterList, displayColumnList },
    } = this.props;
    if (JSON.stringify(sorter) !== '{}' && sorter.field && sorter.order) {
      dispatch({
        type: 'downloadAdHocReport/fetchPreviewReport',
        payload: {
          sortList: [{ key: sorter.field, value: sorter.order }],
          reportType,
          filterList,
          displayColumnList,
        },
      });
    } else {
      dispatch({
        type: 'downloadAdHocReport/fetchPreviewReport',
        payload: {
          reportType,
          filterList,
          displayColumnList,
        },
      });
    }
  };

  download = () => {
    const {
      downloadAdHocReport: { filterList, displayColumnList },
      reportType,
    } = this.props;
    const sortList = sortListByReportTypeForCommon(reportType);
    download({
      url: exportReportUrl,
      method: 'POST',
      body: { fileSuffixType: 'xlsx', reportType, filterList, displayColumnList, sortList },
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
  };

  render() {
    const {
      downloadAdHocReport: {
        previewModal,
        currentPage,
        pageSize: nowPageSize,
        totalSize,
        dataList,
        columns,
        filterList,
        displayColumnList,
      },
      loading,
      reportType,
    } = this.props;
    const sortList = sortListByReportTypeForPreview(reportType);
    const pageOpts = {
      total: totalSize,
      current: currentPage,
      pageSize: nowPageSize,
      pageChange: (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
          type: 'downloadAdHocReport/tableChanged',
          payload: {
            reportType,
            filterList,
            sortList,
            displayColumnList,
            pagination: {
              currentPage: page,
              pageSize,
            },
          },
        });
      },
    };
    const otherProps = {
      className: 'no-border',
      scroll: { x: 700 },
    };
    const { loadingStatus } = this.state;
    return (
      <div>
        <Modal
          maskClosable={false}
          visible={previewModal}
          width={drawWidth}
          title={<span className={styles.title}>{`Preview ${reportType}`}</span>}
          onCancel={this.handleCancel}
          footer={
            <div>
              <Button
                type="primary"
                disabled={!hasAllPrivilege([REPORT_AUTHORITY_MAP.REPORT_AUTHORITY_DOWNLOAD])}
                onClick={() => {
                  this.download();
                }}
              >
                {formatMessage({ id: 'REPORT_DOWNLOAD' })}
              </Button>
              <Button onClick={this.handleCancel} style={{ width: 60 }}>
                {formatMessage({ id: 'COMMON_CANCEL' })}
              </Button>
            </div>
          }
          {...otherProps}
        >
          <Table
            className={`tabs-no-padding ${styles.searchTitle}`}
            columns={columns}
            dataSource={dataList}
            pagination={false}
            loading={loading || loadingStatus}
            rowKey={record => record.key}
            size="small"
            scroll={{ x: true }}
            onChange={this.tableChange}
          />
          <PaginationComp style={{ marginTop: 10 }} {...pageOpts} />
        </Modal>
      </div>
    );
  }
}
export default ShowPreviewModal;
