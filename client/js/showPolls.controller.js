var app = angular.module('poll', []);

app.controller('showPolls', function($scope, $http) {
	$scope.firstLoad = true;
	$scope.message = "";
	$scope.loading = false;

	$scope.getPolls = function() {
		if ($scope.firstLoad) {
			$scope.loading = true;
			$scope.firstLoad = false;

			$http.get('/profile/getpolls').then(function(response) {
				$scope.polls = response.data;
				$scope.loading = false;
				$scope.message = "";

				if (response.data && response.data.length <= 0) {
					$scope.message = "User has no owned polls."
				}

			}, function(response) {
				$scope.loading = false;
				console.log(response.status);
				$scope.message = "Finding polls failed. Please try again later.";
			});
		}
	}
});
