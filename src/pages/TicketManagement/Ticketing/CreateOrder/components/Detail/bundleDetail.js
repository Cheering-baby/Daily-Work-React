import React, { Component } from 'react';
import { connect } from 'dva';
import { Drawer, Row, Col, Table } from 'antd';
import { getVoucherProducts, calculateAllProductPrice } from '../../../../utils/utils';
import styles from './index.less';

@connect(({ global }) => ({
  userCompanyInfo: global.userCompanyInfo,
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
      userCompanyInfo: { companyType },
    } = this.props;
    const longDescriptionItems = [];
    const offerIncludesItems = [];
    const termsAndConditionsItems = [];
    const voucherItems = [];
    const columns = [
      {
        title: 'Voucher Name',
        dataIndex: 'productName',
        key: 'productName',
        width: '70%',
        render: record => {
          return <div className={styles.voucherName}>{record}</div>;
        },
      },
      {
        title: 'Quantity',
        dataIndex: 'needChoiceCount',
        key: 'needChoiceCount',
      },
    ];
    offers.forEach(item => {
      const {
        detail,
        detail: { offerContentList = [], offerBundle = [{}], offerNo },
      } = item;
      voucherItems.push(
        <Col span={24} key={offerNo} style={{ marginBottom: '16px' }}>
          <Col span={24} className={styles.bundleLabel}>
            {offerBundle[0].bundleLabel || '-'}
          </Col>
          <Col span={24}>
            <Table
              className={styles.table}
              dataSource={getVoucherProducts(detail)}
              columns={columns}
              pagination={false}
              rowKey={record => record.productNo}
            />
          </Col>
        </Col>
      );
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
          width={bodyWidth < 720 ? bodyWidth : 720}
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
                <Col span={24} className={styles.item}>
                  <Col span={24}>
                    <span className={styles.detailLabel}>Offer Name :</span>
                  </Col>
                  <Col span={24}>
                    <span className={styles.detailText}>{bundleName || '-'}</span>
                  </Col>
                </Col>
                {companyType === '02' ? null : (
                  <Col span={24} className={styles.item}>
                    <Col span={24}>
                      <span className={styles.detailLabel}>Price (SGD) :</span>
                    </Col>
                    <Col span={24}>
                      {offers.map((itemOffer, index) => {
                        const {
                          attractionProduct,
                          detail: { priceRuleId, offerBundle = [{}] },
                        } = itemOffer;
                        return (
                          <div
                            className={styles.detailLabel}
                            style={{ marginTop: index !== 0 ? '5px' : null }}
                          >
                            {offerBundle[0].bundleLabel || '-'}
                            {' - '}
                            {calculateAllProductPrice(
                              attractionProduct,
                              priceRuleId,
                              null,
                              itemOffer.detail
                            )}
                            /Package
                          </div>
                        );
                      })}
                    </Col>
                  </Col>
                )}
                <Col span={24} className={styles.item}>
                  <Col span={24}>
                    <span className={styles.detailLabel}>Description :</span>
                  </Col>
                  <Col span={24}>
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
                <Col span={24} className={styles.item}>
                  <Col span={24}>
                    <span className={styles.detailLabel}>Offer Includes :</span>
                  </Col>
                  <Col span={24}>
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
                <Col span={24} className={styles.item}>
                  <Col span={24}>
                    <span className={styles.detailLabel}>Terms and Conditions :</span>
                  </Col>
                  <Col span={24}>
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
              <Row>
                <Col span={24} className={styles.voucherContainer}>
                  VOUCHER INFORMATION
                </Col>
                <Col span={24} className={styles.voucherText}>
                  The corresponding voucher will be automatically matched after the items are added
                  to the cart.
                </Col>
                {}
                <Col span={24}>{voucherItems}</Col>
              </Row>
            </div>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default Detail;
