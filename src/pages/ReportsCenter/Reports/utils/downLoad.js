import { message } from 'antd';
import 'isomorphic-fetch';
import UAAService from '@/uaa-npm';

import { globalConst } from '@/uaa-npm/constant';

const download = ({
  url,
  method,
  body,
  defFileName,
  loading = {
    open: () => {},
    close: () => {},
  },
  handleStatusIsNot200,
}) => {
  loading.open();
  fetch(url, {
    method,
    body: JSON.stringify(body),
    credentials: 'include',
    headers: new Headers({
      [globalConst.HEADER_AUTHORIZATION]: globalConst.TOKEN_PREFIX + UAAService.axiosConfig.RT,
      'App-Code': 'PAMS',
      'Content-Type': 'application/json',
    }),
  })
    .then(response => {
      loading.close();
      response.blob().then(blob => {
        if (response.status === 401) {
          message.warn(` Session timeout. Please login out and login in again.`);
          return;
        }
        if (response.status !== 200) {
          if (handleStatusIsNot200) {
            handleStatusIsNot200();
          } else {
            message.warn(
              `File download error.status:${response.status} ,message: ${response.status}`
            );
          }
          return;
        }
        let fileName = response.headers.get('Content-Disposition');
        fileName = fileName || defFileName || 'report.xlsx';
        fileName = fileName.replace('attachment;filename=', '');
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fileName);
        } else {
          const blobUrl = window.URL.createObjectURL(blob);
          const aElement = document.createElement('a');
          document.body.appendChild(aElement);
          aElement.style.display = 'none';
          aElement.href = blobUrl;
          aElement.download = fileName || defFileName;
          aElement.click();
          document.body.removeChild(aElement);
        }
      });
    })
    .finally(() => loading.close());
};

export default download;
