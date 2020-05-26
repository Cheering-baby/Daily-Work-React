import React from 'react';
import { Drawer, Form, Spin, Table, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
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

@connect(({ orderDetailMgr, loading }) => ({
  orderDetailMgr,
  pageLoading: loading.effects['orderDetailMgr/queryOrderDetail'],
}))
class Detail extends React.Component {
  detailColumns = [
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'NO' })}</span>,
      dataIndex: 'vidNo',
      key: 'vidNo',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'VID_CODE' })}</span>,
      dataIndex: 'vidCode',
      key: 'vidCode',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'OFFER_NAME' })}</span>,
      dataIndex: 'offerName',
      key: 'offerName',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
  ];

  columns = [
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'NO' })}</span>,
      dataIndex: 'vidNo',
      key: 'vidNo',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'VID_CODE' })}</span>,
      dataIndex: 'vidCode',
      key: 'vidCode',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
  ];

  componentWillUnmount() {
    const { dispatch } = this.props;
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
            title={<span style={{ whiteSpace: 'pre-wrap' }}>{label}</span>}
          >
            <span className={styles.labelStyle}>{label}</span>
          </Tooltip>
        }
        {...formLayout}
      >
        <Tooltip
          placement="topLeft"
          title={<span style={{ whiteSpace: 'pre-wrap' }}>{info || '-'}</span>}
        >
          <span className={styles.infoStyle}>{info || '-'}</span>
        </Tooltip>
      </FormItem>
    );
  };

  showInformation = (detailType, detailList, vidResultList, pageLoading) => {
    if (detailType !== 'Revalidation' && detailType !== 'Refund') {
      const child = [];
      const newDetailList = [];
      detailList.forEach(detailInfo => {
        const newDetailIndex = newDetailList.findIndex(
          newDetail => newDetail.offerGroup === detailInfo.offerGroup
        );
        if (newDetailIndex < 0) {
          newDetailList.push(
            Object.assign(
              {},
              {
                ...detailInfo,
              }
            )
          );
        } else {
          newDetailList[newDetailIndex].vidList = [
            ...newDetailList[newDetailIndex].vidList,
            ...detailInfo.vidList,
          ];
        }
      });
      detailList = newDetailList;
      for (let i = 0; i < detailList.length; i += 1) {
        for (let j = 0; j < detailList[i].vidList.length; j += 1) {
          detailList[i].vidList[j].vidNo = (Array(3).join('0') + (j + 1)).slice(-3);
        }
        const firstName = detailList[i].delivery ? detailList[i].delivery.firstName : '-';
        const lastName = detailList[i].delivery ? detailList[i].delivery.lastName : '-';
        const country = detailList[i].delivery ? detailList[i].delivery.country : '-';
        const referenceNo = detailList[i].delivery ? detailList[i].delivery.referenceNo : '-';
        const contactNo = detailList[i].delivery ? detailList[i].delivery.contactNo : '-';
        const email = detailList[i].delivery ? detailList[i].delivery.email : '-';
        const { bundleName, offerName } = detailList[i];
        let offerNameText = offerName;
        if (bundleName !== null && bundleName !== '') {
          offerNameText = bundleName;
        }
        child.push(
          <div key={`offer_${i}`}>
            <Form className={styles.formStyle}>
              <FormItem
                label={
                  <span className={styles.drawerTitleStyle}>
                    {formatMessage({ id: 'OFFER_NAME_TITLE' })}
                  </span>
                }
                {...formLayout}
              >
                <Tooltip
                  placement="topLeft"
                  title={<span style={{ whiteSpace: 'pre-wrap' }}>{offerNameText || '-'}</span>}
                >
                  <span className={styles.drawerTitleStyle}>{offerNameText || '-'}</span>
                </Tooltip>
              </FormItem>
            </Form>
            <div>
              <span className={styles.drawerTitleStyle}>
                {formatMessage({ id: 'DELIVERY_INFORMATION' })}
              </span>
            </div>
            <Form className={styles.formStyle}>
              {this.showDelivery(formatMessage({ id: 'COUNTRY_OF_RESIDENCE' }), country)}
              {this.showDelivery(formatMessage({ id: 'TA_REFERENCE_NO' }), referenceNo)}
              {this.showDelivery(formatMessage({ id: 'GUEST_FIRST_NAME' }), firstName)}
              {this.showDelivery(formatMessage({ id: 'GUEST_LAST_NAME' }), lastName)}
              {this.showDelivery(formatMessage({ id: 'CUSTOMER_CONTACT_NO' }), contactNo)}
              {this.showDelivery(formatMessage({ id: 'CUSTOMER_EMAIL_ADDRESS' }), email)}
            </Form>
            <Table
              size="small"
              style={{ marginTop: 10, marginBottom: 20 }}
              columns={this.columns}
              dataSource={detailList[i].vidList}
              loading={!!pageLoading}
              pagination={false}
              bordered={false}
            />
          </div>
        );
      }
      return <Spin spinning={!!pageLoading}>{child}</Spin>;
    }
    return (
      <Table
        size="small"
        style={{ marginTop: 10 }}
        columns={this.detailColumns}
        dataSource={vidResultList}
        loading={!!pageLoading}
        pagination={false}
        bordered={false}
      />
    );
  };

  onClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderDetailMgr/effectSave',
      payload: {
        orderDetailVisible: false,
      },
    }).then(() => {
      setTimeout(() => {
        dispatch({
          type: 'orderDetailMgr/save',
          payload: {
            detailType: 'Revalidation',
            searchList: {
              bookingNo: null,
              isSubOrder: null,
            },
            detailList: [],
            vidResultList: [],
          },
        });
      }, 500);
    });
  };

  render() {
    const {
      pageLoading,
      orderDetailMgr: { orderDetailVisible, detailType, detailList, vidResultList },
    } = this.props;

    return (
      <Drawer
        title={<span className={styles.drawerTitle}>{formatMessage({ id: 'DETAIL' })}</span>}
        className={styles.drawerStyle}
        placement="right"
        onClose={this.onClose}
        visible={orderDetailVisible}
        maskClosable={false}
      >
        {this.showInformation(detailType, detailList, vidResultList, pageLoading)}
      </Drawer>
    );
  }
}

export default Detail;
