var request = require('request');
var fs = require('fs');
if(typeof require !== 'undefined') XLS = require('xlsjs');
var schema = JSON.parse(fs.readFileSync('schema.json'));
//var express = require('express');
//var app = express();

//XLSRequest();
JSONconvert();

function XLSRequest() {
  var localFile = fs.createWriteStream('results.xls');

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
	var workbook = XLS.readFile('./results.xls');
	var results = workbook.Sheets.Results;
	//console.log(results['A1'].v);

	schema.PrecinctsReporting = results['A3'].v;
	// TODO: parse PRECINCTS
	// TODO: parse Ballots
	schema.Updated = results['A4'].v; // TODO: parse Updated

	// PRESIDENT
	schema.Contests.US.President.Candidates[0].Votes = results['B7'].v; // write-in
	schema.Contests.US.President.Candidates[1].Votes = results['C7'].v; // CLINTON
	schema.Contests.US.President.Candidates[2].Votes = results['D7'].v; // TRUMP
	schema.Contests.US.President.Candidates[3].Votes = results['E7'].v; // JOHNSON
	schema.Contests.US.President.Candidates[4].Votes = results['F7'].v; // STEIN
	schema.Contests.US.President.Candidates[5].Votes = results['G7'].v; // DE LA FUENTE
	schema.Contests.US.President.Candidates[6].Votes = results['H7'].v; // CASTLE

	console.log(schema.Contests.US.President);
}
