import moment from 'moment';

const PRODUCT_TYPE_ATTRACTION = 'Attraction';
const PRODUCT_TYPE_VOUCHER = 'Voucher';
const PRODUCT_RULE_NAME = 'DefaultPrice';

export function getProductGroupByOfferProfile(offerProfile, productType) {
  let productGroupList = null;
  if (!offerProfile || !offerProfile.productGroup) {
    productGroupList = [];
  } else {
    offerProfile.productGroup.forEach(productGroupInfo => {
      if (productGroupInfo.productType === productType) {
        productGroupList = productGroupInfo.productGroup;
      }
    });
  }
  return productGroupList;
}

export function getPluProductByRuleName(productInfo, priceRuleName, validTimeFrom) {
  if (!productInfo || !productInfo.priceRule) {
    return null;
  }
  const pluProduct = [];
  const priceRuleList = productInfo.priceRule;
  priceRuleList.forEach(priceRule => {
    if (priceRule.priceRuleName === priceRuleName) {
      const productPriceList = priceRule.productPrice || [];
      productPriceList.forEach(productPrice => {
        if (productPrice.priceDate === validTimeFrom) {
          pluProduct.push(productPrice);
        }
      });
    }
  });
  return pluProduct;
}

export function getPluProductByRuleId(productInfo, priceRuleId, validTimeFrom) {
  const pluProductList = [];
  if (!productInfo || !productInfo.priceRule) {
    return null;
  }
  const priceRuleList = productInfo.priceRule;
  priceRuleList.forEach(priceRule => {
    if (priceRule.priceRuleId === priceRuleId) {
      const productPriceList = priceRule.productPrice || [];
      productPriceList.forEach(productPrice => {
        if (productPrice.priceDate === validTimeFrom) {
          pluProductList.push(productPrice);
        }
      });
    }
  });
  return pluProductList;
}

export function getProductList(offerProfile, productType, priceRuleId, validTimeFrom) {
  const attractionProductList = [];
  const productGroupList = getProductGroupByOfferProfile(offerProfile, PRODUCT_TYPE_ATTRACTION);
  productGroupList.forEach(productGroup => {
    if (productGroup.groupName === productType) {
      const productList = productGroup.products || [];
      productList.forEach(productInfo => {
        const pluProductList = getPluProductByRuleId(productInfo, priceRuleId, validTimeFrom);
        const pluProduct = pluProductList[0];
        if (pluProduct) {
          const productInventory =
            pluProduct.productInventory === -1 ? 2147483647 : pluProduct.productInventory;
          if (productInventory > 0) {
            attractionProductList.push(Object.assign({}, { ...productInfo }));
          }
        }
      });
    }
  });
  return attractionProductList;
}

export function calculateProductPrice(product, selectRuleId, sessionTime) {
  const { priceRule = [], productType, special = [], needChoiceCount } = product;
  const ruleId = selectRuleId || null;
  const { productPrice } = priceRule.find(({ priceRuleId }) => priceRuleId === ruleId);
  let price = 0;
  if (productType === 'Hotel') {
    const specialPriceArray = special.map(({ servicePriceValue }) => servicePriceValue);
    const specialTotalPrice =
      specialPriceArray.length > 0
        ? specialPriceArray.reduce((a, b) => parseFloat(a) + parseFloat(b))
        : 0;
    const hotelPrice = productPrice.map(
      ({ discountUnitPrice }) => parseFloat(discountUnitPrice) + parseFloat(specialTotalPrice)
    );
    price +=
      hotelPrice.length === 0 ? 0 : hotelPrice.reduce((a, b) => parseFloat(a) + parseFloat(b));
  } else if (productType === 'Attraction') {
    let productPriceList = [...productPrice];
    if (sessionTime) {
      productPriceList = productPrice.filter(({ priceTimeFrom }) => priceTimeFrom === sessionTime);
    }
    let priceArray = [...productPriceList];
    if (productPriceList.length > 1) {
      priceArray = productPriceList.filter(({ perPiece }) => (selectRuleId ? perPiece : !perPiece));
    }
    const attractionPrice = priceArray.map(
      ({ perPiece, discountUnitPrice }) =>
        parseFloat(perPiece || needChoiceCount) * parseFloat(discountUnitPrice)
    );
    price +=
      attractionPrice.length === 0
        ? 0
        : attractionPrice.reduce((a, b) => parseFloat(a) + parseFloat(b));
  }
  return price;
}

