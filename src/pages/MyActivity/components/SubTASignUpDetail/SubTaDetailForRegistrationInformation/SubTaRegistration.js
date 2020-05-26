import React, { PureComponent } from 'react';
import { Col, Form, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from './SubTaRegistration.less';
import { isNvl } from '@/utils/utils';
import { getCountryStr } from '@/pages/SubTAManagement/utils/pubUtils';

const layoutDisplay = {
  xs: 24,
  sm: 12,
  md: 8,
  lg: 12,
  xl: 12,
  xxl: 12,
};

const valueDisplay = {
  xs: 24,
  sm: 12,
  md: 16,
  lg: 12,
  xl: 12,
  xxl: 12,
};

const longLayoutDisplay = {
  xs: 24,
  sm: 12,
  md: 8,
  lg: 6,
  xl: 6,
  xxl: 6,
};

const longValueDisplay = {
  xs: 24,
  sm: 12,
  md: 16,
  lg: 18,
  xl: 18,
  xxl: 18,
};

@Form.create()
@connect(({ commonSignUpDetail }) => ({
  commonSignUpDetail,
}))
class SubTaRegistration extends PureComponent {
  componentDidMount() {}

  render() {
    const {
      subTaInfo = {},
      commonSignUpDetail: { countryList = [] },
    } = this.props;
    return (
      <React.Fragment>
        <Row type="flex" justify="space-around">
          <Col span={24}>
            <span className={styles.titleHeader}>
              {formatMessage({ id: 'TA_REGISTRATION_INFORMATION' })}
            </span>
          </Col>
        </Row>

        <Row type="flex" justify="space-around">
          <Col span={24}>
            <span className={styles.detailTitle}>
              {formatMessage({ id: 'SUB_TA_ACCOUNT_INFORMATION' })}
            </span>
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
                  <span>{formatMessage({ id: 'SUB_TA_FULL_NAME' })}</span>
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
                  <span>{!isNvl(subTaInfo.fullName) ? subTaInfo.fullName : '-'}</span>
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
                  <span>{formatMessage({ id: 'SUB_TA_EMAIL' })}</span>
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
                  <span>{!isNvl(subTaInfo.email) ? subTaInfo.email : '-'}</span>
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
                  <span>{formatMessage({ id: 'SUB_TA_COMPANY_NAME' })}</span>
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
                  <span>{!isNvl(subTaInfo.companyName) ? subTaInfo.companyName : '-'}</span>
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
                  <span>{formatMessage({ id: 'SUB_TA_COUNTRY_INCORPORATION' })}</span>
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
                  <span>{getCountryStr(countryList, subTaInfo.country)}</span>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
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
                  <span>{formatMessage({ id: 'SUB_TA_COMPANY_ADDRESS' })}</span>
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

export default SubTaRegistration;
