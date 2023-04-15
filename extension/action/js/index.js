var results = [];

const target = document.getElementById("CommentList");

const observer = new MutationObserver((mutations) => {
  // 変化が発生したときの処理を記述
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      var userMessage =
        node.getElementsByClassName("user-message")[0].textContent;
      var iconUrl = node.getElementsByTagName("img")[0];
      var userName = node.getElementsByClassName("user-name")[0].textContent;
      var value = parseFloat(
        node.getElementsByClassName("value")[0].textContent
      );

      if (!isNaN(value)) {
        new Spacha(node, {
          message: userMessage,
          price: value,
          user: {
            name: userName,
            img: iconUrl,
          },
        });
      }
    });
  });

  var comment_element = document.getElementById("CommentList");
  // 最下部までスクロールする
  comment_element.scrollTop = comment_element.scrollHeight;
});

// 監視の開始
observer.observe(target, {
  childList: true,
});
