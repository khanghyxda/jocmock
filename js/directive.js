var app = angular.module('app', []);

app.directive("pagination", function () {
  var html = "";
  html += '<ul class="pagination pagination-sm">';

  // First
  html += '<li class="page-item {{currentPage == 1 ? \'disabled\' : \'\' }}">';
  html += '<a class="page-link" href="javascript:void(0)" ng-click="pageChange(1)" aria-label="First"><span aria-hidden="true">&laquo;&laquo;</span></a>';
  html += '</li>';

  // Previous
  html += '<li class="page-item {{currentPage  <= 1 ? \'disabled\' : \'\' }}">';
  html += '<a class="page-link" href="javascript:void(0)" ng-click="pageChange(currentPage-1)" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>';
  html += '</li>';

  // Left ...
  html += '<li class="page-item disabled" ng-if="from() > 1">';
  html += '<a class="page-link" href="javascript:void(0)">…</a>';
  html += '</li>';

  // Page
  html += '<div ng-repeat="i in range()">';
  html += '<li class="page-item {{ i == currentPage ? \'active\' : \'\'}}">';
  html += '<a class="page-link" href="javascript:void(0)" ng-click="pageChange(i)">{{i}}</a>';
  html += '</li>';
  html += '</div>';

  // Right ...
  html += '<li class="page-item disabled" ng-if="to() < numberPage()">';
  html += '<a class="page-link" href="javascript:void(0)">…</a>';
  html += '</li>';

  // Next
  html += '<li class="page-item {{currentPage >= numberPage() ? \'disabled\' : \'\'}}">';
  html += '<a class="page-link" href="javascript:void(0)" ng-click="pageChange(currentPage+1)" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>';
  html += '</li>';

  html += '<li class="page-item {{currentPage >= numberPage() ? \'disabled\' : \'\'}}">';
  html += '<a class="page-link" href="javascript:void(0)" ng-click="pageChange(numberPage())" aria-label="Next"><span aria-hidden="true">&raquo;&raquo;</span></a>';
  html += '</li>';

  html += '</ul>';

  return {
    scope: {
      totalItems: "=totalItems",
      currentPage: "=currentPage",
      itemsPerPage: "=itemsPerPage",
      maxSize: "=maxSize",
      pageChange: "=pageChange",
    },
    controller: function ($scope) {
      $scope.Math = window.Math;
      $scope.range = function () {
        var input = [];
        var from = $scope.from();
        var to = $scope.to();
        for (var i = from; i <= to; i += 1) {
          input.push(i);
        }
        return input;
      }

      $scope.from = function(){
        var numberPage = Math.round($scope.totalItems / $scope.itemsPerPage);
        var from = Math.max(1, $scope.currentPage - $scope.maxSize);
        if($scope.currentPage > numberPage - $scope.maxSize){
          from =  Math.max(1, numberPage - 2 * $scope.maxSize);
        }
        return from;
      }

      $scope.to = function(){
        var numberPage = Math.round($scope.totalItems / $scope.itemsPerPage);
        var to = Math.min(numberPage, $scope.currentPage + $scope.maxSize);
        if($scope.currentPage <= $scope.maxSize) {
          to = Math.min(1 + 2*$scope.maxSize, numberPage);
        }
        return to;
      }

      $scope.numberPage = function () {
        return Math.round($scope.totalItems / $scope.itemsPerPage);
      }

    },  
    restrict: "E",
    template: html
  };
});

app.controller('controller', function ($scope, $http) {
  $scope.currentPage = 1 ;
  $scope.pageChange = function(value){
    $scope.currentPage = value;
  }
})