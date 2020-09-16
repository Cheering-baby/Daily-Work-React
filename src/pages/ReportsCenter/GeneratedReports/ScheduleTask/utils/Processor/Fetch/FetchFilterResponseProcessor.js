import DATABASE_NAME from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/consts/dataBase';
import {
  queryChannels,
  queryPluAttribute,
  queryReportDictionary,
  queryAgentDict,
} from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/services/scheduledTaskService';
import {
  EXTRA_FILTER_TYPE,
  FILTER_TYPE,
} from '@/pages/ReportsCenter/GeneratedReports/ScheduleTask/consts/filterType';

const { SELECT, MULTIPLE_SELECT } = FILTER_TYPE;
const {
  MULTIPLE_SELECT_THEME_PARK_CODE,
  MULTIPLE_SELECT_AGE_GROUP,
  MULTIPLE_SELECT_CHANNEL,
} = EXTRA_FILTER_TYPE;

const DictionaryProcessor = {
  [DATABASE_NAME.REPORT]: queryReportDictionary,
  [DATABASE_NAME.AGENT]: queryAgentDict,
};

const NormalSelect = (store, filter) => ({
  preprocess: () => true,
  service: DictionaryProcessor[filter.dictDbName] || DictionaryProcessor[DATABASE_NAME.REPORT],
  params: { dictType: filter.dictType, dictSubType: filter.dictSubType},
  process: _store => {
    const { _response, filterList, index } = _store;
    const {
      data: { result: dictInfoList = [], resultCode },
    } = _response;
    if (resultCode !== '0') return;
    const keyMap = {};
    const options = dictInfoList.map(({ dictName, dictId }) => {
      Object.assign(keyMap, { [dictId]: dictName });
      return { text: dictName, value: dictId };
    });
    Object.assign(filterList[index], { options, keyMap });
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
    const keyMap = {};
    const options = items.map(({ itemName, itemValue }) => {
      Object.assign(keyMap, { [itemValue]: itemName });
      return { text: itemName, value: itemValue };
    });
    Object.assign(filterList[index], { options, keyMap });
  },
});

const ChannelSelect = () => ({
  preprocess: () => true,
  service: queryChannels,
  // params: { attributeItem },
  process: _store => {
    const { _response, filterList, index } = _store;
    const {
      data: {
        result: { channelInfos = [] },
        resultCode,
      },
    } = _response;
    if (resultCode !== '0') return;
    const keyMap = {};
    const options = channelInfos.map(({ channel, id }) => {
      Object.assign(keyMap, { [id]: channel });
      return { text: channel, value: id };
    });
    Object.assign(keyMap, { 0: 'Galaxy' });
    Object.assign(filterList[index], { options, keyMap });
  },
});

const BaseProcessor = {
  [SELECT]: NormalSelect,
  [MULTIPLE_SELECT]: NormalSelect,
  [MULTIPLE_SELECT_THEME_PARK_CODE]: () => PluAttributeSelect('THEME_PARK'),
  [MULTIPLE_SELECT_AGE_GROUP]: () => PluAttributeSelect('AGE_GROUP'),
  [MULTIPLE_SELECT_CHANNEL]: ChannelSelect,
};

const FetchFilterResponseProcessor = (store, filter) => {
  const { filterKey, filterType } = filter;
  const baseProcessor = BaseProcessor[`${filterType}_${filterKey}`] || BaseProcessor[filterType];
  if (baseProcessor) return baseProcessor(store, filter);
  return {};
};

export default FetchFilterResponseProcessor;
