var categoryList = [
    {categoryId: 1, categoryName: "Color1", categoryUrl: "../../images/blue.png"},
    {categoryId: 2, categoryName: "Color2", categoryUrl: "../../images/pink.png"}
];
var emojiList = [
    {categoryId: 1, emojiName: "blue", emojiUrl: "../../images/blue.png"},
    {categoryId: 1, emojiName: "pink", emojiUrl: "../../images/pink.png"},
    {categoryId: 1, emojiName: "red", emojiUrl: "../../images/red.png"},
    {categoryId: 1, emojiName: "green", emojiUrl: "../../images/green.png"},
    {categoryId: 2, emojiName: "blue", emojiUrl: "../../images/blue.png"},
    {categoryId: 2, emojiName: "pink", emojiUrl: "../../images/pink.png"},
    {categoryId: 2, emojiName: "red", emojiUrl: "../../images/red.png"},
    {categoryId: 2, emojiName: "green", emojiUrl: "../../images/green.png"},
];
var emojiMap = {};

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