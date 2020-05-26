import React from 'react';
import { Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { isNvl } from '@/utils/utils';
import { getFinanceType, getTelStr } from '@/pages/TAManagement/utils/pubUtils';
import styles from './TaRegistration.less';

const TaFinanceContact = props => {
  const {
    financeContactList = [],
    countryList = [],
    layoutDisplay = {},
    valueDisplay = {},
  } = props;
  const { financeTypeOne, financeTypeTwo } = getFinanceType() || {};
  let financeInfoOne = {};
  if (financeContactList && financeContactList.length > 0) {
    financeInfoOne = financeContactList.find(
      item => String(item.financeType).toLowerCase() === financeTypeOne
    );
  }
  if (isNvl(financeInfoOne)) financeInfoOne = {};
  let financeInfoTwo = {};
  if (financeContactList && financeContactList.length > 0) {
    financeInfoTwo = financeContactList.find(
      item => String(item.financeType).toLowerCase() === financeTypeTwo
    );
  }
  if (isNvl(financeInfoTwo)) financeInfoTwo = {};
  return (
    <React.Fragment>
      <Row type="flex" justify="space-around">
        <Col span={24}>
          <span className={styles.detailTitle}>{formatMessage({ id: 'TA_FINANCE_CONTACT' })}</span>
        </Col>
      </Row>
      <Row type="flex" justify="space-around">
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col
              xs={layoutDisplay.xs}
              sm={layoutDisplay.sm}
              md={layoutDisplay.md}
              lg={layoutDisplay.lg}
              xl={layoutDisplay.xl}
              xxl={layoutDisplay.xxl}
            >
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'TA_FINANCE_PRIMARY_CONTACT_PERSON' })}</span>
              </div>
            </Col>
            <Col
              xs={valueDisplay.xs}
              sm={valueDisplay.sm}
              md={valueDisplay.md}
              lg={valueDisplay.lg}
              xl={valueDisplay.xl}
              xxl={valueDisplay.xxl}
            >
              <div className={styles.detailLeftStyle}>
                <span>
                  {!isNvl(financeInfoOne.contactPerson) ? financeInfoOne.contactPerson : '-'}
                </span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col
              xs={layoutDisplay.xs}
              sm={layoutDisplay.sm}
              md={layoutDisplay.md}
              lg={layoutDisplay.lg}
              xl={layoutDisplay.xl}
              xxl={layoutDisplay.xxl}
            >
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'TA_FINANCE_PRIMARY_CONTACT_MOBILE_NO' })}</span>
              </div>
            </Col>
            <Col
              xs={valueDisplay.xs}
              sm={valueDisplay.sm}
              md={valueDisplay.md}
              lg={valueDisplay.lg}
              xl={valueDisplay.xl}
              xxl={valueDisplay.xxl}
            >
              <div className={styles.detailLeftStyle}>
                <span>
                  {getTelStr(
                    countryList,
                    financeInfoOne.mobileCountry,
                    financeInfoOne.mobileNumber
                  )}
                </span>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row type="flex" justify="space-around">
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col
              xs={layoutDisplay.xs}
              sm={layoutDisplay.sm}
              md={layoutDisplay.md}
              lg={layoutDisplay.lg}
              xl={layoutDisplay.xl}
              xxl={layoutDisplay.xxl}
            >
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'TA_FINANCE_PRIMARY_CONTACT_NO' })}</span>
              </div>
            </Col>
            <Col
              xs={valueDisplay.xs}
              sm={valueDisplay.sm}
              md={valueDisplay.md}
              lg={valueDisplay.lg}
              xl={valueDisplay.xl}
              xxl={valueDisplay.xxl}
            >
              <div className={styles.detailLeftStyle}>
                <span>
                  {getTelStr(countryList, financeInfoOne.country, financeInfoOne.contactNo)}
                </span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col
              xs={layoutDisplay.xs}
              sm={layoutDisplay.sm}
              md={layoutDisplay.md}
              lg={layoutDisplay.lg}
              xl={layoutDisplay.xl}
              xxl={layoutDisplay.xxl}
            >
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'TA_FINANCE_PRIMARY_CONTACT_EMAIL' })}</span>
              </div>
            </Col>
            <Col
              xs={valueDisplay.xs}
              sm={valueDisplay.sm}
              md={valueDisplay.md}
              lg={valueDisplay.lg}
              xl={valueDisplay.xl}
              xxl={valueDisplay.xxl}
            >
              <div className={styles.detailLeftStyle}>
                <span>
                  {!isNvl(financeInfoOne.contactEmail) ? financeInfoOne.contactEmail : '-'}
                </span>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row type="flex" justify="space-around">
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col
              xs={layoutDisplay.xs}
              sm={layoutDisplay.sm}
              md={layoutDisplay.md}
              lg={layoutDisplay.lg}
              xl={layoutDisplay.xl}
              xxl={layoutDisplay.xxl}
            >
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'TA_FINANCE_SECONDARY_CONTACT_PERSON' })}</span>
              </div>
            </Col>
            <Col
              xs={valueDisplay.xs}
              sm={valueDisplay.sm}
              md={valueDisplay.md}
              lg={valueDisplay.lg}
              xl={valueDisplay.xl}
              xxl={valueDisplay.xxl}
            >
              <div className={styles.detailLeftStyle}>
                <span>
                  {!isNvl(financeInfoTwo.contactPerson) ? financeInfoTwo.contactPerson : '-'}
                </span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col
              xs={layoutDisplay.xs}
              sm={layoutDisplay.sm}
              md={layoutDisplay.md}
              lg={layoutDisplay.lg}
              xl={layoutDisplay.xl}
              xxl={layoutDisplay.xxl}
            >
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'TA_FINANCE_SECONDARY_CONTACT_MOBILE_NO' })}</span>
              </div>
            </Col>
            <Col
              xs={valueDisplay.xs}
              sm={valueDisplay.sm}
              md={valueDisplay.md}
              lg={valueDisplay.lg}
              xl={valueDisplay.xl}
              xxl={valueDisplay.xxl}
            >
              <div className={styles.detailLeftStyle}>
                <span>
                  {getTelStr(
                    countryList,
                    financeInfoTwo.mobileCountry,
                    financeInfoTwo.mobileNumber
                  )}
                </span>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row type="flex" justify="space-around">
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col
              xs={layoutDisplay.xs}
              sm={layoutDisplay.sm}
              md={layoutDisplay.md}
              lg={layoutDisplay.lg}
              xl={layoutDisplay.xl}
              xxl={layoutDisplay.xxl}
            >
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'TA_FINANCE_SECONDARY_CONTACT_NO' })}</span>
              </div>
            </Col>
            <Col
              xs={valueDisplay.xs}
              sm={valueDisplay.sm}
              md={valueDisplay.md}
              lg={valueDisplay.lg}
              xl={valueDisplay.xl}
              xxl={valueDisplay.xxl}
            >
              <div className={styles.detailLeftStyle}>
                <span>
                  {getTelStr(countryList, financeInfoTwo.country, financeInfoTwo.contactNo)}
                </span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <Row type="flex" justify="space-around">
            <Col
              xs={layoutDisplay.xs}
              sm={layoutDisplay.sm}
              md={layoutDisplay.md}
              lg={layoutDisplay.lg}
              xl={layoutDisplay.xl}
              xxl={layoutDisplay.xxl}
            >
              <div className={styles.detailRightStyle}>
                <span>{formatMessage({ id: 'TA_FINANCE_SECONDARY_CONTACT_EMAIL' })}</span>
              </div>
            </Col>
            <Col
              xs={valueDisplay.xs}
              sm={valueDisplay.sm}
              md={valueDisplay.md}
              lg={valueDisplay.lg}
              xl={valueDisplay.xl}
              xxl={valueDisplay.xxl}
            >
              <div className={styles.detailLeftStyle}>
                <span>
                  {!isNvl(financeInfoTwo.contactEmail) ? financeInfoTwo.contactEmail : '-'}
                </span>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default TaFinanceContact;
