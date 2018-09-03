  $(document).ready(function () {
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
  });