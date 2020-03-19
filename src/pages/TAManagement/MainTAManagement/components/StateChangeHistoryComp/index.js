import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Badge, Button, Card, Col, DatePicker, Form, Row, Spin, Table } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import PaginationComp from '../PaginationComp';
import styles from './index.less';
import { isNvl } from '@/utils/utils';
import { getKeyValue } from '../../../utils/pubUtils';

const mapStateToProps = store => {
  const { selectTaId } = store.mainTAManagement;
  const {
    searchStateForm = {},
    searchStateList = {
      total: 0,
      currentPage: 1,
      pageSize: 10,
    },
    historyList = [],
    qryStateHistoryLoading = false,
  } = store.stateChangeHistory;
  return {
    selectTaId,
    searchStateForm,
    searchStateList,
    historyList,
    qryStateHistoryLoading,
  };
};

@Form.create()
@connect(mapStateToProps)
class StateChangeHistoryComp extends PureComponent {
  componentDidMount() {
    const { dispatch, form, searchStateList } = this.props;
    form.resetFields();
    dispatch({
      type: 'stateChangeHistory/doCleanData',
    }).then(() => {
      this.searchStateHisList('1', searchStateList.pageSize, searchStateList.total);
    });
  }

  searchStateHisList = (currentPage, pageSize, totalSize) => {
    const { dispatch, searchStateForm, selectTaId } = this.props;
    dispatch({
      type: 'stateChangeHistory/fetchQryProfileStatusHistoryList',
      payload: {
        taId: selectTaId,
        type: 'ta',
        uploadedStartTime: searchStateForm.uploadedStartTime,
        uploadedEndTime: searchStateForm.uploadedEndTime,
        pageInfo: {
          totalSize,
          currentPage,
          pageSize,
        },
      },
    });
  };

  qryStateHisList = () => {
    const { searchStateList } = this.props;
    this.searchStateHisList(
      searchStateList.currentPage,
      searchStateList.pageSize,
      searchStateList.totalSize
    );
  };

