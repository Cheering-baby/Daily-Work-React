import React from 'react';
import {
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Table,
  Tooltip,
} from 'antd';
import { cloneDeep } from 'lodash';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import moment from 'moment';
import styles from '../New/index.less';
import { reBytesStr } from '@/utils/utils';
import SortSelect from '@/components/SortSelect';

const { confirm } = Modal;
const InputGroup = Input.Group;
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 14,
  },
};
const formItemLayout2 = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

const ColProps = {
  sm: 24,
  md: 12,
};

@Form.create()
@connect(({ commissionNew, detail, loading }) => ({
  commissionNew,
  detail,
  fetchLoading: loading.effects['detail/queryDetail'],
}))
class NewCommission extends React.PureComponent {
  componentDidMount() {
    const { dispatch, tplId, type } = this.props;
    if (type === 'edit') {
      dispatch({
        type: 'detail/queryDetail',
        payload: {
          tplId,
        },
      });
    }
    dispatch({
      type: 'detail/bindingDetail',
      payload: {
        tplId,
        commodityType: 'Offer',
      },
    });
    dispatch({
      type: 'detail/bindingDetail',
      payload: {
        tplId,
        commodityType: 'PackagePlu',
      },
    });
    // dispatch({
    //   type: 'detail/pluDetail',
    //   payload: {
    //     tplId,
    //     commodityType: 'PackagePlu',
    //   },
    // });
  }

  showCommissionTierTitle = () => {
    const {
      form: { getFieldValue },
    } = this.props;
    return getFieldValue('commissionType') === 'Attendance'
      ? formatMessage({ id: 'ATTENDANCE_COMMISSION_TIER' })
      : formatMessage({ id: 'TIERED_COMMISSION_TIER' });
  };

  getCommissionColumns = () => {
    return [
      {
        title: this.showCommissionTierTitle(),
        dataIndex: 'minimum',
        render: (text, record, index) => this.showCommission(text, record, index),
      },
      {
        title: formatMessage({ id: 'COMMISSION_SCHEMA' }),
        dataIndex: 'commissionValue',
        render: (text, record, index) => this.commissionInput(text, record, index),
      },
      {
        title: formatMessage({ id: 'OPERATION' }),
        dataIndex: 'operation',
        render: (text, record, index) => this.operation(text, record, index),
      },
    ];
  };

  handleInitVal = key => {
    const {
      type,
      detail: { commisssionList },
    } = this.props;
    if (type === 'edit' && commisssionList && Object.keys(commisssionList).length > 0) {
      let val = commisssionList[key];
      if (key === 'effectiveDate') {
        val = val ? moment(val) : '';
      } else if (key === 'expiryDate') {
        val = val ? moment(val) : '';
      }
      return val;
    }
  };

  add = () => {
    const {
      detail: { tieredList },
      dispatch,
    } = this.props;
    let arr = cloneDeep(tieredList);
    const isExist = arr.find(({ type }) => type === 'ADD_ROW');
    const isExist2 = arr.find(item => item.EDIT_ROW === true);

    if (arr.length > 0) {
      if (arr[arr.length - 1].minimum > 0 && arr[arr.length - 1].maxmum === '') {
        message.warning('Please fill in the maximum value.');
        return false;
      }
    }

    if (isExist2) {
      message.warning(formatMessage({ id: 'PLEASE_END_THE_CURRENT_EDIT_FIRST' }));
      return false;
    }
    if (isExist === undefined) {
      arr = [{ type: 'ADD_ROW' }, ...tieredList];
    } else {
      message.warning(formatMessage({ id: 'PLEASE_ADD_THE_CURRENT_EDIT_FIRST' }));
      return false;
    }
    dispatch({
      type: 'detail/save',
      payload: {
        tieredList: arr,
        addInput1Min: '',
        addInput1Max: '',
        addInput2: '',
      },
    });
  };

  delete = record => {
    const {
      detail: { tieredList },
      dispatch,
    } = this.props;
    const filterTieredList = tieredList.filter(item => {
      return record !== item;
    });
    dispatch({
      type: 'detail/save',
      payload: {
        tieredList: filterTieredList,
      },
    });
  };

