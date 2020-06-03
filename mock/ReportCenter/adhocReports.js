const reportListData = {
  resultCode: '0',
  resultMsg: 'success',
  result: [
    {
      reportName: 'Sales Incentive Report',
      reportType: 'SalesIncentiveReport',
      updateTime: 1586758387760,
    },
    {
      reportName: 'Attendance Incentive Report',
      reportType: 'AttendanceIncentiveReport',
      updateTime: 1586758387760,
    },
    {
      reportName: 'Fixed Commission report',
      reportType: 'FixedCommissionReport',
      updateTime: 1586758387760,
    },
    {
      reportName: 'Attractions Sales report',
      reportType: 'AttractionsSalesReport',
      updateTime: 1586758387760,
    },
    {
      reportName: 'TA account balance summary report for AR account',
      reportType: 'TaArAccountBalanceSummaryReport',
      updateTime: 1586758387760,
    },
    {
      reportName: 'TA account balance summary report for e-Wallet',
      reportType: 'TaEwalletAccountBalanceSummaryReport',
      updateTime: 1586758387760,
    },
    {
      reportName: 'TA account balance detail report for AR account',
      reportType: 'TaArAccountBalanceDetailReport',
      updateTime: 1586758387760,
    },
    {
      reportName: 'TA account balance detail report for e-Wallet',
      reportType: 'TaEwalletAccountBalanceDetailReport',
      updateTime: 1586758387760,
    },
    {
      reportName: 'Tax Invoice Listing Report',
      reportType: 'TaxInvoiceReport',
      updateTime: 1586758387760,
    },
    {
      reportName: 'DETAILED TRANSATION REPORT',
      reportType: 'DetailedTransactionReport',
      updateTime: 1586758387760,
    },
    {
      reportName: 'Attraction Transaction Report',
      reportType: 'AttractionTransactionReport',
      updateTime: 1586758387760,
    },
    {
      reportName: 'Attraction Expired report',
      reportType: 'AttractionExpiredReport',
      updateTime: 1586758387760,
    },
    {
      reportName: 'Attraction Attendance report',
      reportType: 'AttractionAttendanceReport',
      updateTime: 1586758387760,
    },
  ],
};

const filterListData = {
  resultCode: '0',
  resultMsg: 'success',
  result: [
    {
      filterKey: 'customerName',
      filterName: 'Customer Name',
      filterType: 'INPUT',
    },
    {
      filterKey: 'themeParkCode',
      filterName: 'Attraction',
      filterType: 'MULTIPLE_SELECT',
    },
    {
      filterKey: 'categoryType',
      filterName: 'Category Type',
      filterType: 'SELECT',
    },
    {
      filterKey: 'customerGroup',
      filterName: 'Customer Group',
      filterType: 'MULTIPLE_SELECT',
    },
    {
      filterKey: 'taMarket',
      filterName: 'TA Market',
      filterType: 'MULTIPLE_SELECT',
      dictType: '10',
      dictSubType: '1006',
      dictDbName: 'AGENT',
    },
    {
      filterKey: 'orderOpenDate',
      filterName: 'Order Open Date',
      filterType: 'RANGE_PICKER',
    },
  ],
};

