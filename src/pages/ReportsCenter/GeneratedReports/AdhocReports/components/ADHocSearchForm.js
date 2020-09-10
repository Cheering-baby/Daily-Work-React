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
@connect(({ adhoc, loading }) => ({
  adhoc,
  reportNameLoadingFlag: loading.effects['adhoc/fetchReportNameListData'],
}))
class ADHocReportSearchForm extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'adhoc/reportTypeSelect',
    });
    dispatch({
      type: 'adhoc/reportFrequency',
    });
  }

  handleSearch = ev => {
    ev.preventDefault();
    const {
      dispatch,
      form,
      adhoc: { reportTypeOptions },
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
        type: 'adhoc/search',
        payload: {
          filter: {
            likeParam: {
              taskName: values.reportName,
              reportTypes: values.reportType ? [values.reportType] : reportTypes,
              cronTypeList: values.cronTypeList ? [values.cronTypeList] : ['03'],
              endCreateTime,
              startCreateTime,
            },
          },
        },
      });
    });
  };

  search = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adhoc/search',
      payload: {
        filter: {
          likeParam: {
            reportType: value,
          },
        },
      },
    });
  };

  searchReportType = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adhoc/fetch',
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
      adhoc: { reportTypeOptions },
    } = this.props;
    const reportTypes =
      reportTypeOptions && reportTypeOptions.length > 0 && reportTypeOptions.map(i => i.value);
    form.resetFields();
    dispatch({
      type: 'adhoc/reset',
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
      adhoc: { reportTypeOptions, cronTypeOptions },
    } = this.props;
    const reportTypes =
      reportTypeOptions && reportTypeOptions.length > 0 && reportTypeOptions.map(i => i.value);
    const cronTypeOptionsList = cronTypeOptions.filter(item => item.dictName === 'Ad-hoc');
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
        type: 'adhoc/fetchReportNameListData',
        payload: {
          taskName: value ? value.trim() : '',
          reportTypes: reportTypes ? reportTypes.join() : '',
          cronTypeList: cronType ? cronType.join() : '',
        },
      });
      dispatch({
        type: 'adhoc/save',
        payload: {
          taskName: value ? value.trim() : '',
        },
      });
    }, 300);
  };

  render() {
    const {
      form: { getFieldDecorator },
      adhoc: { reportTypeOptions, cronTypeOptions, loadingStatus, reportNameOptions, taskName },
      reportNameLoadingFlag,
    } = this.props;

    const cronTypeOptionsList = cronTypeOptions.filter(item => item.dictName === 'Ad-hoc');

    return (
      <Spin spinning={loadingStatus}>
        <Form onSubmit={this.handleSearch}>
          <div className={styles.searchDiv}>
            <Row>
              <Col className={styles.inputColStyle} xs={12} sm={12} md={6}>
                <FormItem>
                  {getFieldDecorator('reportName')(
                    <Select
                      notFoundContent={reportNameLoadingFlag ? <Spin size="small" /> : null}
                      loading={reportNameLoadingFlag}
                      placeholder="Search(Report Name)"
                      allowClear
                      optionFilterProp="children"
                      defaultActiveFirstOption={false}
                      onSearch={this.onSearch}
                      onFocus={this.onSearch}
                      showSearch
                      dropdownClassName={styles.reportNameSelect}
                    >
                      {taskName &&
                        reportNameOptions &&
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
                  {getFieldDecorator('reportType')(
                    <Select
                      placeholder={formatMessage({ id: 'REPORT_TYPE' })}
                      className={styles.inputStyle}
                      allowClear
                      showSearch
                      dropdownClassName={styles.reportNameSelect}
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
                  {getFieldDecorator('cronTypeList')(
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
                  {getFieldDecorator('generateDate')(
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

export default ADHocReportSearchForm;
