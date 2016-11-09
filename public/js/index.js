var app = angular.module('app', [])

app.controller('ctrl', function ($scope, $http) {

	$http.get("/results")
    .then(function(response) {
				$scope.results = response.data;
				$scope.updated = response.data.updated;
				$scope.precincts = response.data.precincts;
				$scope.ballots = response.data.ballots;
				$scope.contests = response.data.contests.state.nd;
				$scope.cards = response.data.contests.us.president.candidates;
				$scope.reportingPercent = (json.precincts.reporting / json.precincts.total * 100).toFixed(2) + '%';
				$scope.ballotsPercent = (json.ballots.cast / 570955 * 100).toFixed(2) + '%';
				//console.log(response.data.contests.us.president.candidates);
				console.log(response.data)
    });

});
