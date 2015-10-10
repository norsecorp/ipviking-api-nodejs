var http = require("http");
var fs = require("fs");
var qs = require("querystring");

var IPVikingGetter = {
    //constants
        PROXIES:{ 'UNIVERSAL':'api.ipviking.com',
          'NORTHAMERICA':'us.api.ipviking.com',
          'EUROPE':'eu.api.ipviking.com',
          'ASIAPACIFIC':'as.api.ipviking.com',
          'SOUTHAMERICA':'la.api.ipviking.com',
          'SANDBOX':'beta.ipviking.com'},
      OPTIONS:['apikey',
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
               'haversine'],

      //run settings
      loud : true,
      strict : false,

      //configuration functions
    config : {'apikey':"8292777557e8eb8bc169c2af29e87ac07d0f1ac4857048044402dbee06ba5cea",
      'proxy':'beta.ipviking.com',
            'method':'ipq',
            'callback':console.log,
            'ip':'208.74.76.5',
            'transID':'0',
            'clientID':'1',
            'customID':'2',
            'address':'1014 Ericsson Way',
            'city':'Reykjavik',
            'zip':'00000',
            'state':'The Land of Ice and Snow',
            'country':'Iceland',
            'categories':null,
            'options':null,
            'protocol':'51',
            'category':'13',
            'timestamp':null,
            'headers':{ 'Host':'beta.ipviking.com',
            'Content-Type':'application/x-www-form-urlencoded',
            'Accept-Encoding':'gzip, deflate, compress',
            'Accept': 'application/json'},
    },

    configure : function(apikey, proxy){
      apikey ? this.config.apikey = apikey : null;
      proxy ? this.config.proxy = proxy : null;
    },
    set_config : function(name, value) {
      this.config[name] = value;
    },

    set_callback : function(callback_fn) {
      this.config.callback = callback_fn;
    },

    //request builders
    get_args : function (method, body) {
      args = {hostname:this.config.proxy,
          path: 'http://'+this.config.proxy+'/api/',
          port: 80,
          method: method=='submission' ? "PUT" : "POST",
          headers:this.config.headers
          };
      args.headers['Content-Length'] = body.length;
      return args;
      },

    get_body : function (method, params) {
      params.method=method;
      params.apikey=this.config.apikey;
      body = qs.stringify(params);
      return body;
    },

    //validators
    validate_params : function (method, params, config, loud) {
      loud = loud || this.loud;
      config = config || this.config;
      params = params || {};
      method = method || this.config.method;

      var validity = {
          valid: true,
          errors: '',
          params: params
          };
      var add_error = function (err) {
        validity.valid = false;
        validity.errors += (err+' | ');
        loud ? console.log(err) : null;
      };
      var getcontent = function (arg, filename) {
        content = fs.readFileSync(filename).toString();
        content ? validity.params[arg]=content : validity.add_error("Invalid file name: no content.");
      };
      var do_nothing = function (arg1, arg2) {

      };

      var test_arg = function (arg, callback) {
        params[arg] = params[arg] || config[arg];
        params[arg] === null ?
            add_error("Missing argument: "+arg) :
            callback(arg, params[arg]);
      };
      switch(method) {
        case 'ipq':
          test_arg('ip', do_nothing);
          break;
        case 'risk':
          test_arg('ip', do_nothing);
          break;
        case 'riskfactor':
          test_arg('riskfactorxml', getcontent);
          break;
        case 'geofilter':
          test_arg('geofilterxml', getcontent);
          break;
        case 'submission':
          test_arg('ip', do_nothing);
          test_arg('category', do_nothing);
          test_arg('protocol', do_nothing);
          break;
        default:
          add_error("Invalid method. Must be one of: ipq, risk, geofilter, riskfactor, submission.");
      }
      return validity;
    },

    validate_options : function (params, strict, loud) {
      params = params || {};
      strict = strict || this.strict;
      loud = loud || this.loud;
      validity = {valid:true, options:{}};
      warn = function(warning) {
        this.strict ? this.validity.valid = false : null;
        this.loud ? console.log(warning) : null;
      };
      options = this.OPTIONS;
      check = function(key) {
        (key in this.options) ?
            this.warn("Invalid option: "+key) :
            this.validity.options[key]=params[key];
      };

      Object.keys(params).forEach(check);
      return validity;
    },

    execute : function(method, params, callback){
      //normalize args to defaults
      method = method || this.config.method;
      callback = callback || this.config.callback;

      //validate required and optional parameters
      var opt_valid = this.validate_options(params);
      params = opt_valid.options;
      var req_valid = this.validate_params(method, params);
      if (!req_valid.valid) {
        console.log("Request invalid. Errors: "+req_valid.errors);
      } else {
        params = req_valid.params;
      }

      //get body, args, and buffer
      var body = this.get_body(method, params);
      var args = this.get_args(method, body);
      var resp_buffer = '';


      //make request
      var req = http.request(args, function(res) {
        res.on('data', function(chunk) {
          resp_buffer+=chunk;
        });
        res.on('end', function() {
          if (res.headers['content-type']==='application/json'){
            callback(JSON.parse(resp_buffer));
          } else {
            callback(resp_buffer);
          };
        });
      });

      req.on('error', function(error) {
        console.log("Request error: Error: "+error.message);
      });
      req.write(body);
      req.end();
    },
};

module.exports.IPVikingGetter = IPVikingGetter;