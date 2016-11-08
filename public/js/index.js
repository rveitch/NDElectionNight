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
				//console.log(response.data.contests.us.president.candidates);
				console.log(response.data)
    });

});
