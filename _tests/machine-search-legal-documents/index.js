console.log("-----------------\n-- APP STARTED --\n-----------------");

const translate = require('google-translate-api');

if(!process.argv[2]){
	console.log("No text specified");
	console.log("Please use 'npm start' for example text");
	console.log("or 'node index.js "+'"'+"<your text>"+'"'+"' instead");
	process.exit(0);
}

translate(process.argv[2], {to: 'en'}).then(res => {
   console.log(process.argv[2]);
	console.log(res.from.language.iso+" => en");
   console.log(res.text);
}).catch(err => {
    console.error(err);
});


/*
var request = require('request');

var opts = {
  url: 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken',
  headers: {
    'Ocp-Apim-Subscription-Key': '92d928ad419e420fb3ae1f5b63cef2b8'
  }
};

function callback(er, res, body){
	console.log(res.statusCode);
	console.log(res);
}

request(opts,callback);
*/
/*
request('https://api.cognitive.microsoft.com/sts/v1.0/issueToken', function (error, response, body) {
   if(response.statusCode == 404){
   	console.log("404");
   };
   if (response.statusCode == 200) {
   	console.log("TOKEN:")
      console.log(JSON.stringify(body)); // Show the HTML for the Google homepage.
   };
});

curl --header 'Ocp-Apim-Subscription-Key: 92d928ad419e420fb3ae1f5b63cef2b8' --data "" 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken'
*/
/*
var https = require('https');

var tokenUrl = "https://api.cognitive.microsoft.com/sts/v1.0/issueToken";

var key = "92d928ad419e420fb3ae1f5b63cef2b8";

var opts = {
	host: tokenUrl,
	header: key,
	method: 'GET'
};

var getToken = https.get(opts, function(res){
	console.log(res.statusCode);
	res.on('data', function(d) {
    process.stdout.write(d);
  });
});
*/
/*

var MsTranslator = require('mstranslator');

var client = new MsTranslator({
  api_key: "your portal.azure.com api key" // use this for the new token API.
}, true);



var params = {
  text: "How are you?"
  , from: 'en'
  , to: 'es'
};

// Don't worry about access token, it will be auto-generated if needed.
client.translate(params, function(err, data) {
  console.log(data);
});
*/