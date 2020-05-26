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
