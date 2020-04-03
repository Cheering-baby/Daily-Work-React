import React from 'react';
import router from 'umi/router';
import {
  Col,
  Form,
  Radio,
  Row,
  Button,
  Table,
  Divider,
  InputNumber,
  message,
  Tooltip,
  Icon,
} from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import classNames from 'classnames';
import MediaQuery from 'react-responsive';
import detailStyles from './index.less';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import styles from '../../OnlineRule/New/index.less';
import AddOfflinePLUModal from '../components/AddOfflinePLUModal';
import { commonConfirm } from '@/components/CommonModal';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};
const COMMONRule = {
  required: true,
  msg: 'Required',
};

@Form.create()
@connect(({ offlineNew, offline }) => ({
  offlineNew,
  offline,
}))
class OfflineNew extends React.PureComponent {
  columns = [
    {
      title: formatMessage({ id: 'PLU_CODE' }),
      dataIndex: 'commodityCode',
    },
    {
      title: formatMessage({ id: 'PLU_DESCRIPTION' }),
      dataIndex: 'commodityDescription',
    },
    {
      title: formatMessage({ id: 'THEME_PARK' }),
      dataIndex: 'themeParkCode',
    },
    {
      title: formatMessage({ id: 'OPERATION' }),
      dataIndex: 'operation',
      render: (text, record) => {
        return record && record.key && record.key !== 'addOption' ? (
          <div>
            <Tooltip title={formatMessage({ id: 'COMMON_DELETE' })}>
              <Icon
                type="delete"
                onClick={() => {
                  this.delete(record);
                }}
              />
            </Tooltip>
          </div>
        ) : null;
      },
    },
  ];

  delete = record => {
    const {
      offlineNew: { checkedList },
      dispatch,
    } = this.props;
    const filterCheckedList = checkedList.filter(item => {
      const { commoditySpecId } = item;
      return commoditySpecId !== record.commoditySpecId;
    });
    dispatch({
      type: 'offlineNew/save',
      payload: {
        checkedList: filterCheckedList,
      },
    });
  };

  add = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'offlineNew/save',
      payload: {
        addPLUModal: true,
      },
    });
  };

  onClose = () => {
    router.push({
      pathname: '/ProductManagement/CommissionRule/OfflineRule',
    });
  };

  handleSubmit = e => {
    const {
      form,
      dispatch,
      offlineNew: { checkedList },
    } = this.props;
    e.preventDefault();
    const resCb = response => {
      this.onClose();
      if (response === 'SUCCESS') {
        message.success('Newed successfully.');
      } else if (response === 'ERROR') {
        message.error('Failed to new.');
      }
    };
    form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      values.commissionValue =
        values.commissionScheme === 'Amount' ? values.Amount : values.Percentage;
      commonConfirm({
        content: `Confirm to New ?`,
        onOk: async () => {
          const res = await dispatch({
            type: 'offlineNew/add',
            payload: {
              params: values,
              commodityList: checkedList,
            },
          });
          resCb(res);
        },
      });
    });
  };

  cancel = () => {
    router.push('/ProductManagement/CommissionRule/OfflineRule');
  };

  render() {
    const {
      location: {
        query: { type },
      },
    } = this.props;
    const breadcrumbArr = [
      {
        breadcrumbName: formatMessage({ id: 'PRODUCT_MANAGEMENT' }),
        url: null,
      },
      {
        breadcrumbName: formatMessage({ id: 'COMMISSION_RULE_TITLE' }),
        url: null,
      },
      {
        breadcrumbName: formatMessage({ id: 'OFFLINE_FIXED_COMMISSION' }),
        url: '/ProductManagement/CommissionRule/OfflineRule',
      },
      {
        breadcrumbName:
          type && type === 'edit'
            ? formatMessage({ id: 'COMMON_MODIFY' })
            : formatMessage({ id: 'COMMON_NEW' }),
        url: null,
      },
    ];
    const {
      form: { getFieldDecorator },
      offlineNew: { addPLUModal, checkedList },
    } = this.props;

    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
        <Row type="flex" justify="space-around" id="mainTaView">
          <Col span={24} className={detailStyles.pageHeaderTitle}>
            <MediaQuery
              maxWidth={SCREEN.screenMdMax}
              minWidth={SCREEN.screenSmMin}
              minHeight={SCREEN.screenSmMin}
            >
              <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
            </MediaQuery>
            <MediaQuery minWidth={SCREEN.screenLgMin}>
              <BreadcrumbComp breadcrumbArr={breadcrumbArr} />
            </MediaQuery>
          </Col>
          <Col span={24}>
            <div className={classNames(detailStyles.formStyle, 'has-shadow no-border')}>
              <div className="title-header" style={{ padding: '16px' }}>
                <span>{formatMessage({ id: 'OFFLINE_FIXED_COMMISSION_RULE' })}</span>
              </div>
              <Row>
                <Col span={24}>
                  <FormItem {...formItemLayout} label={formatMessage({ id: 'COMMISSION_SCHEMA' })}>
                    {getFieldDecorator('commissionScheme', {
                      rules: [COMMONRule],
                    })(
                      <Radio.Group>
                        <Radio value="Amount">
                          {formatMessage({ id: 'COMMISSION_AMOUNT' })}
                          {getFieldDecorator('Amount', {
                            // rules: [COMMONRule],
                          })(
                            <InputNumber
                              style={{ marginLeft: '10px' }}
                              formatter={value =>
                                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                              }
                              parser={value => {
                                value = value.replace(/[^\d]/g, '');
                                return value;
                              }}
                            />
                          )}
                        </Radio>
                        <Radio value="Percentage" style={{ marginLeft: '60px' }}>
                          {formatMessage({ id: 'COMMISSION_PERCENTAGE' })}
                          {getFieldDecorator('Percentage', {
                            // rules: [COMMONRule],
                          })(
                            <InputNumber
                              style={{ marginLeft: '10px' }}
                              formatter={value => `${value}%`}
                              parser={value => {
                                value = value.replace(/[^\d]/g, '');
                                value = +value > 100 ? 100 : value.substr(0, 2);
                                return String(value);
                              }}
                            />
                          )}
                        </Radio>
                      </Radio.Group>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <div className="title-header" style={{ padding: '16px' }}>
                <span>{formatMessage({ id: 'BINDING' })}</span>
              </div>
              <Row>
                <Col span={24} style={{ padding: '0 15px' }}>
                  <Table
                    size="small"
                    columns={this.columns}
                    rowKey={record => record.commoditySpecId}
                    className={`tabs-no-padding ${styles.searchTitle}`}
                    pagination={false}
                    dataSource={[
                      {
                        key: 'addOption',
                        commodityCode: <a onClick={() => this.add()}>+ Add</a>,
                        commodityDescription: ' ',
                        themeParkCode: '',
                      },
                      ...checkedList,
                    ]}
                  />
                </Col>
              </Row>
              {addPLUModal ? <AddOfflinePLUModal /> : null}
              <Divider style={{ marginTop: 100 }} />
              <Row>
                <Col style={{ textAlign: 'right', padding: '10px 15px' }}>
                  <Button onClick={this.cancel}>{formatMessage({ id: 'COMMON_CANCEL' })}</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    // loading={addLoading || modifyLoading}
                    style={{ marginLeft: '10px' }}
                  >
                    {formatMessage({ id: 'COMMON_OK' })}
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}
export default OfflineNew;
