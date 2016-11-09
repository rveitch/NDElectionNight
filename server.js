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
	}, 60000);
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

	// Updated & Reporting:
	var updated = results['A4'].v.replace('Downloaded at ','');
	var updatedArray = updated.split(" ");
	var updated_date = updatedArray[0];
	var updated_time = updatedArray[1] + ' ' + updatedArray[2];
	var reporting = results['A3'].v.replace('Precincts Reporting: ','');
	schema.updated.date = updated_date;
	schema.updated.time = updated_time;
	schema.downloaded = results['A4'].v.replace('Downloaded at ','');
	schema.reporting = results['A3'].v;

	// Precincts Reporting:
	var precinctsReporting = parseInt(reporting.split("/",1)[0]);
	schema.precincts.reporting = precinctsReporting;

	// Total Ballots Cast:
	var ballotsArray = reporting.split(": ");
	var ballotsCast = parseInt(ballotsArray[ballotsArray.length - 1]);
	schema.ballots.cast = ballotsCast;

	// PRESIDENT
	schema.contests.us.president.candidates[0].votes = results['C7'].v; // CLINTON
	schema.contests.us.president.candidates[1].votes = results['D7'].v; // TRUMP
	schema.contests.us.president.candidates[2].votes = results['E7'].v; // JOHNSON
	schema.contests.us.president.candidates[3].votes = results['F7'].v; // STEIN
	schema.contests.us.president.candidates[4].votes = results['H7'].v; // CASTLE
	schema.contests.us.president.candidates[5].votes = results['G7'].v; // DE LA FUENTE
	schema.contests.us.president.candidates[6].votes = results['B7'].v; // write-in

	// SENATORS
	var senators = schema.contests.state.nd[0].candidates; // row 12
	senators[0].votes = results['E12'].v; // Glassheim
	senators[1].votes = results['D12'].v; // Hoeven
	senators[2].votes = results['F12'].v; // Germalic
	senators[3].votes = results['C12'].v; // Marquette
	senators[4].votes = results['B12'].v; // Write-In

	// CONGRESS
	var congress = schema.contests.state.nd[1].candidates; // row 17
	congress[0].votes = results['E17'].v; // Chase Iron Eyes
	congress[1].votes = results['D17'].v; // Kevin Cramer
	congress[2].votes = results['C17'].v; // Jack Seaman
	congress[3].votes = results['B17'].v; // Write-In

	// Governor
	var governor = schema.contests.state.nd[2].candidates; // row 22
	governor[0].votes = results['D22'].v; // Marvin E Nelson & Joan Heckaman
	governor[1].votes = results['E22'].v; // Doug Burgum & Brent Sanford
	governor[2].votes = results['C22'].v; // Marty Riske & Joshua Voytek
	governor[3].votes = results['B22'].v; // Write-In

	// STATE AUDITOR
	var auditor = schema.contests.state.nd[3].candidates; // row 27
	auditor[0].votes = results['D27'].v; // Josh Gallion
	auditor[1].votes = results['C27'].v; // Roland Riemers
	auditor[2].votes = results['B27'].v; // Write-In

	// STATE TREASURER
	var treasurer = schema.contests.state.nd[4].candidates; // row 32
	treasurer[0].votes = results['E32'].v; // Tim Mathern
	treasurer[1].votes = results['D32'].v; // Kelly L Schmidt
	treasurer[2].votes = results['C32'].v; // Eric Olson
	treasurer[3].votes = results['B32'].v; // Write-In

	// INSURANCE COMMISIONER
	var insuranceComm = schema.contests.state.nd[5].candidates; // row 37
	insuranceComm[0].votes = results['E37'].v; // Ruth Buffalo
	insuranceComm[1].votes = results['D37'].v; // Jon Godfread
	insuranceComm[2].votes = results['C37'].v; // Nick Bata
	insuranceComm[3].votes = results['B37'].v; // Write-In

	// PUBLIC SERVICE COMMISIONER
	var publicServComm = schema.contests.state.nd[6].candidates; // row 42
	publicServComm[0].votes = results['E42'].v; // Marlo Hunte-Beaubrun
	publicServComm[1].votes = results['D42'].v; // Julie Fedorchak
	publicServComm[2].votes = results['C42'].v; // Thomas Skadeland
	publicServComm[3].votes = results['B42'].v; // Write-In

	// Superintendent of Public Instruction
	var superintendent = schema.contests.state.nd[7].candidates; // row 47
	superintendent[0].votes = results['C47'].v; // Kirsten Baesler
	superintendent[1].votes = results['D47'].v; // Joe Chiang

	// Justice of the Supreme Court
	var justiceSC = schema.contests.state.nd[8].candidates; // row 52
	justiceSC[0].votes = results['C52'].v; // Jerod Elton Tufte
	justiceSC[1].votes = results['D52'].v; // Robert V Bolinske Sr
	justiceSC[2].votes = results['B52'].v; // Write-In

	// Justice of the Supreme Court Unexpired 2-Year Term
	var justiceSCU = schema.contests.state.nd[9].candidates; // row 57
	justiceSCU[0].votes = results['C57'].v; // Lisa Fair McEvers - NON
	justiceSCU[1].votes = results['B57'].v; // Write-In

	var wstream = fs.createWriteStream('results/results.json');
	wstream.write(JSON.stringify(schema));
	wstream.end();
	console.log('results.json Updated');
}
