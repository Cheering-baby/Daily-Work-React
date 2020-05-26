import React, { PureComponent } from 'react';
import { Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { isNvl } from '@/utils/utils';
import { getCountryStr, getDetailLayout } from '../../utils/pubUtils';

class RegistrationInformationToSubTa extends PureComponent {
  render() {
    const { subTaInfo = {}, countryList = [], isProfile } = this.props;
    const {
      layoutDisplay = {},
      valueDisplay = {},
      longLayoutDisplay = {},
      longValueDisplay = {},
    } = getDetailLayout();
    return (
      <React.Fragment>
        <Row type="flex" justify="space-around">
          {!isProfile && (
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Row type="flex" justify="space-around">
                <Col {...layoutDisplay}>
                  <div className={styles.detailRightStyle}>
                    <span>{formatMessage({ id: 'SUB_TA_MAIN_TA_NAME' })}</span>
                  </div>
                </Col>
                <Col {...valueDisplay}>
                  <div className={styles.detailLeftStyle}>
                    <span>
                      {!isNvl(subTaInfo.mainCompanyName) ? subTaInfo.mainCompanyName : '-'}
                    </span>
                  </div>
                </Col>
              </Row>
            </Col>
          )}
          {!isProfile && (
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} style={{ height: 0 }}>
              &nbsp;
            </Col>
          )}
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Row type="flex" justify="space-around">
              <Col {...layoutDisplay}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'SUB_TA_FULL_NAME' })}</span>
                </div>
              </Col>
              <Col {...valueDisplay}>
                <div className={styles.detailLeftStyle}>
                  <span>{!isNvl(subTaInfo.fullName) ? subTaInfo.fullName : '-'}</span>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Row type="flex" justify="space-around">
              <Col {...layoutDisplay}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'SUB_TA_EMAIL' })}</span>
                </div>
              </Col>
              <Col {...valueDisplay}>
                <div className={styles.detailLeftStyle}>
                  <span>{!isNvl(subTaInfo.email) ? subTaInfo.email : '-'}</span>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Row type="flex" justify="space-around">
              <Col {...layoutDisplay}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'SUB_TA_COMPANY_NAME' })}</span>
                </div>
              </Col>
              <Col {...valueDisplay}>
                <div className={styles.detailLeftStyle}>
                  <span>{!isNvl(subTaInfo.companyName) ? subTaInfo.companyName : '-'}</span>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Row type="flex" justify="space-around">
              <Col {...layoutDisplay}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'SUB_TA_COUNTRY_INCORPORATION' })}</span>
                </div>
              </Col>
              <Col {...valueDisplay}>
                <div className={styles.detailLeftStyle}>
                  <span>{getCountryStr(countryList, subTaInfo.country)}</span>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row type="flex" justify="space-around">
              <Col {...longLayoutDisplay}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'SUB_TA_COMPANY_ADDRESS' })}</span>
                </div>
              </Col>
              <Col {...longValueDisplay}>
                <div className={styles.detailLeftStyle}>
                  <span>{!isNvl(subTaInfo.address) ? subTaInfo.address : '-'}</span>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default RegistrationInformationToSubTa;
