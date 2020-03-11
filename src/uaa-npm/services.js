const defaults = require('./setting');
const UAAService = require('./UAAService');

/**
 * Create an instance of UAAService
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Object} A new instance of UAAService
 */
function createInstance(defaultConfig) {
  return new UAAService(defaultConfig);
}

// Create the default instance to be exported
const services = createInstance(defaults);

services.create = function create(instanceConfig) {
  const setting = { ...defaults, ...instanceConfig };
  return createInstance(setting);
};

module.exports = services;
