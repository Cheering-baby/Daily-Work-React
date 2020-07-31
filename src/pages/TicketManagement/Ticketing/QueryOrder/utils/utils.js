export default function serialize(obj) {
  const ary = [];
  for (const p in obj)
    if (Object.prototype.hasOwnProperty.call(obj, p) && obj[p]) {
      ary.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
    }
  return `?${ary.join('&')}`;
}

export function getNumOfPaxInPackage(attraction) {
  let resultValue = 0;
  if (attraction && attraction.ticketNumOfPax) {
    try {
      const ticketNumOfPaxList = JSON.parse(attraction.ticketNumOfPax);
      if (ticketNumOfPaxList && ticketNumOfPaxList.length > 0) {
        resultValue = ticketNumOfPaxList[0].qty || 1;
      }
    } catch (e) {
      console.log('getNumOfPaxInPackage error');
      console.log(e);
    }
  }
  return resultValue;
}
