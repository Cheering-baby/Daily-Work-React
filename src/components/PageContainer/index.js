import React, { PureComponent } from 'react';
import watermark from './WaterMark';
import removeWaterMark from './RemoveWaterMark';

class PageContainer extends PureComponent {
  componentDidMount() {
    this.showExtracted();
  }

  showExtracted = () => {
    const userName = window.AppGlobal && window.AppGlobal.userName;
    window.clearInterval(window.pageContainerTimer);
    window.pageContainerTimer = setInterval(() => {
      const obj = window.document.getElementById('pageContainer');
      if (obj && this.scrollHeight !== obj.scrollHeight) {
        this.scrollHeight = obj.scrollHeight;
        removeWaterMark();
        watermark(obj, userName || 'admin123');
      } else if (obj && this.scrollHeight === obj.scrollHeight) {
        const maskNodes = document.getElementsByClassName('mask_div');
        if (maskNodes.length <= 0) {
          watermark(obj, userName || 'admin123');
        }
      }
      if (obj && this.clientWidth !== obj.clientWidth) {
        this.clientWidth = obj.clientWidth;
        removeWaterMark();
        watermark(obj, userName || 'admin123');
      }
    }, 1200);
  };

  render() {
    const { children } = this.props;
    return (
      <div id="pageContainer" style={{ height: 'calc(100vh - 112px)' }}>
        {children}
      </div>
    );
  }
}

export default PageContainer;
