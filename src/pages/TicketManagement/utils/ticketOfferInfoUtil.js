import {message} from "antd";
import {isNvl} from "@/utils/utils";

const PRODUCT_TYPE_ATTRACTION = 'Attraction';
const PRODUCT_TYPE_VOUCHER = 'Voucher';
const PRODUCT_RULE_NAME = 'DefaultPrice';

export function getProductGroupByOfferProfile(offerProfile,groupType) {

  let productGroupList = null;
  if (!offerProfile || !offerProfile.productGroup) {
    productGroupList = [];
  } else {
    offerProfile.productGroup.forEach(productGroupInfo => {
      if (productGroupInfo && productGroupInfo.productType === groupType) {
        productGroupList = productGroupInfo.productGroup;
      }
    });
  }
  return productGroupList;

}

export function getPluProductByRule(productInfo,priceRuleName,validTimeFrom) {

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

export function getProductList(offerProfile,productType,validTimeFrom) {

  let attractionProductList = [];
  const productGroupList = getProductGroupByOfferProfile(offerProfile,productType);
  productGroupList.forEach(productGroup => {
    const productList = productGroup.products || [];
    productList.forEach(productInfo=>{
      const pluProduct = getPluProductByRule(productInfo,PRODUCT_RULE_NAME,validTimeFrom);
      if (pluProduct) {
        const productInventory = pluProduct.productInventory === -1 ? 2147483647 : pluProduct.productInventory;
        if (productInventory>0) {
          attractionProductList.push(Object.assign({},
            {...productInfo}))
        }
      }
    });
  });
  return attractionProductList;

}

export function getAttractionProductList(offerProfile,validTimeFrom) {
  return getProductList(offerProfile,PRODUCT_TYPE_ATTRACTION,validTimeFrom);
}

export function getVoucherProductList(offerProfile,validTimeFrom) {
  return getProductList(offerProfile,PRODUCT_TYPE_VOUCHER,validTimeFrom);
}

export function getSessionTimeList(offerProfile,validTimeFrom) {

  const sessionTimeList = [];
  const attractionProductList = getAttractionProductList(offerProfile,validTimeFrom);
  attractionProductList.forEach(productInfo => {
    const pluProduct = getPluProductByRule(productInfo,PRODUCT_RULE_NAME,validTimeFrom);
    const { priceTimeFrom } = pluProduct;
    const existSession = sessionTimeList.find(
      item => item.value === priceTimeFrom
    );
    if (priceTimeFrom && !existSession) {
      sessionTimeList.push({
        value: priceTimeFrom,
        label: priceTimeFrom,
      });
    }
  });

  return sessionTimeList;

}