const basicReportListData = {
  resultCode: '0',
  resultMsg: 'success',
  result: {
    header: null,
    data: {
      pageInfo: {
        pageSize: 10,
        currentPage: 1,
        totalSize: 1,
      },
      column: {
        source: 'Source',
        transactionDate: 'Transaction Date',
        countryOfResidence: 'Country of residence',
        categoryType: 'Category Type',
        customerGroup: 'Customer Group',
        customerName: 'Customer Name',
        peopleSoftCustomerId: 'PeopleSoft Customer ID',
        pamsCustomerId: 'PAMS Customer ID',
        galaxyCustomerId: 'Galaxy Customer ID',
        gstIndicator: 'GST Indicator',
        commissionableTa: 'Commissionable TA',
        pamsBookingId: 'PAMS Booking ID',
        galaxyOrderId: 'Galaxy Booking ID',
        attraction: 'Attraction',
        plu: 'PLU',
        pluDescription: 'PLU Description',
        offerCode: 'Offer Code',
        itemDescription: 'Item Description',
        ageGroup: 'Adult/Child/Senior',
        invoiceAmountBeforeGst: 'Invoice Amount Before GST',
        gstAmount: 'GST Amount',
        invoiceAmountWithGst: 'Invoice Amount With GST',
        ticketValidityStartDate: 'Ticket Validity Start Date',
        ticketQuantity: 'Ticket Quantity',
        commissionAmountBeforeGst: 'Commission Amount Before GST',
        commissionGstAmount: 'Commission GST Amount',
        commissionAmountIncGst: 'Commission Amount Including GST',
        commissionPaymentDate: 'Commission Payment Date',
        commissionPaymentId: 'Commission Payment Id',
        commissionPaymentType: 'Commission Payment Type',
        paymentMode: 'Payment Mode',
        paymentAmount: 'Payment Amount',
        paymentAmountPerTicket: 'Payment Amount Per Ticket',
        commissionRatePerTicketIncGst: 'Commission Rate per Ticket Incl. GST',
      },
      dataList: [
        {
          source: 'akjhkjh',
          transactionDate: '16-Apr-2020 10:26:19',
          countryOfResidence: 'china',
          categoryType: 'asdf',
          customerGroup: 'lkj',
          customerName: 'asdfasdf',
          peopleSoftCustomerId: '12341',
          pamsCustomerId: '3543245',
          galaxyCustomerId: '1345345',
          gstIndicator: 'Y',
          commissionableTa: 'Y',
          pamsBookingId: '12345',
          galaxyOrderId: '264523',
          attraction: 'lasj',
          plu: 'asdf',
          pluDescription: 'alsdfkj',
          offerCode: 'lkajsdf',
          itemDescription: 'aldfkj',
          ageGroup: 'Ads',
          invoiceAmountBeforeGst: '1,432.00',
          gstAmount: '12,342.00',
          invoiceAmountWithGst: '234,234.00',
          ticketValidityStartDate: '16-Apr-2020 10:27:22',
          ticketQuantity: 1,
          commissionAmountBeforeGst: '345.00',
          commissionGstAmount: '1,345.00',
          commissionAmountIncGst: '15.00',
          commissionPaymentDate: '16-Apr-2020 10:27:41',
          commissionPaymentId: '32452345',
          commissionPaymentType: 'asdf',
          paymentMode: 'asdf',
          paymentAmount: '2,345.00',
          paymentAmountPerTicket: '23,436.00',
          commissionRatePerTicketIncGst: '2,345.00',
        },
      ],
    },
    footer: null,
  },
};

const dictListData = {
  resultCode: '0',
  resultMsg: 'success',
  result: [
    {
      dictName: 'Inbound',
      dictId: '01',
    },
    {
      dictName: 'Outbound',
      dictId: '02',
    },
    {
      dictName: 'Malaysia',
      dictId: '03',
    },
  ],
};

const dictListEmptyData = {
  resultCode: '0',
  resultMsg: 'success',
  result: [],
};

const success = {
  resultCode: '0',
  resultMsg: 'success',
};

export default {
  'GET /b2b/report/v1/ad-hoc/list': reportListData,
  'GET /b2b/report/v1/common/queryFilter': filterListData,
  'POST /b2b/report/v1/common/queryReportByFilter': basicReportListData,
  'POST /b2b/report/v1/common/exportReportByFilter': success,
  'GET /agent/common/queryDictionary': (req, res) => {
    if (String(req.query.dictType) === '10' && String(req.query.dictSubType) === '1006') {
      res.send(dictListData);
    } else {
      res.send(dictListEmptyData);
    }
  },
};
