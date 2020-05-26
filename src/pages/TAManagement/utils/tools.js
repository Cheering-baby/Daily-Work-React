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
