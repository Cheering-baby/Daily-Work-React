/* eslint-disable */
import React from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { Button, message, Modal, Spin } from 'antd';
import html2pdf from 'html2pdf.js';
import styles from './index.less';

const logoImage = require('@/assets/image/logi-mini.png');

@connect(({ walletInvoice, taWalletMgr, global, loading }) => ({
  walletInvoice,
  taWalletMgr,
  global,
  loading: loading.effects['walletInvoice/fetchInvoiceDetail'],
}))
class WalletInvoice extends React.PureComponent {
  state = {
    visible: false,
  };

  componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.onRef(this);
  }

  open = id => {
    const {
      dispatch,
      taWalletMgr: { taId },
    } = this.props;
    dispatch({
      type: 'walletInvoice/fetchInvoiceDetail',
      payload: {
        accountBookFlowId: id,
        taId,
      },
    });
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  exportPdf = fileName => {
    const element = document.getElementById('invoice-doc');
    const opt = {
      margin: 0.5,
      filename: `${fileName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, width: 750 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };
    if (element) {
      html2pdf()
        .set(opt)
        .from(element)
        .save();
    }
  };

  render() {
    const { visible } = this.state;
    const {
      walletInvoice: {
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
      width: 760,
      onCancel: this.handleCancel,
      maskClosable: false,
      footer: [
        <Button
          key="download"
          type="primary"
          className={styles.downloadBtn}
          onClick={e => {
            this.exportPdf(descriptionsData['Tax_Invoice']);
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
              id="invoice-doc"
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
                    width: '400px',
                    height: '100%',
                  }}
                >
                  <div className={styles['invoice-logo']}>
                    <img src={logoImage} alt="logo" width="100%" height="auto" />
                  </div>
                  <div className={styles['company-address']}>{profile.taId}</div>
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
                    left: '63%',
                    boxSizing: 'borderBox',
                    width: '37%',
                    height: '100%',
                    right: '0px',
                  }}
                >
                  <div className={styles.descriptions}>
                    <div className={styles['descriptions-title']}>
                      {formatMessage({ id: 'INVOICE_TITLE' })}
                    </div>
                    <div className={styles['descriptions-view']}>
                      <table style={{ width: '100%' }}>
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
                        <td />
                        <td className={styles['descriptions-table-item-content']}>
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
              <div style={{ width: '100%', marginTop: '190px', borderTop: '1px solid #000' }}>
                <div className={styles['instructions-title']}>
                  <div className={styles['instructions-title-label']}>Payment Instructions</div>
                </div>
                <div className={styles['instructions-content']}>
                  Payment should be made by cheque, GIRO or T/T quoting invoice numbers being paid
                  to "Resorts World at Sentosa Pte Ltd";
                  <br />
                  Bank: DBS Bank Ltd, Address: 12 Marina Boulevard, Marina Bay Financial Centre
                  Tower 3, Singapore 018982
                  <br />
                  Bank Code: 7171, Branch Code: 003, Account No: 003-910526-6, Swift Code: DBSSSGSG
                </div>
                <div className={styles['instructions-signature-line']}>
                  <div className={styles['instructions-signature']}>
                    Resorts World at Sentosa Pte Ltd.
                    <br />
                    3, Lim Teck Kim Road #10-01, Genting Centre, Singapore 088934
                  </div>
                  <div className={styles['instructions-footer']}>{paymentInstructions.footer}</div>
                </div>
              </div>
            </div>
          </Spin>
        </Modal>
      </React.Fragment>
    );
  }
}

export default WalletInvoice;
