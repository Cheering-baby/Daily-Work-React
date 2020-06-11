import React from 'react';
import { Divider, Drawer, Form, Icon, Popover, Spin, Table, Tooltip } from 'antd';
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

@connect(({ orderDetailMgr, global, loading }) => ({
  orderDetailMgr,
  global,
  pageLoading: loading.effects['orderDetailMgr/queryOrderDetail'],
}))
class Detail extends React.Component {
  detailColumns = [
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'NO' })}</span>,
      width: '8%',
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
      width: '23%',
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
      width: '23%',
      dataIndex: 'offerName',
      key: 'offerName',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'THEME_PARK' })}</span>,
      width: '23%',
      dataIndex: 'themePark',
      key: 'themePark',
      render: text => this.showThemePark(text),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'CATEGORY' })}</span>,
      width: '11%',
      dataIndex: 'ticketGroup',
      key: 'ticketGroup',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'VID_TYPE' })}</span>,
      dataIndex: 'ticketType',
      key: 'ticketType',
      render: text => this.showVidType(text),
    },
  ];

  columns = [
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'NO' })}</span>,
      width: '10%',
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
      width: '30%',
      dataIndex: 'vidCode',
      key: 'vidCode',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'THEME_PARK' })}</span>,
      width: '30%',
      dataIndex: 'themePark',
      key: 'themePark',
      render: text => this.showThemePark(text),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'CATEGORY' })}</span>,
      width: '15%',
      dataIndex: 'ticketGroup',
      key: 'ticketGroup',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'VID_TYPE' })}</span>,
      dataIndex: 'ticketType',
      key: 'ticketType',
      render: text => this.showVidType(text),
    },
  ];

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderDetailMgr/resetData',
    });
  }

  showThemePark = text => {
    const {
      orderDetailMgr: { themeParkList = [] },
    } = this.props;
    for (let i = 0; i < themeParkList.length; i += 1) {
      if (themeParkList[i].itemValue === text) {
        return (
          <Tooltip
            placement="topLeft"
            title={<span style={{ whiteSpace: 'pre-wrap' }}>{themeParkList[i].itemName}</span>}
          >
            <span>{themeParkList[i].itemName}</span>
          </Tooltip>
        );
      }
    }
  };

  showVidType = text => {
    if (text === 'Voucher') {
      return text;
    }
    if (text !== 'Voucher') {
      return 'Ticketing';
    }
  };

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

  showQuantity = vidList => {
    let adult = 0;
    let senior = 0;
    let child = 0;
    let student = 0;
    let helper = 0;
    let voucher = 0;
    let noSet = 0;
    for (let i = 0; i < vidList.length; i += 1) {
      if (vidList[i].ticketType === 'Voucher') {
        voucher += 1;
      } else if (vidList[i].ticketGroup === 'Adult') {
        adult += 1;
      } else if (vidList[i].ticketGroup === 'Senior') {
        senior += 1;
      } else if (vidList[i].ticketGroup === 'Child') {
        child += 1;
      } else if (vidList[i].ticketGroup === 'Student') {
        student += 1;
      } else if (vidList[i].ticketGroup === 'Helper') {
        helper += 1;
      } else {
        noSet += 1;
      }
    }
    const quantity = adult + senior + child + student + helper + voucher + noSet;
    return (
      <div>
        <span className={styles.drawerTitleStyle}>{quantity}</span>
        {quantity > 0 && (
          <Popover
            overlayStyle={{ width: 160, color: '#565656' }}
            content={
              <Form className={styles.quantityFormStyle}>
                {adult > 0 && this.showQuantityEye('Adult', adult)}
                {senior > 0 && this.showQuantityEye('Senior', senior)}
                {child > 0 && this.showQuantityEye('Child', child)}
                {student > 0 && this.showQuantityEye('Student', student)}
                {helper > 0 && this.showQuantityEye('Helper', helper)}
                {voucher > 0 && this.showQuantityEye('Voucher', voucher)}
                {noSet > 0 && this.showQuantityEye('-', noSet)}
              </Form>
            }
          >
            <Icon style={{ marginLeft: 10 }} type="eye" />
          </Popover>
        )}
      </div>
    );
  };

  showQuantityEye = (label, value) => (
    <FormItem label={label} {...formLayout}>
      {value}
    </FormItem>
  );

  showInformation = (
    detailType,
    detailList,
    vidResultList,
    patronInfo,
    netAmt,
    refundSuccessFlag,
    pageLoading,
    userType
  ) => {
    if (detailType !== 'Revalidation' && detailType !== 'Refund') {
      const { mainTaName = '-', taName = '-' } = patronInfo;
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
        const filterVidList = detailList[i].vidList.filter(item => {
          return item.vidCode !== null && item.vidCode !== '';
        });
        for (let j = 0; j < filterVidList.length; j += 1) {
          filterVidList[j].vidNo = (Array(3).join('0') + (j + 1)).slice(-3);
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
              <FormItem
                label={
                  <span className={styles.drawerTitleStyle}>
                    {formatMessage({ id: 'QUANTITY' })}
                  </span>
                }
                {...formLayout}
              >
                {this.showQuantity(filterVidList)}
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
            {filterVidList.length > 0 && (
              <Table
                size="small"
                style={{ marginTop: 10, marginBottom: 20 }}
                columns={this.columns}
                dataSource={filterVidList}
                loading={!!pageLoading}
                scroll={{ x: 540 }}
                pagination={false}
                bordered={false}
              />
            )}
          </div>
        );
      }
      return (
        <Spin spinning={!!pageLoading}>
          <Form className={styles.formStyle}>
            <FormItem
              label={
                <span className={styles.drawerTitleStyle}>
                  {formatMessage({ id: 'TA_NAME_TITLE' })}
                </span>
              }
              {...formLayout}
            >
              <Tooltip
                placement="topLeft"
                title={<span style={{ whiteSpace: 'pre-wrap' }}>{mainTaName || '-'}</span>}
              >
                <span className={styles.drawerTitleStyle}>{mainTaName || '-'}</span>
              </Tooltip>
            </FormItem>
            <FormItem
              label={
                <span className={styles.drawerTitleStyle}>
                  {formatMessage({ id: 'SUB_TA_NAME_TITLE' })}
                </span>
              }
              {...formLayout}
            >
              <Tooltip
                placement="topLeft"
                title={<span style={{ whiteSpace: 'pre-wrap' }}>{taName || '-'}</span>}
              >
                <span className={styles.drawerTitleStyle}>{taName || '-'}</span>
              </Tooltip>
            </FormItem>
            {(userType === '02' || userType === '01') && (
              <FormItem
                label={
                  <span className={styles.drawerTitleStyle}>
                    {formatMessage({ id: 'RECEIVED_AMOUNT' })}
                  </span>
                }
                {...formLayout}
              >
                <Tooltip
                  placement="topLeft"
                  title={
                    <span style={{ whiteSpace: 'pre-wrap' }}>{`$ ${Number(netAmt).toFixed(
                      2
                    )}`}</span>
                  }
                >
                  <span className={styles.drawerTitleStyle}>{`$ ${Number(netAmt).toFixed(
                    2
                  )}`}</span>
                </Tooltip>
              </FormItem>
            )}
            {refundSuccessFlag && (userType === '02' || userType === '01') && (
              <FormItem
                label={
                  <span className={styles.drawerTitleStyle}>
                    {formatMessage({ id: 'REFUNDED_AMOUNT' })}
                  </span>
                }
                {...formLayout}
              >
                <Tooltip
                  placement="topLeft"
                  title={
                    <span style={{ whiteSpace: 'pre-wrap' }}>{`$ ${Number(netAmt).toFixed(
                      2
                    )}`}</span>
                  }
                >
                  <span className={styles.drawerTitleStyle}>{`$ ${Number(netAmt).toFixed(
                    2
                  )}`}</span>
                </Tooltip>
              </FormItem>
            )}
          </Form>
          <Divider className={styles.dividerStyle} dashed />
          {child}
        </Spin>
      );
    }
    return (
      <Table
        size="small"
        style={{ marginTop: 10 }}
        columns={this.detailColumns}
        dataSource={vidResultList}
        loading={!!pageLoading}
        scroll={{ x: 700 }}
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
            patronInfo: {},
            netAmt: 0,
            refundSuccessFlag: false,
          },
        });
      }, 500);
    });
  };

  render() {
    const {
      pageLoading,
      orderDetailMgr: {
        orderDetailVisible,
        detailType,
        detailList,
        vidResultList,
        patronInfo,
        netAmt,
        refundSuccessFlag,
      },
      global: {
        currentUser: { userType },
      },
    } = this.props;

    return (
      <Drawer
        title={<span className={styles.drawerTitle}>{formatMessage({ id: 'DETAIL' })}</span>}
        className={styles.drawerStyle}
        getContainer={false}
        placement="right"
        onClose={this.onClose}
        visible={orderDetailVisible}
        maskClosable={false}
      >
        {this.showInformation(
          detailType,
          detailList,
          vidResultList,
          patronInfo,
          netAmt,
          refundSuccessFlag,
          pageLoading,
          userType
        )}
      </Drawer>
    );
  }
}

export default Detail;
