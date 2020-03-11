import axios from 'axios';

export function commissionRuleSetupList(data) {
  return axios({
    url: `/pams/api/v1/agent/commission/template/queryCommissionlist`,
    method: 'POST',
    data,
  });
}
