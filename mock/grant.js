const offerList = {
  resultCode: 0,
  resultMsg: 'success',
  result: {
    currentPage: 1,
    pageSize: 5,
    totalSize: 20,
    queryOfferList: [
      {
        No: '01',
        offerName: 'wwe',
        offerIdentify: '2342',
        Commison: '',
        plu: {
          No: '02',
          PLUCode: '23',
          PLUDescription: 'sdfsdfsf',
          Commison: '',
        },
      },
      {
        No: '03',
        offerName: 'wwe',
        offerIdentify: '2342',
        Commison: '',
        plu: {
          No: '04',
          PLUCode: '23',
          PLUDescription: 'sdfsdfsf',
          Commison: '',
        },
      },
    ],
  },
};

const api = 'POST /pams/api/v1/offer/offeridentify/queryOfferList';
module.exports = {
  [api](req, res) {
    res.json(offerList);
  },
};
