import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Tooltip, Icon, Card, List } from 'antd';
import { formatMessage } from 'umi/locale';
import Detail from '../Detail';
import ToCart from '../AttractionToCart';
import { calculateTicketPrice, arrToString } from '../../../../utils/utils';
import styles from './index.less';

@connect(({ ticketMgr, global }) => ({
  ticketMgr,
  global,
}))
class DolphinIslandOffer extends Component {
  constructor(props) {
    super(props);
    const clientHeight =
      document.getElementsByClassName('main-layout-content ant-layout-content')[0].clientHeight -
      50;
    this.state = {
      clientHeight,
    };
  }

  showToCart = record => {
    const { dispatch } = this.props;
    const {
      attractionProduct = [],
      detail,
      session: { priceTimeFrom },
    } = record;
    const attractionProductCopy = JSON.parse(JSON.stringify(attractionProduct));
    const detailCopy = JSON.parse(JSON.stringify(detail));
    const { priceRule } = attractionProduct[0];
    let dolphinSessionIndex;

    priceRule.forEach(item => {
      const { productPrice, priceRuleName } = item;
      if (priceRuleName === 'DefaultPrice') {
        productPrice.forEach((item2, index2) => {
          if (item2.priceTimeFrom === priceTimeFrom) {
            dolphinSessionIndex = index2;
          }
        });
      }
    });
    dispatch({
      type: 'ticketMgr/save',
      payload: {
        attractionProduct: attractionProductCopy,
        detail: detailCopy,
        showToCartModal: true,
        dolphinSessionIndex,
        eventSession: priceTimeFrom,
      },
    });
  };

