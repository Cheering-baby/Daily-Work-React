import '@babel/polyfill';

global.Intl = require('intl');
window.Intl = require('intl');

require('./utils/loadScript');
