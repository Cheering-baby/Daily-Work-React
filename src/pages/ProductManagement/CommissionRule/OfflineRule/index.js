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
@connect(({ offline, loading }) => ({
  offline,
  loading: loading.effects['offline/fetchOfflineList'],
}))
class Offline extends React.PureComponent {
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
          </div>
        );
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'offline/fetchOfflineList',
      payload: {},
    });
  }

  detail = record => {
    router.push(`/ProductManagement/CommissionRule/OfflineRule/Detail/${record.type}`);
  };

  newOffline = () => {
    router.push({
      pathname: '/ProductManagement/CommissionRule/OfflineRule/New',
    });
  };

  edit = record => {
    router.push(`/ProductManagement/CommissionRule/OfflineRule/Edit/${record.type}`);
  };

  showTotal(total) {
    return <div>Total {total} items</div>;
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      offline: { offlineList, currentPage, pageSize, totalSize },
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
            <Breadcrumb.Item className="breadcrumbbold">Offine Rule</Breadcrumb.Item>
          </Breadcrumb>
          {/* </MediaQuery> */}
        </Col>
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
                <Button type="primary" onClick={() => this.newOffline()}>
                  {formatMessage({ id: 'COMMON_NEW' })}
                </Button>
              </Col>
            </Row>
            <Table
              rowKey="id"
              bordered={false}
              size="small"
              dataSource={offlineList}
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

export default Offline;
