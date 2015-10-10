'use strict';

var IPVG = require('./IPVikingGetter.js');

//create an instance and initialize with the default values
var ipv = IPVG.IPVikingGetter;
ipv.configure();

//create a callback function to feed to execute
var print_it = function (err, results) {
  if (err) {
    console.war(err);
  } else {
    console.log(results);
  }
};

//call each method with explicit parameters
ipv.execute('ipq', {ip:'208.64.76.5'}, print_it);
ipv.execute('risk', {ip:'208.64.76.5'}, print_it);
ipv.execute('geofilter', {geofilterxml:'examples/geofilter.xml'}, print_it);
ipv.execute('riskfactor', {riskfactorxml:'examples/riskfactor.xml'}, print_it);
ipv.execute('submission', {ip:'208.64.76.5', category:13, protocol: 51}, print_it);

//control parameters by setting config values
ipv.set_config('callback', print_it);
ipv.set_config('ip','208.74.76.5');
ipv.execute('ipq');
ipv.execute('risk');

ipv.set_config('riskfactorxml', 'examples/riskfactor.xml');
ipv.execute('riskfactor');
ipv.set_config('riskfactorxml', null);

ipv.set_config('geofilterxml', 'examples/geofilter.xml');
ipv.execute('geofilter');
ipv.set_config('geofilterxml', null);

ipv.set_config('category', 13);
ipv.set_config('protocol', 51);
ipv.execute('submission');