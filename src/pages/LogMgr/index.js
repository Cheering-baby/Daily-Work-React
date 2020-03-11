import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import { isEqual } from 'lodash';
import BasicTable from '@/components/BasicTable';
import ExportFileButton from '@/components/FileOperation/ExportFileButton';
import styles from './index.less';

const { Option } = Select;
const FormItem = Form.Item;
const formItemLayout = {
  wrapperCol: {
    span: 24,
  },
};
const ColProps = {
  xs: 8,
  sm: 8,
  md: 8,
  xl: 8,
};

const excelServiceURL = '/log/excelExport';
const csvServiceURL = '/log/csvExport';

@Form.create()
@connect(({ logMgr, loading, global }) => ({
  logMgr,
  fetchLoading: loading.effects['logMgr/fetch'],
  format: global.sysparams.dateFormat,
}))
class logMgr extends PureComponent {
  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
  };

  constructor(props) {
    super(props);

    this.columns = [
      {
        title: formatMessage({ id: 'LOG_LOGTIME' }),
        dataIndex: 'logTime',
        key: 'logTime',
        sorter: (a, b) => (a.logTime > b.logTime ? -1 : 1),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: formatMessage({ id: 'LOG_LOGTYPE' }),
        dataIndex: 'logType',
        key: 'logType',
        sorter: (a, b) => (a.logType > b.logType ? -1 : 1),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: formatMessage({ id: 'LOG_OPERUSERCODE' }),
        dataIndex: 'operUserCode',
        key: 'operUserCode',
        sorter: (a, b) => (a.operUserCode > b.operUserCode ? -1 : 1),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: formatMessage({ id: 'LOG_STATE' }),
        dataIndex: 'state',
        key: 'state',
        sorter: (a, b) => (a.state > b.state ? -1 : 1),
        sortDirections: ['descend', 'ascend'],
        render: state =>
          state === 'S' ? formatMessage({ id: 'LOG_SUCCESS' }) : formatMessage({ id: 'LOG_FAIR' }),
      },
      {
        title: formatMessage({ id: 'LOG_COMMENTS' }),
        dataIndex: 'comment',
        key: 'comment',
        sorter: (a, b) => (a.comment > b.comment ? -1 : 1),
        sortDirections: ['descend', 'ascend'],
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'logMgr/fetch',
    });

    // operUserCode dropdown box data
    dispatch({
      type: 'logMgr/queryLogType',
    });
  }

  get formData() {
    const { form } = this.props;
    const { getFieldsValue } = form;
    const values = getFieldsValue();

    Object.keys(values).forEach(k => {
      values[k] = values[k] || null;

      if (k === 'fromDate' || k === 'toDate') {
        if (values[k]) {
          values[k] = values[k].format();
        }
      }
    });

    return values;
  }

  handleTableChange = page => {
    const {
      dispatch,
      logMgr: { pagination },
    } = this.props;

    // page change
    if (!isEqual(page, pagination)) {
      dispatch({
        type: 'logMgr/tableChanged',
        payload: {
          pagination: page,
        },
      });
    }
  };

  search = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'logMgr/search',
      payload: {
        values: this.formData,
      },
    });
  };

  disabledStartDate = startValue => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    // Start time is longer than end time, disable
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    // When the end time is less than or equal to the start time, disable
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = value => {
    this.onChange('startValue', value);
  };

  onEndChange = value => {
    this.onChange('endValue', value);
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };

  reset = () => {
    const {
      form: { getFieldsValue, setFieldsValue },
      dispatch,
    } = this.props;

    Object.keys(getFieldsValue()).forEach(key => {
      setFieldsValue({ [key]: undefined });
    });

    dispatch({
      type: 'logMgr/fetch',
    });
  };

  renderButtons = () => {
    const param = {
      excelServiceURL,
      csvServiceURL,
      requestMethod: 'POST',
      getCSVServiceParam: () => this.formData,
      getExcelServiceParam: () => this.formData,
    };

    return (
      <div>
        <Button
          id="logMgr-index-searchButton"
          type="primary"
          onClick={() => {
            this.search();
          }}
        >
          {formatMessage({ id: 'LOG_SEARCH' })}
        </Button>

        <Button id="logMgr-index-resetButton" onClick={this.reset}>
          {formatMessage({ id: 'LOG_RESET' })}
        </Button>

        <ExportFileButton {...param} text="Export file" showPDFBtn={false} />
      </div>
    );
  };

  render() {
    let {
      /* eslint-disable */
      form: { getFieldDecorator },
      logMgr: { list = [], pagination, queryLogTypeList },
      fetchLoading,
    } = this.props;

    list = list.map(item => {
      const tmp = queryLogTypeList.find(_ => item.logType === _.paramCode) || '';
      return {
        ...item,
        logType: tmp && tmp.paramValue,
      };
    });

    const { endOpen } = this.state;

    const dataSource = {
      list,
      pagination,
    };

    const otherProps = {
      className: 'no-border',
      title: () => this.renderButtons(),
    };
    const formNode = (
      <Row gutter={24} id="logMgr-index-row" className={styles.formWrap}>
        <Form id="logMgr-index-form">
          <Col {...ColProps} id="logMgr-index-startDateCol">
            <FormItem {...formItemLayout} id="logMgr-index-startDateFormItem">
              {getFieldDecorator('fromDate')(
                <DatePicker
                  disabledDate={this.disabledStartDate}
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'LOG_FROM_DATE' })}
                  onChange={this.onStartChange}
                  onOpenChange={this.handleStartOpenChange}
                />
              )}
            </FormItem>
          </Col>
          <Col {...ColProps} id="logMgr-index-endDateCol">
            <FormItem {...formItemLayout} id="logMgr-index-endDateColFormItem">
              {getFieldDecorator(
                'toDate',
                {}
              )(
                <DatePicker
                  id="logMgr-index-endDateColDatePicker"
                  disabledDate={this.disabledEndDate}
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'LOG_TO_DATE' })}
                  onChange={this.onEndChange}
                  open={endOpen}
                  onOpenChange={this.handleEndOpenChange}
                />
              )}
            </FormItem>
          </Col>
          <Col {...ColProps} id="logMgr-index-logTypeCol">
            <FormItem {...formItemLayout} id="logMgr-index-logTypeFormItem">
              {getFieldDecorator(
                'logType',
                {}
              )(
                <Select
                  id="logMgr-index-logTypeSelect"
                  placeholder={formatMessage({ id: 'LOG_LOGTYPE' })}
                  optionFilterProp="children"
                  style={{ width: '100%' }}
                  allowClear="true"
                >
                  {queryLogTypeList.map(logType => (
                    <Option
                      id="logMgr-index-logTypeSelectOption"
                      key={`logType_option_${logType.paramCode}`}
                      value={logType.paramCode}
                    >
                      {logType.paramValue}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...ColProps} id="logMgr-index-operusecodeCol">
            <FormItem {...formItemLayout} id="logMgr-index-operusecodeFormItem">
              {getFieldDecorator(
                'name',
                {}
              )(
                <Input
                  id="logMgr-index-operUserCodeInput"
                  type="text"
                  placeholder={formatMessage({ id: 'LOG_OPERUSERCODE' })}
                />
              )}
            </FormItem>
          </Col>
          <Col {...ColProps} id="logMgr-index-stateCol">
            <FormItem {...formItemLayout} id="logMgr-index-stateFormItem">
              {getFieldDecorator(
                'state',
                {}
              )(
                <Select
                  id="logMgr-index-stateSelect"
                  allowClear="true"
                  optionFilterProp="children"
                  placeholder={formatMessage({ id: 'LOG_STATE' })}
                  style={{ width: '100%' }}
                >
                  <Option value="S">Success</Option>
                  <Option value="F">Failure</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Form>
      </Row>
    );

    return (
      <Card className="card-no-padding has-shadow no-border" id="logMgr-index-card">
        {formNode}
        <BasicTable
          id="logMgr-index-basicTable"
          data={dataSource}
          loading={fetchLoading}
          columns={this.columns}
          onChange={this.handleTableChange}
          {...otherProps}
        />
      </Card>
    );
  }
}

export default logMgr;
