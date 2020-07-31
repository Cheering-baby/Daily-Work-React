import { isNullOrUndefined } from 'util';
import { Attraction, Voucher } from './constants';

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
  const { priceRule = [], needChoiceCount } = product;
  const ruleId = selectRuleId || null;
  let { productPrice } = priceRule.find(({ priceRuleId }) => priceRuleId === ruleId);
  let price = 0;
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
  return price;
}

export function calculateProductPriceGst(product, selectRuleId, session) {
  const { priceRule = [], needChoiceCount } = product;
  const ruleId = selectRuleId || null;
  let { productPrice } = priceRule.find(({ priceRuleId }) => priceRuleId === ruleId);
  let price = 0;
  if (session && isSessionProduct(selectRuleId, product)) {
    productPrice = productPrice.filter(({ priceTimeFrom }) => priceTimeFrom === session);
  }
  const priceArray = productPrice.filter(({ perPiece }) => (selectRuleId ? perPiece : !perPiece));
  const attractionPrice = priceArray.map(
    ({ perPiece, gstAmount }) => parseFloat(perPiece || needChoiceCount) * parseFloat(gstAmount)
  );
  price +=
    attractionPrice.length === 0
      ? 0
      : attractionPrice.reduce((a, b) => parseFloat(a) + parseFloat(b));
  return price;
}

