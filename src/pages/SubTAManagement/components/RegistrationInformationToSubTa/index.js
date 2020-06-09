import React, { PureComponent } from 'react';
import { Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { isNvl } from '@/utils/utils';
import { getCountryStr, colLayOut, rowLayOut } from '../../utils/pubUtils';



class RegistrationInformationToSubTa extends PureComponent {
  render() {
    const { subTaInfo = {}, countryList = [], isProfile } = this.props;

    return (
      <React.Fragment>
        <Row {...rowLayOut} className={styles.container}>
          {!isProfile && (
            <Col span={24}>
              <div className={styles.detailLeftStyle}>
                <span>{formatMessage({ id: 'SUB_TA_MAIN_TA_NAME' })}</span>
              </div>
              <div className={styles.detailLeftStyle}>
                <span>
                  {!isNvl(subTaInfo.mainCompanyName) ? subTaInfo.mainCompanyName : '-'}
                </span>
              </div>
            </Col>
          )}
          <Col {...colLayOut}>
            <div className={styles.detailLeftStyle}>
              <span>{formatMessage({ id: 'SUB_TA_FULL_NAME' })}</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>{!isNvl(subTaInfo.fullName) ? subTaInfo.fullName : '-'}</span>
            </div>
          </Col>
          <Col {...colLayOut}>
            <div className={styles.detailLeftStyle}>
              <span>{formatMessage({ id: 'SUB_TA_EMAIL' })}</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>{!isNvl(subTaInfo.email) ? subTaInfo.email : '-'}</span>
            </div>
          </Col>
          <Col {...colLayOut}>
            <div className={styles.detailLeftStyle}>
              <span>{formatMessage({ id: 'SUB_TA_COMPANY_NAME' })}</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>{!isNvl(subTaInfo.companyName) ? subTaInfo.companyName : '-'}</span>
            </div>
          </Col>
          <Col {...colLayOut}>
            <div className={styles.detailLeftStyle}>
              <span>{formatMessage({ id: 'SUB_TA_COUNTRY_INCORPORATION' })}</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>{getCountryStr(countryList, subTaInfo.country)}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.detailLeftStyle}>
              <span>{formatMessage({ id: 'SUB_TA_COMPANY_ADDRESS' })}</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>{!isNvl(subTaInfo.address) ? subTaInfo.address : '-'}</span>
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default RegistrationInformationToSubTa;
