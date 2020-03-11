import React from 'react';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Icon,
  Input,
  Row,
  Select,
  Table,
  Tooltip,
} from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import router from 'umi/router';
import detailStyles from './index.less';
import AddOfferToCommissionName from './components/AddOfferToCommissionName';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 23,
  },
};

const ColProps = {
  xs: 4,
  sm: 4,
  md: 6,
  xl: 6,
};

@Form.create()
@connect(({ commissionRuleSetup, loading }) => ({
  commissionRuleSetup,
  loading: loading.effects['commissionRuleSetup/fetchCommissionRuleSetupList'],
}))
class CommissionRuleSetup extends React.PureComponent {
  columns = [
    {
      title: formatMessage({ id: 'PRODUCT_COMMISSION_NAME' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: formatMessage({ id: 'PRODUCT_COMMISSION_TYPE' }),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: formatMessage({ id: 'PRODUCT_COMMISSION_SCHEME' }),
      dataIndex: 'scheme',
      key: 'scheme',
    },
    {
      title: formatMessage({ id: 'STATUS' }),
      dataIndex: 'status',
      key: 'status',
      render: text => {
        let flagClass = '';
        if (text === 'ACTIVE') flagClass = detailStyles.flagStyle1;
        if (text === 'INACTIVE') flagClass = detailStyles.flagStyle2;
        return (
          <div>
            <span className={flagClass} />
            {text}
          </div>
        );
      },
    },
    {
      title: formatMessage({ id: 'OPERATION' }),
      dataIndex: 'createStaff',
      key: 'createStaff',
      render: (text, record) => {
        return (
          <div>
            <Tooltip title={formatMessage({ id: 'COMMON_DETAIL' })}>
              <Icon
                type="eye"
                onClick={() => {
                  this.detail(record);
                }}
              />
            </Tooltip>
            <Tooltip title={formatMessage({ id: 'COMMON_EDIT' })}>
              <Icon
                type="edit"
                onClick={() => {
                  this.edit(record);
                }}
              />
            </Tooltip>
            <Tooltip title={formatMessage({ id: 'COMMISSION_ADD' })}>
              <Icon
                type="plus"
                onClick={() => {
                  this.add();
                }}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commissionRuleSetup/fetchCommissionRuleSetupList',
      payload: {},
    });
  }

  add = (record = {}) => {
    this.AddCommissioProps = {
      ...this.AddCommissioProps,
      title: formatMessage({
        id: 'ADD_OFFER_COMMISSION',
      }),
      record,
      onCancel: () => {
        this.handleModal('detailVisible', false);
      },
    };
    this.handleModal('detailVisible', true);
  };

  handleModal = (key, flag = true) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commissionRuleSetup/toggleModal',
      payload: {
        key,
        val: flag,
      },
    });
  };

  turnToNew = () => {
    router.push({
      pathname: '/ProductManagement/CommissionRule/OnlineRule/New',
    });
  };

  detail = record => {
    router.push(`/ProductManagement/CommissionRule/OnlineRule/Detail/${record.type}`);
  };

  edit = record => {
    router.push(`/ProductManagement/CommissionRule/OnlineRule/Edit/${record.type}`);
  };

  showTotal(total) {
    return <div>Total {total} items</div>;
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      commissionRuleSetup: {
        commissionRuleSetupList,
        currentPage,
        pageSize,
        totalSize,
        detailVisible,
      },
    } = this.props;
    const pagination = {
      current: currentPage,
      pageSize,
      total: totalSize,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['20', '50', '100'],
      showTotal: this.showTotal,
    };
    return (
      <Row type="flex" justify="space-around" id="mainTaView">
        <Col span={24} className={detailStyles.pageHeaderTitle}>
          {/* <MediaQuery> */}
          <Breadcrumb separator=" > " style={{ marginBottom: '10px' }}>
            <Breadcrumb.Item className="breadcrumb-style">Product Management</Breadcrumb.Item>
            <Breadcrumb.Item className="breadcrumb-style">Commission Rule</Breadcrumb.Item>
            <Breadcrumb.Item className="breadcrumbbold">Online Rule</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        {/* </MediaQuery> */}
        <Col span={24} className={detailStyles.pageSearchCard}>
          <Card>
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
              <Row gutter={24}>
                <Col {...ColProps}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator(
                      `search`,
                      {}
                    )(
                      <Input
                        placeholder={formatMessage({ id: 'PRODUCT_COMMISSION_NAME' })}
                        allowClear
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...ColProps}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator(
                      `companyName`,
                      {}
                    )(
                      <Select
                        placeholder={formatMessage({ id: 'PRODUCT_COMMISSION_TYPE' })}
                        optionFilterProp="children"
                        style={{ width: '100%' }}
                        allowClear
                      >
                        <Option value="Attendance">Attendance</Option>
                        <Option value="Tiered">Tiered</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col {...ColProps}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator(
                      `category`,
                      {}
                    )(
                      <Select
                        placeholder={formatMessage({ id: 'STATUS' })}
                        optionFilterProp="children"
                        style={{ width: '100%' }}
                        allowClear
                      >
                        <Option value="ACTIVE">ACTIVE</Option>
                        <Option value="ACTIVE">INACTIVE</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col {...ColProps} style={{ textAlign: 'right' }}>
                  <Button type="primary" htmlType="submit">
                    {formatMessage({ id: 'BTN_SEARCH' })}
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                    {formatMessage({ id: 'BTN_RESET' })}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
        <Col span={24} className={detailStyles.pageTableCard}>
          <Card>
            <Row gutter={24}>
              <Col {...ColProps} style={{ padding: '12px' }}>
                <Button type="primary" onClick={() => this.turnToNew()}>
                  {formatMessage({ id: 'COMMON_NEW' })}
                </Button>
              </Col>
            </Row>
            {detailVisible && <AddOfferToCommissionName {...this.AddCommissioProps} />}
            <Table
              rowKey="id"
              bordered={false}
              size="small"
              dataSource={commissionRuleSetupList}
              pagination={pagination}
              loading={loading}
              columns={this.columns}
              className="table-style"
              // onChange={this.handleTableChange}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}

export default CommissionRuleSetup;
