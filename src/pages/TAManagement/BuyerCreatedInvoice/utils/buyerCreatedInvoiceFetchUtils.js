// eslint-disable-next-line import/prefer-default-export
export const transform2ListParams = (filterOptions = {}, sortOptions, currentPage, pageSize) => {
  const { agentCode, taName, invoiceDate } = filterOptions;

  const params = {
    size: pageSize,
    page: currentPage,
  };

  if (agentCode) {
    Object.assign(params, { agentCode: agentCode.trim() });
  }

  if (taName) {
    Object.assign(params, { taName });
  }

  if (invoiceDate instanceof Array) {
    if (invoiceDate.length >= 1) {
      Object.assign(params, {
        invoiceDateFrom: invoiceDate[0].startOf('date').valueOf(),
      });
    }
    if (invoiceDate.length >= 2) {
      Object.assign(params, {
        invoiceDateTo: invoiceDate[1].endOf('date').valueOf(),
      });
    }
  }

  return params;
};
