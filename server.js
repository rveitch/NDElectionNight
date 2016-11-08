var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
if(typeof require !== 'undefined') XLS = require('xlsjs');
var schema = JSON.parse(fs.readFileSync('./schema/schema.json'));
var RESULTS_FILE = path.join(__dirname, './results/results.json');

app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/results', function(req, res) {
  fs.readFile(RESULTS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.json(JSON.parse(data));
  });
});


/****************** LISTEN *********************/

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
	clearInterval(interval);
	var interval = setInterval(function() {
		XLSRequest(); // fetch every 5 minutes
	}, 300000);
});

function XLSRequest() {
  var localFile = fs.createWriteStream('./results/results.xls');

  request
    .get('http://results.sos.nd.gov/ResultsExport.aspx?cat=SWALL&type=SW&text=Race&area=')
    .pipe(localFile)
    .on('close', JSONconvert);

		//JSONconvert();
}

function JSONconvert() {
	var workbook = XLS.readFile('./results/results.xls');
	var results = workbook.Sheets.Results;

	schema.reporting = results['A3'].v;
	// TODO: parse PRECINCTS
	// TODO: parse Ballots
	var updated = results['A4'].v.replace('Downloaded at ','');
	console.log(updated);
	schema.updated = results['A4'].v.replace('Downloaded at ',''); // TODO: parse Updated

	// PRESIDENT
	schema.contests.us.president.candidates[0].votes = results['C7'].v; // CLINTON
	schema.contests.us.president.candidates[1].votes = results['D7'].v; // TRUMP
	schema.contests.us.president.candidates[2].votes = results['E7'].v; // JOHNSON
	schema.contests.us.president.candidates[3].votes = results['F7'].v; // STEIN
	schema.contests.us.president.candidates[4].votes = results['H7'].v; // CASTLE
	schema.contests.us.president.candidates[5].votes = results['G7'].v; // DE LA FUENTE
	schema.contests.us.president.candidates[6].votes = results['B7'].v; // write-in

	var wstream = fs.createWriteStream('results/results.json');
	wstream.write(JSON.stringify(schema));
	wstream.end();
	console.log('results.json Updated');
}
