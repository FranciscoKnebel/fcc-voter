var app = angular.module('poll', []);

app.controller('showPolls', function($scope, $http) {
	$scope.firstLoad = true;
	$scope.message = "";

	$scope.getPolls = function() {
		if ($scope.firstLoad) {
			$scope.firstLoad = false;

			$http.get('/profile/getpolls').then(function(response) {
				$scope.polls = response.data;
			}, function(response) {
				console.log(response.status);
				$scope.message = "Finding polls failed. Please try again later.";
			});
		}
	}
});
