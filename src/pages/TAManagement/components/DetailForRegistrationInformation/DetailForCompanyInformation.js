import React from 'react';
import { Col, Descriptions, Row } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { isNvl } from '@/utils/utils';
import styles from './index.less';
import {
  getCategoryAndCustomerGroupStr,
  getCountryAndCityStr,
  getOrganizationRoleStr,
  getTravelAgentNoLabel,
  getYesOrNo,
  detailLayOut,
} from '../../utils/pubUtils';

const DetailForCompanyInformation = props => {
  const {
    companyInfo = {},
    countryList = [],
    cityList = [],
    organizationRoleList = [],
    categoryList = [],
    customerGroupList = [],
    isMainTaRoleFlag,
    isSaleSupportRoleFlag,
    userType,
  } = props;

  const rwsLogin = userType === '01';
  return (
    <React.Fragment>
      <Row type="flex" justify="space-around">
        <Col span={24}>
          <span className={styles.DetailTitle}>{formatMessage({ id: 'COMPANY_INFORMATION' })}</span>
        </Col>
      </Row>
      <Row type="flex" justify="space-around" className={styles.detailContent}>
        <Col span={24}>
          <Descriptions className={styles.descriptionsStyle} column={1}>
            <Descriptions.Item label={formatMessage({ id: 'COMPANY_NAME' })}>
              {!isNvl(companyInfo.companyName) ? companyInfo.companyName : '-'}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions className={styles.descriptionsStyle} column={1}>
            <Descriptions.Item label={formatMessage({ id: 'COMPANY_ADDRESS' })}>
              {!isNvl(companyInfo.address) ? companyInfo.address : '-'}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions className={styles.descriptionsStyle} column={detailLayOut}>
            <Descriptions.Item label={formatMessage({ id: 'UEN_BUSINESS_REGISTRATION_NUMBER' })}>
              {!isNvl(companyInfo.registrationNo) ? companyInfo.registrationNo : '-'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'ORGANISATION_ROLE' })}>
              {getOrganizationRoleStr(organizationRoleList, companyInfo.organizationRole)}
            </Descriptions.Item>

            <Descriptions.Item label={formatMessage({ id: 'COUNTRY_AND_CITY_STATE' })}>
              {getCountryAndCityStr(countryList, companyInfo.country, companyInfo.city, cityList)}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'ZIP_POSTAL_CODE' })}>
              {!isNvl(companyInfo.postalCode) ? companyInfo.postalCode : '-'}
            </Descriptions.Item>

            <Descriptions.Item label={formatMessage({ id: 'DATE_OF_INCORPORATION' })}>
              {!isNvl(companyInfo.incorporationDate)
                ? moment(companyInfo.incorporationDate, 'YYYY-MM-DD').format('DD-MMM-YYYY')
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label={getTravelAgentNoLabel(companyInfo.country)}>
              {!isNvl(companyInfo.travelAgentNo) ? companyInfo.travelAgentNo : '-'}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'GST_REG_YES_OR_NO' })}>
              {getYesOrNo(companyInfo.isGstRegIndicator)}
            </Descriptions.Item>
            <Descriptions.Item label={formatMessage({ id: 'COMPANY_REGISTRATION_NUMBER' })}>
              {!isNvl(companyInfo.gstRegNo) ? companyInfo.gstRegNo : '-'}
            </Descriptions.Item>
            {(isMainTaRoleFlag || isSaleSupportRoleFlag) && (
              <Descriptions.Item label={formatMessage({ id: 'GST_EFFECTIVE_DATE' })}>
                {!isNvl(companyInfo.gstEffectiveDate)
                  ? moment(companyInfo.gstEffectiveDate, 'YYYY-MM-DD').format('DD-MMM-YYYY')
                  : '-'}
              </Descriptions.Item>
            )}
            {(isMainTaRoleFlag || isSaleSupportRoleFlag) && rwsLogin && (
              <Descriptions.Item label={formatMessage({ id: 'CATEGORY_AND_CUSTOMER_GROUP' })}>
                {getCategoryAndCustomerGroupStr(
                  categoryList,
                  customerGroupList,
                  companyInfo.category,
                  companyInfo.customerGroup
                )}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default DetailForCompanyInformation;