  edit = (record, index) => {
    const {
      detail: { tieredList },
      dispatch,
    } = this.props;
    const arr = tieredList.map((item, idx) => ({ ...item, EDIT_ROW: idx + 1 === index }));
    dispatch({
      type: 'detail/save',
      payload: {
        addInput1Min: record.minimum,
        addInput1Max: record.maxmum,
        addInput2: record.commissionValue,
        tieredList: arr,
      },
    });
  };

  showCommission = (text, record) => {
    let node;
    if (record.type === 'ADD_BUTTON') {
      node = <a onClick={this.add}>+ Add</a>;
    } else if (record.type === 'ADD_ROW') {
      const {
        detail: { addInput1Min, addInput1Max },
        dispatch,
      } = this.props;
      node = (
        <InputGroup compact>
          <Input
            style={{ width: 100, textAlign: 'center' }}
            value={addInput1Min}
            placeholder="Minimum"
            onChange={ev => {
              const val = ev.target.value.replace(/\D/g, '');
              if (val && val.trim().length > 12) {
                return false;
              }
              dispatch({
                type: 'detail/save',
                payload: {
                  addInput1Min: val,
                },
              });
            }}
          />
          <Input
            style={{
              width: 30,
              borderLeft: 0,
              pointerEvents: 'none',
              backgroundColor: '#fff',
            }}
            placeholder="~"
            disabled
          />
          <Input
            style={{ width: 100, textAlign: 'center', borderLeft: 0 }}
            value={addInput1Max}
            placeholder="Maxmum"
            onChange={ev => {
              const val = ev.target.value.replace(/\D/g, '');
              if (val && val.trim().length > 12) {
                return false;
              }
              dispatch({
                type: 'detail/save',
                payload: {
                  addInput1Max: val,
                },
              });
            }}
          />
        </InputGroup>
      );
    } else if (record.EDIT_ROW) {
      const {
        dispatch,
        detail: { addInput1Min, addInput1Max },
      } = this.props;
      node = (
        <InputGroup compact>
          <Input
            style={{ width: 100, textAlign: 'center' }}
            value={addInput1Min}
            placeholder="Minimum"
            onChange={ev => {
              const val = ev.target.value.replace(/\D/g, '');
              if (val && val.trim().length > 12) {
                return false;
              }
              dispatch({
                type: 'detail/save',
                payload: {
                  addInput1Min: val,
                },
              });
            }}
          />
          <Input
            style={{
              width: 30,
              borderLeft: 0,
              pointerEvents: 'none',
              backgroundColor: '#fff',
            }}
            placeholder="~"
            disabled
          />
          <Input
            style={{ width: 100, textAlign: 'center', borderLeft: 0 }}
            value={addInput1Max}
            placeholder="Maximum"
            onChange={ev => {
              const val = ev.target.value.replace(/\D/g, '');
              if (val && val.trim().length > 12) {
                return false;
              }
              dispatch({
                type: 'detail/save',
                payload: {
                  addInput1Max: val,
                },
              });
            }}
          />
        </InputGroup>
      );
    } else if (record.minimum && +record.maxmum !== 0) {
      node = `${record.minimum}~${record.maxmum}`;
    } else if (record.minimum && +record.maxmum === 0) {
      node = `${record.minimum}-`;
    }
    return node;
  };

