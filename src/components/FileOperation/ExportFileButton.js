/* eslint-disable */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Icon, Menu, message } from 'antd';
import excelURL from '../../assets/fileOperation/excel.svg';
import pdfURL from '../../assets/fileOperation/pdf.svg';
import csvURL from '../../assets/fileOperation/csv.svg';
import 'isomorphic-fetch';
import { stringify } from 'qs';
import UAAService from '@/uaa-npm';
import { getServicePath } from '@/utils/utils';

const detailStyles = {
  exportBtnClass: {
    height: '60px',
  },
  exportBtnLiClass: {
    float: 'left',
    clear: 'none',
  },
  exportBtnPClass: {
    padding: '0px',
    margin: '0px',
  },
};

class ExportFileButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loadingStatus: true,
      buttonDisabled: false,
    };
  }

  handleDownFile = (apiUrl, reqParamJson, defaultFileName) => {
    this.setState({
      loadingStatus: false,
      buttonDisabled: true,
    });
    const { requestMethod } = this.props;
    const url = requestMethod === 'GET' ? `${apiUrl}?${stringify(reqParamJson)}` : apiUrl;
    UAAService.request(url, {
      method: requestMethod,
      responseType: 'blob',
      body: reqParamJson,
    })
      .then(response => {
        const { success, file, filename = '', errorMsg } = response;
        if (!success) {
          message.warn('File download error,error message: ' + response.errorMsg);
          this.setState({
            loadingStatus: true,
            buttonDisabled: false,
          });
          return;
        }
        const blob = new Blob([file]);
        let fileName = filename.includes('filename=') ? filename.split('filename=')[1] : '';
        fileName = fileName ? fileName : defaultFileName;
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(blob, fileName);
        } else {
          const blobUrl = window.URL.createObjectURL(blob);
          const aElement = document.createElement('a');
          aElement.href = blobUrl;
          aElement.download = fileName ? fileName : 'test.xlsx';
          aElement.click();
        }
        this.setState({
          loadingStatus: true,
          buttonDisabled: false,
        });
      })
      .catch(error => {
        this.setState({
          loadingStatus: true,
          buttonDisabled: false,
        });
        message.warn('File download error,error message: ' + error);
      });
  };

  exportBtnClickEvent(menuParam) {
    const rwsUrl = getServicePath();

    const {
      defaultExcelFileName,
      defaultCSVFileName,
      excelServiceURL,
      pdfServiceURL,
      csvServiceURL,
    } = this.props;

    let apiUrl = rwsUrl + '';
    let reqParamJson = null;
    let defaultFileName = '';
    if (menuParam.key === 'excel') {
      apiUrl += excelServiceURL;
      reqParamJson = this.props.getExcelServiceParam();
      defaultFileName = defaultExcelFileName;
    } else if (menuParam.key === 'pdf') {
      apiUrl += pdfServiceURL;
      reqParamJson = this.props.getPDFServiceParam();
    } else if (menuParam.key === 'csv') {
      apiUrl += csvServiceURL;
      reqParamJson = this.props.getCSVServiceParam();
      defaultFileName = defaultCSVFileName;
    }

    if (reqParamJson === 'ERROR-STOP') {
      return;
    }
    this.handleDownFile(apiUrl, reqParamJson, defaultFileName);
  }

  render() {
    const { text, downFileBtnClass, showExcelBtn, showPDFBtn, showCSVBtn, style } = this.props;
    const { loadingStatus, buttonDisabled } = this.state;

    const downLoadMenu = (
      <Menu
        onClick={param => {
          this.exportBtnClickEvent(param);
        }}
        style={detailStyles.exportBtnClass}
      >
        {showExcelBtn && (
          <Menu.Item key="excel" style={detailStyles.exportBtnLiClass}>
            <img src={excelURL} style={{ paddingLeft: '6px' }} />
            <p style={detailStyles.exportBtnPClass}>Excel</p>
          </Menu.Item>
        )}
        {showPDFBtn && (
          <Menu.Item key="pdf" style={detailStyles.exportBtnLiClass}>
            <img src={pdfURL} style={{ paddingLeft: '2px' }} />
            <p style={detailStyles.exportBtnPClass}>PDF</p>
          </Menu.Item>
        )}
        {showCSVBtn && (
          <Menu.Item key="csv" style={detailStyles.exportBtnLiClass}>
            <img src={csvURL} style={{ paddingLeft: '2px' }} />
            <p style={detailStyles.exportBtnPClass}>CSV</p>
          </Menu.Item>
        )}
      </Menu>
    );

    if (buttonDisabled) {
      return (
        <Button style={style} disabled={buttonDisabled}>
          {loadingStatus ? 'Export' : 'loading...'}
          <Icon type="caret-down" style={{ fontSize: '7px' }} />
        </Button>
      );
    }

    return (
      <Dropdown overlay={downLoadMenu} trigger={['click']}>
        <Button style={style} disabled={buttonDisabled}>
          {loadingStatus ? 'Export' : 'loading...'}
          <Icon type="caret-down" style={{ fontSize: '7px' }} />
        </Button>
      </Dropdown>
    );
  }
}

ExportFileButton.proTypes = {
  api_url: PropTypes.isRequired,
};

ExportFileButton.defaultProps = {
  text: 'Template Download',
  requestMethod: 'GET',
  excelServiceURL: null,
  pdfServiceURL: null,
  csvServiceURL: null,
  showExcelBtn: true,
  showPDFBtn: true,
  showCSVBtn: true,
  defaultExcelFileName: 'downloadExcel.xlsx',
  defaultCSVFileName: 'downloadCSV.csv',
  getExcelServiceParam: () => {},
  getPDFServiceParam: () => {},
  getCSVServiceParam: () => {},
};

export default ExportFileButton;
