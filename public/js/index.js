var app = angular.module('app', [])

app.controller('ctrl', function ($scope, $http) {

	$http.get("/results")
    .then(function(response) {
        $scope.cards = response.data.contests.us.president.candidates;
				$scope.updated = response.data.updated;
				console.log(response.data.contests.us.president.candidates);
    });

});
