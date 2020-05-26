import React from 'react';
import { Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './TaRegistration.less';
import { isNvl } from '@/utils/utils';
import { getSalutationStr, getTelStr } from '@/pages/TAManagement/utils/pubUtils';

const ContactInformation = props => {
  const {
    contactInfo = {},
    salutationList = [],
    countryList = [],
    layoutDisplay = {},
    valueDisplay = {},
  } = props;
  return (
    <React.Fragment>
      <Row type="flex" justify="space-around">
        <Col span={24}>
          <span className={styles.detailTitle}>{formatMessage({ id: 'CONTACT_INFORMATION' })}</span>
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
                <span>{formatMessage({ id: 'CONTACT_PERSON_SALUTATION' })}</span>
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
                <span>{getSalutationStr(salutationList, contactInfo.salutation)}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} style={{ height: 0 }}>
          &nbsp;
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
                <span>{formatMessage({ id: 'CONTACT_PERSON_FIRST_NAME' })}</span>
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
                <span>{!isNvl(contactInfo.firstName) ? contactInfo.firstName : '-'}</span>
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
                <span>{formatMessage({ id: 'CONTACT_PERSON_LAST_NAME' })}</span>
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
                <span>{!isNvl(contactInfo.lastName) ? contactInfo.lastName : '-'}</span>
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
                <span>{formatMessage({ id: 'CHIEF_EXECUTIVE_DIRECTOR_NAME' })}</span>
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
                <span>
                  {!isNvl(contactInfo.chiefExecutiveName) ? contactInfo.chiefExecutiveName : '-'}
                </span>
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
                <span>{formatMessage({ id: 'EMAIL' })}</span>
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
                <span>{!isNvl(contactInfo.email) ? contactInfo.email : '-'}</span>
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
                <span>{formatMessage({ id: 'TEL' })}</span>
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
                <span>{getTelStr(countryList, contactInfo.country, contactInfo.phone)}</span>
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
                <span>{formatMessage({ id: 'MOBILE_NO' })}</span>
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
                <span>{getTelStr(countryList, contactInfo.country, contactInfo.phone)}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} style={{ height: 0 }}>
          &nbsp;
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ContactInformation;
