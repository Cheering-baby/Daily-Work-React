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

export function calculateAllProductPrice(products = [], selectRuleId) {
  let price = 0;
  products.forEach(item => {
    price += calculateProductPrice(item, selectRuleId);
  });
  return price.toFixed(2);
}

export function checkInventory(detail, offerQuantity, orderProducts = []) {
  const { productGroup, inventories } = detail;
  const { available } = inventories[0];
  const availableNew = available === -1 ? 100000000 : available;
  let enough = true;
  let offerConstrain;
  productGroup.forEach(item => {
    if (item.productType === 'Attraction') {
      item.productGroup.forEach(item2 => {
        if (item2.groupName === 'Attraction') {
          offerConstrain = item2.choiceConstrain;
          if (offerConstrain === 'Fixed') {
            if (offerQuantity > availableNew) {
              enough = false;
            }
            item2.products.forEach(item3 => {
              const { priceRule, needChoiceCount } = item3;
              const { productPrice } = priceRule[0];
              const { productInventory } = productPrice[0];
              const productInventoryNew = productInventory === -1 ? 100000000 : productInventory;
              if (offerQuantity * needChoiceCount > productInventoryNew) {
                enough = false;
              }
            });
          } else {
            orderProducts.forEach(orderProductItem => {
              const { ticketNumber, productNo } = orderProductItem;
              item2.products.forEach(item3 => {
                if (item3.productNo === productNo) {
                  const { priceRule, needChoiceCount } = item3;
                  const { productPrice } = priceRule[0];
                  const { productInventory } = productPrice[0];
                  const productInventoryNew =
                    productInventory === -1 ? 100000000 : productInventory;
                  if (ticketNumber * needChoiceCount > productInventoryNew) {
                    enough = false;
                  }
                }
              });
            });
          }
        }
      });
    }
  });

  return enough;
}
