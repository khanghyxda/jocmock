$(document).ready(function () {
  autosize($('textarea'));
  document.emojiSource = 'lib/pngs/';
  $('#comment-editor').summernote({
    toolbar: [
      ['misc', ['emoji']],
      ['insert', ['picture', 'link']]
    ],
    tabsize: 2,
    height: 200,
    lang: 'vi-VN'
  });

  $('.tags-user').tagsinput({
    allowDuplicates: true,
    itemValue: 'value',
    itemText: 'text'
  });

  $(".comment-add a").on("click", function () {
    $(this).closest(".comment-add").find(".comment-input").show();
    $(this).closest(".comment-add").find(".comment-input .bootstrap-tagsinput").hide();
    $(this).hide();
  });

  $(".comment-reply").on("click", function () {
    $(this).closest(".comment-list").find(".comment-add a").hide();
    $(this).closest(".comment-list").find(".comment-input").show();
    $(this).closest(".comment-list").find(".comment-input .bootstrap-tagsinput").show();
    $(this).closest(".comment-list").find(".comment-input .tags-user").tagsinput('add', { value: $(this).attr("data-uid"), text: $(this).attr("data-name") });
  });

  $('input').on('itemRemoved', function (event) {
    if ($(this).val() == "") {
      $(this).closest(".comment-input").find(".bootstrap-tagsinput").hide();
    }
  });

  $('input').on('beforeItemAdd', function(event) {
    console.log(event);
    var arr = $(this).val().split(",");
    if(arr.indexOf(event.item.value) > -1) {
      event.cancel = true;
    }
  });
});
