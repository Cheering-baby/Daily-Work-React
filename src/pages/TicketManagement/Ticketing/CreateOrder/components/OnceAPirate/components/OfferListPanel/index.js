import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Icon, InputNumber, message, Table, Tooltip } from 'antd';
import styles from './index.less';
import OfferDetail from '@/pages/TicketManagement/Ticketing/CreateOrder/components/Detail';
import { getAttractionProducts } from '@/pages/TicketManagement/utils/utils';

@Form.create()
@connect(({ global, ticketMgr, loading, onceAPirateTicketMgr }) => ({
  global,
  ticketMgr,
  onceAPirateTicketMgr,
  showLoading: loading.effects['ticketMgr/queryOfferList'],
}))
class OfferListPanel extends Component {
  componentDidMount() {}

  showOperation = record => {
    return (
      <div>
        <Tooltip title="Detail" placement="top">
          <Icon type="eye" onClick={() => this.showDetail(record)} />
        </Tooltip>
      </div>
    );
  };

  showDetail = offerDetail => {
    const {
      dispatch,
      onceAPirateTicketMgr: { queryInfo = {} },
    } = this.props;
    const { offerProfile, selectRuleId } = offerDetail;
    const { sessionTime } = queryInfo;
    let attractionProduct = getAttractionProducts(offerProfile);
    attractionProduct = attractionProduct.map(item => ({ ...item, sessionTime }));
    offerProfile.selectRuleId = selectRuleId;
    dispatch({
      type: 'onceAPirateTicketMgr/save',
      payload: {
        showDetail: true,
        offerProfile,
        attractionProduct,
        offerDetail,
      },
    });
  };

  onClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'onceAPirateTicketMgr/save',
      payload: {
        showDetail: false,
      },
    });
  };

  changeOrderQuantity = (offerInfo, quantityValue) => {
    const {
      dispatch,
      onceAPirateTicketMgr: { queryInfo, onceAPirateOfferData = [] },
    } = this.props;

    let orderQuantity = 0;
    for (const onceAPirateOffer of onceAPirateOfferData) {
      if (onceAPirateOffer.offerNo === offerInfo.offerNo) {
        onceAPirateOffer.orderQuantity = quantityValue;
      }
      orderQuantity += onceAPirateOffer.orderQuantity;
    }

    if (orderQuantity > queryInfo.numOfGuests) {
      message.warn('Offer order quantity more than No. of Guests');
    }

    dispatch({
      type: 'onceAPirateTicketMgr/save',
      payload: {
        onceAPirateOfferData,
      },
    });
  };

  getOfferMaxAvailable = offerInfo => {
    const { offerMaxQuantity } = offerInfo;
    return offerMaxQuantity;
  };

  render() {
    const {
      global: {
        userCompanyInfo: { companyType },
      },
      onceAPirateTicketMgr: {
        showCategory,
        onceAPirateOfferData = [],
        showCategoryLoading,
        offerProfile,
        attractionProduct,
        showDetail,
      },
    } = this.props;

    const columns = [
      {
        title: 'Offer Name',
        dataIndex: 'offerName',
        key: 'offerName',
        render: text => (
          <div className={styles.tableColDiv}>
            <Tooltip title={text} placement="topLeft">
              {text || '-'}
            </Tooltip>
          </div>
        ),
      },
      {
        title: 'Price',
        dataIndex: 'showPrice',
        align: 'right',
        render: text => (
          <div className={styles.tableColDiv}>
            <Tooltip title={text} placement="topLeft">
              {text || '-'}
            </Tooltip>
          </div>
        ),
      },
      {
        title: '',
        dataIndex: 'offerNo',
        width: '16%',
        render: () => <div className={styles.tableColDiv} />,
      },
      {
        title: 'Quantity',
        dataIndex: 'orderQuantity',
        render: (text, record) => (
          <div className={styles.tableColDiv}>
            <InputNumber
              value={text}
              min={0}
              max={this.getOfferMaxAvailable(record)}
              onChange={value => this.changeOrderQuantity(record, value)}
              placeholder="Please Input"
            />
          </div>
        ),
      },
      {
        title: 'Operation',
        render: (text, record) => this.showOperation(record),
      },
    ];

    if (companyType === '02') {
      // delete price column
      columns.splice(1, 1);
    }

    const onceAPirateOfferDataNew = onceAPirateOfferData.filter(offerData => {
      let isVip = false;
      let isRegular = false;
      if (offerData.offerProfile && offerData.offerProfile.offerCategory) {
        offerData.offerProfile.offerCategory.forEach(offerCategory => {
          if (offerCategory.categoryName === 'VIP') {
            isVip = true;
          }
          if (
            offerCategory.categoryName === 'General' ||
            offerCategory.categoryName === 'GENERAL'
          ) {
            isRegular = true;
          }
        });
      }
      let result = false;
      if (showCategory === '1' && isRegular) {
        result = true;
      }
      if (showCategory === '2' && isVip) {
        result = true;
      }
      return result;
    });

    return (
      <div>
        <Table
          className={styles.tablePanel}
          style={{ marginTop: 10 }}
          bordered={false}
          size="small"
          columns={columns}
          dataSource={onceAPirateOfferDataNew}
          pagination={false}
          rowKey="offerNo"
          loading={showCategoryLoading}
        />
        {showDetail ? (
          <OfferDetail
            detail={offerProfile}
            attractionProduct={attractionProduct}
            onClose={this.onClose}
          />
        ) : null}
      </div>
    );
  }
}

export default OfferListPanel;
