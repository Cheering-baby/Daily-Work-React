const REQUEST_200 = 'The server returned the requested data successfully';
const REQUEST_201 = 'New or modified data successfully';
const REQUEST_202 = 'A request has entered the background queue ';
const REQUEST_204 = 'Delete Successfully';
const REQUEST_400 =
  'An error was made in the request and the server did not create or modify the data';
const REQUEST_401 = 'No Permission';
const REQUEST_403 = 'Users are authorized, but access is prohibited';
const REQUEST_404 =
  'The request was made for a record that did not exist and the server did not operate';
const REQUEST_406 = 'The requested format is not available';
const REQUEST_410 = 'The requested resource is permanently deleted and will not be retrieved';
const REQUEST_422 = 'validation Error';
const REQUEST_500 = 'An error occurred on the server. Please check the server';
const REQUEST_502 = 'Gateway Error';
const REQUEST_503 = 'Services Rre Unavailable';
const REQUEST_504 = 'Gateway Timeout';

const codeMessage = {
  200: REQUEST_200,
  201: REQUEST_201,
  202: REQUEST_202,
  204: REQUEST_204,
  400: REQUEST_400,
  401: REQUEST_401,
  403: REQUEST_403,
  404: REQUEST_404,
  406: REQUEST_406,
  410: REQUEST_410,
  422: REQUEST_422,
  500: REQUEST_500,
  502: REQUEST_502,
  503: REQUEST_503,
  504: REQUEST_504,
};

const promptMessage = {
  COMMON_SESSION_TIMEOUT: 'Session Timeout.',
};

const globalConst = {
  TOKEN_PREFIX: 'Bearer ',
  HEADER_AUTHORIZATION: 'Authorization',
  ERROR_RT_VERIFICATION_FAILED: 'RT_VERIFICATION_FAILED',
  ERROR_UNAUTHORIZED: 'UNAUTHORIZED',
  HEADER_CSRF_TOKEN: 'X-CSRF-TOKEN',
  APP_CODE: 'App-Code',
};

module.exports = {
  codeMessage,
  promptMessage,
  globalConst,
};
