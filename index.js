var request = require('request');
var fs = require('fs');
if(typeof require !== 'undefined') XLS = require('xlsjs');
var schema = JSON.parse(fs.readFileSync('./schema/schema.json'));
//var express = require('express');
//var app = express();

//XLSRequest();
JSONconvert();

function XLSRequest() {
  var localFile = fs.createWriteStream('./results/results.xls');

  request
    .get('http://results.sos.nd.gov/ResultsExport.aspx?cat=SWALL&type=SW&text=Race&area=')
    .pipe(localFile)
		//.on('close', successCallback);
    //.on('close', JSONconvert);

		//onManifestUnzipped(manifestName);
		//JSONconvert();
}

function JSONconvert() {
	//var sheets = workbook.SheetNames;
	//var Sheet1A1 = workbook.Sheets[sheets[0]]['A1'].v;
	var workbook = XLS.readFile('./results/results.xls');
	var results = workbook.Sheets.Results;
	//console.log(results['A1'].v);

	schema.PrecinctsReporting = results['A3'].v;
	// TODO: parse PRECINCTS
	// TODO: parse Ballots
	schema.Updated = results['A4'].v; // TODO: parse Updated

	// PRESIDENT
	schema.contests.us.president.candidates[0].votes = results['C7'].v; // CLINTON
	schema.contests.us.president.candidates[1].votes = results['D7'].v; // TRUMP
	schema.contests.us.president.candidates[2].votes = results['E7'].v; // JOHNSON
	schema.contests.us.president.candidates[3].votes = results['F7'].v; // STEIN
	schema.contests.us.president.candidates[4].votes = results['H7'].v; // CASTLE
	schema.contests.us.president.candidates[5].votes = results['G7'].v; // DE LA FUENTE
	schema.contests.us.president.candidates[6].votes = results['B7'].v; // write-in

	console.log(schema.contests.us.president);
	var json = require('./schema/schema.json'); //(with path)
	console.log(json);
}
