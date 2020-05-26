import React, { Component } from 'react';
import { connect } from 'dva';
import { Checkbox, Col, Row, Spin } from 'antd';
import styles from './index.less';
import general from './assets/general.png';
import generalEmpty from './assets/generalEmpty.png';
import vip from './assets/vip.png';
import vipEmpty from './assets/vipEmpty.png';
import accessibleSeat from './assets/accessibleSeat.png';

@connect(({ ticketMgr, loading, onceAPirateTicketMgr }) => ({
  ticketMgr,
  onceAPirateTicketMgr,
  showLoading: loading.effects['ticketMgr/queryOAPOfferList'],
}))
class SitMapPanel extends Component {
  componentDidMount() {}

  callback = event => {
    const { dispatch } = this.props;

    dispatch({
      type: 'onceAPirateTicketMgr/save',
      payload: {
        showCategoryLoading: true,
      },
    });
    setTimeout(() => {
      dispatch({
        type: 'onceAPirateTicketMgr/save',
        payload: {
          showCategory: event.target.value,
          showCategoryLoading: false,
        },
      });
    }, 1000);
  };

  render() {
    const {
      onceAPirateTicketMgr: {
        queryInfo,
        onceAPirateOfferData = [],
        showCategory,
        showCategoryLoading,
      },
    } = this.props;

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

    const sitMapColGrid = { xs: 24, sm: 24, md: 12, lg: 16, xl: 16, xxl: 18 };
    const sitOpColGrid = { xs: 24, sm: 24, md: 12, lg: 8, xl: 8, xxl: 6 };

    let checkDisabled = false;
    if (queryInfo && queryInfo.accessibleSeat) {
      checkDisabled = queryInfo.accessibleSeat;
    }
    let generalChecked = false;
    let vipChecked = false;
    if (showCategory === '1') {
      generalChecked = true;
      vipChecked = false;
    } else if (showCategory === '2') {
      generalChecked = false;
      vipChecked = true;
    }

    return (
      <Spin spinning={showCategoryLoading}>
        <span style={{ marginLeft: '15px' }}>
          Please click the sitemap to choose the show category.
        </span>
        <Row>
          <Col {...sitMapColGrid} className={styles.sitMapCol}>
            <div className={styles.sitMapDiv}>
              {showCategory === '0' && onceAPirateOfferDataNew.length === 0 && (
                <img className={styles.sitMapImg} alt="Site Map" src={general} />
              )}
              {showCategory === '1' && onceAPirateOfferDataNew.length > 0 && (
                <img className={styles.sitMapImg} alt="Site Map" src={general} />
              )}
              {showCategory === '2' && onceAPirateOfferDataNew.length > 0 && (
                <img className={styles.sitMapImg} alt="Site Map" src={vip} />
              )}
              {showCategory === '1' && onceAPirateOfferDataNew.length === 0 && (
                <img className={styles.sitMapImg} alt="Site Map" src={generalEmpty} />
              )}
              {showCategory === '2' && onceAPirateOfferDataNew.length === 0 && (
                <img className={styles.sitMapImg} alt="Site Map" src={vipEmpty} />
              )}
            </div>
          </Col>
          <Col {...sitOpColGrid} className={styles.sitMapCol}>
            <div className={styles.sitMapOpDiv}>
              <Row>
                <Col span={24} className={styles.sitMapOpCol}>
                  <i className={styles.sitMapOpIcon} style={{ backgroundColor: '#6E51A2' }} />
                  <span>VIP</span>
                  <Checkbox
                    disabled={checkDisabled}
                    checked={vipChecked}
                    style={{ float: 'right' }}
                    onChange={this.callback}
                    value="2"
                  />
                </Col>
                <Col span={24}>
                  <i className={styles.sitMapOpIcon} style={{ backgroundColor: '#09BAEC' }} />
                  <span>General</span>
                  <Checkbox
                    disabled={checkDisabled}
                    checked={generalChecked}
                    style={{ float: 'right' }}
                    onChange={this.callback}
                    value="1"
                  />
                </Col>
                <Col span={24}>
                  <img
                    className={styles.wheelChairImg}
                    src={accessibleSeat}
                    alt="accessible seat"
                  />
                  <span>WheelChair Friendly</span>
                </Col>
                <Col span={24}>
                  <i className={styles.sitMapOpIcon} style={{ backgroundColor: '#939598' }} />
                  <span>Sold Out</span>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Spin>
    );
  }
}

export default SitMapPanel;