  resetSearch = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'stateChangeHistory/doSaveData',
      payload: {
        searchStateForm: {
          uploadedStartTime: null,
          uploadedEndTime: null,
        },
      },
    }).then(() => {
      this.qryStateHisList();
    });
  };

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
      dataIndex: 'updatedBy',
      width: '20%',
      render: text => {
        return !isNvl(text) ? text : '-';
      },
    },
    {
      title: formatMessage({ id: 'TA_TABLE_CONTACT_UPLOADED_TIME' }),
      dataIndex: 'updatedTime',
      width: '20%',
      render: text => {
        return !isNvl(text) ? moment(text, 'YYYY-MM-DD HH:mm:ss').format('DD-MMM-YYYY') : '-';
      },
    },
    {
      title: formatMessage({ id: 'TA_TABLE_STATE_STATUS_BEFORE' }),
      dataIndex: 'statusBefore',
      width: '25%',
      render: text => this.getStatus(text),
    },
    {
      title: formatMessage({ id: 'TA_TABLE_STATE_STATUS_AFTER' }),
      dataIndex: 'statusAfter',
      width: '25%',
      render: text => this.getStatus(text),
    },
  ];

  getStatus = text => {
    let statusStr = 'default';
    let statusTxt = '';
    switch (String(text).toLowerCase()) {
      case 'active':
        statusStr = 'success';
        statusTxt = formatMessage({ id: 'TA_STATUS_ACTIVE' });
        break;
      case 'inactive':
        statusStr = 'default';
        statusTxt = formatMessage({ id: 'TA_STATUS_INACTIVE' });
        break;
      default:
        statusStr = 'default';
        statusTxt = formatMessage({ id: 'TA_STATUS_INACTIVE' });
        break;
    }
    return <Badge status={statusStr} text={statusTxt || null} />;
  };

  onHandleChange = (key, keyValue, fieldKey) => {
    const { dispatch, form, searchStateForm } = this.props;
    const queryInfo = { ...searchStateForm };
    const noVal = getKeyValue(keyValue);
    form.setFieldsValue(JSON.parse(`{"${fieldKey}":"${noVal}"}`));
    const source = JSON.parse(`{"${key}":"${noVal}"}`);
    Object.assign(queryInfo, source);
    dispatch({
      type: 'stateChangeHistory/save',
      payload: {
        searchStateForm: queryInfo,
      },
    });
  };

  disabledStartDate = startValue => {
    const { form } = this.props;
    const endTime = form.getFieldValue('uploadedEndTime');
    if (!startValue || !endTime) {
      return false;
    }
    return startValue.valueOf() > moment(endTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
  };

  disabledEndDate = endValue => {
    const { form } = this.props;
    const startTime = form.getFieldValue('uploadedStartTime');
    if (!endValue || !startTime) {
      return false;
    }
    return endValue.valueOf() < moment(startTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
  };

  render() {
    const {
      form,
      searchStateForm,
      searchStateList,
      historyList,
      qryStateHistoryLoading,
    } = this.props;
    const { getFieldDecorator } = form;
    const startDateOpts = {
      placeholder: formatMessage({ id: 'TA_TABLE_Q_START_TIME' }),
      format: 'DD-MMM-YYYY',
      disabledDate: this.disabledStartDate,
      getCalendarContainer: () => document.getElementById(`stateCardView`),
      onChange: date =>
        this.onHandleChange(
          'updatedStartTime',
          isNvl(date) ? date : date.format('YYYYMMDD'),
          'updatedStartTime'
        ),
    };
    const endDateOpts = {
      placeholder: formatMessage({ id: 'TA_TABLE_Q_END_TIME' }),
      format: 'DD-MMM-YYYY',
      disabledDate: this.disabledEndDate,
      getCalendarContainer: () => document.getElementById(`stateCardView`),
      onChange: date =>
        this.onHandleChange(
          'updatedEndTime',
          isNvl(date) ? date : date.format('YYYYMMDD'),
          'updatedEndTime'
        ),
    };
    const pageOpts = {
      total: searchStateList.total,
      current: searchStateList.currentPage,
      pageSize: searchStateList.pageSize,
      pageChange: (page, pageSize) => {
        this.searchStateHisList(page, pageSize, searchStateList.total);
      },
    };
    const tableOpts = {
      pagination: false,
      footer: () => <PaginationComp {...pageOpts} />,
    };
    return (
      <Card className={styles.stateCard} id="stateCardView">
        <Spin spinning={qryStateHistoryLoading}>
          <Row type="flex" justify="space-around" className={styles.stateCardQryRow}>
            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8} className={styles.stateCompCol}>
              {getFieldDecorator('uploadedStartTime', {
                initialValue: !isNvl(searchStateForm.uploadedStartTime)
                  ? moment(searchStateForm.uploadedStartTime, 'YYYY-MM-DD HH:mm:ss')
                  : null,
              })(<DatePicker {...startDateOpts} style={{ width: '100%' }} />)}
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8} className={styles.stateCompCol}>
              {getFieldDecorator('uploadedEndTime', {
                initialValue: !isNvl(searchStateForm.uploadedEndTime)
                  ? moment(searchStateForm.uploadedEndTime, 'YYYY-MM-DD HH:mm:ss')
                  : null,
              })(<DatePicker {...endDateOpts} style={{ width: '100%' }} />)}
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} className={styles.stateCompBtnCol}>
              <Button
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => this.qryStateHisList()}
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
              rowKey={record => `stateHisList_${String(record.number)}`}
              dataSource={historyList || []}
              loading={qryStateHistoryLoading}
              scroll={{ x: 660 }}
              {...tableOpts}
            />
          </Col>
        </Row>
      </Card>
    );
  }
}

export default StateChangeHistoryComp;
