import { EXTRA_FILTER_TYPE, FILTER_TYPE } from '@/pages/ReportCenter/PamsReport/consts/filterType';
import {
  queryAgentDictionary,
  queryPluAttribute,
  queryReportDictionary,
  querySalePerson,
} from '@/pages/ReportCenter/PamsReport/services/adhocReportsService';
import DATABASE_NAME from '@/pages/ReportCenter/PamsReport/consts/dataBase';

const { SELECT, MULTIPLE_SELECT } = FILTER_TYPE;
const {
  SELECT_CATEGORY_TYPE,
  MULTIPLE_SELECT_THEME_PARK_CODE,
  MULTIPLE_SELECT_AGE_GROUP,
  MULTIPLE_SELECT_ACCOUNT_MANAGER,
} = EXTRA_FILTER_TYPE;

const DictionaryProcessor = {
  [DATABASE_NAME.AGENT]: queryAgentDictionary,
  [DATABASE_NAME.REPORT]: queryReportDictionary,
};

const NormalSelect = (store, filter) => ({
  preprocess: () => true,
  service: DictionaryProcessor[filter.dictDbName] || DictionaryProcessor[DATABASE_NAME.REPORT],
  params: { dictType: filter.dictType, dictSubType: filter.dictSubType },
  process: _store => {
    const { _response, filterList, index } = _store;
    const {
      data: { result: dictInfoList = [], resultCode },
    } = _response;
    if (resultCode !== '0') return;
    const options = dictInfoList.map(({ dictName, dictId }) => ({
      text: dictName,
      value: dictId,
    }));
    Object.assign(filterList[index], { options });
  },
});

const CategoryTypeSelect = () => ({
  preprocess: () => true,
  service: queryAgentDictionary,
  params: { dictType: 1004 },
  process: _store => {
    const { _response } = _store;
    const {
      data: { result: dictInfoList = [], resultCode },
    } = _response;
    if (resultCode !== '0') return;
    const categoryTypeList = [];
    const categoryTypeMap = {};
    const customerGroupMap = {};
    dictInfoList.forEach(({ dictId, dictName, dictSubType, dictSubTypeName }) => {
      if (!categoryTypeMap[dictSubType]) {
        categoryTypeMap[dictSubType] = dictSubTypeName;
        categoryTypeList.push({ text: dictSubTypeName, value: dictSubType });
      }
      if (!customerGroupMap[dictSubType]) {
        customerGroupMap[dictSubType] = [{ text: dictName, value: dictId }];
      } else {
        customerGroupMap[dictSubType].push({ text: dictName, value: dictId });
      }
    });
    return { categoryTypeList, customerGroupMap };
  },
});

const PluAttributeSelect = attributeItem => ({
  preprocess: () => true,
  service: queryPluAttribute,
  params: { attributeItem },
  process: _store => {
    const { _response, filterList, index } = _store;
    const {
      data: {
        result: { items = [] },
        resultCode,
      },
    } = _response;
    if (resultCode !== '0') return;
    const options = items.map(({ itemName, itemValue }) => ({
      text: itemName,
      value: itemValue,
    }));
    Object.assign(filterList[index], { options });
  },
});

const AccountManagerSelect = () => ({
  preprocess: () => true,
  service: querySalePerson,
  params: null,
  process: _store => {
    const { _response, filterList, index } = _store;
    const {
      data: {
        resultData: { userProfiles = [] },
      },
    } = _response;
    const options = userProfiles.map(({ userCode }) => ({
      text: userCode,
      value: userCode,
    }));
    Object.assign(filterList[index], { options });
  },
});

const BaseProcessor = {
  [SELECT]: NormalSelect,
  [MULTIPLE_SELECT]: NormalSelect,
  [SELECT_CATEGORY_TYPE]: CategoryTypeSelect,
  [MULTIPLE_SELECT_THEME_PARK_CODE]: () => PluAttributeSelect('THEME_PARK'),
  [MULTIPLE_SELECT_AGE_GROUP]: () => PluAttributeSelect('AGE_GROUP'),
  [MULTIPLE_SELECT_ACCOUNT_MANAGER]: AccountManagerSelect,
};

const FetchFilterResponseProcessor = (store, filter) => {
  const { filterKey, filterType } = filter;
  const baseProcessor = BaseProcessor[`${filterType}_${filterKey}`] || BaseProcessor[filterType];
  if (baseProcessor) return baseProcessor(store, filter);
  return {};
};

export default FetchFilterResponseProcessor;
