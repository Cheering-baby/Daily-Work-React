import React, { Component } from 'react';
import { connect } from 'dva';
import { Col, Row, Select, DatePicker, Button, Form, Spin } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import styles from '../index.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
let timeout;

@Form.create()
@connect(({ dailyAndMonthlyReport, user, loading }) => ({
  dailyAndMonthlyReport,
  user,
  reportNameLoadingFlag: loading.effects['dailyAndMonthlyReport/fetchReportNameListData'],
}))
class DailyMonthlySearchForm extends Component {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'dailyAndMonthlyReport/reportTypeSelect',
    });
    dispatch({
      type: 'dailyAndMonthlyReport/reportFrequency',
    });
  }

  handleSearch = ev => {
    ev.preventDefault();
    const {
      dispatch,
      form,
      dailyAndMonthlyReport: { reportTypeOptions },
    } = this.props;
    const reportTypes =
      reportTypeOptions && reportTypeOptions.length > 0 && reportTypeOptions.map(i => i.value);
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let startCreateTime = null;
      let endCreateTime = null;
      Object.keys(values).forEach(k => {
        const value = values[k];
        if (k === 'generateDate') {
          startCreateTime = value
            ? new Date(
                moment(value[0])
                  .format('YYYY-MM-DD')
                  .replace(/-/g, '/')
              ).getTime()
            : '';
          endCreateTime = value
            ? new Date(
                moment(value[1])
                  .format('YYYY-MM-DD')
                  .replace(/-/g, '/')
              ).getTime()
            : '';
        }
      });
      dispatch({
        type: 'dailyAndMonthlyReport/search',
        payload: {
          filter: {
            likeParam: {
              taskName: values.reportName,
              reportTypes: values.reportType ? [values.reportType] : reportTypes,
              cronTypeList: values.cronTypeList ? [values.cronTypeList] : ['01', '02'],
              endCreateTime,
              startCreateTime,
            },
          },
        },
      });
    });
  };

  searchReportType = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dailyAndMonthlyReport/fetch',
      payload: {
        filter: {
          likeParam: {
            reportType: value,
          },
        },
      },
    });
  };

  handleReset = () => {
    const {
      dispatch,
      form,
      dailyAndMonthlyReport: { reportTypeOptions },
    } = this.props;
    const reportTypes =
      reportTypeOptions && reportTypeOptions.length > 0 && reportTypeOptions.map(i => i.value);
    form.resetFields();
    dispatch({
      type: 'dailyAndMonthlyReport/reset',
      payload: {
        currentPage: 1,
        pageSize: 10,
        reportTypes,
      },
    });
  };

  onSearch = value => {
    const {
      dispatch,
      dailyAndMonthlyReport: { reportTypeOptions, cronTypeOptions },
    } = this.props;
    const reportTypes =
      reportTypeOptions && reportTypeOptions.length > 0 && reportTypeOptions.map(i => i.value);
    const cronTypeOptionsList = cronTypeOptions.filter(item => item.dictName !== 'Ad-hoc');
    const cronType =
      cronTypeOptionsList &&
      cronTypeOptionsList.length > 0 &&
      cronTypeOptionsList.map(i => i.dictId);
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => {
      dispatch({
        type: 'dailyAndMonthlyReport/fetchReportNameListData',
        payload: {
          taskName: value ? value.trim() : '',
          reportTypes: reportTypes ? reportTypes.join() : '',
          cronTypeList: cronType ? cronType.join() : '',
        },
      });
      dispatch({
        type: 'dailyAndMonthlyReport/save',
        payload: {
          taskName: value ? value.trim() : '',
        },
      });
    }, 300);
  };

  render() {
    const {
      form: { getFieldDecorator },
      dailyAndMonthlyReport: {
        reportTypeOptions,
        cronTypeOptions,
        loadingStatus,
        reportNameOptions,
      },
      reportNameLoadingFlag,
    } = this.props;

    const cronTypeOptionsList = cronTypeOptions.filter(item => item.dictName !== 'Ad-hoc');
    return (
      <Spin spinning={loadingStatus}>
        <Form onSubmit={this.handleSearch}>
          <div className={styles.searchDiv}>
            <Row>
              <Col className={styles.inputColStyle} xs={12} sm={12} md={6}>
                <FormItem>
                  {getFieldDecorator('reportName', {
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })(
                    <Select
                      notFoundContent={reportNameLoadingFlag ? <Spin size="small" /> : null}
                      loading={reportNameLoadingFlag}
                      placeholder="Search(Report Name)"
                      allowClear
                      onSearch={this.onSearch}
                      onFocus={this.onSearch}
                      showSearch
                      dropdownClassName={styles.reportNameSelect}
                    >
                      {reportNameOptions &&
                        reportNameOptions.map(item => (
                          <Option key={item.key} value={item.value}>
                            {item.value}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col className={styles.inputColStyle} xs={12} sm={12} md={6}>
                <FormItem>
                  {getFieldDecorator('reportType', {
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })(
                    <Select
                      placeholder={formatMessage({ id: 'REPORT_TYPE' })}
                      className={styles.inputStyle}
                      allowClear
                      showSearch
                    >
                      {reportTypeOptions &&
                        reportTypeOptions.map(item => (
                          <Option key={item.value} value={item.value}>
                            {item.text}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col className={styles.inputColStyle} xs={12} sm={12} md={6}>
                <FormItem>
                  {getFieldDecorator('cronTypeList', {
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })(
                    <Select
                      placeholder={formatMessage({ id: 'REPORT_FREQUENCEY' })}
                      className={styles.inputStyle}
                      allowClear
                      showSearch
                    >
                      {cronTypeOptionsList &&
                        cronTypeOptionsList.map(item => (
                          <Option key={item.dictId} value={item.dictId}>
                            {item.dictName}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col className={styles.inputColStyle} xs={12} sm={12} md={6}>
                <FormItem>
                  {getFieldDecorator('generateDate', {
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })(
                    <RangePicker
                      placeholder={['Generated Date Start', 'Generated Date End']}
                      format="DD-MMM-YYYY"
                      style={{ width: '100%' }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col className={styles.buttonColStyle} xs={12} sm={12} md={6}>
                <Button className={styles.searchButton} onClick={this.handleReset}>
                  Reset
                </Button>
                <Button type="primary" className={styles.searchButton} htmlType="submit">
                  Search
                </Button>
              </Col>
            </Row>
          </div>
        </Form>
      </Spin>
    );
  }
}

export default DailyMonthlySearchForm;