export function calculateAllProductPrice(products = [], selectRuleId, session, detail) {
  let price = 0;
  let isChoiceConstrain = false;
  if (detail) {
    const { productGroup = [] } = detail;
    productGroup.forEach(item => {
      if (item.productType === 'Attraction') {
        item.productGroup.forEach(item2 => {
          if (item2.groupName === 'Attraction' && item2.choiceConstrain === 'Fixed') {
            isChoiceConstrain = true;
            const { groupPrices = [] } = item2;
            const groupPriceSelect = groupPrices.find(
              groupPrice => groupPrice.priceRuleId === selectRuleId
            );
            price = groupPriceSelect ? groupPriceSelect.totalPrice : 0.0;
          }
        });
      }
    });
  }
  if (!isChoiceConstrain) {
    products.forEach(item => {
      const { sessionTime } = item;
      if (isSessionProduct(selectRuleId, item)) {
        price += calculateProductPrice(item, selectRuleId, sessionTime || session);
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
  }
  return price.toFixed(2);
}

export function calculateAllProductPriceGst(products = [], selectRuleId, session, detail) {
  let price = 0;
  let isChoiceConstrain = false;
  if (detail) {
    const { productGroup = [] } = detail;
    productGroup.forEach(item => {
      if (item.productType === 'Attraction') {
        item.productGroup.forEach(item2 => {
          if (item2.groupName === 'Attraction' && item2.choiceConstrain === 'Fixed') {
            isChoiceConstrain = true;
            const { groupPrices = [] } = item2;
            const groupPriceSelect = groupPrices.find(
              groupPrice => groupPrice.priceRuleId === selectRuleId
            );
            price = groupPriceSelect ? groupPriceSelect.totalGSTAmount : 0.0;
          }
        });
      }
    });
  }
  if (!isChoiceConstrain) {
    products.forEach(item => {
      const { sessionTime } = item;
      if (isSessionProduct(selectRuleId, item)) {
        price += calculateProductPriceGst(item, selectRuleId, sessionTime || session);
      } else if (isSessionProduct(selectRuleId, item)) {
        const { priceRule, needChoiceCount } = item;
        const filterPriceRule = priceRule.filter(({ priceRuleId }) => priceRuleId === selectRuleId);
        const { productPrice } = filterPriceRule[0];
        const { priceTimeFrom } = productPrice.find(
          ({ productInventory }) => productInventory / needChoiceCount >= 1
        );
        price += calculateProductPriceGst(item, selectRuleId, priceTimeFrom);
      } else {
        price += calculateProductPriceGst(item, selectRuleId);
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
  if(!detail || Object.keys(detail).length === 0) {
    return false;
  }
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
  const filterProduct = [];
  products.forEach(item => {
    const { priceRule = [] } = item;
    const priceRuleFilter = priceRule.filter(item2 => item2.priceRuleId === priceRuleId);
    const currentPriceRule = priceRuleFilter[0];
    const { productPrice } = currentPriceRule;
    const isSession = productPrice.some(({ priceTimeFrom }) => !!priceTimeFrom);
    if (isSession) {
      if (productPrice.find(({ priceTimeFrom }) => priceTimeFrom === session)) {
        filterProduct.push({
          ...item,
          sessionTime: session,
        });
      }
    } else {
      filterProduct.push({
        ...item,
        sessionTime: null,
      });
    }
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

export function multiplePromise(arr, max, callback) {
  const maxParallelTime = max || 20;
  const handleQueue = [];
  const parallelArr = arr || [];
  let handleIndex = 0;
  let result = 0;

  function toHandle() {
    if (handleIndex === parallelArr.length) {
      return Promise.resolve();
    }
    // eslint-disable-next-line no-plusplus
    const one = parallelArr[handleIndex++];
    const oneP = one();
    oneP.id = `${Math.ceil(Math.random() * 1000)}X${Math.ceil(Math.random() * 1000)}`;
    oneP.then(() => {
      const testArr = [...handleQueue];
      let index = 0;
      testArr.forEach((item, indexItem) => {
        if (item.id === oneP.id) {
          index = indexItem;
        }
      });
      handleQueue.splice(index, 1);
      // eslint-disable-next-line no-plusplus
      result++;
      if (result === parallelArr.length) {
        Promise.all(handleQueue).then(() => {
          callback();
        });
      }
    });
    handleQueue.push(oneP);
    let p = Promise.resolve();
    if (handleQueue.length >= maxParallelTime) {
      p = Promise.race(handleQueue);
    }
    return p.then(() => {
      toHandle();
    });
  }

  toHandle();
}

export function dealSessionArr(target = []) {
  const sessionArr = [];
  const resultSession = [];
  const doExchange = function doExchangeFunc(arr, index) {
    for (let j = 0; j < arr[index].length; j += 1) {
      resultSession[index] = arr[index][j];
      if (index !== arr.length - 1) {
        doExchange(arr, index + 1);
      } else {
        sessionArr.push([...resultSession]);
      }
    }
  };
  doExchange(target, 0);
  return sessionArr;
}

export function getVoucherProducts(detail) {
  const { productGroup } = detail;
  let voucherProducts = [];
  productGroup.forEach(itemProduct => {
    if (itemProduct.productType === Attraction) {
      itemProduct.productGroup.forEach(attractionProduct => {
        if (attractionProduct.groupName === Voucher) {
          voucherProducts = attractionProduct.products;
        }
      });
    }
  });
  return voucherProducts;
}

export function getAttractionProducts(detail) {
  const { productGroup } = detail;
  let attractionProducts = [];
  productGroup.forEach(itemProduct => {
    if (itemProduct.productType === Attraction) {
      itemProduct.productGroup.forEach(attractionProduct => {
        if (attractionProduct.groupName === Attraction) {
          attractionProducts = attractionProduct.products;
        }
      });
    }
  });
  return attractionProducts;
}

export function getOfferConstrain(detail) {
  const { productGroup } = detail;
  let offerConstrain;
  productGroup.forEach(item => {
    if (item.productType === Attraction) {
      item.productGroup.forEach(item2 => {
        if (item2.groupName === Attraction) {
          offerConstrain = item2.choiceConstrain;
        }
      });
    }
  });
  return offerConstrain;
}

export function getProductLimitInventory(detail) {
  let min;
  let max;
  const { productGroup } = detail;
  productGroup.forEach(item => {
    if (item.productType === Attraction) {
      item.productGroup.forEach(item2 => {
        if (item2.groupName === Attraction) {
          min = item2.minProductQuantity;
          max = item2.maxProductQuantity;
        }
      });
    }
  });
  return [min, max];
}

export function findArrSame(arr = []) {
  let temArr = arr[0] || [];
  for (let j = 1; j < arr.length; j += 1) {
    const arr1 = temArr;
    const arr2 = arr[j];
    temArr = arr1.filter(element1 => arr2.some(element2 => element1 === element2));
  }
  return temArr;
}
