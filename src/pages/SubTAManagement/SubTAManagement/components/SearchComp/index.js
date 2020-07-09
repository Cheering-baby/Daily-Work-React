import React, { PureComponent } from 'react';
import {Button, Col, DatePicker, Form, Input, Row, Select, Spin} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { isNvl } from '@/utils/utils';
import styles from './index.less';
import { getFormKeyValue } from '@/pages/SubTAManagement/utils/pubUtils';
import SortSelect from "@/components/SortSelect";

const mapStateToProps = store => {
  const { searchForm, searchList, qrySubTaTableLoading, viewId, companyList } = store.subTAManagement;
  return {
    searchForm,
    searchList,
    qrySubTaTableLoading,
    viewId,
    companyList
  };
};

const { Option } = Select;
@Form.create()
@connect(mapStateToProps)
class SearchComp extends PureComponent {
  searchSubTAList = () => {
    const { dispatch, searchForm, searchList } = this.props;
    dispatch({
      type: 'subTAManagement/fetchQrySubTAList',
      payload: {
        taCompanyId: searchForm.taCompanyId,
        companyName: searchForm.companyName,
        applyStartDate: searchForm.applyStartDate,
        applyEndDate: searchForm.applyEndDate,
        pageInfo: {
          currentPage: 1,
          pageSize: searchList.pageSize,
          totalSize: searchList.total,
        },
      },
    });
  };

  resetSearch = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'subTAManagement/doSaveData',
      payload: {
        searchForm: {
          companyName: null,
          applyStartDate: null,
          applyEndDate: null,
        },
      },
    }).then(() => {
      this.searchSubTAList();
    });
  };

  onHandleChange = (key, keyValue, fieldKey) => {
    const { dispatch, form, searchForm } = this.props;
    let formInfo = {};
    if (!isNvl(searchForm)) {
      formInfo = { ...searchForm };
    }
    const noVal = getFormKeyValue(keyValue);
    form.setFieldsValue(JSON.parse(`{"${fieldKey}":"${noVal}"}`));
    const source = JSON.parse(`{"${key}":"${noVal}"}`);
    Object.assign(formInfo, source);
    dispatch({
      type: 'subTAManagement/save',
      payload: {
        searchForm: {
          ...formInfo,
        },
      },
    });
  };

  disabledStartDate = startValue => {
    const { form } = this.props;
    const endTime = form.getFieldValue('applyEndDate');
    if (!startValue || !endTime) {
      return false;
    }
    return startValue.valueOf() > moment(endTime, 'YYYY-MM-DD').valueOf();
  };

  disabledEndDate = endValue => {
    const { form } = this.props;
    const startTime = form.getFieldValue('applyStartDate');
    if (!endValue || !startTime) {
      return false;
    }
    return endValue.valueOf() < moment(startTime, 'YYYY-MM-DD').valueOf();
  };

  render() {
    const { form, searchForm, qrySubTaTableLoading, viewId, companyList = [] } = this.props;
    const { getFieldDecorator } = form;
    const startDateOpts = {
      placeholder: formatMessage({ id: 'SUB_TA_M_APPLICATION_START_DATE' }),
      disabledDate: this.disabledStartDate,
      format: 'DD-MMM-YYYY',
      getCalendarContainer: () => document.getElementById(`${viewId}`),
      onChange: date =>
        this.onHandleChange(
          'applyStartDate',
          isNvl(date) ? date : date.format('YYYY-MM-DD'),
          'applyStartDate'
        ),
    };
    const endDateOpts = {
      placeholder: formatMessage({ id: 'SUB_TA_M_APPLICATION_END_DATE' }),
      disabledDate: this.disabledEndDate,
      format: 'DD-MMM-YYYY',
      getCalendarContainer: () => document.getElementById(`${viewId}`),
      onChange: date =>
        this.onHandleChange(
          'applyEndDate',
          isNvl(date) ? date : date.format('YYYY-MM-DD'),
          'applyEndDate'
        ),
    };
    return (
      <Spin spinning={qrySubTaTableLoading}>
        <Row type="flex" justify="space-around">
          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} className={styles.subTaMSearchCompCol}>
            {getFieldDecorator(`taCompanyId`, {
              initialValue: searchForm.taCompanyId !== null ? searchForm.taCompanyId : undefined,
            })(
              <SortSelect
                showSearch
                onChange={value => this.onHandleChange('taCompanyId', value, 'taCompanyId')}
                placeholder={formatMessage({ id: 'MAIN_TA_COMPANY_NAME' })}
                style={{ width: '100%' }}
                allowClear
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                options={companyList.map(item => (
                  <Option key={item.id} value={item.id}>
                    {item.companyName}
                  </Option>
                ))}
              />
            )}
          </Col>
          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} className={styles.subTaMSearchCompCol}>
            {getFieldDecorator('companyName', {
              initialValue: searchForm.companyName || null,
            })(
              <Input
                placeholder={formatMessage({ id: 'SUB_TA_M_SUB_AGENT_COMPANY_NAME' })}
                onChange={e => this.onHandleChange('companyName', e.target.value, 'companyName')}
                onPressEnter={e =>
                  this.onHandleChange('companyName', e.target.value, 'companyName')
                }
                allowClear
              />
            )}
          </Col>
          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} className={styles.subTaMSearchCompCol}>
            {getFieldDecorator('applyStartDate', {
              initialValue: !isNvl(searchForm.applyStartDate)
                ? moment(searchForm.applyStartDate, 'YYYY-MM-DD')
                : null,
            })(<DatePicker {...startDateOpts} style={{ width: '100%' }} />)}
          </Col>
          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} className={styles.subTaMSearchCompCol}>
            {getFieldDecorator('applyEndDate', {
              initialValue: !isNvl(searchForm.applyEndDate)
                ? moment(searchForm.applyEndDate, 'YYYY-MM-DD')
                : null,
            })(<DatePicker {...endDateOpts} style={{ width: '100%' }} />)}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} className={styles.subTaMSearchCompBtnCol}>
            <Button
              type="primary"
              style={{ marginRight: 8 }}
              onClick={() => this.searchSubTAList()}
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
