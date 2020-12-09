import React, { Component } from 'react';
import { Col, Drawer, Row, Table } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { toThousands } from '@/utils/utils';
import {
  getVoucherProducts,
  getOfferConstrain,
  calculateProductPrice,
  calculateAllProductPrice,
} from '../../../../utils/utils';
import { ticketTypes, ticketTypesDetail } from '../../../../utils/constants';
import { sortAgeGroupByYouth } from '../../../../utils/ticketOfferInfoUtil';
import styles from './index.less';

@connect(({ global }) => ({
  userCompanyInfo: global.userCompanyInfo,
}))
class Detail extends Component {
  render() {
    const bodyWidth = document.body.clientWidth || document.documentElement.clientWidth;
    const {
      onClose,
      detail,
      detail: {
        priceRuleId,
        selectRuleId,
        offerContentList = [],
        offerBasicInfo: { offerName },
      },
      attractionProduct,
      userCompanyInfo: { companyType },
    } = this.props;
    let longDescription;
    let offerIncludes;
    let termsAndConditions;
    const voucherProducts = getVoucherProducts(detail);
    const offerConstrain = getOfferConstrain(detail);
    const columns = [
      {
        title: 'Voucher Name',
        dataIndex: 'productName',
        key: 'productName',
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
    const youthAgeGroup = attractionProduct.find(i => i.attractionProduct.ageGroup === 'Youth');
    let ticketTypesReally = ticketTypes;
    if (youthAgeGroup) {
      sortAgeGroupByYouth(attractionProduct);
      ticketTypesReally = ticketTypesDetail;
    }
    return (
      <div>
        <Drawer
          visible
          title={<div className={styles.title}>{formatMessage({ id: 'DETAILS' })}</div>}
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
              <Row className={styles.offerInformation}>
                <Col style={{ height: '35px' }} className={styles.title}>
                  {formatMessage({ id: 'OFFER_INFORMATION' })}
                </Col>
                <Col span={24} className={styles.item}>
                  <Col span={24}>
                    <span className={styles.detailLabel}>Offer Name :</span>
                  </Col>
                  <Col span={24}>
                    <span className={styles.detailText}>{offerName || '-'}</span>
                  </Col>
                </Col>
                {companyType === '02' ? null : (
                  <Col span={24} className={styles.item}>
                    <Col span={24}>
                      <span className={styles.detailLabel}>Price (SGD) :</span>
                    </Col>
                    <Col span={24}>
                      {offerConstrain === 'Fixed' ? (
                        <div className={styles.fixedPriceContainer}>
                          <div style={{ marginRight: '20px' }}>
                            {attractionProduct.map((item, index) => {
                              let ticketTypeShow = ticketTypesReally.filter(
                                ({ value }) => item.attractionProduct.ageGroup === value
                              );
                              ticketTypeShow = ticketTypeShow.map(i => ({
                                ...i,
                                text: `${i.text} * ${item.needChoiceCount}`,
                              }));
                              if (
                                !item.onlyVoucher &&
                                Array.isArray(item.attractionProduct.itemPlus)
                              ) {
                                ticketTypeShow = item.attractionProduct.itemPlus.map(i => {
                                  const targetText =
                                    i.ageGroup &&
                                    ticketTypesReally.find(({ value }) => i.ageGroup === value);
                                  const text = `${
                                    targetText ? targetText.text : i.ageGroup || 'General'
                                  } * ${(i.itemQty || 1) * item.needChoiceCount}`;
                                  return {
                                    ...i,
                                    text,
                                  };
                                });
                              }
                              return (
                                <div
                                  className={styles.detailText}
                                  style={{ marginTop: index !== 0 ? '5px' : null }}
                                >
                                  {ticketTypeShow.length > 0
                                    ? ticketTypeShow.map(i => i.text).join(', ')
                                    : `${item.attractionProduct.ageGroup || 'General'} * ${
                                        item.needChoiceCount
                                      }`}
                                </div>
                              );
                            })}
                          </div>
                          <div className={styles.detailText}>
                            {toThousands(
                              calculateAllProductPrice(
                                attractionProduct,
                                priceRuleId || selectRuleId,
                                null,
                                detail
                              )
                            )}
                            /Package
                          </div>
                        </div>
                      ) : (
                        attractionProduct.map((item, index) => {
                          const priceTag = item.onlyVoucher ? 'Voucher' : 'Ticket';
                          let ticketTypeShow = ticketTypesReally.filter(
                            ({ value }) => item.attractionProduct.ageGroup === value
                          );
                          ticketTypeShow = ticketTypeShow.map(i => ({
                            ...i,
                            text: `${i.text} * ${item.needChoiceCount}`,
                          }));
                          if (!item.onlyVoucher && Array.isArray(item.attractionProduct.itemPlus)) {
                            ticketTypeShow = item.attractionProduct.itemPlus.map(i => {
                              const targetText =
                                i.ageGroup &&
                                ticketTypesReally.find(({ value }) => i.ageGroup === value);
                              const text = `${
                                targetText ? targetText.text : i.ageGroup || 'General'
                              } * ${(i.itemQty || 1) * item.needChoiceCount} `;
                              return {
                                ...i,
                                text,
                              };
                            });
                          }
                          return (
                            <div
                              className={styles.detailText}
                              style={{ marginTop: index !== 0 ? '5px' : null }}
                            >
                              {ticketTypeShow.length > 0
                                ? ticketTypeShow.map(i => i.text).join(', ')
                                : `${item.attractionProduct.ageGroup || 'General'} * ${
                                    item.needChoiceCount
                                  }`}
                              -{' '}
                              {toThousands(
                                calculateProductPrice(
                                  item,
                                  priceRuleId || selectRuleId,
                                  item.sessionTime
                                ).toFixed(2)
                              )}
                              /{priceTag}
                            </div>
                          );
                        })
                      )}
                    </Col>
                  </Col>
                )}
                <Col span={24} className={styles.item}>
                  <Col span={24}>
                    <span className={styles.detailLabel}>Description :</span>
                  </Col>
                  <Col span={24}>
                    <span className={styles.detailText}>{longDescription || '-'}</span>
                  </Col>
                </Col>
                <Col span={24} className={styles.item}>
                  <Col span={24}>
                    <span className={styles.detailLabel}>Offer Includes :</span>
                  </Col>
                  <Col span={24}>
                    <span className={styles.detailText}>{offerIncludes || '-'}</span>
                  </Col>
                </Col>
                <Col span={24} className={styles.item}>
                  <Col span={24}>
                    <span className={styles.detailLabel}>Terms and Conditions :</span>
                  </Col>
                  <Col span={24}>
                    <span className={styles.detailText}>{termsAndConditions || '-'}</span>
                  </Col>
                </Col>
              </Row>
              {voucherProducts.length > 0 ? (
                <Row>
                  <Col span={24} className={styles.voucherContainer}>
                    VOUCHER INFORMATION
                  </Col>
                  <Col span={24} className={styles.voucherText}>
                    The corresponding voucher will be automatically matched after the items are
                    added to the cart.
                  </Col>
                  <Col span={24}>
                    <Table
                      className={styles.table}
                      dataSource={voucherProducts}
                      columns={columns}
                      pagination={false}
                      rowKey={record => record.productNo}
                    />
                  </Col>
                </Row>
              ) : null}
            </div>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default Detail;
