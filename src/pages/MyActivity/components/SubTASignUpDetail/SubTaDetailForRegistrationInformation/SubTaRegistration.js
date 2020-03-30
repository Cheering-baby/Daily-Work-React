import React, { PureComponent } from 'react';
import { Col, Form, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from './SubTaRegistration.less';
import { isNvl } from '@/utils/utils';
import { getCountryStr } from '@/pages/SubTAManagement/utils/pubUtils';

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
              <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'SUB_TA_FULL_NAME' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span>{!isNvl(subTaInfo.fullName) ? subTaInfo.fullName : '-'}</span>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Row type="flex" justify="space-around">
              <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'SUB_TA_EMAIL' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                <div className={styles.detailLeftStyle}>
                  <span>{!isNvl(subTaInfo.email) ? subTaInfo.email : '-'}</span>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Row type="flex" justify="space-around">
              <Col xs={12} sm={12} md={10} lg={12} xl={8} xxl={8}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'SUB_TA_COMPANY_NAME' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={12} xl={16} xxl={16}>
                <div className={styles.detailLeftStyle}>
                  <span>{!isNvl(subTaInfo.companyName) ? subTaInfo.companyName : '-'}</span>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Row type="flex" justify="space-around">
              <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'SUB_TA_COUNTRY_INCORPORATION' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                <div className={styles.detailLeftStyle}>
                  <span>{getCountryStr(countryList, subTaInfo.country)}</span>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row type="flex" justify="space-around">
              <Col xs={12} sm={12} md={10} lg={6} xl={4} xxl={4}>
                <div className={styles.detailRightStyle}>
                  <span>{formatMessage({ id: 'SUB_TA_COMPANY_ADDRESS' })}</span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={14} lg={18} xl={20} xxl={20}>
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
