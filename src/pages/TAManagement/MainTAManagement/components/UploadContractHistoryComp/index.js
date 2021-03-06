import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, Form, Icon, Row, Spin, Table, Tooltip } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import PaginationComp from '@/components/PaginationComp';
import styles from './index.less';
import { getUrl, handleDownFile, isNvl } from '@/utils/utils';
import { hasAllPrivilege } from '@/utils/PrivilegeUtil';
import { getKeyValue } from '../../../utils/pubUtils';
import FriendlyDatePicker from '@/components/FriendlyDatePicker';

const downUrl = `${getUrl()}/common/downloadFile`;
const downAllFilesUrl = `${getUrl()}/b2b/agent/common/downloadAllFiles`;

const mapStateToProps = store => {
  const { loading } = store;
  const { selectTaId } = store.mainTAManagement;
  const {
    searchContractForm,
    searchContractList = {
      total: 0,
      currentPage: 1,
      pageSize: 10,
    },
    contractList = [],
    qryContractHistoryLoading = false,
  } = store.uploadContractHistory;
  return {
    selectTaId,
    searchContractForm,
    searchContractList,
    contractList,
    qryContractHistoryLoading: loading.effects['uploadContractHistory/removeContractHistoryFiles'] || qryContractHistoryLoading ,
  };
};

@Form.create()
@connect(mapStateToProps)
class UploadContractHistoryComp extends PureComponent {
  componentDidMount() {
    const { dispatch, form, searchContractList } = this.props;
    form.resetFields();
    dispatch({
      type: 'stateChangeHistory/doCleanData',
    }).then(() => {
      this.searchContactHisList('1', searchContractList.pageSize, searchContractList.total);
    });
  }

  getColumns = () => [
    {
      title: formatMessage({ id: 'TA_TABLE_NO' }),
      dataIndex: 'number',
      width: '10%',
      render: text => {
        return !isNvl(text) ? text : '-';
      },
    },
    {
      title: formatMessage({ id: 'TA_TABLE_CONTACT_UPLOADED_BY' }),
      dataIndex: 'uploadedBy',
      width: '20%',
      render: text => {
        return !isNvl(text) ? text : '-';
      },
    },
    {
      title: formatMessage({ id: 'TA_TABLE_CONTACT_UPLOADED_TIME' }),
      dataIndex: 'uploadedTime',
      width: '20%',
      render: text => {
        return !isNvl(text) ? moment(text, 'YYYY-MM-DD').format('DD-MMM-YYYY') : '-';
      },
    },
    {
      title: () => (
        <div className={styles.fileList}>
          <span>{formatMessage({ id: 'TA_TABLE_CONTACT_CONTACT_LIST' })}</span>
          <Button type="primary" onClick={this.downloadAllFiles}>
            {formatMessage({ id: 'DOWNLOAD_ALL_FILES' })}
          </Button>
        </div>
      ),
      dataIndex: 'fileList',
      width: '50%',
      render: (text, record) => {
        return (
          <Col span={24}>
            <div className={styles.uploadList}>
              {record &&
                record.fileList &&
                record.fileList.length > 0 &&
                record.fileList.map((item, fileIndex) => (
                  <div key={String(item.number) + Math.random()} className={styles.uploadListItem}>
                    <div className={styles.uploadListItemInfo}>
                      <span>
                        <Icon type="paper-clip" className={styles.uploadListItemInfoPaperClip} />
                        <div className={styles.uploadListItemName}>{item.sourceName}</div>
                        <span className={styles.uploadListItemNameActions}>
                          <Tooltip title={formatMessage({ id: 'COMMON_DOWNLOAD' })}>
                            <Icon 
                              type="download"
                              onClick={() =>
                                handleDownFile(
                                  downUrl,
                                  {
                                    fileName: item.name,
                                    filePath: item.path,
                                    path: item.path,
                                  },
                                  item.sourceName,
                                  () => this.updateDownFileLoading(true),
                                  () => this.updateDownFileLoading(false)
                                )
                              } 
                            />
                          </Tooltip>
                          {hasAllPrivilege(['MAIN_TA_MANAGEMENT_FUNCTION_DELETE_CONTRACT']) && 
                            <Tooltip title={formatMessage({ id: 'COMMON_DELETE' })}>
                              <Icon
                                type="delete"
                                onClick={() => this.deleteContractFile(record, fileIndex)}
                              />
                            </Tooltip>
                          }
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </Col>
        );
      },
    },
    // {
    //   title: formatMessage({ id: 'TA_TABLE_OPERATION' }),
    //   dataIndex: '',
    // },
  ];

  deleteContractFile = async (record, fileIndex) => {
    const { dispatch } = this.props;
    const { fileList } = record;
    if(Array.isArray(fileList) && fileList.length > 0) {
      await dispatch({
        type: 'uploadContractHistory/removeContractHistoryFiles',
        payload: {
          fileIds: [fileList[fileIndex].id],
        },
      });
      this.qryContactHisList();
    }
  }

  downloadAllFiles = () => {
    const { selectTaId } = this.props;
    handleDownFile(
      downAllFilesUrl,
      {
        taId: selectTaId,
        type: "TA_CONTRACT_HISTORY"
      },
      `TA_CONTRACT_HISTORY-${selectTaId}-AllFiles.zip`,
      () => this.updateDownFileLoading(true),
      () => this.updateDownFileLoading(false),
    );
  };

  updateDownFileLoading = flag => {
    const { dispatch } = this.props;
    dispatch({
      type: 'uploadContractHistory/save',
      payload: {
        qryContractHistoryLoading: flag,
      },
    });
  };

  searchContactHisList = (currentPage, pageSize, totalSize) => {
    const { dispatch, searchContractForm, selectTaId } = this.props;
    dispatch({
      type: 'uploadContractHistory/fetchQryContractHistoryList',
      payload: {
        taId: selectTaId,
        uploadedStartTime: searchContractForm.uploadedStartTime,
        uploadedEndTime: searchContractForm.uploadedEndTime,
        pageInfo: {
          totalSize,
          currentPage,
          pageSize,
        },
      },
    });
  };

  qryContactHisList = () => {
    const { searchContractList } = this.props;
    this.searchContactHisList(
      searchContractList.currentPage,
      searchContractList.pageSize,
      searchContractList.total
    );
  };

  resetSearch = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'uploadContractHistory/doSaveData',
      payload: {
        searchContractForm: {
          uploadedStartTime: null,
          uploadedEndTime: null,
        },
      },
    }).then(() => {
      this.qryContactHisList();
    });
  };

