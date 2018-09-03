$(document).ready(function () {
  autosize($('textarea'));
  $('.jeditor-bar .emoji-category').click(function (e) {
    e.stopPropagation();
  })

  $("#jeditor-image").on("click", function() {
    document.getElementById('fileInput').click();
  })
});
