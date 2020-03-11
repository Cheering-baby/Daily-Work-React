const offerIdentifyList = {
  resultCode: 0,
  resultMsg: 'success',
  result: {
    currentPage: 1,
    pageSize: 5,
    totalSize: 20,
    offerIdentifyList: [
      {
        id: '430',
        offerNo: 'offer-200218143450006796114',
        offerName: 'hua021802',
        offerIdentify: '2020021802',
        validDateFrom: 1581955200000,
        validDateTo: 1583251200000,
        status: 'PUBLISH',
        contentId: null,
        publishTime: 1582010458000,
        unpublishTime: null,
        templateSetting: null,
        createBy: '3',
      },
      {
        id: '429',
        offerNo: 'offer-200218143314006795114',
        offerName: 'hua021801',
        offerIdentify: '2020021801',
        validDateFrom: 1581955200000,
        validDateTo: 1583683200000,
        status: 'NEW',
        contentId: null,
        publishTime: null,
        unpublishTime: null,
        templateSetting: null,
        createBy: '3',
      },
      {
        id: '428',
        offerNo: 'offer-200218142229006794114',
        offerName: 'Add On Child with Express',
        offerIdentify: 'UKSUSSFBAPCHEXPFIT',
        validDateFrom: 1580486400000,
        validDateTo: 1582905600000,
        status: 'PUBLISH',
        contentId: null,
        publishTime: 1582007962000,
        unpublishTime: null,
        templateSetting: null,
        createBy: '3',
      },
    ],
  },
};

const detail = 'POST /pams/api/v1/offer/offeridentify/queryOfferIdentifyList';
module.exports = {
  [detail](req, res) {
    res.json(offerIdentifyList);
  },
};
