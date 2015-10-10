'use strict';

var DEMO_API_KEY = '8292777557e8eb8bc169c2af29e87ac07d0f1ac4857048044402dbee06ba5cea';

var ipv = require('./index')(DEMO_API_KEY);

//create a callback function to feed to execute
function printIt(err, results) {
  if (err) {
    console.warn(err);
  } else {
    console.log(results);
  }
}

//call each method with explicit parameters
ipv.execute('ipq', {ip:'208.64.76.5'}, printIt);
ipv.execute('risk', {ip:'208.64.76.5'}, printIt);
ipv.execute('geofilter', {geofilterxml:'examples/geofilter.xml'}, printIt);
ipv.execute('riskfactor', {riskfactorxml:'examples/riskfactor.xml'}, printIt);
ipv.execute('submission', {ip:'208.64.76.5', category:13, protocol: 51}, printIt);

//control parameters by setting config values
ipv.config.callback =  printIt;
ipv.config.ip = '208.74.76.5';

ipv.execute('ipq');
ipv.execute('risk');

ipv.config.riskfactorxml = './examples/riskfactor.xml';
ipv.execute('riskfactor');
ipv.config.riskfactorxml = null;

ipv.config.geofilterxml = './examples/geofilter.xml';
ipv.execute('geofilter');
ipv.config.geofilterxml = null;

ipv.category = 13;
ipv.protocol = 51;
ipv.execute('submission');