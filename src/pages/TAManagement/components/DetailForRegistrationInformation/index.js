import React, { PureComponent } from 'react';
import DetailForContactInformation from './DetailForContactInformation';
import DetailForCompanyInformation from './DetailForCompanyInformation';
import DetailForQuestionsInformation from './DetailForQuestionsInformation';
import DetailForFileUploadInformation from './DetailForFileUploadInformation';
import DetailForBillingInformation from './DetailForBillingInformation';
import DetailForTaFinanceContact from './DetailForTaFinanceContact';
import {
  AR_ACCOUNT_PRIVILEGE,
  hasAllPrivilege,
  MAIN_TA_ADMIN_PRIVILEGE,
  SALES_SUPPORT_PRIVILEGE,
} from '@/utils/PrivilegeUtil';

class DetailForRegistrationInformation extends PureComponent {
  state = {
    downFileLoadingFlag: false,
  };

  render() {
    const {
      customerInfo = {},
      otherInfo = {},
      mappingInfo = {},
      organizationRoleList = [],
      salutationList = [],
      countryList = [],
      cityList = [],
      bilCityList = [],
      currencyList = [],
      categoryList = [],
      customerGroupList = [],
    } = this.props;
    const { downFileLoadingFlag = false } = this.state;
    const detailProps = {
      organizationRoleList,
      salutationList,
      countryList,
      cityList,
      bilCityList,
      currencyList,
      categoryList,
      customerGroupList,
      isMainTaRoleFlag: hasAllPrivilege([MAIN_TA_ADMIN_PRIVILEGE]),
      isSaleSupportRoleFlag: hasAllPrivilege([SALES_SUPPORT_PRIVILEGE]),
      isAccountingArRoleFlag: hasAllPrivilege([AR_ACCOUNT_PRIVILEGE]),
    };
    return (
      <>
        {customerInfo && customerInfo.contactInfo && (
          <DetailForContactInformation contactInfo={customerInfo.contactInfo} {...detailProps} />
        )}
        {customerInfo && customerInfo.companyInfo && (
          <DetailForCompanyInformation companyInfo={customerInfo.companyInfo} {...detailProps} />
        )}
        {customerInfo && customerInfo.companyInfo && (
          <DetailForQuestionsInformation companyInfo={customerInfo.companyInfo} {...detailProps} />
        )}
        {customerInfo && customerInfo.companyInfo && (
          <DetailForFileUploadInformation
            companyInfo={customerInfo.companyInfo}
            {...detailProps}
            downFileLoadingFlag={downFileLoadingFlag}
            updateDownFileLoading={val => this.setState(val)}
          />
        )}
        {otherInfo && otherInfo.billingInfo && (
          <DetailForBillingInformation billingInfo={otherInfo.billingInfo} {...detailProps} />
        )}
        {otherInfo && otherInfo.financeContactList && (
          <DetailForTaFinanceContact
            financeContactList={otherInfo.financeContactList}
            mappingInfo={mappingInfo}
            {...detailProps}
          />
        )}
      </>
    );
  }
}

export default DetailForRegistrationInformation;
