import React from 'react';
import { Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { isNvl } from '@/utils/utils';
import { getProductType, getTopNationalitiesStr } from '../../utils/pubUtils';

const DetailForQuestionsInformation = props => {
  const { companyInfo = {}, countryList = [] } = props;
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
          <span className={styles.DetailTitle}>{formatMessage({ id: 'QUESTIONS' })}</span>
        </Col>
      </Row>
      <Row type="flex" justify="space-around">
        <Col xs={12} sm={12} md={10} lg={6} xl={4} xxl={4}>
          <div className={styles.detailRightStyle}>
            <span>{formatMessage({ id: 'CUSTOMER_NATIONALITY' })}</span>
          </div>
        </Col>
        <Col xs={12} sm={12} md={14} lg={18} xl={20} xxl={20}>
          <div className={styles.detailLeftStyle}>
            <span>{getTopNationalitiesStr(countryList, companyInfo.topNationalities)}</span>
          </div>
        </Col>
      </Row>
      <Row type="flex" justify="space-around">
        <Col xs={12} sm={12} md={10} lg={6} xl={4} xxl={4}>
          <div className={styles.detailRightStyle}>
            <span>{formatMessage({ id: 'QUESTIONS_Q_ONE' })}</span>
          </div>
        </Col>
        <Col xs={12} sm={12} md={14} lg={18} xl={20} xxl={20}>
          <div className={styles.detailLeftStyle}>
            <span>{volumeOne}</span>
          </div>
        </Col>
      </Row>
      <Row type="flex" justify="space-around">
        <Col xs={12} sm={12} md={10} lg={6} xl={4} xxl={4}>
          <div className={styles.detailRightStyle}>
            <span>{formatMessage({ id: 'QUESTIONS_Q_TWO' })}</span>
          </div>
        </Col>
        <Col xs={12} sm={12} md={14} lg={18} xl={20} xxl={20}>
          <div className={styles.detailLeftStyle}>
            <span>{volumeTwo}</span>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default DetailForQuestionsInformation;
