# IPViking API for Node.js

This API is designed to make IPViking calls
from a Node.js app. As with other APIs, the goal is to make calling
IPViking as easy as possible.

## Installing

`npm install --save ipviking`

## Simple usage

```javascript
var MY_API_KEY = '12345abcdef';
var ipv = require('ipviking')(MY_API_KEY);
ipv.execute('ipq', {ip: '0.0.0.0'}, function (err, results) {
    // Handle err & results
});
```

And that's it! In other words, import, configure, and execute it with a callback. End of story.

## Advanced configuration

Pass in a configuration object instead of an api key at the initial configure step:

`var ipv = require('ipviking')({apiKey: 'asdf', proxy: 'UNIVERSAL'});`

`ipv` also exposes its `config` property for later modification.  See tests.js for examples.

#### `execute`
Calls the validators and builders in order, then makes the http request to the API.  Lookie, it'll even hand you back a map from the JSON respone!

That's all! Told you it was simple. So what else is here?

Examples includes the sample xml docs for riskfactor and geofilter methods a la our website.
`tests.js` includes some very basic examples of using the API in both literal mode (ie, supplying values to execute) and no-hands mode (setting config and calling execute without params).