import React from 'react';
import { Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './TaRegistration.less';
import { isNvl } from '@/utils/utils';
import { getProductType, getTopNationalitiesStr } from '@/pages/TAManagement/utils/pubUtils';

const QuestionsInformation = props => {
  const {
    companyInfo = {},
    countryList = [],
    longLayoutDisplay = {},
    longValueDisplay = {},
  } = props;
  const { productTypeRoom, productTypeAttractions } = getProductType() || {};
  let productInfoOne = {};
  if (companyInfo && companyInfo.productList && companyInfo.productList.length > 0) {
    productInfoOne =
      companyInfo.productList.find(item => String(item.productType) === productTypeRoom) || {};
  }
  const otherVolumeOne = !isNvl(productInfoOne.otherVolume)
    ? formatMessage({ id: 'QUESTIONS_Q_ONE_OTHER_ROOM' }).replace(
        '2000',
        productInfoOne.otherVolume
      )
    : null;
  const rwsVolumeOne = !isNvl(productInfoOne.rwsVolume)
    ? formatMessage({ id: 'QUESTIONS_Q_ONE_RWS_ROOM' }).replace('2000', productInfoOne.rwsVolume)
    : '-';
  const volumeOne = !isNvl(otherVolumeOne) ? otherVolumeOne : rwsVolumeOne;
  let productInfoTwo = {};
  if (companyInfo && companyInfo.productList && companyInfo.productList.length > 0) {
    productInfoTwo =
      companyInfo.productList.find(item => String(item.productType) === productTypeAttractions) ||
      {};
  }
  const otherVolumeTwo = !isNvl(productInfoTwo.otherVolume)
    ? formatMessage({ id: 'QUESTIONS_Q_TWO_OTHER_ATTRACTION' }).replace(
        '2000',
        productInfoTwo.otherVolume
      )
    : null;
  const rwsVolumeTwo = !isNvl(productInfoTwo.rwsVolume)
    ? formatMessage({ id: 'QUESTIONS_Q_TWO_RWS_ATTRACTION' }).replace(
        '2000',
        productInfoTwo.rwsVolume
      )
    : '-';
  const volumeTwo = !isNvl(otherVolumeTwo) ? otherVolumeTwo : rwsVolumeTwo;
  return (
    <React.Fragment>
      <Row type="flex" justify="space-around">
        <Col span={24}>
          <span className={styles.detailTitle}>{formatMessage({ id: 'QUESTIONS' })}</span>
        </Col>
      </Row>
      <Row type="flex" justify="space-around">
        <Col
          xs={longLayoutDisplay.xs}
          sm={longLayoutDisplay.sm}
          md={longLayoutDisplay.md}
          lg={longLayoutDisplay.lg}
          xl={longLayoutDisplay.xl}
          xxl={longLayoutDisplay.xxl}
        >
          <div className={styles.detailRightStyle}>
            <span>{formatMessage({ id: 'CUSTOMER_NATIONALITY' })}</span>
          </div>
        </Col>
        <Col
          xs={longValueDisplay.xs}
          sm={longValueDisplay.sm}
          md={longValueDisplay.md}
          lg={longValueDisplay.lg}
          xl={longValueDisplay.xl}
          xxl={longValueDisplay.xxl}
        >
          <div className={styles.detailLeftStyle}>
            <span>{getTopNationalitiesStr(countryList, companyInfo.topNationalities)}</span>
          </div>
        </Col>
      </Row>
      <Row type="flex" justify="space-around">
        <Col
          xs={longLayoutDisplay.xs}
          sm={longLayoutDisplay.sm}
          md={longLayoutDisplay.md}
          lg={longLayoutDisplay.lg}
          xl={longLayoutDisplay.xl}
          xxl={longLayoutDisplay.xxl}
        >
          <div className={styles.detailRightStyle}>
            <span>{formatMessage({ id: 'QUESTIONS_Q_ONE' })}</span>
          </div>
        </Col>
        <Col
          xs={longValueDisplay.xs}
          sm={longValueDisplay.sm}
          md={longValueDisplay.md}
          lg={longValueDisplay.lg}
          xl={longValueDisplay.xl}
          xxl={longValueDisplay.xxl}
        >
          <div className={styles.detailLeftStyle}>
            <span>{volumeOne}</span>
          </div>
        </Col>
      </Row>
      <Row type="flex" justify="space-around">
        <Col
          xs={longLayoutDisplay.xs}
          sm={longLayoutDisplay.sm}
          md={longLayoutDisplay.md}
          lg={longLayoutDisplay.lg}
          xl={longLayoutDisplay.xl}
          xxl={longLayoutDisplay.xxl}
        >
          <div className={styles.detailRightStyle}>
            <span>{formatMessage({ id: 'QUESTIONS_Q_TWO' })}</span>
          </div>
        </Col>
        <Col
          xs={longValueDisplay.xs}
          sm={longValueDisplay.sm}
          md={longValueDisplay.md}
          lg={longValueDisplay.lg}
          xl={longValueDisplay.xl}
          xxl={longValueDisplay.xxl}
        >
          <div className={styles.detailLeftStyle}>
            <span>{volumeTwo}</span>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default QuestionsInformation;
