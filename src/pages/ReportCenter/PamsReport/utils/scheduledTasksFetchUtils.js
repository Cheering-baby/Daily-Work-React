export const transform2ListParams = (filterOptions = {}, sortOptions, currentPage, pageSize) => {
  const { reportName, selectedReceivers = [] } = filterOptions;

  const listReceiver = selectedReceivers.map(item => item.userCode);

  const params = {
    pageInfo: {
      pageSize,
      currentPage,
    },
  };

  if (reportName) {
    Object.assign(params, { jobName: reportName });
  }

  if (listReceiver.length !== 0) {
    Object.assign(params, { listReceiver });
  }

  return params;
};

export const transform2CreateParams = values => {
  const { id, jobName, jobCron, jobDesc, executorSql } = values;

  let { listReceiver } = values;
  listReceiver = listReceiver.map(item => ({
    userCode: item.userCode,
    userType: item.userType,
  }));

  const params = {
    jobName,
    jobCron,
    jobDesc,
    executorSql,
    listReceiver,
  };

  if (id) Object.assign(params, { id });

  return params;
};