  onHandleChange = (key, keyValue, fieldKey) => {
    const { dispatch, form, searchContractForm } = this.props;
    const queryInfo = { ...searchContractForm };
    const noVal = getKeyValue(keyValue);
    form.setFieldsValue(JSON.parse(`{"${fieldKey}":"${noVal}"}`));
    const source = JSON.parse(`{"${key}":"${noVal}"}`);
    Object.assign(queryInfo, source);
    dispatch({
      type: 'uploadContractHistory/save',
      payload: {
        searchContractForm: queryInfo,
      },
    });
  };

  disabledStartDate = startValue => {
    const { form } = this.props;
    const endTime = form.getFieldValue('uploadedEndTime');
    if (!startValue || !endTime) {
      return false;
    }
    return startValue.valueOf() > moment(endTime, 'YYYY-MM-DD').valueOf();
  };

  disabledEndDate = endValue => {
    const { form } = this.props;
    const startTime = form.getFieldValue('uploadedStartTime');
    if (!endValue || !startTime) {
      return false;
    }
    return endValue.valueOf() < moment(startTime, 'YYYY-MM-DD').valueOf();
  };

  render() {
    const {
      form,
      searchContractForm = {},
      searchContractList,
      contractList = [],
      qryContractHistoryLoading = false,
    } = this.props;
    const { getFieldDecorator } = form;
    const startDateOpts = {
      placeholder: formatMessage({ id: 'TA_TABLE_Q_START_TIME' }),
      displayFormat: 'DD-MMM-YYYY',
      searchFormat: 'DDMMYYYY',
      disabledDate: this.disabledStartDate,
      getCalendarContainer: () => document.getElementById(`contactCardView`),
      onChange: date =>
        this.onHandleChange(
          'uploadedStartTime',
          isNvl(date) ? null : date.format('YYYY-MM-DD'),
          'uploadedStartTime'
        ),
    };
    const endDateOpts = {
      placeholder: formatMessage({ id: 'TA_TABLE_Q_END_TIME' }),
      displayFormat: 'DD-MMM-YYYY',
      searchFormat: 'DDMMYYYY',
      disabledDate: this.disabledEndDate,
      getCalendarContainer: () => document.getElementById(`contactCardView`),
      onChange: date =>
        this.onHandleChange(
          'uploadedEndTime',
          isNvl(date) ? null : date.format('YYYY-MM-DD'),
          'uploadedEndTime'
        ),
    };
    const pageOpts = {
      total: searchContractList.total,
      current: searchContractList.currentPage,
      pageSize: searchContractList.pageSize,
      pageChange: (page, pageSize) => {
        this.searchContactHisList(page, pageSize, searchContractList.total);
      },
    };
    const tableOpts = {
      pagination: false,
      footer: () => <PaginationComp {...pageOpts} />,
    };
    return (
      <Card className={styles.uploadCard} id="contactCardView">
        <Spin spinning={qryContractHistoryLoading}>
          <Row type="flex" justify="space-around" className={styles.uploadCardQryRow}>
            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8} className={styles.contractCompCol}>
              {getFieldDecorator('uploadedStartTime', {
                initialValue: !isNvl(searchContractForm.uploadedStartTime)
                  ? moment(searchContractForm.uploadedStartTime, 'YYYY-MM-DD')
                  : null,
              })(<FriendlyDatePicker {...startDateOpts} style={{ width: '100%' }} />)}
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8} className={styles.contractCompCol}>
              {getFieldDecorator('uploadedEndTime', {
                initialValue: !isNvl(searchContractForm.uploadedEndTime)
                  ? moment(searchContractForm.uploadedEndTime, 'YYYY-MM-DD')
                  : null,
              })(<FriendlyDatePicker {...endDateOpts} style={{ width: '100%' }} />)}
            </Col>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={8}
              xl={8}
              xxl={8}
              className={styles.contractCompBtnCol}
            >
              <Button
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => this.qryContactHisList()}
              >
                {formatMessage({ id: 'BTN_SEARCH' })}
              </Button>
              <Button onClick={() => this.resetSearch()}>
                {formatMessage({ id: 'BTN_RESET' })}
              </Button>
            </Col>
          </Row>
        </Spin>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <Table
              size="small"
              className={`tabs-no-padding ${styles.searchTitle}`}
              columns={this.getColumns()}
              rowKey={record => `contractHisList_${String(record.number)}`}
              dataSource={contractList}
              loading={qryContractHistoryLoading}
              scroll={{ x: 660 }}
              {...tableOpts}
            />
          </Col>
        </Row>
      </Card>
    );
  }
}

export default UploadContractHistoryComp;
