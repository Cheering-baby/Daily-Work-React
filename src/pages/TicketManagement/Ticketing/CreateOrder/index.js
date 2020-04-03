import React, {PureComponent} from 'react';
import {Card, Col, List, Row, Spin} from 'antd';
import {connect} from 'dva';
import router from 'umi/router';
import MediaQuery from 'react-responsive';
import {formatMessage} from 'umi/locale';
import {isNvl} from '@/utils/utils';
import styles from './index.less';
import SCREEN from '@/utils/screen';
import BreadcrumbComp from '../../components/BreadcrumbComp';
import SearchPanel from './components/SearchPanel';
import OnceAPirate from './components/OnceAPirate';
import Attraction from './components/Attraction';
import DolphinIslandOffer from './components/DolphinIslandOffer';
import MyOrderButton from '@/pages/TicketManagement/components/MyOrderButton';

const productPanelList = [<Attraction />, <OnceAPirate />, <DolphinIslandOffer />];

@connect(({ ticketMgr, ticketOrderCartMgr, loading }) => ({
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
      50;
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
      // dispatch({
      //   type: 'ticketMgr/resetData',
      //   payload: {},
      // });
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
    }
  }

  clickOrder = () => {
    router.push(`/TicketManagement/Ticketing/OrderCart/CheckOrder`);
  };

  render() {
    const {
      productPanelListLoading,
      ticketMgr: { tipVisible, activeDataPanel, mainPageLoading = false },
      ticketOrderCartMgr: { orderCartDataAmount },
    } = this.props;

    const { clientHeight } = this.state;

    const title = [{ name: 'Ticketing' }, { name: 'Create Order' }];
    const searchPanelGrid = { xs: 24, sm: 24, md: 9, lg: 8, xl: 6, xxl: 6 };
    const infoPanelGrid = { xs: 24, sm: 24, md: 15, lg: 16, xl: 18, xxl: 18 };

    return (
      <Spin spinning={mainPageLoading}>
        <Row gutter={12}>
          <Col {...searchPanelGrid} className={styles.marginBottom8}>
            <MediaQuery minWidth={SCREEN.screenSm}>
              <div style={{ height: 34 }}>
                <BreadcrumbComp title={title} />
              </div>
            </MediaQuery>
            <SearchPanel />
          </Col>
          <Col {...infoPanelGrid} className={styles.marginBottom8}>
            <MyOrderButton
              tipVisible={tipVisible}
              tipString={formatMessage({ id: 'ORDER_TITLE_TIP' })}
              orderAmount={orderCartDataAmount}
              onClickOrder={() => this.clickOrder()}
            />
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
