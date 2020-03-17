import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Radio, Row, Col  } from 'antd';
import styles from './index.less';
import siteMapDataEmpty from './assets/empty.png';
import regularActive from './assets/regularActive.png';
import regularInactive from './assets/regularInactive.png';
import VIPActive from './assets/VIPActive.png';
import VIPInActive from './assets/VIPInActive.png';

@connect(({ ticketMgr, loading, onceAPirateTicketMgr }) => ({
  ticketMgr,
  onceAPirateTicketMgr,
  showLoading: loading.effects['ticketMgr/queryOAPOfferList'],
}))
class SitMapPanel extends Component {

  componentDidMount() {

  }

  callback = (event) => {

    const {
      dispatch,
    } = this.props;

    dispatch({
      type: 'onceAPirateTicketMgr/save',
      payload: {
        showCategoryLoading: true,
      },
    });
    setTimeout(()=>{
      dispatch({
        type: 'onceAPirateTicketMgr/save',
        payload: {
          showCategory: event.target.value,
          showCategoryLoading: false,
        },
      });
    },1000);

  };

  render() {

    const {
      onceAPirateTicketMgr: {
        queryInfo,
        onceAPirateOfferData = [],
        showCategory,
        showCategoryLoading
      }
    } = this.props;

    return (
      <Spin spinning={showCategoryLoading}>
        <Radio.Group defaultValue={showCategory} value={showCategory} buttonStyle="solid" onChange={this.callback}>
          <Radio.Button value="1">General</Radio.Button>
          {
            (queryInfo && !queryInfo.accessibleSeat) && (
              <Radio.Button value="2">VIP</Radio.Button>
            )
          }
        </Radio.Group>
        {
          (queryInfo && !queryInfo.accessibleSeat) && (
            <span style={{marginLeft:'15px'}}>Please click the button to choose the show category.</span>
          )
        }
        <Row>
          <Col span={24}>
            {
              (showCategory === "0" && onceAPirateOfferData.length === 0) && (
                <img className={styles.sitMapImg} alt='Site Map' src={siteMapDataEmpty} />
              )
            }
            {
              (showCategory === "1" && onceAPirateOfferData.length > 0) && (
                <img className={styles.sitMapImg} alt='Site Map' src={regularActive} />
              )
            }
            {
              (showCategory === "2" && onceAPirateOfferData.length > 0) && (
                <img className={styles.sitMapImg} alt='Site Map' src={VIPActive} />
              )
            }
            {
              (showCategory === "1" && onceAPirateOfferData.length === 0)  && (
                <img className={styles.sitMapImg} alt='Site Map' src={regularInactive} />
              )
            }
            {
              (showCategory === "2" && onceAPirateOfferData.length === 0) && (
                <img className={styles.sitMapImg} alt='Site Map' src={VIPInActive} />
              )
            }
          </Col>
        </Row>
      </Spin>
    );
  }
}

export default SitMapPanel;
