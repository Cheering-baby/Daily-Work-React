import React, { PureComponent } from 'react';
import { Card, Col, List, Row, Spin } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import MediaQuery from 'react-responsive';
import { formatMessage } from 'umi/locale';
import { isNvl } from '@/utils/utils';
import styles from './index.less';
import SCREEN from '@/utils/screen';
import BreadcrumbCompForPams from '@/components/BreadcrumbComp/BreadcurmbCompForPams';
import SearchPanel from './components/SearchPanel';
import OnceAPirate from './components/OnceAPirate';
import Attraction from './components/Attraction';
import MyOrderButton from '@/pages/TicketManagement/components/MyOrderButton';

@connect(({ global, ticketMgr, ticketOrderCartMgr, loading }) => ({
  global,
  ticketMgr,
  ticketOrderCartMgr,
  productPanelListLoading:
    loading.effects['ticketMgr/queryOfferList'] || loading.effects['ticketMgr/queryDolphinIsland'],
}))
class CreateOrder extends PureComponent {
  constructor(props) {
    super(props);
    const clientHeight =
      document.getElementsByClassName('main-layout-content ant-layout-content')[0].clientHeight -
      78;
    this.state = {
      clientHeight,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      ticketMgr: { orderIndex },
      location: {
        query: { operateType },
      },
    } = this.props;
    dispatch({
      type: 'ticketMgr/queryPluAttribute',
      payload: {
        attributeItem: 'TICKET_TYPE',
      },
    });
    dispatch({
      type: 'ticketMgr/queryTicketConfig',
      payload: {
        attributeItem: 'TICKET_TYPE',
      },
    });
    dispatch({
      type: 'ticketMgr/queryOfferBookingCategory',
      payload: {},
    });
    dispatch({
      type: 'ticketOrderCartMgr/createShoppingCart',
      payload: {},
    }).then(() => {
      dispatch({
        type: 'ticketOrderCartMgr/queryShoppingCart',
        payload: {},
      });
    });
    if (operateType && operateType === 'editOnceAPirateOrder' && orderIndex !== null) {
      dispatch({
        type: 'ticketMgr/initEditOnceAPirateOrder',
        payload: {},
      });
    } else if (operateType && operateType === 'return') {
      // to do some thing
    } else if (operateType && operateType === 'goBack') {
      if (orderIndex !== null) {
        dispatch({
          type: 'ticketMgr/resetEditOnceAPirateOrder',
          payload: {},
        });
      }
    } else {
      dispatch({
        type: 'ticketMgr/resetData',
        payload: {},
      });
      dispatch({
        type: 'onceAPirateTicketMgr/resetData',
        payload: {},
      });
      dispatch({
        type: 'ticketOrderCartMgr/resetData',
        payload: {},
      });
      dispatch({
        type: 'ticketBookingAndPayMgr/resetData',
        payload: {},
      });
      dispatch({
        type: 'ticketMgr/save',
        payload: {
          functionActive: this.checkTAStatus(),
        },
      });
    }
  }

  checkTAStatus = () => {
    const {
      global: {
        currentUser: { userType },
        userCompanyInfo,
      },
    } = this.props;
    let taStatus = false;
    if (userType === '02') {
      if (userCompanyInfo.status === '0') {
        taStatus = true;
      }
    } else if (userType === '03') {
      if (userCompanyInfo.status === '0') {
        taStatus = true;
      }
      if (userCompanyInfo.mainTAInfo && userCompanyInfo.mainTAInfo.status !== '0') {
        taStatus = false;
      }
    }
    return taStatus;
  };

  clickOrder = () => {
    router.push(`/TicketManagement/Ticketing/OrderCart/CheckOrder`);
  };

  searchSuccess = () => {
    if (this.attractionForm) {
      const { form } = this.attractionForm.props;
      if (form) {
        form.resetFields();
      }
    }
  };

  render() {
    const {
      productPanelListLoading,
      ticketMgr: { activeDataPanel, mainPageLoading = false },
      ticketOrderCartMgr: { orderCartDataAmount },
    } = this.props;

    const { clientHeight } = this.state;

    const title = [
      { name: formatMessage({ id: 'TICKETING' }) },
      { name: formatMessage({ id: 'ORDER_CREATION' }) },
    ];
    const searchPanelGrid = { xs: 24, sm: 24, md: 9, lg: 8, xl: 6, xxl: 6 };
    const infoPanelGrid = { xs: 24, sm: 24, md: 15, lg: 16, xl: 18, xxl: 18 };
    const productPanelList = [
      <Attraction
        wrappedComponentRef={form => {
          this.attractionForm = form;
        }}
      />,
      <OnceAPirate />,
    ];

    return (
      <Spin spinning={mainPageLoading}>
        <Row gutter={12} style={{ fontSize: '15px' }} id="Ticketing-Create-Order">
          <MediaQuery minWidth={SCREEN.screenSm}>
            <Col span={24} className={styles.top}>
              <BreadcrumbCompForPams title={title} />
              <MyOrderButton
                orderAmount={orderCartDataAmount}
                onClickOrder={() => this.clickOrder()}
              />
            </Col>
          </MediaQuery>
          <Col span={24}>
            <div className={styles.orderTitle}>{formatMessage({ id: 'ORDER_CREATION' })}</div>
          </Col>
          <Col span={24}>
            <div className={styles.orderTitleTipStyles}>
              Note: {formatMessage({ id: 'ORDER_TITLE_TIP' })}
            </div>
          </Col>
          <MediaQuery maxWidth={SCREEN.screenXsMax}>
            <Col span={24} style={{ marginLeft: '5px', marginTop: '10px' }}>
              <MyOrderButton
                orderAmount={orderCartDataAmount}
                onClickOrder={() => this.clickOrder()}
              />
            </Col>
          </MediaQuery>
          <Col {...searchPanelGrid} className={styles.marginBottom8}>
            <SearchPanel searchSuccess={this.searchSuccess} />
          </Col>
          <Col {...infoPanelGrid} className={styles.marginBottom8}>
            <Spin spinning={!!productPanelListLoading}>
              <div className={styles.marginTop4}>
                {!isNvl(activeDataPanel) ? (
                  productPanelList[activeDataPanel]
                ) : (
                  <Card
                    title={null}
                    style={{ minHeight: clientHeight, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)' }}
                  >
                    <List style={{ marginTop: 100 }} />
                    <div className={styles.emptyListFont}>
                      {formatMessage({ id: 'EMPTY_PRODUCT_TIP' })}
                    </div>
                  </Card>
                )}
              </div>
            </Spin>
          </Col>
        </Row>
      </Spin>
    );
  }
}

export default CreateOrder;
