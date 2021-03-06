import { formatMessage } from 'umi/locale';
import { getLocalUrl, isNvl } from '@/utils/utils';
import {
  AR_ACCOUNT_PRIVILEGE,
  hasAllPrivilege,
  MAIN_TA_ADMIN_PRIVILEGE,
  SALES_SUPPORT_PRIVILEGE,
} from '@/utils/PrivilegeUtil';

export function getTravelAgentNoLabel(country) {
  if (String(country).toLowerCase() === '65') {
    return formatMessage({ id: 'STB_TRAVEL_AGENT_LICENSE_NUMBER' });
  }
  return formatMessage({ id: 'TRAVEL_AGENT_REGISTRATION_NUMBER' });
}

export function getSalutationStr(salutationList, salutation) {
  let salutationStr = '';
  if (salutation && salutationList && salutationList.length) {
    const salutationInfo = salutationList.find(n => String(n.dictId) === String(salutation)) || {};
    if (!isNvl(salutationInfo) && !isNvl(salutationInfo.dictName)) {
      salutationStr += `${salutationInfo.dictName}.`;
      return salutationStr;
    }
  }
  return '-';
}

export function getTelStr(countryList, country, phone) {
  let countryStr = '';
  if (country && countryList && countryList.length) {
    const countryInfo = countryList.find(n => String(n.dictId) === String(country)) || {};
    if (!isNvl(countryInfo) && !isNvl(countryInfo.dictName)) {
      countryStr += `(${countryInfo.dictName} +${countryInfo.dictId})`;
    }
  }
  if (phone) {
    return countryStr + phone;
  }
  return '-';
}

export function getOrganizationRoleStr(organizationRoleList, organizationRole) {
  if (organizationRole && organizationRoleList && organizationRoleList.length > 0) {
    const organizationRoleInfo =
      organizationRoleList.find(n => String(n.dictId) === String(organizationRole)) || {};
    if (!isNvl(organizationRoleInfo) && !isNvl(organizationRoleInfo.dictName)) {
      return organizationRoleInfo.dictName;
    }
  }
  return '-';
}

export function getCountryAndCityStr(countryList, country, city, cityList) {
  let countryAndCityStr = '';
  if (country && countryList && countryList.length > 0) {
    const countryInfo = countryList.find(n => String(n.dictId) === String(country)) || {};
    if (!isNvl(countryInfo) && !isNvl(countryInfo.dictName)) {
      countryAndCityStr += `${countryInfo.dictName}`;
    }
  }
  if (city && cityList && cityList.length > 0) {
    const cityInfo = cityList.find(n => String(n.dictId) === String(city)) || {};
    if (!isNvl(cityInfo) && !isNvl(cityInfo.dictName)) {
      if (isNvl(countryAndCityStr)) countryAndCityStr += cityInfo.dictName;
      else countryAndCityStr += `,${cityInfo.dictName}`;
    }
  }
  return !isNvl(countryAndCityStr) ? countryAndCityStr : '-';
}

export function getTopNationalitiesStr(countryList, topNationalities) {
  let topNationalitiesStr = '';
  if (!isNvl(topNationalities)) {
    const topNationalitiesArr = topNationalities.split(',');
    topNationalitiesArr.forEach(item => {
      if (item && countryList && countryList.length > 0) {
        const countryInfo = countryList.find(n => String(n.dictId) === String(item)) || {};
        if (!isNvl(topNationalitiesStr)) {
          topNationalitiesStr += ',';
        }
        if (!isNvl(countryInfo) && !isNvl(countryInfo.dictName)) {
          topNationalitiesStr += `${countryInfo.dictName}`;
        }
      }
    });
  }
  return !isNvl(topNationalitiesStr) ? topNationalitiesStr : '-';
}

export function getCreateTeamStr(createTeamList, createTeam) {
  if (createTeam && createTeamList && createTeamList.length > 0) {
    const createTeamInfo = createTeamList.find(n => String(n.dictId) === String(createTeam)) || {};
    if (!isNvl(createTeamInfo) && !isNvl(createTeamInfo.dictName)) {
      return createTeamInfo.dictName;
    }
  }
  return '-';
}

