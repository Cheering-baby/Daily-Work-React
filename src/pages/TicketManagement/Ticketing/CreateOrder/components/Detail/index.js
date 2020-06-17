import React, { Component } from 'react';
import { Col, Drawer, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';

// eslint-disable-next-line react/prefer-stateless-function
class Detail extends Component {
  render() {
    const bodyWidth = document.body.clientWidth || document.documentElement.clientWidth;
    const {
      onClose,
      detail: {
        offerContentList = [],
        offerBasicInfo: { offerName },
      },
    } = this.props;
    let longDescription;
    let offerIncludes;
    let termsAndConditions;
    offerContentList.forEach(item => {
      const { contentLanguage, contentType, contentValue } = item;
      if (contentLanguage === 'en-us') {
        switch (contentType) {
          case 'longDescription':
            longDescription = contentValue;
            break;
          case 'offerIncludes':
            offerIncludes = contentValue;
            break;
          case 'termsAndConditions':
            termsAndConditions = contentValue;
            break;
          default:
            break;
        }
      }
    });
    return (
      <div>
        <Drawer
          visible
          title={<div className={styles.title}>{formatMessage({ id: 'DETAILS' })}</div>}
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
                  {formatMessage({ id: 'OFFER_INFORMATION' })}
                </Col>
                <Col span={24} style={{ marginBottom: '5px' }}>
                  <Col span={9} style={{ height: '30px' }}>
                    <span className={styles.detailLabel}>Offer Name</span>
                  </Col>
                  <Col span={15}>
                    <span className={styles.detailText}>{offerName || '-'}</span>
                  </Col>
                </Col>
                <Col span={24} style={{ marginBottom: '5px' }}>
                  <Col span={9} style={{ height: '30px' }}>
                    <span className={styles.detailLabel}>
                      {formatMessage({ id: 'DESCRIPTION' })}
                    </span>
                  </Col>
                  <Col span={15}>
                    <span className={styles.detailText}>{longDescription || '-'}</span>
                  </Col>
                </Col>
                <Col span={24} style={{ marginBottom: '5px' }}>
                  <Col span={9} style={{ height: '30px' }}>
                    <span className={styles.detailLabel}>Offer Includes</span>
                  </Col>
                  <Col span={15}>
                    <span className={styles.detailText}>{offerIncludes || '-'}</span>
                  </Col>
                </Col>
                <Col span={24} style={{ marginBottom: '5px' }}>
                  <Col span={9} style={{ height: '30px' }}>
                    <span className={styles.detailLabel}>Terms and Conditions</span>
                  </Col>
                  <Col span={15}>
                    <span className={styles.detailText}>{termsAndConditions || '-'}</span>
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
