export default function serialize(obj) {
  const ary = [];
  for (const p in obj)
    if (Object.prototype.hasOwnProperty.call(obj, p) && obj[p]) {
      ary.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
    }
  return `?${ary.join('&')}`;
}

export function getNumOfPaxInPackage(attraction) {
  let resultValue = 0;
  if (attraction && attraction.ticketNumOfPax) {
    try {
      const ticketNumOfPaxList = JSON.parse(attraction.ticketNumOfPax);
      if (ticketNumOfPaxList && ticketNumOfPaxList.length > 0) {
        resultValue = ticketNumOfPaxList[0].qty || 1;
      }
    } catch (e) {
      console.log('getNumOfPaxInPackage error');
      console.log(e);
    }
  }
  return resultValue;
}

export function getRefundThemePark(groupList) {
  let refundMark = false;
  const existUsedList = groupList.filter(
    item =>
      item.themeParks &&
      item.themeParks.join(',') === 'UMLE' &&
      item.visualIdStatus === 'true' &&
      item.ticketType !== 'Voucher'
  );
  if (existUsedList.length > 0) {
    refundMark = true;
  }
  return refundMark;
}

export function checkFixOfferRefund(groupList, vidResultObject, refundDolList) {
  if (vidResultObject.attractionGroupType === 'Fixed' && vidResultObject.isNotPackage) {
    const existUsedList = groupList.filter(
      item =>
        item.themeParks &&
        item.themeParks.join(',') === 'UMLE' &&
        item.visualIdStatus === 'true' &&
        item.ticketType !== 'Voucher'
    );
    if (existUsedList.length > 0) {
      existUsedList.forEach(existItem => {
        if (existItem.vidGroup === vidResultObject.vidGroup) {
          if (
            vidResultObject.themeParks &&
            vidResultObject.themeParks.join(',') === 'DOL' &&
            vidResultObject.visualIdStatus === 'false' &&
            vidResultObject.ticketType !== 'Voucher'
          ) {
            vidResultObject.disabled = false;
            refundDolList.push(vidResultObject);
          }
        }
      });
    }
  }
}

export function checkVoucherByTicketOrByPackage(refundDolList, vidResultList) {
  if (refundDolList.length > 0) {
    const voucherList = [];
    const pluList = [];
    for (let i = 0; i < refundDolList.length; i += 1) {
      let checkVoucherFlag = '';
      for (let a = 0; a < vidResultList.length; a += 1) {
        if (refundDolList[i].vidGroup === vidResultList[a].vidGroup) {
          if (vidResultList[a].ticketType === 'Voucher') {
            voucherList.push(vidResultList[a]);
          } else {
            pluList.push(vidResultList[a]);
          }
          checkVoucherFlag = vidResultList[a].voucherQtyType;
        }
      }
      if (checkVoucherFlag === 'By Ticket') {
        const refundVoucherNumber = voucherList.length / pluList.length;
        for (let x = 0; x < refundVoucherNumber; x += 1) {
          for (let j = 0; j < voucherList.length; j += 1) {
            if (refundDolList[i].vidGroup === voucherList[j].vidGroup) {
              if (
                voucherList[j].visualIdStatus === 'false' &&
                voucherList[j].disabled &&
                voucherList[j].attractionGroupType === 'Fixed' &&
                voucherList[j].isNotPackage
              ) {
                voucherList[j].disabled = false;
                break;
              }
            }
          }
        }
      }
    }
  }
}
