export function sortListByReportTypeForPreview(reportType) {
  let sortList = [];
  switch (reportType) {
    case 'SalesIncentiveReport':
      sortList = [{ key: 'orderOpenDate', value: 'ascend' }];
      break;
    case 'AttendanceIncentiveReport':
      sortList = [{ key: 'orderOpenDate', value: 'ascend' }];
      break;
    case 'FixedCommissionReport':
      sortList = [{ key: 'transactionDate', value: 'ascend' }];
      break;
    case 'ARAccountBalanceSummaryReport':
      sortList = [
        { key: 'customerName', value: 'ascend' },
        { key: 'transactionDate', value: 'ascend' },
      ];
      break;
    case 'E-WalletBalanceSummaryReport':
      sortList = [
        { key: 'customerName', value: 'ascend' },
        { key: 'transactionDate', value: 'ascend' },
      ];
      break;
    case 'ARAccountBalanceDetailReport':
      sortList = [{ key: 'transactionDate', value: 'ascend' }];
      break;
    case 'E-WalletAccountBalanceDetailReport':
      sortList = [{ key: 'transactionDate', value: 'ascend' }];
      break;
    case 'DetailedTransactionReport':
      sortList = [{ key: 'transactionDate', value: 'ascend' }];
      break;
    case 'AttractionTransactionReport':
      sortList = [{ key: 'transactionDate', value: 'ascend' }];
      break;
    case 'AttractionsSalesReport':
      sortList = [{ key: 'orderDate', value: 'ascend' }];
      break;
    case 'TaxInvoiceReport':
      sortList = [{ key: 'invoiceDate', value: 'ascend' }];
      break;
    case 'AttractionExpiredReport':
      sortList = [{ key: 'expiredDate', value: 'ascend' }];
      break;
    case 'AttractionAttendanceReport':
      sortList = [{ key: 'ticketUsageDate', value: 'ascend' }];
      break;
    case 'BuyerCreatedTaxInvoiceReport':
      sortList = [{ key: 'bciTaxInvoiceDate', value: 'ascend' }];
      break;
    default:
      break;
  }
  return sortList;
}

export function sortListByReportTypeForCommon(reportType) {
  let sortList = [];
  switch (reportType) {
    case 'SalesIncentiveReport':
      sortList = [{ key: 'orderOpenDate', value: 'ASC' }];
      break;
    case 'AttendanceIncentiveReport':
      sortList = [{ key: 'orderOpenDate', value: 'ASC' }];
      break;
    case 'FixedCommissionReport':
      sortList = [{ key: 'transactionDate', value: 'ASC' }];
      break;
    case 'ARAccountBalanceSummaryReport':
      sortList = [
        { key: 'customerName', value: 'ASC' },
        { key: 'transactionDate', value: 'ASC' },
      ];
      break;
    case 'E-WalletBalanceSummaryReport':
      sortList = [
        { key: 'customerName', value: 'ASC' },
        { key: 'transactionDate', value: 'ASC' },
      ];
      break;
    case 'ARAccountBalanceDetailReport':
      sortList = [{ key: 'transactionDate', value: 'ASC' }];
      break;
    case 'E-WalletAccountBalanceDetailReport':
      sortList = [{ key: 'transactionDate', value: 'ASC' }];
      break;
    case 'DetailedTransactionReport':
      sortList = [{ key: 'transactionDate', value: 'ASC' }];
      break;
    case 'AttractionTransactionReport':
      sortList = [{ key: 'transactionDate', value: 'ASC' }];
      break;
    case 'AttractionsSalesReport':
      sortList = [{ key: 'orderDate', value: 'ASC' }];
      break;
    case 'TaxInvoiceReport':
      sortList = [{ key: 'invoiceDate', value: 'ASC' }];
      break;
    case 'AttractionExpiredReport':
      sortList = [{ key: 'expiredDate', value: 'ASC' }];
      break;
    case 'AttractionAttendanceReport':
      sortList = [{ key: 'ticketUsageDate', value: 'ASC' }];
      break;
    case 'BuyerCreatedTaxInvoiceReport':
      sortList = [{ key: 'bciTaxInvoiceDate', value: 'ASC' }];
      break;
    default:
      break;
  }
  return sortList;
}

export const reportViewList = [
  'SalesIncentiveReport',
  'AttendanceIncentiveReport',
  'FixedCommissionReport',
  'AttractionsSalesReport',
  'ARAccountBalanceSummaryReport',
  'E-WalletBalanceSummaryReport',
  'ARAccountBalanceDetailReport',
  'E-WalletAccountBalanceDetailReport',
  'TaxInvoiceReport',
];
