/* eslint-disable */
import React from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { Button, message, Modal, Spin } from 'antd';
import styles from './invoice.less';

const logoImage = require('@/assets/image/logi-mini.png');

@connect(({ invoice, global, loading }) => ({
  invoice,
  global,
  loading: loading.effects['invoice/fetchInvoiceDetail'],
}))
class Invoice extends React.PureComponent {
  state = {
    visible: false,
  };

  componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.onRef(this);
  }

  open = id => {
    const { dispatch } = this.props;
    dispatch({ type: 'invoice/fetchInvoiceDetail', payload: { accountBookFlowId: id } });
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  downloadFileEvent = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'invoice/fetchDownloadInvoice',
      payload: { accountBookFlowId: id },
    }).then(result => {
      if (result) {
        if (result) {
          const urlArray = result.split('?');
          const pointIndex = urlArray[0].lastIndexOf('.');
          const fileType = urlArray[0].substring(pointIndex + 1);
          this.getBlob(result).then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const aElement = document.createElement('a');
            document.body.appendChild(aElement);
            aElement.style.display = 'none';
            aElement.href = blobUrl;
            aElement.download = 'invoice.' + fileType;
            aElement.click();
            document.body.removeChild(aElement);
          });
        } else {
          message.error('Download invoice error!');
        }
      }
    });
  };

  getBlob = url => {
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        }
      };
      xhr.send();
    });
  };

  render() {
    const { visible } = this.state;
    const {
      invoice: {
        profile = {},
        descriptions = [],
        descriptionsData = {},
        details = {},
        paymentInstructions,
      },
      loading,
    } = this.props;
    const modelProps = {
      title: formatMessage({ id: 'INVOICE_TITLE' }),
      visible,
      width: 740,
      onCancel: this.handleCancel,
      footer: [
        <Button
          type="primary"
          className={styles.downloadBtn}
          onClick={e => {
            e.preventDefault();
            this.downloadFileEvent(details.id);
          }}
        >
          {formatMessage({ id: 'BTN_DOWNLOAD' })}
        </Button>,
      ],
    };
    return (
      <React.Fragment>
        <Modal {...modelProps} className={styles.invoiceModal}>
          <Spin spinning={loading}>
            <div
              className={styles['invoice-container']}
              ref={el => {
                this.invoice = el;
              }}
            >
              <div className={styles.overview}>
                <div
                  style={{
                    display: 'block',
                    position: 'absolute',
                    boxSizing: 'borderBox',
                    width: '288px',
                    height: '100%',
                  }}
                >
                  <div className={styles['invoice-logo']}>
                    <img src={logoImage} alt="logo" width="100%" height="auto" />
                  </div>
                  <div className={styles['company-name']}>{profile.name}</div>
                  <div className={styles['company-address']}>
                    {profile.address} <br />
                    {profile.countryName} {profile.postalCode}
                  </div>
                  <br />
                  <div className={styles['company-address']}>
                    <b>Attn:</b> {profile.primaryFinanceContactName}{' '}
                  </div>
                </div>
                <div
                  style={{
                    display: 'block',
                    position: 'relative',
                    left: '50%',
                    boxSizing: 'borderBox',
                    width: '50%',
                    height: '100%',
                    right: '0px',
                  }}
                >
                  <div className={styles.descriptions}>
                    <div className={styles['descriptions-title']}>
                      {formatMessage({ id: 'INVOICE_TITLE' })}
                    </div>
                    <div className={styles['descriptions-view']}>
                      <table>
                        <tbody>
                          {descriptions.map((item, index) => {
                            return (
                              // eslint-disable-next-line react/no-array-index-key
                              <tr
                                className={styles['description-row']}
                                key={`description-row_${index}`}
                              >
                                <td colSpan={1} className={styles['descriptions-item']}>
                                  <span
                                    className={styles['descriptions-item-label']}
                                    key={`descriptions-item-label_${item.label}`}
                                  >
                                    {item.label}
                                  </span>
                                  <span
                                    className={`${styles['descriptions-item-content']} ${styles['descriptions-item-content-pre-line']}`}
                                    key={`descriptions-item-content_${item.dataKey}`}
                                  >
                                    {descriptionsData[item.dataKey]}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles['descriptions-table']}>
                <div className={styles['descriptions-table-view']}>
                  <table style={{ tableLayout: 'auto' }}>
                    <tbody>
                      <tr className={styles['descriptions-table-row']}>
                        <th colSpan={1} className={styles['descriptions-table-item-label']}>
                          Date
                        </th>
                        <th colSpan={1} className={styles['descriptions-table-item-label']}>
                          Line Description
                        </th>
                        <th
                          colSpan={1}
                          className={`${styles['descriptions-table-item-label']} ${styles['descriptions-table-item-right']}`}
                        >
                          <div className={styles['descriptions-table-width']}>
                            <span>{'Total Amount'}</span>
                          </div>
                          <div className={styles['descriptions-table-width']}>
                            <span>{'(SGD)'}</span>
                          </div>
                        </th>
                      </tr>
                      <tr className={styles['descriptions-table-row']}>
                        <td colSpan={1} className={styles['descriptions-table-item-content']}>
                          {details.Date}
                        </td>
                        <td colSpan={1} className={styles['descriptions-table-item-content']}>
                          {details.Line_Description}
                        </td>
                        <td
                          colSpan={1}
                          className={`${styles['descriptions-table-item-content']} ${styles['descriptions-table-item-right']}`}
                        >
                          {Number(details.Total_Amount)
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={2}
                          className={`${styles['descriptions-table-item-content']} ${styles['descriptions-table-item-right']}`}
                        >
                          <div className={styles['descriptions-item-content-internal-label']}>
                            Total Amount Before GST
                          </div>
                          <div className={styles['descriptions-item-content-internal-label']}>
                            GST ({details.taxRatio})
                          </div>
                          <div className={styles['descriptions-item-content-internal-label']}>
                            Total Amount Inclusive GST
                          </div>
                        </td>
                        <td
                          colSpan={1}
                          className={`${styles['descriptions-table-item-content']} ${styles['descriptions-table-item-right']}`}
                        >
                          <div>
                            {Number(details.internal.befGstAmount)
                              .toFixed(2)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          </div>
                          <div>
                            {Number(details.internal.gstAmount)
                              .toFixed(2)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          </div>
                          <div>
                            {Number(details.internal.totalAmount)
                              .toFixed(2)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <div className={styles['instructions-title']}>
                  <div className={styles['instructions-title-label']}>Payment Instructions</div>
                </div>
                <div className={styles['instructions-content']}>{paymentInstructions.content}</div>
                <div className={styles['instructions-signature-line']}>
                  <div className={styles['instructions-signature']}>
                    {paymentInstructions.party}
                    <br />
                    {paymentInstructions.address}
                    <div className={styles['instructions-footer']}>
                      {paymentInstructions.footer}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Spin>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Invoice;
