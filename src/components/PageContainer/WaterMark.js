import SCREEN from '../../utils/screen';
import removeWaterMark from './RemoveWaterMark';

const waterMark = (oWaterMark, watermarkTxt) => {
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  let isMobile = false;
  if (screenWidth <= SCREEN.screenXsMax) {
    isMobile = true;
  } else if (
    screenWidth > SCREEN.screenSmMin &&
    screenWidth <= SCREEN.screenMdMax &&
    screenHeight <= SCREEN.screenXsMax
  ) {
    isMobile = true;
  }
  // 默认设置
  const defaultSettings =
    isMobile === true
      ? {
          watermarkTxt,
          watermarkX: 0, // 水印起始位置x轴坐标
          watermarkY: 44, // 水印起始位置Y轴坐标
          watermarkRows: 20, // 水印行数
          watermarkCols: 20, // 水印列数
          watermarkXSpace: 10, // 水印x轴间隔
          watermarkYSpace: -30, // 水印y轴间隔
          watermarkColor: '#787f8d', // 水印字体颜色
          watermarkAlpha: 0.2, // 水印透明度
          watermarkFontsize: '15px', // 水印字体大小
          watermarkFont: 'Calibri', // 水印字体
          watermarkWidth: 100, // 水印宽度
          watermarkHeight: 130, // 水印高度
          watermarkAngle: 20, // 水印倾斜度数
        }
      : {
          watermarkTxt,
          watermarkX: 0, // 水印起始位置x轴坐标
          watermarkY: 30, // 水印起始位置Y轴坐标
          watermarkRows: 20, // 水印行数
          watermarkCols: 20, // 水印列数
          watermarkXSpace: 20, // 水印x轴间隔
          watermarkYSpace: 10, // 水印y轴间隔
          watermarkColor: '#787f8d', // 水印字体颜色
          watermarkAlpha: 0.2, // 水印透明度
          watermarkFontsize: '15px', // 水印字体大小
          watermarkFont: 'calibri', // 水印字体
          watermarkWidth: 200, // 水印宽度
          watermarkHeight: 100, // 水印高度
          watermarkAngle: 20, // 水印倾斜度数
        };

  const oTemp = document.createDocumentFragment();

  // 获取页面最大宽度
  let pageWidth = window.innerWidth - 40;
  // 获取页面最大高度
  let pageHeight = parseInt(getComputedStyle(oWaterMark).height, 0); // window.innerHeight;
  let mainLayoutContent = document.getElementsByClassName('main-layout-content');
  if (isMobile === true) {
    mainLayoutContent = document.getElementsByClassName('mobile-main-layout-content');
  }
  if (mainLayoutContent && mainLayoutContent.length === 1) {
    pageWidth = mainLayoutContent[0].clientWidth;
    pageHeight = mainLayoutContent[0].clientHeight;
  }
  // 计算水印列数
  defaultSettings.watermarkCols = parseInt(
    (pageWidth - defaultSettings.watermarkX * 2) /
      (defaultSettings.watermarkWidth + defaultSettings.watermarkXSpace),
    0
  );
  defaultSettings.watermarkXSpace = parseInt(
    (pageWidth -
      defaultSettings.watermarkX -
      defaultSettings.watermarkWidth * defaultSettings.watermarkCols) /
      (defaultSettings.watermarkCols - 1),
    0
  );
  //  计算水印行数
  if (isMobile === true) {
    defaultSettings.watermarkRows =
      parseInt(
        (pageHeight - defaultSettings.watermarkY * 2) /
          (defaultSettings.watermarkHeight + defaultSettings.watermarkYSpace),
        0
      ) + 1;
  } else {
    defaultSettings.watermarkRows = parseInt(
      (pageHeight - defaultSettings.watermarkY * 2) /
        (defaultSettings.watermarkHeight + defaultSettings.watermarkYSpace),
      0
    );
    defaultSettings.watermarkYSpace = parseInt(
      (pageHeight -
        defaultSettings.watermarkY -
        defaultSettings.watermarkHeight * defaultSettings.watermarkRows) /
        (defaultSettings.watermarkRows - 1),
      0
    );
  }
  let x;
  let y;
  for (let i = 0; i < defaultSettings.watermarkRows; i += 1) {
    y =
      defaultSettings.watermarkY +
      (defaultSettings.watermarkYSpace + defaultSettings.watermarkHeight) * i;
    for (let j = 0; j < defaultSettings.watermarkCols; j += 1) {
      x =
        defaultSettings.watermarkX +
        (defaultSettings.watermarkWidth + defaultSettings.watermarkXSpace) * j;
      const maskDiv = document.createElement('div');
      maskDiv.id = `mask_div${i}${j}`;
      maskDiv.className = 'mask_div';
      maskDiv.appendChild(document.createTextNode(defaultSettings.watermarkTxt));
      // 设置水印div倾斜显示
      maskDiv.style.webkitTransform = `rotate(-${defaultSettings.watermarkAngle}deg)`;
      maskDiv.style.MozTransform = `rotate(-${defaultSettings.watermarkAngle}deg)`;
      maskDiv.style.msTransform = `rotate(-${defaultSettings.watermarkAngle}deg)`;
      maskDiv.style.OTransform = `rotate(-${defaultSettings.watermarkAngle}deg)`;
      maskDiv.style.transform = `rotate(-${defaultSettings.watermarkAngle}deg)`;
      maskDiv.style.visibility = '';
      maskDiv.style.position = 'absolute';
      maskDiv.style.left = `${x}px`;
      maskDiv.style.top = `${y}px`;
      maskDiv.style.overflow = 'hidden';
      if (isMobile === true) maskDiv.style.zIndex = '9999';
      else maskDiv.style.zIndex = '1';
      maskDiv.style.pointerEvents = 'none';
      maskDiv.style.opacity = defaultSettings.watermarkAlpha;
      maskDiv.style.fontSize = defaultSettings.watermarkFontsize;
      maskDiv.style.fontFamily = defaultSettings.watermarkFont;
      maskDiv.style.color = defaultSettings.watermarkColor;
      if (isMobile === true) maskDiv.style.background = defaultSettings.watermarkBackground;
      maskDiv.style.textAlign = 'center';
      maskDiv.style.display = 'flex';
      maskDiv.style.alignItems = 'center';
      maskDiv.style.justifyContent = 'center';
      maskDiv.style.width = `${defaultSettings.watermarkWidth}px`;
      maskDiv.style.height = `${defaultSettings.watermarkHeight}px`;

      oTemp.appendChild(maskDiv);
    }
  }
  const mainDiv = document.createElement('div');
  mainDiv.style.position = 'fixed';
  mainDiv.style.left = '0px';
  mainDiv.style.top = '0px';
  mainDiv.style.width = '100%';
  mainDiv.style.height = '100%';
  mainDiv.style.pointerEvents = 'none';
  if (mainLayoutContent && mainLayoutContent.length === 1) {
    mainDiv.style.left = `${mainLayoutContent[0].offsetLeft}px`;
    mainDiv.style.top = `${mainLayoutContent[0].offsetTop}px`;
    mainDiv.style.width = `${mainLayoutContent[0].clientWidth}px`;
    mainDiv.style.height = `${mainLayoutContent[0].clientHeight}px`;
  }
  mainDiv.appendChild(oTemp);
  removeWaterMark();
  oWaterMark.appendChild(mainDiv);
};
export default waterMark;
