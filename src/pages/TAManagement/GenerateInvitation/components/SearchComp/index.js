import React, { Component } from 'react';
import { Button, Col, DatePicker, Form, Input, Row, Select, Spin } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { isNvl } from '@/utils/utils';

const mapStateToProps = store => {
  const {
    taId = null,
    searchForm = {
      email: null,
      invitationStartDate: null,
      invitationEndDate: null,
      status: null,
    },
    searchList = {
      total: 0,
      currentPage: 1,
      pageSize: 10,
    },
    qryInvitationTableLoading = false,
    statusList = [],
    viewId = 'invitationView',
  } = store.generateInvitation;
  return {
    taId,
    searchForm,
    searchList,
    qryInvitationTableLoading,
    statusList,
    viewId,
  };
};

@Form.create()
@connect(mapStateToProps)
class SearchComp extends Component {
  componentDidMount() {
    const { form } = this.props;
    form.resetFields();
  }

  getKeyValue = keyValue => {
    let noVal = '';
    if (!isNvl(keyValue)) {
      noVal = String(keyValue);
      noVal = noVal.replace(/\n/g, '\\n');
      noVal = noVal.replace(/\r/g, '\\r');
      noVal = noVal.replace(/(^[ \f\t\v]*)|([ \f\t\v]*$)/g, '');
    }
    return noVal;
  };

  onHandleChange = (key, keyValue, fieldKey) => {
    const { dispatch, form, searchForm } = this.props;
    const searchNewForm = { ...searchForm };
    const noVal = this.getKeyValue(keyValue);
    form.setFieldsValue(JSON.parse(`{"${fieldKey}":"${noVal}"}`));
    const source = JSON.parse(`{"${key}":"${noVal}"}`);
    Object.assign(searchNewForm, source);
    dispatch({
      type: 'generateInvitation/save',
      payload: {
        searchForm: searchNewForm,
      },
    });
  };

  disabledStartDate = startValue => {
    const { form } = this.props;
    const endTime = form.getFieldValue('invitationEndDate');
    if (!startValue || !endTime) {
      return false;
    }
    return startValue.valueOf() > moment(endTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
  };

  disabledEndDate = endValue => {
    const { form } = this.props;
    const startTime = form.getFieldValue('invitationStartDate');
    if (!endValue || !startTime) {
      return false;
    }
    return endValue.valueOf() < moment(startTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
  };

  resetSearch = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'generateInvitation/doSaveData',
      payload: {
        searchForm: {
          email: null,
          invitationStartDate: null,
          invitationEndDate: null,
          status: null,
        },
      },
    }).then(() => {
      this.searchInvitationList();
    });
  };

  searchInvitationList = () => {
    const { dispatch, taId, searchForm, searchList } = this.props;
    dispatch({
      type: 'generateInvitation/fetchQryInvitationRecordList',
      payload: {
        taId,
        email: searchForm.email || null,
        invitationStartDate: searchForm.invitationStartDate || null,
        invitationEndDate: searchForm.invitationEndDate || null,
        status: searchForm.status || null,
        pageInfo: {
          totalSize: searchList.total,
          currentPage: 1,
          pageSize: searchList.pageSize || '10',
        },
      },
    });
  };

  render() {
    const { form, searchForm, qryInvitationTableLoading, statusList, viewId } = this.props;
    const { getFieldDecorator } = form;
    const startDateOpts = {
      placeholder: formatMessage({ id: 'GI_Q_BEGIN_INVITATION_DATE' }),
      disabledDate: this.disabledStartDate,
      format: 'DD-MMM-YYYY',
      getCalendarContainer: () => document.getElementById(`${viewId}`),
      onChange: date =>
        this.onHandleChange(
          'invitationStartDate',
          isNvl(date) ? date : date.format('YYYYMMDD'),
          'invitationStartDate'
        ),
    };
    const endDateOpts = {
      placeholder: formatMessage({ id: 'GI_Q_END_INVITATION_DATE' }),
      disabledDate: this.disabledEndDate,
      format: 'DD-MMM-YYYY',
      getCalendarContainer: () => document.getElementById(`${viewId}`),
      onChange: date =>
        this.onHandleChange(
          'invitationEndDate',
          isNvl(date) ? date : date.format('YYYYMMDD'),
          'invitationEndDate'
        ),
    };
    return (
      <Spin spinning={qryInvitationTableLoading}>
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} className={styles.searchCompCol}>
            {getFieldDecorator('email', {
              initialValue: searchForm.email || null,
            })(
              <Input
                placeholder={formatMessage({ id: 'GI_Q_EMAIL_ADDRESS' })}
                onChange={e => this.onHandleChange('email', e.target.value, 'email')}
                onPressEnter={e => this.onHandleChange('email', e.target.value, 'email')}
                allowClear
              />
            )}
          </Col>
          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} className={styles.searchCompCol}>
            {getFieldDecorator('invitationStartDate', {
              initialValue: !isNvl(searchForm.invitationStartDate)
                ? moment(searchForm.invitationStartDate, 'YYYY-MM-DD HH:mm:ss')
                : null,
            })(<DatePicker {...startDateOpts} style={{ width: '100%' }} />)}
          </Col>
          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} className={styles.searchCompCol}>
            {getFieldDecorator('invitationEndDate', {
              initialValue: !isNvl(searchForm.invitationEndDate)
                ? moment(searchForm.invitationEndDate, 'YYYY-MM-DD HH:mm:ss')
                : null,
            })(<DatePicker {...endDateOpts} style={{ width: '100%' }} />)}
          </Col>
          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} className={styles.searchCompCol}>
            {getFieldDecorator('status', {
              initialValue: searchForm.status || [],
            })(
              <Select
                allowClear
                showSearch
                placeholder={formatMessage({ id: 'GI_Q_STATUS' })}
                optionFilterProp="children"
                getPopupContainer={() => document.getElementById(`${viewId}`)}
                onChange={value => this.onHandleChange('status', value, 'status')}
                style={{ width: '100%' }}
              >
                {statusList && statusList.length > 0
                  ? statusList.map(item => (
                    <Select.Option key={`statusList${item.dictId}`} value={`${item.dictId}`}>
                      {item.dictName}
                    </Select.Option>
                    ))
                  : null}
              </Select>
            )}
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col span={24} className={styles.searchCompBtnCol}>
            <Button
              type="primary"
              style={{ marginRight: 8 }}
              onClick={() => this.searchInvitationList()}
            >
              {formatMessage({ id: 'BTN_SEARCH' })}
            </Button>
            <Button onClick={() => this.resetSearch()}>{formatMessage({ id: 'BTN_RESET' })}</Button>
          </Col>
        </Row>
      </Spin>
    );
  }
}

export default SearchComp;
