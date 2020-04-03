import React, { Fragment } from 'react';
import {
  Icon,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Radio,
  Table,
  InputNumber,
  Tooltip,
  message,
} from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import moment from 'moment';
import styles from '../New/index.less';
import CommissionSchemaModal from './CommissionSchemeModal';

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
    span: 14,
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
  columns = [
    {
      title: formatMessage({ id: 'TIERED_COMMISSION_TIER' }),
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
    dispatch({
      type: 'detail/offerDetail',
      payload: {
        tplId,
        commodityType: 'Offer',
      },
    });
    dispatch({
      type: 'detail/pluDetail',
      payload: {
        tplId,
        commodityType: 'PackagePlu',
      },
    });
  }

  handleInitVal = key => {
    const {
      type,
      detail: { commisssionList },
    } = this.props;
    if (type === 'edit' && commisssionList && Object.keys(commisssionList).length > 0) {
      let val = commisssionList[key];
      if (key === 'effectiveDate') {
        val = moment(val);
      } else if (key === 'expiryDate') {
        val = moment(val);
      }
      return val;
    }
  };

  add = () => {
    const {
      detail: { tieredList },
      dispatch,
    } = this.props;
    let arr = tieredList;
    const isExist = arr.find(({ type }) => type === 'ADD_ROW');
    const isExist2 = arr.find(item => item.EDIT_ROW === true);
    if (isExist) {
      message.warning(formatMessage({ id: 'PLEASE_ADD_THE_CURRENT_EDIT_FIRST' }));
      return false;
    }
    if (isExist2) {
      message.warning(formatMessage({ id: 'PLEASE_END_THE_CURRENT_EDIT_FIRST' }));
      return false;
    }
    if (!isExist) {
      arr = [{ type: 'ADD_ROW' }, ...tieredList];
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
    } else {
      node = record.minimum || record.maxmum ? `${record.minimum}~${record.maxmum}` : '';
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
    if (record.type === 'ADD_ROW') {
      node =
        commissionSchemeValue === 'Amount' ? (
          <InputNumber
            value={addInput2}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => {
              value = value.replace(/[^\d]/g, '');
              value = +value > 100 ? 100 : value.substr(0, 2);
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
            parser={value => {
              value = value.replace(/[^\d]/g, '');
              value = +value > 100 ? 100 : value.substr(0, 2);
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
    } else if (record.EDIT_ROW) {
      node =
        commissionSchemeValue === 'Amount' ? (
          <InputNumber
            value={addInput2}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => {
              value = value.replace(/[^\d]/g, '');
              value = +value > 100 ? 100 : value.substr(0, 2);
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
            parser={value => {
              value = value.replace(/[^\d]/g, '');
              value = +value > 100 ? 100 : value.substr(0, 2);
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
        node = record.commissionValue ? `${record.commissionValue}%` : '';
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
            <Icon type="check" onClick={this.addRow} />
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

  addRow = () => {
    const {
      detail: { addInput1Max, addInput1Min, addInput2, tieredList },
      dispatch,
    } = this.props;

    if (tieredList.length > 1) {
      const input1max = tieredList.filter(_ => _.maxmum !== undefined).map(item => item.maxmum);
      const val1 = Math.max(...input1max);
      if (val1 > addInput1Min) {
        message.warning('aaa');
        return;
      }
    }
    if (addInput1Max < addInput1Min) {
      message.warning('bbb');
      return;
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

    if (addInput1Max < addInput1Min) {
      message.warning('aaa');
      return;
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

  radioChange = () => {
    const { dispatch, form } = this.props;
    form.resetFields(['commissionScheme']);
    dispatch({
      type: 'commissionNew/save',
      payload: {
        addCommissionSchema: true,
      },
    });
  };

  render() {
    const {
      form,
      commissionNew: { addCommissionSchema },
      detail: { tieredList = [] },
      fetchLoading,
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Fragment>
        <Form>
          <Row>
            <Col className={styles.commissionTitle}>{formatMessage({ id: 'COMMISSION' })}</Col>
          </Row>
          <Row>
            <Col {...ColProps}>
              <Form.Item
                {...formItemLayout}
                label={formatMessage({ id: 'PRODUCT_COMMISSION_NAME' })}
              >
                {getFieldDecorator('commissionName', {
                  initialValue: this.handleInitVal('commissionName'),
                  rules: [
                    {
                      required: true,
                      msg: 'Required',
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'PLEASE_ENTER' })} />)}
              </Form.Item>
            </Col>
            <Col {...ColProps}>
              <Form.Item
                {...formItemLayout}
                label={formatMessage({ id: 'PRODUCT_COMMISSION_TYPE' })}
              >
                {getFieldDecorator('commissionType', {
                  initialValue: this.handleInitVal('commissionType'),
                  rules: [
                    {
                      required: true,
                      msg: 'Required',
                    },
                  ],
                })(
                  <Select placeholder={formatMessage({ id: 'PLEASE_SELECT' })} allowClear>
                    <Select.Option value="tiered">
                      {formatMessage({ id: 'TIERED_COMMISSION' })}
                    </Select.Option>
                    <Select.Option value="attendance">
                      {formatMessage({ id: 'ATTENDANCE_COMMISSION' })}
                    </Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...ColProps}>
              <Form.Item {...formItemLayout} label={formatMessage({ id: 'EFFECTIVE_PERIOD' })}>
                {getFieldDecorator('effectiveDate', {
                  initialValue: this.handleInitVal('effectiveDate'),
                  rules: [{ type: 'object', required: true, message: 'Required' }],
                })(<DatePicker placeholder="Please select" style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col {...ColProps}>
              <Form.Item {...formItemLayout} label={formatMessage({ id: 'EXPIRY_PERIOD' })}>
                {getFieldDecorator('expiryDate', {
                  initialValue: this.handleInitVal('expiryDate'),
                  rules: [{ type: 'object', required: true, message: 'Required' }],
                })(<DatePicker placeholder="Please select" style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item {...formItemLayout2} label={formatMessage({ id: 'CALCULATION_CYCLE' })}>
                {getFieldDecorator('calculationCycle', {
                  initialValue: this.handleInitVal('caluculateCycle'),
                  rules: [
                    {
                      required: true,
                      msg: 'Required',
                    },
                  ],
                })(
                  <Radio.Group style={{ marginTop: '5px' }}>
                    <div className={styles.commissionSchemeRadioStyle}>
                      <Radio value="Month">{formatMessage({ id: 'MONTH' })}</Radio>
                      <span>{formatMessage({ id: 'CALCUATE_MONTH' })}</span>
                    </div>
                    <div className={styles.commissionSchemeRadioStyle}>
                      <Radio value="Quarter">{formatMessage({ id: 'QUARTER' })}</Radio>
                      <span>{formatMessage({ id: 'CALCUATE_QUARTER' })}</span>
                    </div>
                    <div className={styles.commissionSchemeRadioStyle}>
                      <Radio value="AdHoc">{formatMessage({ id: 'AD_HOC' })}</Radio>
                      <span>{formatMessage({ id: 'CALCUATE_AD_HOC' })}</span>
                    </div>
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
                  initialValue: this.handleInitVal('commissionScheme'),
                  rules: [
                    {
                      required: true,
                      msg: 'Required',
                    },
                  ],
                })(
                  <Radio.Group style={{ marginTop: '5px' }} onChange={this.radioChange}>
                    <Radio value="Amount">{formatMessage({ id: 'COMMISSION_AMOUNT' })}</Radio>
                    <Radio value="Percentage">
                      {formatMessage({ id: 'COMMISSION_PERCENTAGE' })}
                    </Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
            {addCommissionSchema ? <CommissionSchemaModal onCancel={this.radioChange} /> : null}
            <Col span={24}>
              <Table
                loading={fetchLoading}
                size="small"
                columns={this.columns}
                className={`tabs-no-padding ${styles.searchTitle}`}
                pagination={false}
                dataSource={[{ type: 'ADD_BUTTON' }, ...tieredList]}
              />
            </Col>
          </Row>
        </Form>
      </Fragment>
    );
  }
}

export default NewCommission;
