import React from 'react';
import { Divider, Drawer, Form, Icon, Popover, Spin, Table, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { isNullOrUndefined } from 'util';
import moment from 'moment';
import { sortArray, sessionTimeToWholeDay } from '@/pages/TicketManagement/utils/utils';
import { transferModeOfPayment } from '../../utils/utils';
import styles from './index.less';
import PrivilegeUtil from '@/utils/PrivilegeUtil';

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
  revalidationVidLoading: loading.effects['orderDetailMgr/queryVid'],
}))
class Detail extends React.Component {
  revalidationVidColumns = [
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'NO' })}</span>,
      width: '9%',
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
      width: '20%',
      dataIndex: 'vid',
      key: 'vid',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'THEME_PARK' })}</span>,
      width: '20%',
      dataIndex: 'themeParks',
      key: 'themeParks',
      render: text => this.showThemePark(text),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'PLU_NAME' })}</span>,
      width: '20%',
      dataIndex: 'pluName',
      key: 'pluName',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'CATEGORY' })}</span>,
      width: '15%',
      dataIndex: 'ageGroup',
      key: 'ageGroup',
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
      width: '15%',
      render: text => this.showVidType(text),
    },
  ];

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
      width: '15%',
      dataIndex: 'vidCode',
      key: 'vidCode',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: (
        <span className={styles.tableTitle}>{`${formatMessage({ id: 'OFFER_NAME' })}123`}</span>
      ),
      width: '15%',
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
      width: '15%',
      dataIndex: 'themeParks',
      key: 'themeParks',
      render: text => this.showThemePark(text),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'NO_OF_PAX' })}</span>,
      width: '13%',
      dataIndex: 'numOfPax',
      key: 'numOfPax',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
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
      width: '15%',
      render: text => this.showVidType(text),
    },
  ];

  columns = [
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
      width: '17%',
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
      width: '18%',
      dataIndex: 'themeParks',
      key: 'themeParks',
      render: text => this.showThemePark(text),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'PLU_NAME' })}</span>,
      width: '17%',
      dataIndex: 'pluName',
      key: 'pluName',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'NO_OF_PAX' })}</span>,
      width: '14%',
      dataIndex: 'numOfPax',
      key: 'numOfPax',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text || '1'}</span>
        </Tooltip>
      ),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'CATEGORY' })}</span>,
      width: '13%',
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
      width: '15%',
      dataIndex: 'ticketType',
      key: 'ticketType',
      render: text => this.showVidType(text),
    },
  ];

  columnsTwo = [
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'NO' })}</span>,
      width: '9%',
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
      width: '20%',
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
      width: '20%',
      dataIndex: 'themeParks',
      key: 'themeParks',
      render: text => this.showThemePark(text),
    },
    {
      title: <span className={styles.tableTitle}>{formatMessage({ id: 'PLU_NAME' })}</span>,
      width: '20%',
      dataIndex: 'pluName',
      key: 'pluName',
      render: text => (
        <Tooltip placement="topLeft" title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}>
          <span>{text}</span>
        </Tooltip>
      ),
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
      width: '15%',
      render: text => this.showVidType(text),
    },
  ];

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderDetailMgr/resetData',
    });
  }

  showQuantity = orderQuantityInfo => {
    if (!orderQuantityInfo) {
      return;
    }
    const columnsInfo = [
      {
        title: 'Ticket Type',
        dataIndex: 'itemName',
        key: 'itemName',
        render: text => {
          if (Array.isArray(text)) {
            return (
              <div>
                {text.map(i => (
                  <div>{i || '-'}</div>
                ))}
              </div>
            );
          }
          return (
            <Tooltip
              placement="topLeft"
              title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}
            >
              <span>{text}</span>
            </Tooltip>
          );
        },
      },
      {
        title: 'Session',
        dataIndex: 'session',
        key: 'session',
        render: text => {
          if (Array.isArray(text)) {
            return (
              <div>
                {text.map(i => (
                  <div>{sessionTimeToWholeDay(i.session) || '-'}</div>
                ))}
              </div>
            );
          }
          let show = '-';
          if (text) {
            show = sessionTimeToWholeDay(text);
          }
          return (
            <Tooltip
              placement="topLeft"
              title={<span style={{ whiteSpace: 'pre-wrap' }}>{show}</span>}
            >
              <span>{show}</span>
            </Tooltip>
          );
        },
      },
      {
        title: 'Quantity',
        dataIndex: 'itemQuantity',
        key: 'itemQuantity',
        align: 'right',
        render: text => (
          <Tooltip
            placement="topLeft"
            title={<span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>}
          >
            <span>{text}</span>
          </Tooltip>
        ),
      },
    ];
    const { itemList = [], quantityTotal = 0 } = orderQuantityInfo;
    if (quantityTotal > 0) {
      sortArray(itemList, ['itemName']);
    }
    return (
      <div>
        <span className={styles.drawerTitleStyle}>{quantityTotal}</span>
        {quantityTotal > 0 && (
          <Popover
            overlayStyle={{ color: '#565656', margin: 0, padding: 0 }}
            content={
              <Table
                size="small"
                columns={columnsInfo}
                dataSource={itemList}
                pagination={false}
                bordered={false}
              />
            }
          >
            <Icon style={{ marginLeft: 10 }} type="eye" />
          </Popover>
        )}
      </div>
    );
  };

  showInformation = (
    detailType,
    detailList,
    vidResultList,
    patronInfo,
    netAmt,
    refundSuccessFlag,
    pageLoading,
    userType,
    revalidationVidListVisible,
    revalidationVidList,
    revalidationVidLoading,
    orderQuantityList,
    bookingDetail
  ) => {
    let deliveryModeStr = 'e-Ticket';
    let paymentModeStr = '';
    let approveByStr = '-';
    let userRolesStr = '-';
    let transTypeStr = 'booking';
    let refundAmountStr = 0;
    let detailStatus = '-';
    let confirmedVisitDate = null;
    const { orderSourceChannel, externalOrderNo } = bookingDetail || {};
    if (bookingDetail) {
      const { approveBy, paymentMode, status } = bookingDetail;
      approveByStr = approveBy;
      paymentModeStr = transferModeOfPayment(paymentMode);
      detailStatus = status;
      bookingDetail.offers.forEach(offerItem => {
        if (offerItem.deliveryInfo) {
          deliveryModeStr = offerItem.deliveryInfo.deliveryMode;
        }
      });
      if (deliveryModeStr === 'VID') {
        deliveryModeStr = 'EVID (Visual ID)';
      } else if (deliveryModeStr === 'BOCA') {
        deliveryModeStr = 'BOCA (Ticket / Voucher Collection Letter)';
      }

      if (bookingDetail.approveRoles) {
        const { approveRoles = '' } = bookingDetail;
        const userRoles = approveRoles.split(',');
        userRolesStr = userRoles.length > 0 ? userRoles.join(', ') : '-';
      }
      transTypeStr = bookingDetail.transType;
      refundAmountStr = bookingDetail.refundAmount;
    }

    if (revalidationVidList.length > 0) {
      for (let i = 0; i < revalidationVidList.length; i += 1) {
        if (isNullOrUndefined(confirmedVisitDate)) {
          if (
            revalidationVidList[i].validFrom !== '' &&
            revalidationVidList[i].validFrom !== null
          ) {
            confirmedVisitDate = moment(revalidationVidList[i].validFrom).format('DD-MMM-YYYY');
          }
        }
      }
    }

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
          return item.vidCode !== undefined && item.vidCode !== null && item.vidCode !== '';
        });
        for (let j = 0; j < filterVidList.length; j += 1) {
          filterVidList[j].vidNo = (Array(3).join('0') + (j + 1)).slice(-3);
        }

        const firstName = detailList[i].delivery ? detailList[i].delivery.firstName : '-';
        const lastName = detailList[i].delivery ? detailList[i].delivery.lastName : '-';
        const country = detailList[i].delivery ? detailList[i].delivery.country : '-';
        const contactNo = detailList[i].delivery ? detailList[i].delivery.contactNo : '-';
        const email = detailList[i].delivery ? detailList[i].delivery.email : '-';
        const visitDate = detailList[i].visitDate ? detailList[i].visitDate : '-';
        const { bundleName, offerName } = detailList[i];
        let offerNameText = offerName;
        let referenceNo;
        if (orderSourceChannel === 'OTA') {
          referenceNo = externalOrderNo;
        } else if (detailList[i].delivery) {
          // eslint-disable-next-line prefer-destructuring
          referenceNo = detailList[i].delivery.referenceNo;
        }
        if (bundleName !== null && bundleName !== '') {
          offerNameText = bundleName;
        }
        const orderQuantityInfo = orderQuantityList.find(
          orderQuantityItem => orderQuantityItem.offerGroup === detailList[i].offerGroup
        );
        child.push(
          <div key={`offer_${i}`}>
            <Divider className={styles.dividerStyle} dashed />
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
                    {formatMessage({ id: 'VISIT_DATE_TITLE' })}
                  </span>
                }
                {...formLayout}
              >
                <Tooltip
                  placement="topLeft"
                  title={<span style={{ whiteSpace: 'pre-wrap' }}>{visitDate || '-'}</span>}
                >
                  <span className={styles.drawerTitleStyle}>{visitDate || '-'}</span>
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
                {this.showQuantity(orderQuantityInfo)}
              </FormItem>
            </Form>
            <div>
              <span className={styles.drawerTitleStyle}>
                {formatMessage({ id: 'DELIVERY_INFORMATION' })}
              </span>
            </div>
            <Form className={styles.formStyle}>
              {this.showDelivery(formatMessage({ id: 'COUNTRY_OF_RESIDENCE' }), country)}
              {this.showDelivery(formatMessage({ id: 'TA_REFERENCE_NO' }), referenceNo || '-')}
              {PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.TRAN_ORDER_DETAIL_NO_MASK_PRIVILEGE]) &&
                this.showDelivery(formatMessage({ id: 'GUEST_FIRST_NAME' }), firstName)}
              {PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.TRAN_ORDER_DETAIL_NO_MASK_PRIVILEGE]) &&
                this.showDelivery(formatMessage({ id: 'GUEST_LAST_NAME' }), lastName)}
              {PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.TRAN_ORDER_DETAIL_NO_MASK_PRIVILEGE]) &&
                this.showDelivery(formatMessage({ id: 'CUSTOMER_CONTACT_NO' }), contactNo)}
              {PrivilegeUtil.hasAnyPrivilege([PrivilegeUtil.TRAN_ORDER_DETAIL_NO_MASK_PRIVILEGE]) &&
                this.showDelivery(formatMessage({ id: 'CUSTOMER_EMAIL_ADDRESS' }), email)}
              {transTypeStr === 'revalidation' &&
                this.showDelivery(
                  formatMessage({ id: 'NEW_VISIT_DATE' }),
                  bookingDetail.newVisitDate
                    ? moment(bookingDetail.newVisitDate).format('DD-MMM-YYYY')
                    : null
                )}
              {['revalidation', 'refund'].includes(transTypeStr) &&
                this.showDelivery(formatMessage({ id: 'REASON' }), bookingDetail.reason)}
              {['revalidation', 'refund'].includes(transTypeStr) &&
                this.showDelivery(formatMessage({ id: 'TA_EMAIL' }), bookingDetail.taEmail)}
              {['revalidation', 'refund'].includes(transTypeStr) &&
                !isNullOrUndefined(bookingDetail.subTaEmail) &&
                this.showDelivery(formatMessage({ id: 'SUB_TA_EMAIL' }), bookingDetail.subTaEmail)}
            </Form>
            {filterVidList.length > 0 && (
              <Table
                size="small"
                style={{ marginTop: 10, marginBottom: 20 }}
                columns={transTypeStr === 'revalidation' ? this.columnsTwo : this.columns}
                dataSource={filterVidList}
                loading={!!pageLoading}
                scroll={{ x: 540 }}
                pagination={false}
                bordered={false}
                rowKey={record => record.visualID}
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
            {transTypeStr !== 'refund' && (
              <FormItem
                label={<span className={styles.drawerTitleStyle}>MODE OF DELIVERY</span>}
                {...formLayout}
              >
                <Tooltip
                  placement="topLeft"
                  title={<span style={{ whiteSpace: 'pre-wrap' }}>{deliveryModeStr || '-'}</span>}
                >
                  <span className={styles.drawerTitleStyle}>{deliveryModeStr || '-'}</span>
                </Tooltip>
              </FormItem>
            )}
            {transTypeStr !== 'refund' && transTypeStr !== 'revalidation' && (
              <FormItem
                label={<span className={styles.drawerTitleStyle}>MODE OF PAYMENT</span>}
                {...formLayout}
              >
                <Tooltip
                  placement="topLeft"
                  title={<span style={{ whiteSpace: 'pre-wrap' }}>{paymentModeStr || '-'}</span>}
                >
                  <span className={styles.drawerTitleStyle}>{paymentModeStr || '-'}</span>
                </Tooltip>
              </FormItem>
            )}
            {(transTypeStr === 'refund' || transTypeStr === 'revalidation') && (
              <div>
                <FormItem
                  label={<span className={styles.drawerTitleStyle}>PROCESSED BY</span>}
                  {...formLayout}
                >
                  <Tooltip
                    placement="topLeft"
                    title={<span style={{ whiteSpace: 'pre-wrap' }}>{approveByStr || '-'}</span>}
                  >
                    <span className={styles.drawerTitleStyle}>{approveByStr || '-'}</span>
                  </Tooltip>
                </FormItem>
                <FormItem
                  label={<span className={styles.drawerTitleStyle}>USER ROLE</span>}
                  {...formLayout}
                >
                  <Tooltip
                    placement="topLeft"
                    title={<span style={{ whiteSpace: 'pre-wrap' }}>{userRolesStr || '-'}</span>}
                  >
                    <span className={styles.drawerTitleStyle}>{userRolesStr || '-'}</span>
                  </Tooltip>
                </FormItem>
              </div>
            )}
            {transTypeStr !== 'revalidation' && (userType === '02' || userType === '01') && (
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
                    <span style={{ whiteSpace: 'pre-wrap' }}>
                      {`$ ${String(Number(netAmt).toFixed(2)).replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ','
                      )}`}
                    </span>
                  }
                >
                  <span className={styles.drawerTitleStyle}>
                    {`$ ${String(Number(netAmt).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                  </span>
                </Tooltip>
              </FormItem>
            )}
            {transTypeStr === 'revalidation' && detailStatus === 'Complete' && (
              <FormItem
                label={
                  <span className={styles.drawerTitleStyle}>
                    {formatMessage({ id: 'CONFIRMED_VISIT_DATE' })}
                  </span>
                }
                {...formLayout}
              >
                <Tooltip
                  placement="topLeft"
                  title={
                    <span style={{ whiteSpace: 'pre-wrap' }}>{confirmedVisitDate || '-'}</span>
                  }
                >
                  <span className={styles.drawerTitleStyle}>{confirmedVisitDate || '-'}</span>
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
                    <span style={{ whiteSpace: 'pre-wrap' }}>
                      {`$ ${String(Number(refundAmountStr).toFixed(2)).replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ','
                      )}`}
                    </span>
                  }
                >
                  <span className={styles.drawerTitleStyle}>
                    {`$ -${String(Number(refundAmountStr).toFixed(2)).replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ','
                    )}`}
                  </span>
                </Tooltip>
              </FormItem>
            )}
            {revalidationVidListVisible && (
              <div>
                <span className={styles.drawerTitleStyle}>
                  {formatMessage({ id: 'REVALIDATION_VID_TITLE' })}
                </span>
                <Table
                  size="small"
                  style={{ marginTop: 10, marginBottom: 20 }}
                  columns={this.revalidationVidColumns}
                  dataSource={revalidationVidList}
                  loading={!!revalidationVidLoading}
                  scroll={{ x: 540 }}
                  pagination={false}
                  bordered={false}
                />
              </div>
            )}
          </Form>
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

  showThemePark = text => {
    const {
      orderDetailMgr: { themeParkList = [] },
    } = this.props;
    if (text instanceof Array) {
      const resObj = text.map(item => {
        if (themeParkList.find(item2 => item === item2.bookingCategoryCode)) {
          return themeParkList.find(item2 => item === item2.bookingCategoryCode)
            .bookingCategoryName;
        }
        return item;
      });
      const showText = resObj.length > 0 ? resObj.join(', ') : '-';
      return (
        <Tooltip
          placement="topLeft"
          title={<span style={{ whiteSpace: 'pre-wrap' }}>{showText}</span>}
        >
          <span>{showText}</span>
        </Tooltip>
      );
    }
    for (let i = 0; i < themeParkList.length; i += 1) {
      if (themeParkList[i].bookingCategoryCode === text) {
        return (
          <Tooltip
            placement="topLeft"
            title={
              <span style={{ whiteSpace: 'pre-wrap' }}>{themeParkList[i].bookingCategoryName}</span>
            }
          >
            <span>{themeParkList[i].bookingCategoryName}</span>
          </Tooltip>
        );
      }
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

  showVidType = text => {
    if (text === 'Voucher') {
      return text;
    }
    if (text !== 'Voucher') {
      return 'Ticket';
    }
  };

  showQuantityEye = (label, value) => (
    <FormItem label={label} {...formLayout}>
      {value}
    </FormItem>
  );

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
            status: null,
            revalidationVidListVisible: false,
            revalidationVidList: [],
          },
        });
      }, 500);
    });
  };

  render() {
    const {
      pageLoading,
      revalidationVidLoading,
      orderDetailMgr: {
        orderDetailVisible,
        detailType,
        detailList,
        vidResultList,
        patronInfo,
        netAmt,
        refundSuccessFlag,
        revalidationVidListVisible,
        revalidationVidList,
        orderQuantityList,
        bookingDetail,
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
          userType,
          revalidationVidListVisible,
          revalidationVidList,
          revalidationVidLoading,
          orderQuantityList,
          bookingDetail
        )}
      </Drawer>
    );
  }
}

export default Detail;
