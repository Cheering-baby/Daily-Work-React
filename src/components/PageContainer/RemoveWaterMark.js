export default function removeWaterMark() {
  const maskNodes = document.getElementsByClassName('mask_div');
  const maskNodesLen = maskNodes.length;
  let isIE = false;
  if (!!window.ActiveXObject || 'ActiveXObject' in window) {
    isIE = true;
  }
  if (isIE === false) {
    for (let i = 0; i < maskNodesLen; i += 1) {
      maskNodes[0].remove();
    }
  } else {
    for (let i = 0; i < maskNodesLen; i += 1) {
      maskNodes[0].removeNode(true);
    }
  }
}