export function calculateProductGST(product, selectRuleId, sessionTime) {
  const { priceRule = [], productType, special = [], needChoiceCount } = product;
  const ruleId = selectRuleId || null;
  const { productPrice } = priceRule.find(({ priceRuleId }) => priceRuleId === ruleId);
  let price = 0;
  if (productType === 'Hotel') {
    const specialPriceArray = special.map(({ servicePriceValue }) => servicePriceValue);
    const specialTotalPrice =
      specialPriceArray.length > 0
        ? specialPriceArray.reduce((a, b) => parseFloat(a) + parseFloat(b))
        : 0;
    const hotelPrice = productPrice.map(
      ({ discountUnitPrice }) => parseFloat(discountUnitPrice) + parseFloat(specialTotalPrice)
    );
    price +=
      hotelPrice.length === 0 ? 0 : hotelPrice.reduce((a, b) => parseFloat(a) + parseFloat(b));
  } else if (productType === 'Attraction') {
    let productPriceList = [...productPrice];
    if (sessionTime) {
      productPriceList = productPrice.filter(({ priceTimeFrom }) => priceTimeFrom === sessionTime);
    }
    let priceArray = [...productPriceList];
    if (productPriceList.length > 1) {
      priceArray = productPriceList.filter(({ perPiece }) => (selectRuleId ? perPiece : !perPiece));
    }
    const attractionPrice = priceArray.map(
      ({ perPiece, gstAmount }) => parseFloat(perPiece || needChoiceCount) * parseFloat(gstAmount)
    );
    price +=
      attractionPrice.length === 0
        ? 0
        : attractionPrice.reduce((a, b) => parseFloat(a) + parseFloat(b));
  }
  return price;
}

export function getPamsPriceRuleIdByOfferProfile(offerProfile) {
  let priceRuleId = null;
  const productGroupList = getProductGroupByOfferProfile(offerProfile, PRODUCT_TYPE_ATTRACTION);
  productGroupList.forEach(productGroup => {
    if (priceRuleId === null && productGroup.groupName === PRODUCT_TYPE_ATTRACTION) {
      const productList = productGroup.products || [];
      productList.forEach(productInfo => {
        const priceRuleList = productInfo.priceRule;
        if (priceRuleList.length > 1) {
          // eslint-disable-next-line prefer-destructuring
          priceRuleId = priceRuleList[1].priceRuleId;
        }
      });
    }
  });
  return priceRuleId;
}

export function getAttractionProductList(offerProfile, validTimeFrom) {
  const priceRuleId = getPamsPriceRuleIdByOfferProfile(offerProfile);
  return getProductList(offerProfile, PRODUCT_TYPE_ATTRACTION, priceRuleId, validTimeFrom);
}

export function getVoucherProductList(offerProfile, validTimeFrom) {
  const priceRuleId = getPamsPriceRuleIdByOfferProfile(offerProfile);
  return getProductList(offerProfile, PRODUCT_TYPE_VOUCHER, priceRuleId, validTimeFrom);
}

export function getSumPriceOfOfferPaxOfferProfile(
  offerProfile,
  dateOfVisit,
  selectRuleId,
  sessionTime
) {
  if (!selectRuleId) {
    selectRuleId = getPamsPriceRuleIdByOfferProfile(offerProfile);
  }
  let sumPriceOfOfferPax = 0.0;
  let isChoiceConstrain = false;
  const { productGroup = [] } = offerProfile;
  productGroup.forEach(item => {
    if (item.productType === 'Attraction') {
      item.productGroup.forEach(item2 => {
        if (item2.groupName === 'Attraction' && item2.choiceConstrain === 'Fixed') {
          isChoiceConstrain = true;
          const { groupPrices = [] } = item2;
          const groupPriceSelect = groupPrices.find(
            groupPrice => groupPrice.priceRuleId === selectRuleId
          );
          sumPriceOfOfferPax = groupPriceSelect ? groupPriceSelect.totalPrice : 0.0;
        }
      });
    }
  });
  if (!isChoiceConstrain) {
    const attractionProductList = getAttractionProductList(offerProfile, dateOfVisit);
    if (attractionProductList && attractionProductList.length > 0) {
      attractionProductList.forEach(attractionProduct => {
        sumPriceOfOfferPax += calculateProductPrice(attractionProduct, selectRuleId, sessionTime);
      });
    }
  }
  return sumPriceOfOfferPax;
}

