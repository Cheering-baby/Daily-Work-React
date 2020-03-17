import { formatMessage } from 'umi/locale';
import { getLocalUrl, isNvl } from '@/utils/utils';

export function getTravelAgentNoLabel(country) {
  if (String(country).toLowerCase() === 'singapore') {
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

export function getSalesPersonStr(salesPersonList, salesPerson) {
  let salesPersonStr = '';
  if (salesPerson && salesPersonList && salesPersonList.length) {
    const salesPersonInfo =
      salesPersonList.find(n => String(n.userCode) === String(salesPerson)) || {};
    if (!isNvl(salesPersonInfo) && !isNvl(salesPersonInfo.userCode)) {
      salesPersonStr += `${salesPersonInfo.userCode}`;
      return salesPersonStr;
    }
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

export function isMainTaRole(pagePrivileges) {
  let isMainTaRoleFlag = false;
  if (pagePrivileges && pagePrivileges.length > 0) {
    isMainTaRoleFlag =
      pagePrivileges.findIndex(n => String(n.componentCode).toUpperCase() === 'MAIN_TA') !== -1;
  }
  return isMainTaRoleFlag;
}

export function isSaleSupportRole(pagePrivileges) {
  let isSaleSupportRoleFlag = false;
  if (pagePrivileges && pagePrivileges.length > 0) {
    isSaleSupportRoleFlag =
      pagePrivileges.findIndex(n => String(n.componentCode).toUpperCase() === 'SALE_SUPPORT') !==
      -1;
  }
  return isSaleSupportRoleFlag;
}

export function isAccountingArRole(pagePrivileges) {
  let isAccountingArRoleFlag = false;
  if (pagePrivileges && pagePrivileges.length > 0) {
    isAccountingArRoleFlag =
      pagePrivileges.findIndex(n => String(n.componentCode).toUpperCase() === 'ACCOUTING_AR') !==
      -1;
  }
  return isAccountingArRoleFlag;
}

export function getModifyTYpe(pagePrivileges) {
  const isAccountingArRoleFlag = isAccountingArRole(pagePrivileges);
  const isMainTaRoleFlag = isMainTaRole(pagePrivileges);
  const isSaleSupportRoleFlag = isSaleSupportRole(pagePrivileges);
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

export function getFormLayout() {
  const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 12 },
      md: { span: 10 },
      lg: { span: 12 },
      xl: { span: 8 },
      xxl: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 12 },
      md: { span: 14 },
      lg: { span: 12 },
      xl: { span: 16 },
      xxl: { span: 16 },
    },
  };
  const formItemRowLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 12 },
      md: { span: 10 },
      lg: { span: 6 },
      xl: { span: 4 },
      xxl: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 12 },
      md: { span: 14 },
      lg: { span: 18 },
      xl: { span: 20 },
      xxl: { span: 20 },
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
  let urlStr = `${getLocalUrl().replace('/pams', '')}/#/SubTAManagement/SignUp`;
  if (!isNvl(taId) && !isNvl(companyName)) urlStr += `?taId=${taId}&companyName=${companyName}`;
  else if (!isNvl(taId) && isNvl(companyName)) urlStr += `?taId=${taId}`;
  else if (isNvl(taId) && !isNvl(companyName)) urlStr += `?companyName=${companyName}`;
  return urlStr;
}
