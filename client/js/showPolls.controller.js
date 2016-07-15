var app = angular.module('poll', []);

app.controller('showPolls', function($scope, $http) {
	$http.get('/profile/getpolls').then(function(response) {
		console.log(response);
	});
});
