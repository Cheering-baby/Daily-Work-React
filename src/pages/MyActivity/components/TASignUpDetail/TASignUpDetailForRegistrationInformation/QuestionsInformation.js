import React from 'react';
import { Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './TaRegistration.less';
import { isNvl } from '@/utils/utils';
import { getProductType, getTopNationalitiesStr } from '@/pages/TAManagement/utils/pubUtils';
import { rowLayOut } from '@/pages/MyActivity/components/constants';

const QuestionsInformation = props => {
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
      <Row {...rowLayOut}>
        <Col span={24}>
          <span className={styles.detailTitle}>{formatMessage({ id: 'QUESTIONS' })}</span>
        </Col>
      </Row>
      <Row {...rowLayOut} className={styles.contentDetail}>
        <Col span={24} className={styles.colStyle}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'CUSTOMER_NATIONALITY' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{getTopNationalitiesStr(countryList, companyInfo.topNationalities)}</span>
          </div>
        </Col>
        <Col span={24} className={styles.colStyle}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'QUESTIONS_Q_ONE' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{volumeOne}</span>
          </div>
        </Col>
        <Col span={24} className={styles.colStyle}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'QUESTIONS_Q_TWO' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{volumeTwo}</span>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default QuestionsInformation;
