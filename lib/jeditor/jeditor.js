var emojiCategoryList = [
    { categoryId: 1, categoryName: "Color1", categoryUrl: "../../images/blue.png" },
    { categoryId: 2, categoryName: "Color2", categoryUrl: "../../images/pink.png" }
];
var emojiList = [
    { categoryId: 1, emojiName: "blue", emojiUrl: "../../images/blue.png" },
    { categoryId: 1, emojiName: "pink", emojiUrl: "../../images/pink.png" },
    { categoryId: 1, emojiName: "red", emojiUrl: "../../images/red.png" },
    { categoryId: 1, emojiName: "green", emojiUrl: "../../images/green.png" },
    { categoryId: 2, emojiName: "pink", emojiUrl: "../../images/pink.png" },
    { categoryId: 2, emojiName: "red", emojiUrl: "../../images/red.png" },
    { categoryId: 2, emojiName: "blue", emojiUrl: "../../images/blue.png" },
    { categoryId: 2, emojiName: "green", emojiUrl: "../../images/green.png" },
];
var emojiMap = getEmojiMap(emojiList);

var app = angular.module('app', []);

app.filter('unsafe', function ($sce) { return $sce.trustAsHtml; });

app.directive("jeditor", function ($http) {
    return {
        scope: {
            mode: "=mode",
            message: "=message"
        },
        controller: function ($scope) {
            $scope.changeEmojiCategory = function (categoryId) {
                $scope.categoryIdActive = categoryId;
                $scope.emojiDisplayList = getEmojiDisplayList();
            }

            $scope.selectedEmoji = function ($event, emoji) {
                $("#" + $scope.id + " #jeditor-emoji").dropdown("toggle");
                var emojiText = emojiToText(emoji.emojiName)
                insertMessage($scope.id, emojiText);
            }

            $scope.addImageUrl = function () {
                if ($scope.imageUrl != undefined && $scope.imageUrl != "") {
                    $("#" + $scope.id + " #jeditor-image-url").dropdown("toggle");
                    var textInsert = "*" + $scope.imageUrl + "*500" + "*";
                    $scope.imageUrl = "";
                    insertMessage($scope.id, textInsert);
                }
            }

            $scope.selectImage = function () {
                $("#file-" + $scope.id).click();
            }

            $scope.uploadImage = function (element) {
                var IMGUR_CLIENT_ID = '4b71bd9f9738a9a';
                var IMGUR_API_URL = 'https://api.imgur.com/3/image';
                var files = element.files;
                const fd = new FormData();
                fd.append('image', files[0]);
                setProgressBar(0);
                var xhr = new XMLHttpRequest();
                xhr.open('POST', IMGUR_API_URL, true);
                xhr.setRequestHeader('Authorization', 'Client-ID ' + IMGUR_CLIENT_ID);
                xhr.onload = function () {
                    setProgressBar(0);
                }
                xhr.onreadystatechange = function () {
                    console.log(xhr.readyState);
                    if (xhr.readyState === 4) {
                        var response = JSON.parse(xhr.responseText);
                        if (response.status === 200 && response.success) {
                            var textInsert = "*" + response.data.link + "*500" + "*";
                            insertMessage($scope.id, textInsert);
                            var control = $("#file-" + $scope.id);
                            control.val("");
                            control.replaceWith(control = control.clone(true));
                        } else {
                        }
                    }
                }
                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        console.log(percentComplete);
                        setProgressBar(percentComplete * 100)
                    }
                }, false);
                xhr.send(fd);
                console.log(files);
            }

            $scope.getPreview = function () {
                var text = $scope.message;
                // emoji
                var emojiRegex = /:+\w+:/g;
                text = text.replace(emojiRegex, function (emoji) {
                    var emojiName = emoji.replace(/:/g, "");
                    return '<img class="emoji-img" src="' + emojiMap[emojiName] + '" />';
                })
                // link
                var urlRegex = /(?<![*])(https?:\/\/[^\s]+)/g;
                text = text.replace(urlRegex, function (url) {
                    return '<a target="_blank" href="' + url + '">' + url + '</a>';
                });
                // image
                var imageRegex = /[\*]+(https?:\/\/[^\s][^\*]+)\*{1}(\d)+[\*]/g;
                text = text.replace(imageRegex, function (url) {
                    var imageInfo = url.split("*")
                    return '<img class="editor-img" src="' + imageInfo[1] + '" width=' + imageInfo[2] + ' />';
                });
                return text;
            }

            var init = function () {
                autosize($('textarea'));
                $scope.emojiMap = emojiMap;
                $scope.emojiCategoryList = emojiCategoryList;
                $scope.emojiList = emojiList;
                $scope.categoryIdActive = 1;
                $scope.emojiDisplayList = getEmojiDisplayList();
                $scope.id = makeid();
            }

            function getEmojiDisplayList() {
                var emojiDisplay = [];
                $scope.emojiList.forEach(function (emoji) {
                    if (emoji.categoryId == $scope.categoryIdActive) {
                        emojiDisplay.push(emoji);
                    }
                });
                return emojiDisplay;
            }

            function setProgressBar(percent) {
                var background = 'linear-gradient(90deg, orange ' + percent + '%, #FFFFFF 0%)'
                $("#" + $scope.id + " .jeditor-upload-bar").css({ background: background });
            }

            function insertMessage(id, text) {
                var txtarea = document.getElementById("textarea-" + id);

                if (!txtarea) {
                    return;
                }

                var scrollPos = txtarea.scrollTop;
                var strPos = 0;
                var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
                    "ff" : (document.selection ? "ie" : false));
                if (br == "ie") {
                    txtarea.focus();
                    var range = document.selection.createRange();
                    range.moveStart('character', -txtarea.value.length);
                    strPos = range.text.length;
                } else if (br == "ff") {
                    strPos = txtarea.selectionStart;
                }

                var front = (txtarea.value).substring(0, strPos);
                var back = (txtarea.value).substring(strPos, txtarea.value.length);
                txtarea.value = front + text + back;
                strPos = strPos + text.length;
                if (br == "ie") {
                    txtarea.focus();
                    var ieRange = document.selection.createRange();
                    ieRange.moveStart('character', -txtarea.value.length);
                    ieRange.moveStart('character', strPos);
                    ieRange.moveEnd('character', 0);
                    ieRange.select();
                } else if (br == "ff") {
                    txtarea.selectionStart = strPos;
                    txtarea.selectionEnd = strPos;
                    txtarea.focus();
                }

                txtarea.scrollTop = scrollPos;

                $scope.message = txtarea.value;
            }

            init();
        },
        restrict: "E",
        templateUrl: "lib/jeditor/template.html"
    };
});

app.controller('controller', function ($scope, $http) {
    $scope.mode = "INSERT"
    $scope.message = ""
})

function emojiToText(emojiName) {
    return " :" + emojiName + ": "
}

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 20; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function getEmojiMap(emojiList) {
    var emojiReturn = {};
    emojiList.forEach(function (emoji) {
        emojiReturn[emoji.emojiName] = emoji.emojiUrl;
    })
    return emojiReturn;
}