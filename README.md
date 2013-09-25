IPVIKING API for NODE.JS

This API is designed to be a simple API to making IPViking calls
using node.js. As with other APIs, the goal is to make calling
IPViking as easy as possible.

THE SIMPLE VERSION:
IPVG = require ('IPVikingGetter.js')
ipv = IPVG.IPVikingGetter
ipv.configure(your_apikey, your_proxy)
//ipv.set_config(name_val)			This is optional, see tests.js
var myFunction  = function (data) {
	//do something here
}
data = ipv.execute(method, {parameters}, myFunction)

And that's it! In other words, import, configure, and execute it 
with a callback. End of story.


THE (SLIGHTLY) MORE COMPLEX VERSION:
This is a brief source dive into this API. Luckily, it's very, very 
small. Everything is in one object in IPVikingGetter.js. Literally.

-IPVikingGetter
This is our primary object; it does it all for you. It slices, dices,
it'll even make you a salad (if by salad you mean you don't even need
to configure it for it to run). Here's how it looks.
	//constants- these are mainly for reference, though they can be used
	PROXIES is map of our current proxies. Pick the best one.
	OPTIONS is a list of the options currently accepted by the API.
	
	//runtime options- settings to control the API's function
	loud is a boolean that toggles warnings.
	strict is a boolean that controls the validation, allowing you to break
		on bad inputs (if you like).
	
	//config- this is your main control panel. Anything can be run from here
	config- a map of all our config options. Including the options for 
		specific calls, like IP address, though you can also override that.
	configure- makes sure we have an apikey and proxy set up. Hard to run
		without those.
	set_config(name, value)- helper function to set a config value. Unset
		by setting to null.
		
	//request builders- helper functions to build the request arguments and body
	get_args- builds the args to be passed to HTTP.request, that is all.
	get_body- builds a URL-encoded string from your parameters, that is all.
	
	//validators- functions to validate your args before requesting. IMPORTANT:
		RUN VALIDATE_OPTIONS FIRST.
	validate_args- validates that we've got values for our essential args.
	validate_options- scrubs values, making sure there's nothing unexpected.
		
	//And finally, execute
	execute: calls the validators and builders in order, then makes the http
		request. Lookie, it'll even hand you back a map from the JSON respone!
		
That's all! Told you it was simple. So what else is here? 

Examples includes the sample xml docs for riskfactor and geofilter methods a la 
	our website.
tests.js includes some very basic examples of using the API in both literal mode
	(ie, supplying values to execute) and no-hands mode (setting config and 
	calling execute without params).