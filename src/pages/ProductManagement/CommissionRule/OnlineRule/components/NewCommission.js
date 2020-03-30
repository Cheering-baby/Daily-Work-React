import React, { Fragment } from 'react';
import { Icon, Col, DatePicker, Form, Input, Row, Select, Radio, Table, InputNumber } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import styles from '../New/index.less';
import CommissionSchemaModal from './CommissionSchemeModal';

const InputGroup = Input.Group;
const format = 'DD-MMM-YYYY';

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
@connect(({ commissionNew, detail }) => ({
  commissionNew,
  detail,
}))
class NewCommission extends React.PureComponent {
  columns = [
    {
      title: formatMessage({ id: 'TIERED_COMMISSION_TIER' }),
      key: 'tieredCommissionTier',
      dataIndex: 'tieredCommissionTier',
      render: (text, record, index) => this.showChannel(text, record, index),
    },
    {
      title: formatMessage({ id: 'COMMISSION_SCHEMA' }),
      key: 'commissionSchema',
      dataIndex: 'commissionSchema',
      render: (text, record, index) => this.commissionInput(text, record, index),
    },
    {
      title: formatMessage({ id: 'OPERATION' }),
      key: 'operation',
      dataIndex: 'operation',
      render: (text, record, index) => this.operation(text, record, index),
    },
  ];

  componentDidMount() {
    const { dispatch, tplId } = this.props;
    dispatch({
      type: 'detail/queryDetail',
      payload: {
        tplId,
      },
    });
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
      commissionNew: { commissionTplList },
      dispatch,
    } = this.props;
    let arr = cloneDeep(commissionTplList);
    const isExist = arr.find(({ type }) => type === 'ADD_ROW');
    if (!isExist) {
      arr = [{ type: 'ADD_ROW' }, ...arr];
    }
    dispatch({
      type: 'commissionNew/save',
      payload: {
        commissionTplList: arr,
      },
    });
  };

  showChannel = (text, record) => {
    if (record.type === 'ADD_BUTTON') {
      return <a onClick={this.add}>+ Add</a>;
    }
    if (record.type === 'ADD_ROW') {
      let node = text;
      if (record.type === 'ADD_ROW') {
        node = (
          <InputGroup compact>
            <Input style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" />
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
              placeholder="Maximum"
            />
          </InputGroup>
        );
      }
      return node;
    }
    return text;
  };

  commissionInput = (text, record) => {
    let node = text;
    if (record.type === 'ADD_ROW') {
      node = <InputNumber />;
    }
    return node;
  };

  operation = (text, record) => {
    let node = text;
    if (record.type === 'ADD_ROW') {
      node = (
        <div>
          <Icon type="check" />
          <Icon
            type="close"
            onClick={() => {
              this.close();
            }}
          />
        </div>
      );
    }
    return node;
  };

  close = () => {
    const {
      commissionNew: { commissionTplList },
      dispatch,
    } = this.props;
    let arr = cloneDeep(commissionTplList);
    arr = arr.filter(({ type }) => type !== 'ADD_ROW');
    dispatch({
      type: 'commissionNew/save',
      payload: {
        commissionTplList: arr,
      },
    });
  };

  radioChange = e => {
    const { dispatch } = this.props;

    dispatch({
      type: 'commissionNew/save',
      payload: {
        commissionSchema: e.target.value,
        addCommissionSchema: true,
      },
    });
  };

  render() {
    const {
      form,
      commissionNew: { commissionTplList = [], addCommissionSchema },
    } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Fragment>
        <Form onSubmit={this.commit}>
          <div style={{ padding: '15px' }}>
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
                    <Select
                      placeholder={formatMessage({ id: 'PLEASE_SELECT' })}
                      allowClear
                      onChange={this.optionChange}
                    >
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
                    rules: [
                      {
                        required: true,
                        msg: 'Required',
                      },
                    ],
                  })(
                    <DatePicker
                      placeholder="Please select"
                      format={format}
                      style={{ width: '100%' }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...ColProps}>
                <Form.Item {...formItemLayout} label={formatMessage({ id: 'EXPIRY_PERIOD' })}>
                  {getFieldDecorator('expiryDate', {
                    initialValue: this.handleInitVal('expiryDate'),
                    rules: [
                      {
                        required: true,
                        msg: 'Required',
                      },
                    ],
                  })(
                    <DatePicker
                      placeholder="Please select"
                      format={format}
                      style={{ width: '100%' }}
                    />
                  )}
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
                    <Radio.Group
                      style={{ marginTop: '5px' }}
                      onChange={this.radioChange}
                      // value='commissionAmount'
                    >
                      <Radio
                        value="Amount"
                        // checked={!!(commissionSchema === 'commissionAmount' && checked === true)}
                      >
                        {formatMessage({ id: 'COMMISSION_AMOUNT' })}
                      </Radio>
                      <Radio
                        value="Percentage"
                        // checked={
                        //   !!(commissionSchema === 'commissionPercentage' && checked === true)
                        // }
                      >
                        {formatMessage({ id: 'COMMISSION_PERCENTAGE' })}
                      </Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
              {addCommissionSchema ? <CommissionSchemaModal /> : null}
              <Col span={24}>
                <Table
                  size="small"
                  columns={this.columns}
                  className={`tabs-no-padding ${styles.searchTitle}`}
                  pagination={false}
                  dataSource={[{ type: 'ADD_BUTTON' }, ...commissionTplList]}
                />
              </Col>
            </Row>
          </div>
        </Form>
      </Fragment>
    );
  }
}

export default NewCommission;
