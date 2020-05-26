import React from 'react';
import { Col, Descriptions, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { isNvl } from '@/utils/utils';
import { getSalutationStr, getTelStr } from '../../utils/pubUtils';

const DetailForContactInformation = props => {
  const { contactInfo = {}, salutationList = [], countryList = [] } = props;
  const layout = { xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 };
  return (
    <React.Fragment>
      <Row type="flex" justify="space-around">
        <Col span={24}>
          <span className={styles.DetailTitle}>{formatMessage({ id: 'CONTACT_INFORMATION' })}</span>
        </Col>
      </Row>
      <Row type="flex" justify="space-around" className={styles.detailContent}>
        <Col span={24}>
          <Descriptions className={styles.descriptionsStyle} column={1}>
            <Descriptions.Item label={formatMessage({ id: 'CONTACT_PERSON_SALUTATION' })}>
              {getSalutationStr(salutationList, contactInfo.salutation)}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions className={styles.descriptionsStyle} column={layout}>
            <Descriptions.Item label={formatMessage({ id: 'CONTACT_PERSON_FIRST_NAME' })}>
              {!isNvl(contactInfo.firstName) ? contactInfo.firstName : '-'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'CONTACT_PERSON_LAST_NAME' })}>
              {!isNvl(contactInfo.lastName) ? contactInfo.lastName : '-'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'CHIEF_EXECUTIVE_DIRECTOR_NAME' })}>
              {!isNvl(contactInfo.chiefExecutiveName) ? contactInfo.chiefExecutiveName : '-'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'EMAIL' })}>
              {!isNvl(contactInfo.email) ? contactInfo.email : '-'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'TEL' })}>
              {getTelStr(countryList, contactInfo.country, contactInfo.phone)}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'MOBILE_NO' })}>
              {getTelStr(countryList, contactInfo.mobileCountry, contactInfo.mobileNumber)}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default DetailForContactInformation;