  detailToCart = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketMgr/save',
      payload: {
        showDetailModal: false,
        showToCartModal: true,
      },
    });
  };

  viewDetail = record => {
    const { dispatch } = this.props;
    const { attractionProduct = [], detail } = record;
    const attractionProductCopy = JSON.parse(JSON.stringify(attractionProduct));
    const detailCopy = JSON.parse(JSON.stringify(detail));
    dispatch({
      type: 'ticketMgr/save',
      payload: {
        attractionProduct: attractionProductCopy,
        detail: detailCopy,
        showDetailModal: true,
      },
    });
  };

  formatInputValue = (index, value, productInventory) => {
    const {
      ticketMgr: { attractionProduct = [] },
    } = this.props;
    const originalValue = attractionProduct[index].ticketNumber;
    const testReg = /^[1-9]\d*$/;
    const testZero = /^0$/;
    if (
      value === '' ||
      testZero.test(value) ||
      (testReg.test(value) && value <= productInventory)
    ) {
      return value;
    }
    return originalValue;
  };

  changeTicketNumber = async (index, value, productPrice, productInventory) => {
    const {
      dispatch,
      ticketMgr: { attractionProduct = [] },
    } = this.props;
    const originalValue = attractionProduct[index].ticketNumber;
    const attractionProductCopy = JSON.parse(JSON.stringify(attractionProduct));
    const testReg = /^[1-9]\d*$/;
    const testZero = /^0$/;
    if (
      value === '' ||
      testZero.test(value) ||
      (testReg.test(value) && value <= productInventory)
    ) {
      attractionProductCopy[index].ticketNumber = value;
      attractionProductCopy[index].price = calculateTicketPrice(value, productPrice);
      dispatch({
        type: 'ticketMgr/save',
        payload: {
          attractionProduct: attractionProductCopy,
        },
      });
      return value;
    }
    return originalValue;
  };

  showDetail = (index, showDetail) => {
    const {
      dispatch,
      ticketMgr: { dolphinIslandOfferList = [] },
    } = this.props;
    const dolphinIslandOfferListCopy = JSON.parse(JSON.stringify(dolphinIslandOfferList));
    dolphinIslandOfferListCopy[index].showDetail = !showDetail;
    dispatch({
      type: 'ticketMgr/save',
      payload: {
        dolphinIslandOfferList: dolphinIslandOfferListCopy,
      },
    });
  };

  onClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ticketMgr/save',
      payload: {
        showDetailModal: false,
        showToCartModal: false,
        deliverInfomation: {},
      },
    });
  };

  changeDeliveryInformation = (type, value) => {
    const {
      dispatch,
      ticketMgr: { deliverInfomation = {} },
    } = this.props;
    const deliverInfomationCopy = JSON.parse(JSON.stringify(deliverInfomation));
    deliverInfomationCopy[type] = value;
    dispatch({
      type: 'ticketMgr/save',
      payload: {
        deliverInfomation: deliverInfomationCopy,
      },
    });
  };

  order = () => {
    const {
      dispatch,
      ticketMgr: {
        deliverInfomation = {},
        attractionProduct = [],
        detail,
        detail: { dateOfVisit, numOfGuests },
      },
    } = this.props;
    if (attractionProduct.length === 1) {
      const { ticketNumber, price } = attractionProduct[0];
      const themeParkCode = attractionProduct[0].attractionProduct.themePark;
      const { themeParkName, ageGroup } = attractionProduct[0].attractionProduct;
      const orderInfo = [];
      orderInfo.push({
        ageGroup,
        quantity: ticketNumber,
        pricePax: price,
        productInfo: attractionProduct[0],
      });
      const orderData = {
        themeParkCode,
        themeParkName,
        queryInfo: {
          dateOfVisit,
          numOfGuests,
        },
        orderInfo,
        offerInfo: { ...detail },
        deliveryInfo: deliverInfomation,
      };
      dispatch({
        type: 'ticketOrderCartMgr/settingGeneralTicketOrderData',
        payload: {
          orderIndex: null,
          orderData,
        },
      });
    } else {
      const orderInfo = [];
      attractionProduct.forEach(item => {
        const { ticketNumber, price } = attractionProduct;
        orderInfo.push({
          ageGroup: item.attractionProduct.ageGroup,
          quantity: ticketNumber,
          pricePax: price,
          productInfo: item,
        });
      });
      const orderData = {
        queryInfo: {
          dateOfVisit,
          numOfGuests,
        },
        orderInfo,
        offerInfo: { ...detail },
        deliveryInfo: deliverInfomation,
      };
      dispatch({
        type: 'ticketOrderCartMgr/settingPackageTicketOrderData',
        payload: {
          orderIndex: null,
          orderData,
        },
      });
    }
    this.onClose();
  };

  render() {
    const { clientHeight } = this.state;
    const {
      ticketMgr: {
        dolphinSessionIndex,
        showDetailModal,
        attractionProduct = [],
        detail,
        showToCartModal,
        dolphinIslandOfferList = [],
        countrys = [],
        eventSession,
        deliverInfomation = {},
      },
      global: {
        userCompanyInfo: { companyType },
      },
    } = this.props;
    const ticketTypeItems = [];
    const descriptionItems = [];
    attractionProduct.forEach(item => {
      ticketTypeItems.push(item.attractionProduct.ticketType);
      descriptionItems.push(item.attractionProduct.pluDesc);
    });
    const ticketType = arrToString(ticketTypeItems);
    const description = arrToString(descriptionItems);
    const columns = [
      {
        title: 'Offer Name',
        key: 'name',
        render: record => {
          const {
            detail: {
              offerBasicInfo: { offerName },
            },
          } = record;
          return (
            <Tooltip
              title={offerName}
              placement="topLeft"
              overlayStyle={{ whiteSpace: 'pre-wrap' }}
            >
              <span style={{ whiteSpace: 'pre' }}>{offerName}</span>
            </Tooltip>
          );
        },
      },
      {
        title: 'Session',
        key: 'Session',
        render: record => {
          const {
            session: { priceTimeFrom },
          } = record;
          return <div>{priceTimeFrom}</div>;
        },
      },
      {
        title: 'Price',
        key: 'Price',
        width: companyType === '02' ? 0 : null,
        align: 'right',
        render: record => {
          const {
            session: { discountUnitPrice },
          } = record;
          const { ageGroup } = record.attractionProduct[0].attractionProduct;
          return (
            <div className={styles.productPrice}>
              <div>{ageGroup}</div>
              <div>From ${discountUnitPrice.toFixed(2)}</div>
            </div>
          );
        },
      },
      {
        title: '',
        key: 'empty',
        width: '2%',
        render: () => {
          return <div />;
        },
      },
      {
        title: 'Operation',
        key: 'Operation',
        width: '30%',
        render: (_, record) => {
          return (
            <div className={styles.operation}>
              <Tooltip title="Detail">
                <Icon
                  type="eye"
                  onClick={e => {
                    e.stopPropagation();
                    this.viewDetail(record);
                  }}
                  style={{ marginRight: '10px' }}
                />
              </Tooltip>
              <Button
                type="primary"
                onClick={e => {
                  e.stopPropagation();
                  this.showToCart(record);
                }}
              >
                Add to Cart
              </Button>
            </div>
          );
        },
      },
    ];
    const columns2 = [
      {
        title: 'Offer Name',
        key: 'name',
        render: record => {
          const {
            detail: {
              offerBasicInfo: { offerName },
            },
          } = record;
          return (
            <Tooltip
              title={offerName}
              placement="topLeft"
              overlayStyle={{ whiteSpace: 'pre-wrap' }}
            >
              <span style={{ whiteSpace: 'pre' }}>{offerName}</span>
            </Tooltip>
          );
        },
      },
      {
        title: 'Session',
        key: 'Session',
        render: record => {
          const {
            session: { priceTimeFrom },
          } = record;
          return <div>{priceTimeFrom}</div>;
        },
      },
      {
        title: 'Operation',
        key: 'Operation',
        width: '30%',
        render: (_, record) => {
          return (
            <div className={styles.operation}>
              <Tooltip title="Detail">
                <Icon
                  type="eye"
                  onClick={e => {
                    e.stopPropagation();
                    this.viewDetail(record);
                  }}
                  style={{ marginRight: '10px' }}
                />
              </Tooltip>
              <Button
                type="primary"
                onClick={e => {
                  e.stopPropagation();
                  this.showToCart(record);
                }}
              >
                Add to Cart
              </Button>
            </div>
          );
        },
      },
    ];
    return (
      <div className={styles.container} style={{ minHeight: clientHeight }}>
        {showDetailModal ? (
          <Detail
            attractionProduct={attractionProduct}
            detail={detail}
            onClose={this.onClose}
            showToCart={this.detailToCart}
          />
        ) : null}
        {showToCartModal ? (
          <ToCart
            attractionProduct={attractionProduct}
            detail={detail}
            onClose={this.onClose}
            changeTicketNumber={this.changeTicketNumber}
            formatInputValue={this.formatInputValue}
            priceRuleIndex={dolphinSessionIndex}
            countrys={countrys}
            order={this.order}
            ticketType={ticketType}
            description={description}
            eventSession={eventSession}
            deliverInfomation={deliverInfomation}
            changeDeliveryInformation={(type, value) => this.changeDeliveryInformation(type, value)}
          />
        ) : null}
        {dolphinIslandOfferList.length === 0 ? (
          <div style={{ minHeight: 500 }}>
            <List style={{ marginTop: 100 }} />
          </div>
        ) : (
          <div>
            {dolphinIslandOfferList.map((item, index) => {
              const { tag, offer = [], showDetail } = item;
              return (
                <div key={tag} className={styles.categoryItem}>
                  <div className={styles.category}>
                    {showDetail ? (
                      <Icon
                        type="caret-down"
                        style={{ color: '#666666', fontSize: '16px', margin: '0 8px 0 12px' }}
                        onClick={() => this.showDetail(index, showDetail)}
                      />
                    ) : (
                      <Icon
                        type="caret-right"
                        style={{ color: '#666666', fontSize: '16px', margin: '0 8px 0 12px' }}
                        onClick={() => this.showDetail(index, showDetail)}
                      />
                    )}
                    <span>{tag}</span>
                  </div>
                  {showDetail ? (
                    <Table
                      className={styles.table}
                      columns={companyType === '02' ? columns2 : columns}
                      dataSource={offer}
                      pagination={false}
                      rowKey={record => record.id}
                      size="small"
                      bordered={false}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default DolphinIslandOffer;
