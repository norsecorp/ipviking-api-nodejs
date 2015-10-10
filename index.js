'use strict';

var http = require('http');
var fs = require('fs');
var qs = require('querystring');

// Constants
var proxies = {
  UNIVERSAL: 'api.ipviking.com',
  NORTHAMERICA: 'us.api.ipviking.com',
  EUROPE: 'eu.api.ipviking.com',
  ASIAPACIFIC: 'as.api.ipviking.com',
  SOUTHAMERICA: 'la.api.ipviking.com',
  SANDBOX: 'beta.ipviking.com'
};

var options = [
  'apiKey',
  'method',
  'ip',
  'transID',
  'customID',
  'address',
  'city',
  'zip',
  'state',
  'country',
  'categories',
  'options',
  'protocol',
  'category',
  'timestamp',
  'noresolve',
  'url_details',
  'suppress',
  'compress',
  'haversine'
];

var config = {
  callback: console.log,
  method: 'ipq',

  transID: '0',
  clientID: '1',
  customID: '2',
  address: '1014 Ericsson Way',
  city: 'Reykjavik',
  zip: '00000',
  state: 'The Land of Ice and Snow',
  country: 'Iceland',
  categories: null,
  options: null,
  protocol: '51',
  category: '13',
  timestamp: null,
  headers: {
    Host: 'beta.ipviking.com',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept-Encoding': 'gzip, deflate, compress',
    Accept: 'application/json'
  },
  loud: true,
  strict: false
};


function getArgs(method, body) {
  var args = {
    hostname: config.proxy,
    path: 'http://' + config.proxy + '/api/',
    port: 80,
    method: method === 'submission' ? 'PUT' : 'POST',
    headers: config.headers
  };
  args.headers['Content-Length'] = body.length;
  return args;
}

function getBody(method, params) {
  params.method = method;
  // apikey has to be all lowercase here
  params.apikey = config.apiKey;

  return qs.stringify(params);
}

function validateOptions(params) {
  params = params || {};

  var validity = {
    valid: true,
    options: {}
  };

  function warn(warning) {
    if (config.strict) { validity.valid = false; }
    if (config.loud) { console.log(warning); }
  }
  function check(key) {
    if (options[key]) {
      return warn('Invalid option: ' + key);
    }
    validity.options[key] = params[key];
  }

  Object.keys(params).forEach(check);
  return validity;
}


// Validators
function validateParams(method, params) {
  params = params || {};
  method = method || config.method;

  var validity = {
    valid: true,
    errors: '',
    params: params
  };

  function addError(err) {
    validity.valid = false;
    validity.errors += (err + ' | ');
    if(config.loud) { console.log(err); }
  }
  function getContent(arg, filename) {
    var content = fs.readFileSync(filename, 'utf-8');
    if (!content) {
      return validity.addError('Invalid file name: No content.');
    }

    validity.params[arg] = content;
  }

  var testArg = function(arg, callback) {
    params[arg] = params[arg] || config[arg];
    params[arg] === null ?
      addError('Missing argument: ' + arg) :
      callback(arg, params[arg]);
  };
  switch (method) {
    case 'riskfactor':
      testArg('riskfactorxml', getContent);
      break;
    case 'geofilter':
      testArg('geofilterxml', getContent);
      break;
    case 'ipq':
    case 'risk':
    case 'submission':
      break;
    default:
      addError('Invalid method. Must be one of: ipq, risk, geofilter, riskfactor, submission.');
  }
  return validity;
}

// Return function that takes apiKey params and returns the thing
function init(_config) {
  if (!_config) {
    throw new Error('Config is required');
  }
  if (typeof _config === 'string') {
    // They just passed in the key as a string
    config.apiKey = _config;
  } else {
    if (!_config.apiKey) {
      throw new Error('API key is required');
    }
    Object.keys(_config).forEach(function (key) {
      if (config[key]) {
        config[key] = _config[key];
      }
    });
  }

  // Special-case proxy so the user can set it to NORTHAMERICA, etc
  config.proxy = proxies[_config.proxy] || _config.proxy || proxies.SANDBOX;

  return {
    execute: function(method, params, callback) {
      callback = callback || config.callback;

      // Validate required and optional parameters
      var optValid = validateOptions(params);
      params = optValid.options;

      var reqValid = validateParams(method, params);

      if (!reqValid.valid) {
        callback(reqValid.errors);
      } else {
        params = reqValid.params;
      }

      // Get body, args, and buffer
      var body = getBody(method, params);
      var args = getArgs(method, body);
      var respBuffer = '';

      // Make request
      var req = http.request(args, function(res) {
        res.on('data', function(chunk) {
          respBuffer += chunk;
        });
        res.on('end', function() {
          if (res.headers['content-type'] === 'application/json') {
            callback(null, JSON.parse(respBuffer));
          } else {
            callback(null, respBuffer);
          }
        });
      });

      req.on('error', function(error) {
        callback(error);
      });
      req.write(body);
      req.end();
    },
    config: config
  };
}

module.exports = init;