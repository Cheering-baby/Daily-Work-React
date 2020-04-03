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
  let pluProduct = null;
  if (!productInfo || !productInfo.priceRule) {
    return null;
  }
  const priceRuleList = productInfo.priceRule;
  priceRuleList.forEach(priceRule => {
    if (priceRule.priceRuleName === priceRuleName) {
      const productPriceList = priceRule.productPrice || [];
      productPriceList.forEach(productPrice => {
        if (productPrice.priceDate === validTimeFrom) {
          pluProduct = productPrice;
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

export function calculateProductPrice(product, selectRuleId) {
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
    const priceArray = productPrice.filter(({ perPiece }) => (selectRuleId ? perPiece : !perPiece));
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

export function getSumPriceOfOfferPaxOfferProfile(offerProfile, dateOfVisit, selectRuleId) {
  if (!selectRuleId) {
    selectRuleId = getPamsPriceRuleIdByOfferProfile(offerProfile);
  }
  const attractionProductList = getAttractionProductList(offerProfile, dateOfVisit);
  let sumPriceOfOfferPax = 0.0;
  if (attractionProductList && attractionProductList.length > 0) {
    attractionProductList.forEach(attractionProduct => {
      sumPriceOfOfferPax += calculateProductPrice(attractionProduct, selectRuleId);
    });
  }
  return sumPriceOfOfferPax;
}

export function getSessionTimeList(offerProfile, validTimeFrom) {
  const sessionTimeList = [];
  const attractionProductList = getAttractionProductList(offerProfile, validTimeFrom);
  attractionProductList.forEach(productInfo => {
    const pluProduct = getPluProductByRuleName(productInfo, PRODUCT_RULE_NAME, validTimeFrom);
    const { priceTimeFrom } = pluProduct;
    const existSession = sessionTimeList.find(item => item.value === priceTimeFrom);
    if (priceTimeFrom && !existSession) {
      sessionTimeList.push({
        value: priceTimeFrom,
        label: priceTimeFrom,
      });
    }
  });
  return sessionTimeList;
}
