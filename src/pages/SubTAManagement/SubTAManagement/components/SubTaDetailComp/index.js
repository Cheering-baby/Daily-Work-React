import React, { PureComponent } from 'react';
import { Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { isNvl } from '@/utils/utils';
import { getCountryStr } from '../../../utils/pubUtils';

class SubTaDetailComp extends PureComponent {
  render() {
    const { subTaInfo, countryList } = this.props;
    return (
      <Row type="flex" justify="space-around">
        <Col span={24}>
          <div className={styles.subTaDetailRightStyleRequired}>
            <span>{formatMessage({ id: 'SUB_TA_MAIN_TA_NAME' })}</span>
          </div>
        </Col>
        <Col span={24}>
          <div className={styles.subTaDetailLeftStyle}>
            <span>{!isNvl(subTaInfo.mainCompanyName) ? subTaInfo.mainCompanyName : '-'}</span>
          </div>
        </Col>
        <Col span={24}>
          <div className={styles.subTaDetailRightStyleRequired}>
            <span>{formatMessage({ id: 'SUB_TA_FULL_NAME' })}</span>
          </div>
        </Col>
        <Col span={24}>
          <div className={styles.subTaDetailLeftStyle}>
            <span>{!isNvl(subTaInfo.fullName) ? subTaInfo.fullName : '-'}</span>
          </div>
        </Col>
        <Col span={24}>
          <div className={styles.subTaDetailRightStyleRequired}>
            <span>{formatMessage({ id: 'SUB_TA_EMAIL' })}</span>
          </div>
        </Col>
        <Col span={24}>
          <div className={styles.subTaDetailLeftStyle}>
            <span>{!isNvl(subTaInfo.email) ? subTaInfo.email : '-'}</span>
          </div>
        </Col>
        <Col span={24}>
          <div className={styles.subTaDetailRightStyleRequired}>
            <span>{formatMessage({ id: 'SUB_TA_COMPANY_NAME' })}</span>
          </div>
        </Col>
        <Col span={24}>
          <div className={styles.subTaDetailLeftStyle}>
            <span>{!isNvl(subTaInfo.companyName) ? subTaInfo.companyName : '-'}</span>
          </div>
        </Col>
        <Col span={24}>
          <div className={styles.subTaDetailRightStyleRequired}>
            <span>{formatMessage({ id: 'SUB_TA_COUNTRY_INCORPORATION' })}</span>
          </div>
        </Col>
        <Col span={24}>
          <div className={styles.subTaDetailLeftStyle}>
            <span>{getCountryStr(countryList, subTaInfo.country)}</span>
          </div>
        </Col>
        <Col span={24}>
          <div className={styles.subTaDetailRightStyle}>
            <span>{formatMessage({ id: 'SUB_TA_COMPANY_ADDRESS' })}</span>
          </div>
        </Col>
        <Col span={24}>
          <div className={styles.subTaDetailLeftStyle}>
            <span>{!isNvl(subTaInfo.address) ? subTaInfo.address : '-'}</span>
          </div>
        </Col>
      </Row>
    );
  }
}

export default SubTaDetailComp;
