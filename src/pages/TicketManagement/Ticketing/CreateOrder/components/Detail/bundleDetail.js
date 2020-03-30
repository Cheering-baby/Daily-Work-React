import React, { Component } from 'react';
import { connect } from 'dva';
import { Drawer, Row, Col, Button } from 'antd';
import styles from './index.less';

@connect(({ callCenterBookingAttraction }) => ({
  callCenterBookingAttraction,
}))
class Detail extends Component {
  onClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'callCenterBookingAttraction/save',
      payload: {
        showDetailModal: false,
      },
    });
  };

  toCart = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'callCenterBookingAttraction/save',
      payload: {
        showDetailModal: false,
        showToCart: true,
      },
    });
  };

  render() {
    const bodyWidth = document.body.clientWidth || document.documentElement.clientWidth;
    const {
      onClose,
      bundleOfferDetail: { bundleName, offers = [] },
    } = this.props;
    const longDescriptionItems = [];
    const offerIncludesItems = [];
    const termsAndConditionsItems = [];
    offers.forEach(item => {
      const { offerContentList = [] } = item;
      offerContentList.forEach(item2 => {
        const { contentLanguage, contentType, contentValue } = item2;
        if (contentLanguage === 'en-us') {
          switch (contentType) {
            case 'longDescription':
              longDescriptionItems.push(contentValue);
              break;
            case 'offerIncludes':
              offerIncludesItems.push(contentValue);
              break;
            case 'termsAndConditions':
              termsAndConditionsItems.push(contentValue);
              break;
            default:
              break;
          }
        }
      });
    });

    return (
      <div>
        <Drawer
          visible
          title={<div className={styles.title}>DETAIL</div>}
          placement="right"
          destroyOnClose
          maskClosable={false}
          width={bodyWidth < 480 ? bodyWidth : 480}
          bodyStyle={{
            height: 'calc(100% - 55px)',
            padding: '20px 20px 53px 20px',
            overflow: 'auto',
          }}
          className={styles.container}
          onClose={() => onClose()}
        >
          <div>
            <div>
              <Row>
                <Col style={{ height: '35px' }} className={styles.title}>
                  BASIC INFORMATION
                </Col>
                <Col span={24} style={{ marginBottom: '5px' }}>
                  <Col span={9} style={{ height: '30px' }}>
                    <span className={styles.detailLabel}>Offer Name</span>
                  </Col>
                  <Col span={15}>
                    <span className={styles.detailText}>{bundleName || '-'}</span>
                  </Col>
                </Col>
                <Col span={24} style={{ marginBottom: '5px' }}>
                  <Col span={9} style={{ height: '30px' }}>
                    <span className={styles.detailLabel}>Long Description</span>
                  </Col>
                  <Col span={15}>
                    {longDescriptionItems.length > 0 ? (
                      <div>
                        {longDescriptionItems.map(item => (
                          <div className={styles.detailText}>{item || '-'}</div>
                        ))}
                      </div>
                    ) : (
                      '-'
                    )}
                  </Col>
                </Col>
                <Col span={24} style={{ marginBottom: '5px' }}>
                  <Col span={9} style={{ height: '30px' }}>
                    <span className={styles.detailLabel}>Offer Includes</span>
                  </Col>
                  <Col span={15}>
                    {offerIncludesItems.length > 0 ? (
                      <div>
                        {longDescriptionItems.map(item => (
                          <div className={styles.detailText}>{item || '-'}</div>
                        ))}
                      </div>
                    ) : (
                      '-'
                    )}
                  </Col>
                </Col>
                <Col span={24} style={{ marginBottom: '5px' }}>
                  <Col span={9} style={{ height: '30px' }}>
                    <span className={styles.detailLabel}>Terms and Conditions</span>
                  </Col>
                  <Col span={15}>
                    {termsAndConditionsItems.length > 0 ? (
                      <div>
                        {longDescriptionItems.map(item => (
                          <div className={styles.detailText}>{item || '-'}</div>
                        ))}
                      </div>
                    ) : (
                      '-'
                    )}
                  </Col>
                </Col>
              </Row>
            </div>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default Detail;
