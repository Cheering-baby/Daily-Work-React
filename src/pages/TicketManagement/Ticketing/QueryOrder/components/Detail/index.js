import React from 'react';
import {Drawer, Form, Spin, Table, Tooltip} from 'antd';
import {connect} from 'dva';
import styles from './index.less';

const FormItem = Form.Item;

const formLayout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
  colon: false,
  labelAlign: 'left',
};

@connect(({orderDetailMgr, loading}) => ({
  orderDetailMgr,
  pageLoading: loading.effects['orderDetailMgr/queryOrderDetail'],
}))
class Detail extends React.Component {
  columns = [
    {
      title: <span className={styles.tableTitle}>No.</span>,
      dataIndex: 'vidNo',
      key: 'vidNo',
    },
    {
      title: <span className={styles.tableTitle}>VID Code</span>,
      dataIndex: 'vidCode',
      key: 'vidCode',
    },
    {
      title: <span className={styles.tableTitle}>Offer Name</span>,
      dataIndex: 'offerName',
      key: 'offerName',
    },
  ];

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'orderDetailMgr/resetData',
    });
  }

  showDelivery = (label, info) => {
    return (
      <FormItem
        label={
          <Tooltip
            placement="topLeft"
            title={<span style={{whiteSpace: 'pre-wrap'}}>{label}</span>}
          >
            <span className={styles.labelStyle}>{label}</span>
          </Tooltip>
        }
        {...formLayout}
      >
        <Tooltip
          placement="topLeft"
          title={<span style={{whiteSpace: 'pre-wrap'}}>{info || '-'}</span>}
        >
          <span className={styles.infoStyle}>{info || '-'}</span>
        </Tooltip>
      </FormItem>
    );
  };

  showInformation = (detailType, deliveryInfo, pageLoading) => {
    if (detailType === 'Revalidation' && deliveryInfo) {
      return (
        <Spin spinning={!!pageLoading}>
          <div>
            <span className={styles.drawerTitleStyle}>DELIVERY INFORMATION</span>
          </div>
          <Form className={styles.formStyle}>
            {this.showDelivery('Country of Residence/Origin', deliveryInfo.country)}
            {this.showDelivery('TA Reference No.', deliveryInfo.referenceNo)}
            {/* {this.showDelivery('Language', 'Chinese')} */}
            {this.showDelivery('Guest First Name', deliveryInfo.firstName)}
            {this.showDelivery('Guest Last Name', deliveryInfo.lastName)}
            {this.showDelivery('Customer Contact No.', deliveryInfo.contactNo)}
          </Form>
        </Spin>
      );
    }
    return null;
  };

  onClose = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'orderDetailMgr/resetData',
    });
  };

  render() {
    const {
      pageLoading,
      orderDetailMgr: {orderDetailVisible, detailType, vidList, deliveryInfo},
    } = this.props;

    return (
      <Drawer
        title={<span className={styles.drawerTitleStyle}>DETAIL</span>}
        className={styles.drawerStyle}
        width={400}
        placement="right"
        onClose={this.onClose}
        visible={orderDetailVisible}
        maskClosable={false}
      >
        {this.showInformation(detailType, deliveryInfo, pageLoading)}
        <Table
          size="small"
          style={{marginTop: 10}}
          columns={this.columns}
          dataSource={vidList}
          loading={!!pageLoading}
          pagination={false}
          bordered={false}
        />
      </Drawer>
    );
  }
}

export default Detail;
