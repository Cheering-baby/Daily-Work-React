export default function serialize(obj) {
  const ary = [];
  for (const p in obj)
    if (Object.prototype.hasOwnProperty.call(obj, p) && obj[p]) {
      ary.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
    }
  return `?${ary.join('&')}`;
}
