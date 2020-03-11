import axios from 'axios';

export function offlineList(data) {
  return axios({
    url: `/pams/api/v1/agent/commission/template/queryOfflinelist`,
    method: 'POST',
    data,
  });
}