export function getMoneyStr(moneyStr) {
  if (!isNvl(moneyStr)) {
    return `$${String(moneyStr).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }
  return '-';
}

export function getCurrencyStr(currencyList, currency) {
  let salutationStr = '';
  if (currency && currencyList && currencyList.length) {
    const currencyInfo = currencyList.find(n => String(n.dictId) === String(currency)) || {};
    if (!isNvl(currencyInfo) && !isNvl(currencyInfo.dictName)) {
      salutationStr += `${currencyInfo.dictName}`;
      return salutationStr;
    }
  }
  return '-';
}

export function getCategoryAndCustomerGroupStr(
  categoryList,
  customerGroupList,
  category,
  customerGroup
) {
  let categoryAndCustomerGroupStr = '';
  if (category && categoryList && categoryList.length > 0) {
    const countryInfo = categoryList.find(n => String(n.dictId) === String(category)) || {};
    if (!isNvl(countryInfo) && !isNvl(countryInfo.dictName)) {
      categoryAndCustomerGroupStr += `${countryInfo.dictName}`;
    }
  }
  if (customerGroup && customerGroupList && customerGroupList.length > 0) {
    const cityInfo = customerGroupList.find(n => String(n.dictId) === String(customerGroup)) || {};
    if (!isNvl(cityInfo) && !isNvl(cityInfo.dictName)) {
      if (isNvl(categoryAndCustomerGroupStr)) categoryAndCustomerGroupStr += cityInfo.dictName;
      else categoryAndCustomerGroupStr += `,${cityInfo.dictName}`;
    }
  }
  return !isNvl(categoryAndCustomerGroupStr) ? categoryAndCustomerGroupStr : '-';
}

export function getSalesPersonStr(salesPersonInfo) {
  if (salesPersonInfo.userCode){
    return salesPersonInfo.userCode;
  }
  return '-';
}

export function getSalesPersonEmailStr(salesPersonInfo) {
  if (salesPersonInfo && salesPersonInfo.rwsInfo && salesPersonInfo.rwsInfo.email){
    return salesPersonInfo.rwsInfo.email;
  }
  return '-';
}

export function getSalesPersonContactNumberStr(salesPersonInfo={}) {
  if (salesPersonInfo && salesPersonInfo.rwsInfo && salesPersonInfo.rwsInfo.phone){
    return salesPersonInfo.rwsInfo.phone;
  }
  return '-';
}

export function getSalesPersonProductEligibility(queryMappingInfo) {
  if (queryMappingInfo && queryMappingInfo.productName) {
    return queryMappingInfo.productName
      .replace('hotel', 'Rooms')
      .replace('attractions', 'Attractions');
  }
  return '-';
}

export function getSettlementCycleStr(settlementCycleList, settlementCycle, settlementValue) {
  let settlementCycleStr = `The ${settlementValue} th day of the`;
  if (settlementCycle && settlementCycleList && settlementCycleList.length) {
    const settlementCycleInfo =
      settlementCycleList.find(n => String(n.dictId) === String(settlementCycle)) || {};
    if (!isNvl(settlementCycleInfo) && !isNvl(settlementCycleInfo.dictName)) {
      settlementCycleStr += ` ${settlementCycleInfo.dictName}`;
      return settlementCycleStr;
    }
  }
  if (!isNvl(settlementValue)) {
    return `The ${settlementValue} th day`;
  }
  return '-';
}

export function getMarketStr(marketList, market) {
  let marketStr = '';
  if (market && marketList && marketList.length > 0) {
    const marketInfo = marketList.find(n => String(n.dictId) === String(market)) || {};
    if (!isNvl(marketInfo) && !isNvl(marketInfo.dictName)) {
      marketStr += `${marketInfo.dictName}`;
      return marketStr;
    }
  }
  return '-';
}

export function getModifyTYpe() {
  const isAccountingArRoleFlag = hasAllPrivilege([AR_ACCOUNT_PRIVILEGE]);
  const isMainTaRoleFlag = hasAllPrivilege([MAIN_TA_ADMIN_PRIVILEGE]);
  const isSaleSupportRoleFlag = hasAllPrivilege([SALES_SUPPORT_PRIVILEGE]);
  let modifyType = '';
  if (isMainTaRoleFlag) {
    modifyType = 'Main TA';
  }
  if (isSaleSupportRoleFlag) {
    modifyType = 'Sales Support';
  }
  if (isAccountingArRoleFlag) {
    modifyType = 'Accounting';
  }
  return modifyType;
}

export const colLayOut = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 12,
  xl: 8,
  xxl: 8,
  style: {
    height: '75px',
  },
};

export const rowLayOut = {
  type: 'flex',
  gutter: 15,
};

export const detailLayOut = { xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 3 };

export function getFormLayout() {
  const formItemLayout = {
    labelCol: {
      span: 24,
    },
    wrapperCol: {
      span: 24,
    },
  };
  const formItemRowLayout = {
    labelCol: {
      span: 24,
    },
    wrapperCol: {
      span: 24,
    },
  };
  const formItemLongLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 12 },
      md: { span: 10 },
      lg: { span: 14 },
      xl: { span: 11 },
      xxl: { span: 11 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 12 },
      md: { span: 14 },
      lg: { span: 10 },
      xl: { span: 13 },
      xxl: { span: 13 },
    },
  };
  return {
    formItemLayout,
    formItemRowLayout,
    formItemLongLayout,
  };
}

export function getDetailLayout() {
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

  return {
    layoutDisplay,
    valueDisplay,
    longLayoutDisplay,
    longValueDisplay,
  };
}

export function getFormKeyValue(keyValue) {
  let noVal = '';
  if (!isNvl(keyValue)) {
    noVal = String(keyValue);
    noVal = noVal.replace(/\n/g, '\\n');
    noVal = noVal.replace(/\r/g, '\\r');
    noVal = noVal.replace(/(^[ \f\t\v]*)|([ \f\t\v]*$)/g, '');
  }
  return noVal;
}

export function getKeyValue(keyValue) {
  let noVal = '';
  if (!isNvl(keyValue)) {
    noVal = String(keyValue);
    noVal = noVal.replace(/\n/g, '\\n');
    noVal = noVal.replace(/\r/g, '\\r');
    noVal = noVal.replace(/(^[ \f\t\v]*)|([ \f\t\v]*$)/g, '');
  }
  return noVal;
}

export function getBillingInfo(otherInfo, customerInfo, checked) {
  const { companyInfo = {} } = customerInfo || {};
  const { contactInfo = {} } = customerInfo || {};
  const newBillingInfo = { ...(otherInfo || {}).billingInfo };
  if (checked) {
    if (!isNvl(companyInfo.companyName)) {
      newBillingInfo.companyName = companyInfo.companyName;
    }
    if (!isNvl(companyInfo.postalCode)) {
      newBillingInfo.postalCode = companyInfo.postalCode;
    }
    if (!isNvl(companyInfo.country)) {
      newBillingInfo.country = companyInfo.country;
    }
    if (!isNvl(companyInfo.city)) {
      newBillingInfo.city = companyInfo.city;
    }
    if (!isNvl(companyInfo.address)) {
      newBillingInfo.address = companyInfo.address;
    }
    if (!isNvl(contactInfo.email)) {
      newBillingInfo.email = contactInfo.email;
    }
    if (!isNvl(contactInfo.country)) {
      newBillingInfo.phoneCountry = contactInfo.country;
    }
    if (!isNvl(contactInfo.phone)) {
      newBillingInfo.phone = contactInfo.phone;
    }
    if (!isNvl(contactInfo.mobileCountry)) {
      newBillingInfo.mobileCountry = contactInfo.mobileCountry;
    }
    if (!isNvl(contactInfo.mobileNumber)) {
      newBillingInfo.mobileNumber = contactInfo.mobileNumber;
    }
    if (!isNvl(contactInfo.fax)) {
      newBillingInfo.fax = contactInfo.fax;
    }
    if (!isNvl(contactInfo.salutation)) {
      newBillingInfo.salutation = contactInfo.salutation;
    }
    if (!isNvl(contactInfo.firstName)) {
      newBillingInfo.firstName = contactInfo.firstName;
    }
    if (!isNvl(contactInfo.lastName)) {
      newBillingInfo.lastName = contactInfo.lastName;
    }
  }
  return newBillingInfo;
}

export function getYesOrNo(val) {
  if (String(val) === '1') {
    return formatMessage({ id: 'GST_REG_YES' });
  }
  if (String(val) === '0') {
    return formatMessage({ id: 'GST_REG_NOT' });
  }
  return '-';
}

export function getProductType() {
  return {
    productTypeRoom: '01',
    productTypeAttractions: '02',
  };
}

export function getFinanceType() {
  return {
    financeTypeOne: '01',
    financeTypeTwo: '02',
  };
}

export function getRegistionLink(companyName, taId) {
  let urlStr = `${getLocalUrl()}#/SubTAManagement/SignUp`;
  if (!isNvl(taId) && !isNvl(companyName)) urlStr += `?taId=${taId}&companyName=${companyName}`;
  else if (!isNvl(taId) && isNvl(companyName)) urlStr += `?taId=${taId}`;
  else if (isNvl(taId) && !isNvl(companyName)) urlStr += `?companyName=${companyName}`;
  return urlStr;
}
