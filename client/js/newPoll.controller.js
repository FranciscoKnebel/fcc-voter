'use strict';

const MIN_LENGTH = 5;

var app = angular.module('poll', []);

app.controller('pollController', function ($scope, $http) {
    $scope.newPoll = { options: [ { id: 0, text: ""} ]};

    $scope.createPoll = function() {
      // Remove any blank answers:
      $scope.newPoll.options = $scope.newPoll.options.filter(function(option) {
        return option.text !== "";
      });

      if($scope.newPoll.question === "" || $scope.newPoll.options.length === 1) {
        return;
      }

      if($scope.newPoll.question.length < MIN_LENGTH)
        return;

      renumberOptions();

      $http.post('/poll/new', $scope.newPoll).then(function(response) {
          window.location.href = '/profile';
        },
        function(response) {
          console.log("Creating poll failed. Try again later.");
        }
      );
    };

    // Renumber options, zero out votes:
    function renumberOptions() {
      var num = 0;
      $scope.newPoll.options = $scope.newPoll.options.map(function(option){
        option.id = num;
        num++;
        return option;
      });
    }

    $scope.addOption = function() {
      $scope.newPoll.options.push({
          id: $scope.newPoll.options.length,
          text: ""
       });
    };

    $scope.deleteOption = function(del) {
      $scope.newPoll.options = $scope.newPoll.options.filter(function(option){
        return option.id !== del;
      });
      renumberOptions();
    };

});
