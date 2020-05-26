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
  const attractionProductList = getAttractionProductList(offerProfile, dateOfVisit);
  let sumPriceOfOfferPax = 0.0;
  if (attractionProductList && attractionProductList.length > 0) {
    attractionProductList.forEach(attractionProduct => {
      sumPriceOfOfferPax += calculateProductPrice(attractionProduct, selectRuleId, sessionTime);
    });
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
            productGroupNew.push({
              ...productGroupItem,
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
      newOfferProfile.productGroup = newProductGroupInfo;
    }
  }
  return newOfferProfile;
}