  commissionInput = (text, record) => {
    const {
      form: { getFieldValue },
      detail: { addInput2 },
      dispatch,
    } = this.props;
    const commissionSchemeValue = getFieldValue('commissionScheme');
    let node = text;
    if (record.type === 'ADD_BUTTON') {
      node = null;
    }
    if (record.type === 'ADD_ROW' || record.EDIT_ROW) {
      node =
        commissionSchemeValue === 'Amount' ? (
          <InputNumber
            value={addInput2}
            precision={2}
            min={0}
            formatter={value => `$ ${value}`}
            parser={value => {
              value = value.match(/\d+(\.\d{0,2})?/) ? value.match(/\d+(\.\d{0,2})?/)[0] : '';
              return String(value);
            }}
            onChange={value => {
              dispatch({
                type: 'detail/save',
                payload: {
                  addInput2: value,
                },
              });
            }}
          />
        ) : (
          <InputNumber
            value={addInput2}
            formatter={value => `${value}%`}
            min={0}
            max={100}
            parser={value => {
              value = value.match(/\d+(\.\d{0,2})?/) ? value.match(/\d+(\.\d{0,2})?/)[0] : '';
              return String(value);
            }}
            onChange={value => {
              dispatch({
                type: 'detail/save',
                payload: {
                  addInput2: value,
                },
              });
            }}
          />
        );
    } else {
      node = record.commissionValue !== undefined ? record.commissionValue : '';
      if (commissionSchemeValue === 'Amount' && commissionSchemeValue) {
        node = record.commissionValue ? `$ ${record.commissionValue} / Ticket` : '';
      } else {
        node = record.commissionValue ? `${record.commissionValue}% / Ticket` : '';
      }
    }
    return node;
  };

