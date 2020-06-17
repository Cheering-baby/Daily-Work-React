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

const bindingList = {
  resultCode: 0,
  resultMsg: 'success',
  result: {
    queryOfferList: [
      {
        bindingFlg: null,
        commissionList: null,
        commodityCode: null,
        commodityDescription: null,
        commodityIdentifier: null,
        commodityName: 'USS',
        commodityOrder: null,
        commoditySpecId: 'offer-200520121330799580',
        commodityType: 'Offer',
        subCommodityList: [
          {
            bindingFlg: null,
            commissionList: null,
            commodityCode: 'USSPAADTSKT000006M09',
            commodityDescription: 'USS AP TIC V9 6M TSK – ADULT 0120',
            commodityIdentifier: null,
            commodityName: 'ADULT',
            commodityOrder: null,
            commoditySpecId: 'USSPAADTSKT000006M09',
            commodityType: 'Plu',
            subCommodityList: [],
            themeParkCode: null,
          },
        ],
        themeParkCode: null,
      },
      {
        bindingFlg: null,
        commissionList: null,
        commodityCode: null,
        commodityDescription: null,
        commodityIdentifier: null,
        commodityName: 'V9 6M',
        commodityOrder: null,
        commoditySpecId: 'offer-200515014144591212',
        commodityType: 'Offer',
        subCommodityList: [
          {
            bindingFlg: null,
            commissionList: null,
            commodityCode: 'USSPAADT',
            commodityDescription: 'USS AP TIC V9 6M',
            commodityIdentifier: null,
            commodityName: 'USS AP TIC V9 6M',
            commodityOrder: null,
            commoditySpecId: 'USS1DADPAMS000004M01',
            commodityType: 'Plu',
            subCommodityList: [],
            themeParkCode: null,
          },
        ],
        themeParkCode: null,
      },
    ],
    page: {
      pageSize: null,
      currentPage: null,
      totalSize: 0,
    },
  },
};

const api = 'POST /pams/api/v1/offer/offeridentify/queryOfferList';
const binding = 'POST /b2b/agent/v1/commission/binding/queryGrantBindingList';
module.exports = {
  [api](req, res) {
    res.json(offerList);
  },
  [binding](req, res) {
    res.json(bindingList);
  },
};
