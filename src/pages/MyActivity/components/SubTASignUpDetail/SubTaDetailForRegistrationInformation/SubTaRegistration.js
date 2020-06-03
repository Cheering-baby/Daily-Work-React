import React, { PureComponent } from 'react';
import { Col, Form, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from './SubTaRegistration.less';
import { isNvl } from '@/utils/utils';
import { getCountryStr } from '@/pages/SubTAManagement/utils/pubUtils';
import { colLayOut, rowLayOut } from '@/pages/MyActivity/components/constants';

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
        <Row {...rowLayOut}>
          <Col span={24}>
            <span className={styles.titleHeader}>
              {formatMessage({ id: 'TA_REGISTRATION_INFORMATION' })}
            </span>
          </Col>
        </Row>

        <Row {...rowLayOut}>
          <Col span={24}>
            <span className={styles.detailTitle}>
              {formatMessage({ id: 'SUB_TA_ACCOUNT_INFORMATION' })}
            </span>
          </Col>
        </Row>

        <Row {...rowLayOut}>
          <Col {...colLayOut}>
            <div className={styles.detailLabelStyle}>
              <span>{formatMessage({ id: 'SUB_TA_FULL_NAME' })}</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>{!isNvl(subTaInfo.fullName) ? subTaInfo.fullName : '-'}</span>
            </div>
          </Col>
          <Col {...colLayOut}>
            <div className={styles.detailLabelStyle}>
              <span>{formatMessage({ id: 'SUB_TA_EMAIL' })}</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>{!isNvl(subTaInfo.email) ? subTaInfo.email : '-'}</span>
            </div>
          </Col>
          <Col {...colLayOut}>
            <div className={styles.detailLabelStyle}>
              <span>{formatMessage({ id: 'SUB_TA_COMPANY_NAME' })}</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>{!isNvl(subTaInfo.companyName) ? subTaInfo.companyName : '-'}</span>
            </div>
          </Col>
          <Col {...colLayOut}>
            <div className={styles.detailLabelStyle}>
              <span>{formatMessage({ id: 'SUB_TA_COUNTRY_INCORPORATION' })}</span>
            </div>
            <div className={styles.detailLeftStyle}>
              <span>{getCountryStr(countryList, subTaInfo.country)}</span>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.detailLabelStyle}>
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

export default SubTaRegistration;
