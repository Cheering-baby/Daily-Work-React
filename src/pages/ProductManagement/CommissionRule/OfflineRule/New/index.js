import React from 'react';
import router from 'umi/router';
import { Col, Form, Radio, Row, Button, Table, Divider, InputNumber } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import classNames from 'classnames';
import MediaQuery from 'react-responsive';
import detailStyles from './index.less';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '@/components/BreadcrumbComp';
import styles from '../../OnlineRule/New/index.less';
import AddOfflinePLUModal from '../components/AddOfflinePLUModal';

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
      title: formatMessage({ id: 'NO' }),
      dataIndex: 'seqOrder',
    },
    {
      title: formatMessage({ id: 'PLU_CODE' }),
      dataIndex: 'pluCode',
    },
    {
      title: formatMessage({ id: 'PLU_DESCRIPTION' }),
      dataIndex: 'pluDescription',
    },
    {
      title: formatMessage({ id: 'THEME_PARK' }),
      dataIndex: 'pluPark',
    },
  ];

  add = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'offlineNew/save',
      payload: {
        addPLUModal: true,
      },
    });
  };

  selectChange = e => {
    const { dispatch } = this.props;

    dispatch({
      type: 'offlineNew/save',
      payload: {
        value: e,
      },
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
      offlineNew: { addPLUModal },
    } = this.props;

    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
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
                    {getFieldDecorator('commissionName', {
                      rules: [COMMONRule],
                    })(
                      <Radio.Group>
                        <Radio value="Y">
                          {formatMessage({ id: 'COMMISSION_AMOUNT' })}
                          {getFieldDecorator('amount', {
                            rules: [COMMONRule],
                          })(
                            <InputNumber
                              style={{ marginLeft: '10px' }}
                              formatter={value =>
                                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                              }
                              parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            />
                          )}
                        </Radio>
                        <Radio value="N" style={{ marginLeft: '60px' }}>
                          {formatMessage({ id: 'COMMISSION_PERCENTAGE' })}
                          {getFieldDecorator('percent', {
                            rules: [COMMONRule],
                          })(<InputNumber style={{ marginLeft: '10px' }} min={1} max={10} />)}
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
                    className={`tabs-no-padding ${styles.searchTitle}`}
                    pagination={false}
                    dataSource={[
                      {
                        key: 'addOption',
                        seqOrder: <a onClick={() => this.add()}>+ Add</a>,
                        roomTypeCode: ' ',
                        roomTypeName: ' ',
                        operation: '',
                      },
                    ]}
                  />
                </Col>
              </Row>
              {addPLUModal ? <AddOfflinePLUModal /> : null}
              <Divider style={{ margin: 0 }} />
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
