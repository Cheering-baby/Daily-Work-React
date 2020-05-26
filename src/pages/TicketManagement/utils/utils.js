import { isNullOrUndefined } from 'util';

export function arrToString(arr = []) {
  let str1 = '';
  arr.forEach(item => {
    str1 += `${item},`;
  });
  const str2 = str1.substr(0, str1.length - 1);
  return str2;
}

export function calculatePerPiece(i, productPrice = []) {
  let number = 0;
  for (let j = 0; j <= i; j += 1) {
    number += productPrice[j].perPiece;
  }
  return number;
}

export function calculatePerPiecePrice(i, productPrice = []) {
  let price = 0;
  for (let j = 0; j <= i; j += 1) {
    price += productPrice[j].perPiece * productPrice[j].discountUnitPrice;
  }
  return price;
}

export function calculateTicketPrice(ticketNumber, productPrice = []) {
  if (isNullOrUndefined(ticketNumber) || ticketNumber === '' || ticketNumber === 0) return '0.00';
  const len = productPrice.length;
  const ticketNumberC = Number(ticketNumber);
  if (len === 1) {
    const price = productPrice[0].discountUnitPrice * ticketNumberC;
    return price.toFixed(2);
  }
  if (len > 1) {
    let price = 0;
    productPrice.forEach((_item, index) => {
      if (ticketNumberC >= calculatePerPiece(index, productPrice)) {
        price =
          calculatePerPiecePrice(index, productPrice) +
          (ticketNumberC - calculatePerPiece(index, productPrice)) *
            productPrice[index].discountUnitPrice;
      } else if (index > 0) {
        price =
          calculatePerPiecePrice(index - 1, productPrice) +
          (ticketNumberC - calculatePerPiece(index - 1, productPrice)) *
            productPrice[index - 1].discountUnitPrice;
      } else {
        price = productPrice[0].discountUnitPrice * ticketNumberC;
      }
    });
    return price.toFixed(2);
  }
  return '0.00';
}

export function isSessionProduct(priceRuleId, product) {
  const { priceRule = [] } = product;
  const priceRuleFilter = priceRule.filter(item2 => item2.priceRuleId === priceRuleId);
  const currentPriceRule = priceRuleFilter[0];
  const { productPrice } = currentPriceRule;
  const isSession = productPrice.some(({ priceTimeFrom }) => !!priceTimeFrom);
  return isSession;
}

