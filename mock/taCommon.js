export default {
  'GET /pams/profile/queryTaInfo': {
    resultCode: '0',
    resultMsg: 'success',
    result: {
      customerInfo: {
        contactInfo: {
          salutation: '04', // 01: Mr/ 02: Mrs/ 03: Ms/ 04: Dr/05: Prof
          firstName: 'Content',
          lastName: 'Content',
          chiefExecutiveName: 'Gussie Conner',
          email: 'fipbazoh@zez.lv',
          phone: '339-6261',
          country: '63',
        },
        companyInfo: {
          companyName: 'ClippingerChevroletOldsmobile',
          registrationNo: 'Clippinger Chevrolet Oldsmobile',
          organizationRole: '01', // 01: OTA/ 02: Wholesaler/ 03: Tour Operator/ 04: Retail agent
          incorporationDate: '20391205', // yyyymmdd
          city: '591',
          country: '63',
          address: '1959 Auto Center Dr.',
          postalCode: '91723',
          travelAgentNo: '2345123451234512',
          isGstRegIndicator: '1',
          gstRegNo: '9-98qdqw56465d65a44564',
          gstEffectiveDate: '20391205',
          // category: 'OTA',
          // customerGroup: 'Outbound',
          category: '01',
          customerGroup: '02',
          applyArAccount: 'N',
          topNationalities: '63,65',
          productList: [
            {
              productType: '02', // 01: hotel 02:attractions
              rwsVolume: '',
              otherVolume: '200',
            },
            {
              productType: '01', // 01: hotel 02:attractions
              rwsVolume: '500',
              otherVolume: '',
            },
          ],
          fileList: [
            {
              field: '01',
              name: 'taFile_f2113087ec1148089b8efd59741c3664_1581520642021_certificate.p12',
              path:
                'agent/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/',
              sourceName: '12312321321qweqweqw312312312certificate.p12',
            },
            {
              field: '02',
              name: 'taFile_f2113087ec1148089b8efd59741c3664_1581520642021_certificate.p12',
              path:
                'agent/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/',
              sourceName: '12312321321312312312certificate.p12',
            },
          ],
          arAccountFileList: [
            {
              field: '03',
              name: 'taFile_f2113087ec1148089b8efd59741c3664_1581520642021_certificate.p12',
              path:
                'agent/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/arAccountFile/202002/arAccountFile/202002/taFile/202002/',
              sourceName: 'certificate.p12',
            },
          ],
        },
      },
      otherInfo: {
        billingInfo: {
          companyName: 'ClippingerChevroletOldsmobile',
          address: '1959 Auto Center Dr.',
          city: '591',
          country: '63',
          postalCode: '91723',
          phoneCountry: '63',
          phone: '339-6261',
          email: 'fipbazoh@zez.lv',
          salutation: '04', // Mr/Mrs/Ms/Dr/Prof.
          firstName: 'Content',
          lastName: 'Content',
        },
        financeContactList: [
          {
            contactPerson: 'Dr. Lee',
            contactNo: '215243r5234r5234',
            contactEmail: 'fipbazoh@zez.lv',
            financeType: '01',
          },
          {
            contactPerson: 'Dr. Lee',
            contactNo: '215243r5234r5234',
            contactEmail: 'fipbazoh@zez.lv',
            financeType: '02',
          },
        ],
      },
      status: '05',
      remark:
        "The picture is not clear, the phone can't be reachedThe picture is not clear, the phone can't be reachedThe picture is not clear, the phone can't be reachedThe picture is not clear, the phone can't be reached",
    },
  },
  'GET /pams/profile/queryMappingInfo': {
    resultCode: '0',
    resultMsg: 'success',
    result: {
      status: '01',
      effectiveDate: '20191005',
      operaEwallet: '',
      operaArCredit: '',
      galaxyEwallet: '',
      galaxyArCredit: '',
      peoplesoftEwalletId: '215243r5234r5234',
      peoplesoftArAccountId: '154142353245234',
      arAccountCommencementDate: '',
      arAccountEndDate: '',
      securityDepositAmount: '1000000000.78',
      ewalletFixedThreshold: '1000000000.78',
      arFixedThreshold: '12312312',
      guaranteeAmount: '1231231',
      guaranteeExpiryDate: '20990101',
      currency: 'GSD',
      creditTerm: '1231213',
      creditLimit: '11231231',
      salesManager: '',
      productName: '',
    },
  },
  'GET /pams/profile/queryAccountInfo': {
    resultCode: '0',
    resultMsg: 'success',
    result: {
      peoplesoftEwalletId: '154142353245234',
      peoplesoftArAccountId: '154142353245234',
      createdBy: 'test.rm',
      createdTime: '20200105',
      modifiedBy: 'Main TA',
      modifiedTime: '20200105',
      lastActivityDate: '20191005',
      arCreditBalance: '1000000000.78',
      ewalletIdBalance: '1000000000.78',
    },
  },
  'GET /pams/common/queryDictionary': (req, res) => {
    if (String(req.query.dictType) === '1') {
      res.send({
        resultCode: '0',
        resultMsg: 'success',
        result: [
          { dictId: '01', dictName: 'Mr' },
          { dictId: '02', dictName: 'Mrs' },
          { dictId: '03', dictName: 'Ms' },
          { dictId: '04', dictName: 'Dr' },
          { dictId: '05', dictName: 'Prof' },
        ],
      });
    } else if (String(req.query.dictType) === '2') {
      res.send({
        resultCode: '0',
        resultMsg: 'success',
        result: [
          { dictId: '63', dictName: 'china' },
          { dictId: '65', dictName: 'singapore' },
          { dictId: '67', dictName: 'malaysia' },
        ],
      });
    } else if (String(req.query.dictType) === '3') {
      res.send({
        resultCode: '0',
        resultMsg: 'success',
        result: [
          { dictId: '591', dictName: 'fuzhou' },
          { dictId: '592', dictName: 'xiamen' },
          { dictId: '593', dictName: 'lingdeng' },
          { dictId: '594', dictName: 'putian' },
          { dictId: '595', dictName: 'quzhou' },
          { dictId: '596', dictName: 'zhanzhou' },
          { dictId: '597', dictName: 'nanping' },
          { dictId: '598', dictName: 'shanming' },
          { dictId: '599', dictName: 'longyan' },
        ],
      });
    } else if (String(req.query.dictType) === '4') {
      res.send({
        resultCode: '0',
        resultMsg: 'success', // 01: OTA/ 02: Wholesaler/ 03: Tour Operator/ 04: Retail agent
        result: [
          { dictId: '01', dictName: 'OTA' },
          { dictId: '02', dictName: 'Wholesaler' },
          { dictId: '03', dictName: 'Tour Operator' },
          { dictId: '04', dictName: 'Retail agent' },
        ],
      });
    } else if (String(req.query.dictType) === '5') {
      res.send({
        resultCode: '0',
        resultMsg: 'success',
        result: [
          { dictId: '01', dictName: 'OTA' },
          { dictId: '02', dictName: 'TA' },
          { dictId: '03', dictName: 'Reseller' },
          { dictId: '04', dictName: 'MICE/Corporate' },
        ],
      });
    } else if (String(req.query.dictType) === '6' && String(req.query.dictSubType) === '01') {
      res.send({
        resultCode: '0',
        resultMsg: 'success',
        result: [
          { dictId: '01', dictName: 'Inbound' },
          { dictId: '02', dictName: 'Outbound' },
          { dictId: '03', dictName: 'Malaysia' },
        ],
      });
    } else if (String(req.query.dictType) === '6' && String(req.query.dictSubType) === '02') {
      res.send({
        resultCode: '0',
        resultMsg: 'success',
        result: [
          { dictId: '04', dictName: 'Inbound' },
          { dictId: '05', dictName: 'Outbound' },
          { dictId: '06', dictName: 'Malaysia' },
        ],
      });
    } else if (String(req.query.dictType) === '6' && String(req.query.dictSubType) === '03') {
      res.send({
        resultCode: '0',
        resultMsg: 'success',
        result: [],
      });
    } else if (String(req.query.dictType) === '6' && String(req.query.dictSubType) === '04') {
      res.send({
        resultCode: '0',
        resultMsg: 'success',
        result: [
          { dictId: '07', dictName: 'Media & Advertising' },
          { dictId: '08', dictName: 'Manufacturing Processes & Engineering' },
          { dictId: '09', dictName: 'Electronics' },
          { dictId: '10', dictName: 'Semi-Conductors' },
          { dictId: '11', dictName: 'MLM' },
        ],
      });
    } else {
      res.send({
        resultCode: '0',
        resultMsg: 'success',
        result: [],
      });
    }
  },

  'GET /pams/userDictionary': (req, res) => {
    if (String(req.query.dicName) === 'Category') {
      res.send({
        resultCode: '0',
        resultMsg: 'success',
        resultData: {
          dictionaryInfos: [
            {
              id: '54',
              dicType: 5,
              dicName: 'Category',
              dicValue: 'OTA',
              status: '0',
              comments: 'Category',
            },
            {
              id: '55',
              dicType: 5,
              dicName: 'Category',
              dicValue: 'TA',
              status: '0',
              comments: 'Category',
            },
            {
              id: '56',
              dicType: 5,
              dicName: 'Category',
              dicValue: 'Reseller',
              status: '0',
              comments: 'Category',
            },
            {
              id: '57',
              dicType: 5,
              dicName: 'Category',
              dicValue: 'MICE/Corporate',
              status: '0',
              comments: 'Category',
            },
          ],
        },
      });
    } else if (String(req.query.dicName) === 'OTA') {
      res.send({
        resultCode: '0',
        resultMsg: 'success',
        resultData: {
          dictionaryInfos: [
            {
              id: '58',
              dicType: 6,
              dicName: 'OTA',
              dicValue: 'Inbound',
              status: '0',
              comments: 'Customer Group',
            },
            {
              id: '59',
              dicType: 6,
              dicName: 'OTA',
              dicValue: 'Outbound',
              status: '0',
              comments: 'Customer Group',
            },
            {
              id: '60',
              dicType: 6,
              dicName: 'OTA',
              dicValue: 'Malaysia',
              status: '0',
              comments: 'Customer Group',
            },
          ],
        },
      });
    } else {
      res.send({
        resultCode: '0',
        resultMsg: 'success',
        resultData: {
          dictionaryInfos: [],
        },
      });
    }
  },

  'POST /pams/profile/TARegistration': {
    resultCode: '0',
    resultMsg: 'success',
    result: {
      taId: '1111111',
    },
  },
};
