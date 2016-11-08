var app = angular.module('app', [])

app.controller('ctrl', function ($scope, $timeout) {  
	
 $scope.cards = [
  {
    "id": "CLINTON",
    "tag": "tag-primary",
    "president": "Hillary Clinton",
    "vp": "Tim Kaine",
    "party": "DEM",
    "votes": 500
  },
  {
    "id": "TRUMP",
    "tag": "tag-danger",
    "president": "Donald J. Trump",
    "vp": "Michael R. Pence",
    "party": "REP",
    "votes": 250
  },
  {
    "id": "JOHNSON",
    "tag": "tag-warning",
    "president": "Gary Johnson",
    "vp": "William Weld",
    "party": "LIB",
    "votes": 30
  },
  {
    "id": "STEIN",
    "tag": "tag-success",
    "president": "Jill Stein",
    "vp": "Howie Hawkins",
    "party": "GRE",
    "votes": 22
  },
  {
    "id": "CASTLE",
    "tag": "tag-info",
    "president": "Darrell Castle",
    "vp": "Scott Bradley",
    "party": "CON",
    "votes": 6
  },
  {
    "id": "DE LA FUENTE",
    "tag": "tag-default",
    "president": "Roque De La Fuente",
    "vp": "Michael Steinberg",
    "party": "ADP",
    "votes": 5
  },
  {
    "id": "writein",
    "tag": "tag-writein",
    "president": "Write-In",
    "vp": "N/A",
    "party": "NON",
    "votes": 7
  }
];
	
  
	$scope.cardView = true;
	$scope.listView = false;
	
	
	$scope.cardViewClick =  function() {
		$timeout(function() {
			$scope.cardView = true;
		}, 500);
			$scope.listView = false;
	}
	$scope.listViewClick =  function() {
			$scope.cardView = false;
    $timeout(function() {
			$scope.listView = true;		
		}, 500);
	}
	
	$scope.viewMore = function() {
		$('.card-view-info').addClass('active');
	}
	
	$scope.close = function() {
		$('.card-view-info').removeClass('active');
	}
	
});