'use strict';

const colors	= require('colors/safe');
const translate= require('google-translate-api');
var MsTranslator = require('mstranslator');

var client = new MsTranslator({
  api_key: "92d928ad419e420fb3ae1f5b63cef2b8" // use this for the new token API.
}, true);

var introText = 'Lifos är ett expertorgan, vilket agerar opartiskt och proaktivt för att bidra till rättssäkra och effektiva migrationsprocesser genom tillförlitlig, relevant och lättillgänglig landinformation och omvärldsanalys. Lifos samlar in, analyserar och upprätthåller kunskap om länder och regioner från vilka människor söker sig till Sverige, till stöd för prövningen.';

var intro = 'Lifos is an expert body, which acts impartially and proactively to contribute to legal certainty and effective migration processes through reliable, relevant and readily available country information and business intelligence. Lifos collects, analyzes, and maintains knowledge of countries and regions from which people come to Sweden, in support of the trial.';

var enParams = {
	text: introText,
	to: 'en'
};

var arParams = {
	text: introText,
	to: 'ar'
};

var enArParams = {
	text: intro,
	to: 'ar'
}

var svParams = {
	text: intro,
	to: 'sv'
}

/*console.log(introText,'\n');

client.translate(enParams, function(err, data) {
  console.log(data,'\n');
});

client.translate(arParams, function(err, data) {
  console.log(data,'\n');
});
client.translate(svParams, function(err, data) {
  console.log(data,'\n');
});
client.translate(enArParams, function(err, data) {
  console.log(data,'\n');
});*/

module.exports.translateAndStore = function(tag,sum,callback){
	client.translate({
		text: tag,
		from: sv,
		to: en
	}, function(err,data){

		//callback();
	});
	client.translate({
		text: tag,
		from: sv,
		to: ar
	}, function(err,data){

		//callback();
	});
	database.saveTag(tag,trans,sum.id,sum.url);
			session.addTagsWritten(1);
}

module.exports.translateTag = function(tag,sumId,sumUrl,callback){
	translate(tag, {from: 'sv', to: 'en'})
		.then(res => {
			var trans = res.text.toLowerCase();
			callback(tag, trans, sumId, sumUrl);
			return true;
		}).catch(err => {
			console.log(colors.red.bold("COULD NOT FIND TRANSLATION :"),tag,err.code);
			callback(tag, "NOT_TRANSLATED", sumId, sumUrl);
	});
}

module.exports.translateSum = function(sum,tags,docs,callback){
	var gate = {
		title: false,
		abstract: false,
		summary: false
	};
	var trans = {
		title: "NOT_TRANSLATED",
		abstract: "NOT_TRANSLATED",
		summary: "NOT_TRANSLATED"
	};

	var lengthAbstract = 600;
	var trimmedAbstract = sum.abstract.length > lengthAbstract ?
                    		sum.abstract.substring(0, lengthAbstract) + "... MASKINLÄSNING BEGRÄNSAD":
                    		sum.abstract;

	var lengthSummary = 1000;
	var trimmedSummary = sum.summary.length > lengthSummary ?
                    		sum.summary.substring(0, lengthSummary) + "... MASKINLÄSNING BEGRÄNSAD":
                    		sum.summary;

	translate(sum.title, {to: 'en'})
		.then(res => {
			trans.title = res.text;
			gate.title = true;
			if(gate.title && gate.abstract && gate.summary){
				callback(sum,trans,tags,docs);
			}
			return true;
		}).catch(err => {
			console.log(colors.red.bold("COULD NOT FIND TRANSLATION : title :"),sum.title,err.code);
			gate.title = true;
			if(gate.title && gate.abstract && gate.summary){
				callback(sum,trans,tags,docs);
			}
	});

	translate(trimmedAbstract, {to: 'en'})
		.then(res => {
			trans.abstract = res.text;
			gate.abstract = true;
			if(gate.title && gate.abstract && gate.summary){
				callback(sum,trans,tags,docs);
			}
			return true;
		}).catch(err => {
			console.log(colors.red.bold("COULD NOT FIND TRANSLATION : abstract :"),trimmedAbstract,err.code);
			gate.abstract = true;
			if(gate.title && gate.abstract && gate.summary){
				callback(sum,trans,tags,docs);
			}
	});

	translate(trimmedSummary, {to: 'en'})
		.then(res => {
			trans.summary = res.text;
			gate.summary = true;
			if(gate.title && gate.abstract && gate.summary){
				callback(sum,trans,tags,docs);
			}
			return true;
		}).catch(err => {
			console.log(colors.red.bold("COULD NOT FIND TRANSLATION : summary :"),trimmedSummary,err.code);
			gate.summary = true;
			if(gate.title && gate.abstract && gate.summary){
				callback(sum,trans,tags,docs);
			}
	});
}
