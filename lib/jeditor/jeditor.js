var app = angular.module('app', []);

app.directive("jeditor", function () {
    return {
        scope: {

        },
        controller: function ($scope) {
            var init =function(){
                autosize($('textarea'));
            }
            init();
        },
        restrict: "E",
        templateUrl: "lib/jeditor/template.html"
    };
});

app.controller('controller', function ($scope, $http) {

})