export function getSumGSTOfOfferPaxOfferProfile(
  offerProfile,
  dateOfVisit,
  selectRuleId,
  sessionTime
) {
  if (!selectRuleId) {
    selectRuleId = getPamsPriceRuleIdByOfferProfile(offerProfile);
  }
  let sumPriceOfOfferPax = 0.0;
  let isChoiceConstrain = false;
  const { productGroup = [] } = offerProfile;
  productGroup.forEach(item => {
    if (item.productType === 'Attraction') {
      item.productGroup.forEach(item2 => {
        if (item2.groupName === 'Attraction' && item2.choiceConstrain === 'Fixed') {
          isChoiceConstrain = true;
          const { groupPrices = [] } = item2;
          const groupPriceSelect = groupPrices.find(
            groupPrice => groupPrice.priceRuleId === selectRuleId
          );
          sumPriceOfOfferPax = groupPriceSelect ? groupPriceSelect.totalGSTAmount : 0.0;
        }
      });
    }
  });
  if (!isChoiceConstrain) {
    const attractionProductList = getAttractionProductList(offerProfile, dateOfVisit);
    if (attractionProductList && attractionProductList.length > 0) {
      attractionProductList.forEach(attractionProduct => {
        sumPriceOfOfferPax += calculateProductGST(attractionProduct, selectRuleId, sessionTime);
      });
    }
  }
  return sumPriceOfOfferPax;
}

export function getSessionTimeList(offerProfile, validTimeFrom) {
  const sessionTimeList = [];
  const attractionProductList = getAttractionProductList(offerProfile, validTimeFrom);
  attractionProductList.forEach(productInfo => {
    const pluProductList = getPluProductByRuleName(productInfo, PRODUCT_RULE_NAME, validTimeFrom);
    if (pluProductList && pluProductList.length > 0) {
      pluProductList.forEach(pluProduct => {
        const { priceTimeFrom } = pluProduct;
        const existSession = sessionTimeList.find(item => item.value === priceTimeFrom);
        if (priceTimeFrom && !existSession) {
          const dateOfVisitTimeStr = `${validTimeFrom} ${priceTimeFrom}`;
          const dateOfVisitTimeMoment = moment(dateOfVisitTimeStr, 'YYYY-MM-DD HH:mm:ss');
          const du = moment.duration(dateOfVisitTimeMoment - moment(), 'ms');
          const diffMilliseconds = du.asMilliseconds();
          if (diffMilliseconds > 0) {
            sessionTimeList.push({
              value: priceTimeFrom,
              label: priceTimeFrom,
            });
          }
        }
      });
    }
  });
  return sessionTimeList;
}

export function changeVoucherToAttraction(offerProfile) {
  const newOfferProfile = {
    ...offerProfile,
  };
  if (offerProfile && offerProfile.productGroup) {
    const newProductGroupInfo = [];
    let changeNew = false;
    offerProfile.productGroup.forEach(productGroupInfo => {
      if (productGroupInfo.productType === PRODUCT_TYPE_ATTRACTION) {
        const productGroupInfoNew = {
          ...productGroupInfo,
        };
        let haveAttraction = false;
        let haveVoucher = false;
        productGroupInfo.productGroup = productGroupInfo.productGroup || [];
        const productGroupNew = [];
        productGroupInfo.productGroup.forEach(productGroupItem => {
          if (productGroupItem.groupName === PRODUCT_TYPE_ATTRACTION) {
            haveAttraction = true;
          } else if (productGroupItem.groupName === PRODUCT_TYPE_VOUCHER) {
            haveVoucher = true;
            const productGroupItemNew = {
              ...productGroupItem,
            };
            productGroupItemNew.products = productGroupItem.products.map(item => {
              const itemNew = {
                ...item,
                onlyVoucher: true,
              };
              if (itemNew.attractionProduct.themeParkName) {
                // No. of Vouchers
                itemNew.attractionProduct.ageGroup = itemNew.attractionProduct.themeParkName;
              } else {
                itemNew.attractionProduct.ageGroup = 'No. of Vouchers';
              }
              return itemNew;
            });
            productGroupNew.push({
              ...productGroupItemNew,
              groupName: PRODUCT_TYPE_ATTRACTION,
            });
          }
        });
        if (haveVoucher && !haveAttraction) {
          productGroupInfoNew.productGroup = productGroupNew;
          newProductGroupInfo.push(productGroupInfoNew);
          changeNew = true;
        }
      }
    });
    if (changeNew) {
      newOfferProfile.isVoucher = true;
      newOfferProfile.productGroup = newProductGroupInfo;
    }
  }
  return newOfferProfile;
}