export function calculateProductPrice(product, selectRuleId, session) {
  const { priceRule = [], productType, special = [], needChoiceCount } = product;
  const ruleId = selectRuleId || null;
  let { productPrice } = priceRule.find(({ priceRuleId }) => priceRuleId === ruleId);
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
    if (session && isSessionProduct(selectRuleId, product)) {
      productPrice = productPrice.filter(({ priceTimeFrom }) => priceTimeFrom === session);
    }
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

export function calculateAllProductPrice(products = [], selectRuleId, session, detail) {
  let price = 0;
  products.forEach(item => {
    if (session && isSessionProduct(selectRuleId, item)) {
      price += calculateProductPrice(item, selectRuleId, session);
    } else if (isSessionProduct(selectRuleId, item)) {
      const { priceRule, needChoiceCount } = item;
      const filterPriceRule = priceRule.filter(({ priceRuleId }) => priceRuleId === selectRuleId);
      const { productPrice } = filterPriceRule[0];
      const { priceTimeFrom } = productPrice.find(
        ({ productInventory }) => productInventory / needChoiceCount >= 1
      );
      price += calculateProductPrice(item, selectRuleId, priceTimeFrom);
    } else {
      price += calculateProductPrice(item, selectRuleId);
    }
  });
  if (detail) {
    let isFixedOffer = false;
    const { productGroup = [] } = detail;
    productGroup.forEach(item => {
      if (item.productType === 'Attraction') {
        item.productGroup.forEach(item2 => {
          if (item2.groupName === 'Attraction' && item2.choiceConstrain === 'Fixed') {
            isFixedOffer = true;
          }
          if (item2.groupName === 'Voucher') {
            item2.products.forEach(itemProduct => {
              if (itemProduct.attractionProduct.voucherQtyType === 'By Package' && isFixedOffer) {
                price += calculateProductPrice(itemProduct, itemProduct.priceRule[1].priceRuleId);
              }
            });
          }
        });
      }
    });
  }
  return price.toFixed(2);
}

export function checkInventory(detail, orderProducts = []) {
  const { productGroup, inventories } = detail;
  const { available } = inventories[0];
  let enough = true;
  let allProductTickets = 0;
  productGroup.forEach(item => {
    if (item.productType === 'Attraction') {
      item.productGroup.forEach(item2 => {
        if (item2.groupName === 'Attraction') {
          orderProducts.forEach(orderProductItem => {
            const { ticketNumber, productNo, session } = orderProductItem;
            item2.products.forEach(item3 => {
              if (item3.productNo === productNo) {
                const { priceRule, needChoiceCount } = item3;
                const { productPrice, priceRuleId } = priceRule[1];
                let inventory = 0;
                if (session) {
                  inventory = productPrice.find(({ priceTimeFrom }) => priceTimeFrom === session)
                    .productInventory;
                } else if (isSessionProduct(priceRuleId, item3)) {
                  const productInventoryItems = productPrice.map(
                    ({ productInventory }) => productInventory
                  );
                  productInventoryItems.forEach(
                    // eslint-disable-next-line no-return-assign
                    itemInventory =>
                      (inventory =
                        itemInventory > inventory || itemInventory === -1
                          ? itemInventory
                          : inventory)
                  );
                } else {
                  inventory = productPrice[0].productInventory;
                }
                if (inventory !== -1 && ticketNumber * needChoiceCount > inventory) {
                  enough = false;
                }
                if (ticketNumber) {
                  allProductTickets += ticketNumber * needChoiceCount;
                }
              }
            });
          });
        }
      });
    }
  });
  if (available !== -1 && available < allProductTickets) {
    enough = false;
  }
  return enough;
}

export function checkNumOfGuestsAvailable(numOfGuests, detail) {
  let enough = true;
  const {
    productGroup = [],
    offerBundle = [{}],
    inventories = [],
    offerBasicInfo: { offerMinQuantity, offerMaxQuantity },
  } = detail;
  const { available } = inventories[0];
  let attractionGroup;
  productGroup.forEach(item => {
    if (item.productType === 'Attraction') {
      item.productGroup.forEach(item2 => {
        if (item2.groupName === 'Attraction') {
          attractionGroup = item2;
        }
      });
    }
  });
  if (!attractionGroup) {
    return false;
  }
  const {
    choiceConstrain,
    products = [],
    minProductQuantity,
    maxProductQuantity,
  } = attractionGroup;
  if (choiceConstrain === 'Fixed' || offerBundle[0].bundleName) {
    if (offerMinQuantity > numOfGuests || offerMaxQuantity < numOfGuests) {
      enough = false;
    }
    let oneOfferTickets = 0;
    products.forEach(item => {
      const { needChoiceCount, priceRule = [] } = item;
      const { productPrice, priceRuleId } = priceRule[1];
      let inventory = 0;
      if (isSessionProduct(priceRuleId, item)) {
        const productInventoryItems = productPrice.map(({ productInventory }) => productInventory);
        productInventoryItems.forEach(
          // eslint-disable-next-line no-return-assign
          itemInventory =>
            (inventory =
              itemInventory > inventory || itemInventory === -1 ? itemInventory : inventory)
        );
      } else {
        inventory = productPrice[0].productInventory;
      }
      oneOfferTickets += needChoiceCount;
      if (inventory !== -1 && inventory / needChoiceCount < numOfGuests) {
        enough = false;
      }
    });
    if (available !== -1 && available / oneOfferTickets < numOfGuests) {
      enough = false;
    }
  } else {
    let min = 1;
    let minNeedChoiceCount = 1;
    if (numOfGuests < minProductQuantity || numOfGuests > maxProductQuantity) {
      enough = false;
    }
    products.forEach(item => {
      const { needChoiceCount, priceRule = [] } = item;
      const { productPrice, priceRuleId } = priceRule[1];
      let inventory = 0;
      if (isSessionProduct(priceRuleId, item)) {
        const productInventoryItems = productPrice.map(({ productInventory }) => productInventory);
        productInventoryItems.forEach(
          // eslint-disable-next-line no-return-assign
          itemInventory =>
            (inventory =
              itemInventory > inventory || itemInventory === -1 ? itemInventory : inventory)
        );
      } else {
        inventory = productPrice[0].productInventory;
      }
      if (inventory !== -1 && inventory / needChoiceCount < numOfGuests) {
        enough = false;
      }
      if (inventory / needChoiceCount > min) {
        min = inventory / needChoiceCount;
        minNeedChoiceCount = needChoiceCount;
      }
    });
    if (available !== -1 && available / minNeedChoiceCount < numOfGuests) {
      enough = false;
    }
  }
  return enough;
}

export function filterSessionProduct(priceRuleId, session, products = []) {
  if (!session) return products;
  const filterProduct = products.filter(item => {
    const { priceRule = [] } = item;
    const priceRuleFilter = priceRule.filter(item2 => item2.priceRuleId === priceRuleId);
    const currentPriceRule = priceRuleFilter[0];
    const { productPrice } = currentPriceRule;
    const isSession = productPrice.some(({ priceTimeFrom }) => !!priceTimeFrom);
    if (isSession) {
      return productPrice.find(({ priceTimeFrom }) => priceTimeFrom === session);
    }
    return true;
  });
  return filterProduct;
}

export function checkSessionProductInventory(numOfGuests, session, product = {}) {
  let enough = true;
  const { needChoiceCount, priceRule = [] } = product;
  const { productPrice } = priceRule[1];
  productPrice.forEach(({ priceTimeFrom, productInventory }) => {
    if (
      priceTimeFrom === session &&
      productInventory !== -1 &&
      productInventory / needChoiceCount < numOfGuests
    ) {
      enough = false;
    }
  });
  return enough;
}
