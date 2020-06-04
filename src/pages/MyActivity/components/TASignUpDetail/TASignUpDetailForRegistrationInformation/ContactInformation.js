import React from 'react';
import { Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './TaRegistration.less';
import { isNvl } from '@/utils/utils';
import { getSalutationStr, getTelStr } from '@/pages/TAManagement/utils/pubUtils';
import { colLayOut, rowLayOut } from '@/pages/MyActivity/components/constants';

const ContactInformation = props => {
  const { contactInfo = {}, salutationList = [], countryList = [] } = props;
  return (
    <React.Fragment>
      <Row {...rowLayOut}>
        <Col span={24}>
          <span className={styles.detailTitle}>{formatMessage({ id: 'CONTACT_INFORMATION' })}</span>
        </Col>
      </Row>
      <Row {...rowLayOut} className={styles.contentDetail}>
        <Col {...colLayOut} className={styles.colStyle}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'CONTACT_PERSON_SALUTATION' })}</span>
          </div>
          <div className={styles.detailLeftStyle} style={{ marginBottom: '8px' }}>
            <span>{getSalutationStr(salutationList, contactInfo.salutation)}</span>
          </div>
        </Col>
        <Col {...colLayOut} className={styles.colStyle}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'CONTACT_PERSON_FIRST_NAME' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{!isNvl(contactInfo.firstName) ? contactInfo.firstName : '-'}</span>
          </div>
        </Col>
        <Col {...colLayOut} className={styles.colStyle}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'CONTACT_PERSON_LAST_NAME' })}</span>
          </div>
          <div className={styles.detailLeftStyle} style={{ marginBottom: '8px' }}>
            <span>{!isNvl(contactInfo.lastName) ? contactInfo.lastName : '-'}</span>
          </div>
        </Col>
        <Col {...colLayOut} className={styles.colStyle}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'CHIEF_EXECUTIVE_DIRECTOR_NAME' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>
              {!isNvl(contactInfo.chiefExecutiveName) ? contactInfo.chiefExecutiveName : '-'}
            </span>
          </div>
        </Col>
        <Col {...colLayOut} className={styles.colStyle}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'EMAIL' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{!isNvl(contactInfo.email) ? contactInfo.email : '-'}</span>
          </div>
        </Col>
        <Col {...colLayOut} className={styles.colStyle}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'TEL' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{getTelStr(countryList, contactInfo.country, contactInfo.phone)}</span>
          </div>
        </Col>
        <Col {...colLayOut} className={styles.colStyle}>
          <div className={styles.detailLabelStyle}>
            <span>{formatMessage({ id: 'MOBILE_NO' })}</span>
          </div>
          <div className={styles.detailLeftStyle}>
            <span>{getTelStr(countryList, contactInfo.country, contactInfo.phone)}</span>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ContactInformation;
