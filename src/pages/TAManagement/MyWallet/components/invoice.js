/* eslint-disable */
import React from 'react';
import ReactToPrint from 'react-to-print';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { Button, Modal } from 'antd';
import styles from './invoice.less';

@connect(({ invoice, loading }) => ({
  invoice,
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

  // eslint-disable-next-line no-unused-vars
  handleCancel = e => {
    console.log('handleCancel');
    this.setState({
      visible: false,
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
    } = this.props;

    const modelProps = {
      title: formatMessage({ id: 'INVOICE_TITLE' }),
      visible,
      width: 595,
      onCancel: this.handleCancel,
      footer: [
        <ReactToPrint
          key="submit"
          content={() => this.invoice}
          trigger={() => (
            <Button
              type="primary"
              style={{ backgroundColor: '#1890FF', width: '61px', borderRadius: '4px' }}
            >
              {formatMessage({ id: 'BTN_PRINT' })}
            </Button>
          )}
        />,
      ],
    };
    return (
      <Modal {...modelProps}>
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
              <div className={styles['invoice-log']} />
              <div className={styles['invoice-name']}>{profile.name}</div>
              <div className={styles['invoice-content']}>{profile.address}</div>
            </div>
            <div
              style={{
                display: 'block',
                position: 'absolute',
                left: '288px',
                boxSizing: 'borderBox',
                width: '259px',
                height: '100%',
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
                                className={`${styles['descriptionsItem-content']} ${styles['descriptions-item-content-pre-line']}`}
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
                      Total Amount(SGD)
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
                      {details.Total_Amount}
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
                        GST(20.00%)
                      </div>
                      <div className={styles['descriptions-item-content-internal-label']}>
                        Total Amount Inclusive GST
                      </div>
                    </td>
                    <td
                      colSpan={1}
                      className={`${styles['descriptions-table-item-content']} ${styles['descriptions-table-item-right']}`}
                    >
                      <div>{details.internal.befGstAmount}</div>
                      <div>{details.internal.gstAmount}</div>
                      <div>{details.internal.totalAmount}</div>
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
            <div className={styles['instructions-content']}>{paymentInstructions}</div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default Invoice;