  operation = (text, record, index) => {
    let node = text;
    if (record.type === 'ADD_BUTTON') {
      node = null;
    } else if (record.type === 'ADD_ROW') {
      node = (
        <div>
          <Tooltip title="Confirm">
            <Icon type="check" onClick={() => this.addRow(record, index)} />
          </Tooltip>
          <Tooltip title="Cancel">
            <Icon type="close" onClick={() => this.close(record)} />
          </Tooltip>
        </div>
      );
    } else if (record.EDIT_ROW) {
      node = (
        <div>
          <Tooltip title="Confirm">
            <Icon type="check" onClick={() => this.editRow(record, index)} />
          </Tooltip>
          <Tooltip title="Cancel">
            <Icon type="close" onClick={() => this.editClose(record)} />
          </Tooltip>
        </div>
      );
    } else {
      node = (
        <div>
          <Tooltip title="edit">
            <Icon type="edit" onClick={() => this.edit(record, index)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Icon type="delete" onClick={() => this.delete(record)} />
          </Tooltip>
        </div>
      );
    }
    return node;
  };

  inputJudgmentLogic = (addInput1Max, addInput1Min, addInput2) => {
    if (addInput1Min === '' || addInput1Min === null) {
      message.warning('Commission tier is required.');
      return 0;
    }

    if (addInput2 === '' || addInput2 === null) {
      message.warning('Commission Schema is required.');
      return 0;
    }

    if (Number(addInput1Max) < Number(addInput1Min) && Number(addInput1Max) > 0) {
      message.warning(
        'The min of commission tier cannot be greater than the max of commission tier.'
      );
      return 0;
    }

    if (Number(addInput1Max) === Number(addInput1Min)) {
      message.warning(
        'The min of commission tier cannot be as same as the max of commission tier.'
      );
      return 0;
    }
    // if (tieredList.length > 1) {
    //   for (let i = 0; i < tieredList.length; i += 1) {
    //     const { EDIT_ROW = false, type = 'JUDGMENT' } = tieredList[i];
    //     if (!EDIT_ROW && type !== 'ADD_ROW') {
    //       for (let j = parseInt(addInput1Min, 0); j <= parseInt(addInput1Max, 0); j += 1) {
    //         if (j >= parseInt(tieredList[i].minimum, 0) && j <= parseInt(tieredList[i].maxmum, 0)) {
    //           message.warning('The Commission tiers can not be duplicate.');
    //           return 0;
    //         }
    //       }
    //     }
    //   }
    // }
    return 1;
  };

  addRow = () => {
    const {
      detail: { addInput1Max, addInput1Min, addInput2, tieredList },
      dispatch,
    } = this.props;
    if (this.inputJudgmentLogic(addInput1Max, addInput1Min, addInput2, tieredList) === 0) {
      return null;
    }

    if (tieredList.length >= 2) {
      if (Number(addInput1Min) <= Number(tieredList[tieredList.length - 1].maxmum)) {
        message.warning('The Commission tiers can not be duplicate.');
        return 0;
      }
      if (
        addInput1Max === '' &&
        Number(addInput1Min) <= Number(tieredList[tieredList.length - 1].maxmum)
      ) {
        message.warning('Please fill in the maximum value.');
        return false;
      }
    }

    dispatch({
      type: 'detail/save',
      payload: {
        tieredList: [
          ...tieredList.filter(({ type }) => type !== 'ADD_ROW'),
          {
            minimum: addInput1Min || '',
            maxmum: addInput1Max || '',
            commissionValue: addInput2 || '',
            operation: (
              <Icon
                type="delete"
                // onClick={this.close}
              />
            ),
          },
        ],
        addInput1Min: '',
        addInput1Max: '',
        addInput2: '',
      },
    });
  };

  editRow = (record, index) => {
    const {
      detail: { addInput1Max, addInput1Min, addInput2, tieredList },
      dispatch,
    } = this.props;
    if (this.inputJudgmentLogic(addInput1Max, addInput1Min, addInput2, tieredList) === 0) {
      return null;
    }

    if (tieredList.length > 1 && index < tieredList.length && addInput1Max === '') {
      message.warning('Commission tier is required.');
      return 0;
    }
    if (index !== 1 && tieredList.length > 1 && index !== tieredList.length) {
      if (
        Number(addInput1Min) <= Number(tieredList[index - 2].maxmum) ||
        Number(addInput1Max) >= Number(tieredList[index].minimum)
      ) {
        message.warning('The Commission tiers can not be duplicate.');
        return 0;
      }
    } else if (
      +index !== 1 &&
      Number(tieredList.length) === +index &&
      Number(addInput1Min) <= Number(tieredList[index - 2].maxmum) &&
      addInput1Max === ''
    ) {
      message.warning('Please fill in the maximum value.');
      return 0;
    } else if (
      tieredList.length >= 2 &&
      +index === 1 &&
      Number(addInput1Max) >= Number(tieredList[index].minimum)
    ) {
      message.warning('The Commission tiers can not be duplicate.');
      return 0;
    }

    const arr = tieredList.map((item, idx) =>
      1 + idx === index
        ? {
            // ...item,
            minimum: addInput1Min,
            maxmum: addInput1Max,
            commissionValue: addInput2,
          }
        : item
    );
    dispatch({
      type: 'detail/save',
      payload: {
        tieredList: arr,
      },
    });
  };

  editClose = () => {
    const {
      detail: { tieredList },
      dispatch,
    } = this.props;
    const arr = tieredList.map(item => ({ ...item, EDIT_ROW: false }));
    dispatch({
      type: 'detail/save',
      payload: {
        tieredList: arr,
      },
    });
  };

  close = () => {
    const {
      detail: { tieredList },
      dispatch,
    } = this.props;
    const arr = tieredList.filter(({ type }) => type !== 'ADD_ROW');
    dispatch({
      type: 'detail/save',
      payload: {
        tieredList: arr,
      },
    });
  };

  radioChange = (tplId, value) => {
    const { form, dispatch } = this.props;
    if (tplId === null) {
      dispatch({
        type: 'detail/clear',
        payload: {
          tieredList: [],
        },
      });
    }
    if (tplId !== null) {
      confirm({
        className: styles.confirmStyle,
        title: 'Change the Commission Schema?',
        content:
          value === 'Amount' ? (
            <span>{formatMessage({ id: 'CHANGE_COMMISSION_AMOUNT' })}</span>
          ) : (
            <span>{formatMessage({ id: 'CHANGE_PERCENT_AMOUNT' })}</span>
          ),
        icon: <Icon type="exclamation-circle" />,
        cancelText: 'No',
        cancelButtonProps: {
          type: 'default',
        },
        okText: 'Yes',
        okButtonProps: {
          type: 'primary',
        },
        onOk() {
          form.resetFields(['commissionScheme']);
          form.setFieldsValue({
            commissionScheme: value,
          });
          dispatch({
            type: 'detail/save',
            payload: {
              tieredList: [],
            },
          });
        },
        onCancel() {
          form.resetFields(['commissionScheme']);
          form.setFieldsValue({
            commissionScheme: value === 'Amount' ? 'Percentage' : 'Amount',
          });
        },
      });
    }
  };

  changeCommissionName = e => {
    const { dispatch, form } = this.props;
    let { value } = e.target;
    if (value && value.replace(/[\u0391-\uFFE5]/g, 'aa').length > 50) {
      value = reBytesStr(value, 50);
    }
    dispatch({
      type: 'detail/save',
      payload: {
        commissionName: value,
      },
    });
    form.setFieldsValue({
      commissionName: value,
    });
    if (value === '') {
      form.validateFields(['commissionName']);
    }
  };

  showPeriodValue = (effectiveDate, expiryDate) => {
    if (effectiveDate && expiryDate) {
      return [effectiveDate, expiryDate];
    }
    return null;
  };

  disableEndDate = current => {
    const {
      type,
      detail: { effectiveStartDate },
      form: { getFieldValue },
    } = this.props;
    let code = getFieldValue('effectiveDate');
    const start = code ? code.valueOf() : ''
    const data = current ? current.valueOf() : '';
    if (type === 'edit') {
      return data && data < start;
    } else {
      if(!current || !effectiveStartDate) {
        return false
      }
      return data && data <= effectiveStartDate;
    }
  };

  disableStartDate = current => {
    const {
      detail: { effectiveEndDate },
      type,
    } = this.props;
    const data = current ? current.valueOf() : '';
    if (type === 'new') {
      if(!current || !effectiveEndDate) {
        return false
      }
      return data && data > effectiveEndDate;
    }
  };

  dateTimeChange = selectDate => {
    const { dispatch } = this.props;
    dispatch({
      type: 'detail/save',
      payload: {
        effectiveStartDate: selectDate ? selectDate.valueOf() : '',
      },
    });
  };

  endTimeChange = selectDate => {
    const { dispatch } = this.props;
    dispatch({
      type: 'detail/save',
      payload: {
        effectiveEndDate: selectDate ? selectDate.valueOf() : '',
      },
    });
  };

  commissionTypeChange = values => {
    const { dispatch } = this.props;

    dispatch({
      type: 'detail/save',
      payload: {
        commissionType: values,
      },
    });
  };

  render() {
    const {
      form,
      detail: { tieredList },
      fetchLoading,
      tplId = null,
      type,
    } = this.props;
    const { getFieldDecorator } = form;

    const renderContent = () => {
      return (
        <div>
          <div>{formatMessage({ id: 'MONTHLY_COMMISSION' })}</div>
          <div>{formatMessage({ id: 'QUARTERLY_COMMISSION' })}</div>
          <div>{formatMessage({ id: 'ADHOC_COMMISSION' })}</div>
        </div>
      );
    };

    return (
      <Form>
        <Row>
          <Col className={styles.commissionTitle}>{formatMessage({ id: 'COMMISSION' })}</Col>
        </Row>
        <Row>
          <Col {...ColProps}>
            <Form.Item {...formItemLayout} label={formatMessage({ id: 'PRODUCT_COMMISSION_NAME' })}>
              {getFieldDecorator('commissionName', {
                initialValue: this.handleInitVal('commissionName'),
                rules: [
                  {
                    required: true,
                    message: 'Required',
                  },
                  {
                    validator: (rule, value = '', callback) => {
                      if (value && value.trim().length > 50) {
                        callback('The maximum character length is 50.');
                      }
                      return callback();
                    },
                  },
                ],
              })(
                <Input
                  placeholder={formatMessage({ id: 'PLEASE_ENTER' })}
                  onChange={this.changeCommissionName}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...ColProps}>
            <Form.Item {...formItemLayout} label={formatMessage({ id: 'PRODUCT_COMMISSION_TYPE' })}>
              {getFieldDecorator('commissionType', {
                initialValue: this.handleInitVal('commissionType'),
                rules: [
                  {
                    required: type !== 'edit',
                    message: 'Required',
                  },
                ],
              })(
                <SortSelect
                  placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                  allowClear
                  onChange={this.commissionTypeChange}
                  disabled={type === 'edit'}
                  options={[
                    <Select.Option value="Tiered">
                      {formatMessage({ id: 'TIERED_COMMISSION' })}
                    </Select.Option>,
                    <Select.Option value="Attendance">
                      {formatMessage({ id: 'ATTENDANCE_COMMISSION' })}
                    </Select.Option>,
                  ]}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...ColProps}>
            <Form.Item {...formItemLayout} label="Effective Start Date">
              {getFieldDecorator('effectiveDate', {
                initialValue: this.handleInitVal('effectiveDate'),
                rules: [{ required: true, message: 'Required' }],
              })(
                <DatePicker
                  onChange={this.dateTimeChange}
                  placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                  format="DD-MMM-YYYY"
                  style={{ width: '100%' }}
                  disabledDate={this.disableStartDate}
                  disabled={type === 'edit'}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...ColProps}>
            <Form.Item {...formItemLayout} label="Effective End Date">
              {getFieldDecorator('expiryDate', {
                initialValue: this.handleInitVal('expiryDate'),
                rules: [{ required: type !== 'edit', message: 'Required' }],
              })(
                <DatePicker
                  placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                  format="DD-MMM-YYYY"
                  style={{ width: '100%' }}
                  disabledDate={this.disableEndDate}
                  onChange={this.endTimeChange}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24} className={styles.caluculateCycleStyle}>
            <Form.Item {...formItemLayout2} label={formatMessage({ id: 'CALCULATION_CYCLE' })}>
              {getFieldDecorator('caluculateCycle', {
                initialValue: this.handleInitVal('caluculateCycle') || 'Month',
                rules: [
                  {
                    required: type !== 'edit',
                    msg: 'Required',
                  },
                ],
              })(
                <Radio.Group disabled={type === 'edit'}>
                  <Row span={24}>
                    <Col span={2}>
                      <Tooltip placement="top" overlayClassName="searchTip" title={renderContent}>
                        <Icon
                          style={{ paddingRight: 10 }}
                          type="question-circle"
                          theme="outlined"
                          className={styles.iconPosition}
                        />
                      </Tooltip>
                    </Col>
                    <Col span={22}>
                      <div className={styles.commissionSchemeRadioStyle}>
                        <Radio value="Month">{formatMessage({ id: 'MONTH' })}</Radio>
                        <span>{formatMessage({ id: 'CALCUATE_MONTH' })}</span>
                      </div>
                      <div className={styles.commissionSchemeRadioStyle}>
                        <Radio value="Quarter">{formatMessage({ id: 'QUARTER' })}</Radio>
                        <span>{formatMessage({ id: 'CALCUATE_QUARTER' })}</span>
                      </div>
                      <div className={styles.commissionSchemeRadioStyle}>
                        <Radio value="Ad-hoc">{formatMessage({ id: 'AD_HOC' })}</Radio>
                        <span>{formatMessage({ id: 'CALCUATE_AD_HOC' })}</span>
                      </div>
                    </Col>
                  </Row>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              {...formItemLayout2}
              label={formatMessage({ id: 'PRODUCT_COMMISSION_SCHEME' })}
            >
              {getFieldDecorator('commissionScheme', {
                initialValue: this.handleInitVal('commissionScheme') || 'Amount',
                rules: [
                  {
                    required: true,
                    msg: 'Required',
                  },
                ],
              })(
                <Radio.Group
                  className={styles.commissionSchemeRadioStyle}
                  onChange={e => this.radioChange(tplId, e.target.value)}
                >
                  <Radio value="Amount">{formatMessage({ id: 'COMMISSION_AMOUNT' })}</Radio>
                  <Tooltip
                    placement="top"
                    overlayClassName="searchTip"
                    title={formatMessage({ id: 'COMMISSION_PERCENTAGE_CONTENT' })}
                  >
                    <Icon
                      style={{ paddingRight: 10 }}
                      type="question-circle"
                      theme="outlined"
                      // className={styles.iconPosition}
                    />
                  </Tooltip>
                  <Radio value="Percentage">{formatMessage({ id: 'COMMISSION_PERCENTAGE' })}</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Table
              loading={!!fetchLoading}
              size="small"
              columns={this.getCommissionColumns()}
              className={`tabs-no-padding ${styles.searchTitle}`}
              pagination={false}
              dataSource={[{ type: 'ADD_BUTTON' }, ...tieredList]}
            />
          </Col>
        </Row>
      </Form>
    );
  }
}

export default NewCommission;
