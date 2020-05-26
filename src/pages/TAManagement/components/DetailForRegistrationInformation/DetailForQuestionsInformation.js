import React from 'react';
import { Col, Descriptions, Row } from 'antd';
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
      <Row type="flex" justify="space-around" className={styles.detailContent}>
        <Col span={24}>
          <Descriptions className={styles.descriptionsStyle} column={1}>
            <Descriptions.Item label={formatMessage({ id: 'CUSTOMER_NATIONALITY' })}>
              {getTopNationalitiesStr(countryList, companyInfo.topNationalities)}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'QUESTIONS_Q_ONE' })}>
              {volumeOne}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'QUESTIONS_Q_TWO' })}>
              {volumeTwo}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default DetailForQuestionsInformation;
