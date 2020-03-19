import { isNvl } from '@/utils/utils';

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

export function getCountryStr(countryList, country) {
  let countryStr = '';
  if (country && countryList && countryList.length > 0) {
    const countryInfo = countryList.find(n => String(n.dictId) === String(country)) || {};
    countryStr += countryInfo.dictName;
  }
  return !isNvl(countryStr) ? countryStr : '-';
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
