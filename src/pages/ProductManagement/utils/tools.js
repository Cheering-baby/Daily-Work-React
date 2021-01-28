export function objDeepCopy(obj) {
  if (obj !== null) {
    const newObj = obj.constructor === Array ? [] : {};
    for (const i in obj) {
      if (typeof obj[i] === 'object') {
        newObj[i] = objDeepCopy(obj[i]);
      } else {
        newObj[i] = obj[i];
      }
    }
    return newObj;
  }
  return null;
}

export function setSelected(arrayList, selectedList) {
  for (let i = 0; i < arrayList.length; i += 1) {
    for (let j = 0; j < selectedList.length; j += 1) {
      if (arrayList[i].commoditySpecId === selectedList[j].commoditySpecId) {
        arrayList[i].isSelected = true;
        const { subCommodityList: subArrayList = [] } = arrayList[i];
        const { subCommodityList: subSelectList = [] } = selectedList[j];
        if (subArrayList.length > 0 && subSelectList.length > 0) {
          setSelected(subArrayList, subSelectList);
        }
      }
    }
  }
}

export function formatPrice(text) {
  text += '';
  text = text.replace(/[^0-9|\.]/g, '');
  if (/^0+/) text = text.replace(/^0+/, '');
  if (!/\./.test(text)) text += '.00';
  if (/^\./.test(text)) text = `0${text}`;
  text += '00';
  text = text.match(/\d+\.\d{2}/)[0];
  return `$ ${text}`;
}

export function changeThemeParkDisplay(text, themeParkList) {
  let themeParkCodeList = [];
  if (Array.isArray(text)) {
    themeParkCodeList = text;
  } else {
    themeParkCodeList = text ? text.split(',').sort((a, b) => a.localeCompare(b)) : [];
  }
  const changeThemeParkList = themeParkCodeList.map(item => {
    if (themeParkList.find(themePark => item === themePark.bookingCategoryCode)) {
      return themeParkList.find(item2 => item === item2.bookingCategoryCode).bookingCategoryName;
    }
    return item;
  });
  if (changeThemeParkList.length > 0) {
    return changeThemeParkList.join(',');
  }
  return null;
}

/**
 * @param  currentPage
 * @param  pageSize
 * @param  data
 */
export function formatPageData(currentPage, pageSize, data) {
  const pageData = {
    pageSize,
    currentPage,
    items: [],
  };

  const maxLength = currentPage * pageSize - 1;
  const minLength = currentPage * pageSize - pageSize;
  for (let i = minLength; i < data.length; i += 1) {
    if (maxLength < i) {
      break;
    } else {
      pageData.items.push(data[i]);
    }
  }
  return pageData;
}
