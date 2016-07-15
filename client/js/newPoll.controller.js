'use strict';

const MIN_LENGTH = 5;

var app = angular.module('poll', []);

app.controller('pollController', function($scope, $http, $location) {
	$scope.message = "";
	$scope.success = "";
	$scope.loading = "";
	$scope.showMessage = false;

	$scope.newPoll = {
		options: [{
			id: 0,
			text: ""
		}, {
			id: 1,
			text: ""
		}]
	};

	$scope.createPoll = function() {
		// Remove any blank answers:
		$scope.newPoll.options = $scope.newPoll.options.filter(function(option) {
			return option.text !== "";
		});

		renumberOptions();

		if (typeof $scope.newPoll.question === "undefined") {
			$scope.message = "Question title is blank."
			$scope.loading = "";
			$scope.success = "";
			$scope.showMessage = true;
			return;
		} else if ($scope.newPoll.question.length < MIN_LENGTH) {
			$scope.message = "Question title needs to be at least " + MIN_LENGTH + " long.";
			$scope.loading = "";
			$scope.success = "";
			$scope.showMessage = true;
			return;
		} else if ($scope.newPoll.options[1].text === "") {
			$scope.message = "You need at least two filled options.";
			$scope.loading = "";
			$scope.success = "";
			$scope.showMessage = true;
			return;
		} else {
			$scope.message = "";
			$scope.loading = "True";
			$scope.success = "";
			$scope.showMessage = true;
		}

		$http.post('/poll/new', $scope.newPoll).then(function(response) {
				$scope.message = "";
				$scope.loading = "";
				$scope.success = response.data;
				$scope.showMessage = true;

				$scope.newPoll = {
					options: [{
						id: 0,
						text: ""
					}, {
						id: 1,
						text: ""
					}]
				};
				$scope.newPoll.question = "";
			},
			function(response) {
				$scope.message = "Creating poll failed. Try again later.";
				$scope.loading = "";
				$scope.success = "";
				$scope.showMessage = true;
			}
		);
	};

	// Renumber options, zero out votes:
	function renumberOptions() {
		if (typeof $scope.newPoll.options[0] === "undefined") {
			addOption();
			addOption();
		} else if (typeof $scope.newPoll.options[1] === "undefined") {
			addOption();
		} else {
			var num = 0;
			$scope.newPoll.options = $scope.newPoll.options.map(function(option) {
				option.id = num;
				num++;
				return option;
			});
		}
	}

	function addOption() {
		$scope.newPoll.options.push({
			id: $scope.newPoll.options.length,
			text: ""
		});
	}

	$scope.addOption = function() {
		addOption();
	};

	$scope.deleteOption = function(del) {
		$scope.newPoll.options = $scope.newPoll.options.filter(function(option) {
			return option.id !== del;
		});
		renumberOptions();
	};

});
