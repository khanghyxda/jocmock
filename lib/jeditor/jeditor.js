var emojiCategoryList = [
    { categoryId: 1, categoryName: "Color1", categoryUrl: "https://www.googleapis.com/download/storage/v1/b/joc-img/o/20180906092841SCD9JILQEJUDQWO9SE92?generation=1536193721483152&alt=media" },
    { categoryId: 2, categoryName: "Color2", categoryUrl: "https://www.googleapis.com/download/storage/v1/b/joc-img/o/20180906092909HYNFK1IE8O7DRM6SUFSV?generation=1536193750145376&alt=media" }
];
var emojiList = [
    { categoryId: 1, emojiName: "pink", emojiUrl: "https://www.googleapis.com/download/storage/v1/b/joc-img/o/20180906092909HYNFK1IE8O7DRM6SUFSV?generation=1536193750145376&alt=media" },
    { categoryId: 1, emojiName: "red", emojiUrl: "https://www.googleapis.com/download/storage/v1/b/joc-img/o/20180906092820UXE13MJM4J6FN8DT01JF?generation=1536193701134948&alt=media" },
    { categoryId: 1, emojiName: "green", emojiUrl: "https://www.googleapis.com/download/storage/v1/b/joc-img/o/20180906092753WW53FQBIOG7VCC8Y51SO?generation=1536193674269215&alt=media" },
    { categoryId: 1, emojiName: "blue", emojiUrl: "https://www.googleapis.com/download/storage/v1/b/joc-img/o/20180906092841SCD9JILQEJUDQWO9SE92?generation=1536193721483152&alt=media" },
    { categoryId: 2, emojiName: "pink", emojiUrl: "https://www.googleapis.com/download/storage/v1/b/joc-img/o/20180906092909HYNFK1IE8O7DRM6SUFSV?generation=1536193750145376&alt=media" },
    { categoryId: 2, emojiName: "red", emojiUrl: "https://www.googleapis.com/download/storage/v1/b/joc-img/o/20180906092820UXE13MJM4J6FN8DT01JF?generation=1536193701134948&alt=media" },
    { categoryId: 2, emojiName: "blue", emojiUrl: "https://www.googleapis.com/download/storage/v1/b/joc-img/o/20180906092841SCD9JILQEJUDQWO9SE92?generation=1536193721483152&alt=media" },
    { categoryId: 2, emojiName: "green", emojiUrl: "https://www.googleapis.com/download/storage/v1/b/joc-img/o/20180906092753WW53FQBIOG7VCC8Y51SO?generation=1536193674269215&alt=media" },
];
var emojiMap = getEmojiMap(emojiList);

var app = angular.module('app', []);

app.filter('unsafe', function ($sce) { return $sce.trustAsHtml; });

app.directive("jeditor", function ($http) {
    return {
        scope: {
            mode: "=mode",
            message: "=message",
            update: "=update",
            add: "=add"
        },
        controller: function ($scope) {
            $scope.inProgress = false;

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
                            var control = $("#file-" + $scope.id);
                            control.val("");
                            control.replaceWith(control = control.clone(true));
                            var textInsert = "*" + response.data.link + "*500" + "*";
                            insertMessage($scope.id, textInsert);
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
                var text = $scope.message.toString();
                // emoji
                var emojiRegex = /:+\w+:/g;
                text = text.replace(emojiRegex, function (emoji) {
                    var emojiName = emoji.replace(/:/g, "");
                    return '<img class="emoji-img" src="' + emojiMap[emojiName] + '" />';
                })
                // link
                var urlRegex = /(?<!["'*])(https?:\/\/[^\s]+)/g;
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
        templateUrl: "lib/jeditor/jeditor.html"
    };
});

app.controller('controller', function ($scope, $http) {
    $scope.mode = 1
    $scope.message = ""
    $scope.update = function (id) {
        var scope = angular.element($("#" + id)).scope();
        scope.message = '';
    }
    $scope.add = function (id) {
        var scope = angular.element($("#" + id)).scope();
        scope.message = 'Update';
        scope.inProgress = true;
    }
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