export function sortAttractionByAgeGroup(offerProfile) {
  const newOfferProfile = {
    ...offerProfile,
  };
  if (newOfferProfile && newOfferProfile.productGroup) {
    newOfferProfile.productGroup.forEach(productGroupInfo => {
      if (productGroupInfo.productType === PRODUCT_TYPE_ATTRACTION) {
        productGroupInfo.productGroup = productGroupInfo.productGroup || [];
        productGroupInfo.productGroup.forEach(productGroupItem => {
          if (productGroupItem.groupName === PRODUCT_TYPE_ATTRACTION) {
            productGroupItem.products.sort((a, b) => {
              const aName = a.attractionProduct.ageGroup || '';
              const bName = b.attractionProduct.ageGroup || '';
              return aName.charCodeAt(0) - bName.charCodeAt(0);
            });
          }
        });
      }
    });
  }
  return newOfferProfile;
}

export function getOfferCategory(themeparkCode) {
  const USS_SEAA_ACW_TAGS = [
    'Admissions',
    'VIP Experiences',
    'Express',
    'Promotions',
    'Group Ticketings',
    'Vouchers',
  ];
  const DOL_TAGS = [
    'Dolphin Adventure',
    'Dolphin Discovery',
    'Dolphin Encounter',
    'Dolphin Observer',
    'Dolphin Trek',
    'Dolphin VIP',
    'Dolphin Trainer For A Day',
    'Promotions',
  ];
  const UM_TAGS = [
    'Ray Bay',
    'Shark Encounter',
    'Sea Trek Adventure',
    'Shark Dive',
    'Open Ocean Dive',
  ];
  const OM_TAGS = ['Ocean Dream', 'Ocean Dream Glamping', 'Ocean Dream Group'];
  const VOUCHERS_TAGS = ['Meal Vouchers', 'Retail Vouchers', 'Others'];
  const HHN_TAGS = [
    'Admissions',
    'Express',
    'Frequent Fear Pass',
    'Rest In Peace (R.I.P) Experience',
    'Vouchers',
    'Others',
  ];
  let resultTags = [];
  switch (themeparkCode) {
    case 'USS':
    case 'SEA':
    case 'ACW': {
      resultTags = [...USS_SEAA_ACW_TAGS];
      break;
    }
    case 'DOL': {
      resultTags = [...DOL_TAGS];
      break;
    }
    case 'UMLE': {
      resultTags = [...UM_TAGS];
      break;
    }
    case 'ODA': {
      resultTags = [...OM_TAGS];
      break;
    }
    case 'VOUCHER': {
      resultTags = [...VOUCHERS_TAGS];
      break;
    }
    case 'HHN': {
      resultTags = [...HHN_TAGS];
      break;
    }

    default: {
      resultTags = [...USS_SEAA_ACW_TAGS];
    }
  }
  const categories = resultTags.map(item => ({
    tag: item,
    offer: [],
    products: [],
    bundleNames: [],
    showDetail: true,
  }));
  return categories;
}

export function sortAgeGroupByYouth(products = []) {
  const ageGroups = {
    'Adult': 0,
    'Youth': 1,
    'Child': 2,
    'Senior': 3,
    'Student': 4,
    'Helper': 5,
    null: 6,
  }
  const compare = (obj1, obj2) => {
    const a = obj1.attractionProduct.ageGroup;
    const b = obj2.attractionProduct.ageGroup;
    if (ageGroups[a] < ageGroups[b]) {
      return -1;
    }
    if (ageGroups[a] > ageGroups[b]) {
      return 1;
    }
    return 0;
  };
  return products.sort(compare);
}
