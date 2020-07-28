import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Drawer } from 'antd';
import styles from './index.less';

@connect(({ onceAPirateTicketMgr }) => ({
  onceAPirateTicketMgr,
}))
class OfferDetail extends Component {
  componentDidMount() {}

  onClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'onceAPirateTicketMgr/save',
      payload: {
        showDetail: false,
      },
    });
  };

  render() {
    const {
      onceAPirateTicketMgr: { showDetail, offerDetail },
    } = this.props;

    const { offerName } = offerDetail;
    const themePark = 'Once A Pirate';
    let longDescription = '-';
    let offerIncludes = '-';
    let termsAndConditions = '-';

    if (offerDetail && offerDetail.offerProfile) {
      const {
        offerProfile: { offerContentList = [] },
      } = offerDetail;
      for (const offerContents of offerContentList) {
        const { contentLanguage, contentType, contentValue } = offerContents;
        if (contentLanguage === 'en-us') {
          if (contentType === 'longDescription') {
            longDescription = contentValue;
          }
          if (contentType === 'offerIncludes') {
            offerIncludes = contentValue;
          }
          if (contentType === 'termsAndConditions') {
            termsAndConditions = contentValue;
          }
        }
      }
    }

    return (
      <Drawer
        title={
          <div className={styles.titleFontBlackWeight}>{formatMessage({ id: 'DETAILS' })}</div>
        }
        width={500}
        placement="right"
        onClose={this.onClose}
        visible={showDetail}
        bodyStyle={{ height: 'calc(100% - 55px)' }}
      >
        <div className={styles.drawerContentStyle}>
          <div className={styles.titleFontBlackWeight}>
            {formatMessage({ id: 'OFFER_INFORMATION' })}
          </div>
          <div className={styles.contentFont}>
            <div className={styles.contentLabelFont}>Offer Name</div>
            <div className={styles.contentLabelFont} style={{ color: '#3B414A' }}>
              {offerName || '-'}
            </div>
            <div className={styles.contentLabelFont}>Theme Park</div>
            <div className={styles.contentLabelFont} style={{ color: '#3B414A' }}>
              {themePark || '-'}
            </div>
          </div>
          <div className={styles.titleFontBlackWeight}>{formatMessage({ id: 'DESCRIPTION' })}</div>
          <div className={styles.contentFont}>{longDescription || '-'}</div>
          <div className={styles.titleFontBlackWeight}>OFFER INCLUDES</div>
          <div className={styles.contentFont}>{offerIncludes || '-'}</div>
          <div className={styles.titleFontBlackWeight}>TERMS AND CONDITIONS</div>
          <div className={styles.contentFont}>{termsAndConditions || '-'}</div>
        </div>
      </Drawer>
    );
  }
}

export default OfferDetail;
