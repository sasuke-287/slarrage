document.addEventListener("DOMContentLoaded", function () {
  var spc = document.getElementsByClassName("spc-div");
  for (var i = 0; i < spc.length; i++) {
    new Spacha(spc[i], {
      message: "サンプルスパチャ",
      price: 5000000000,
      user: {
          name: "Spacha User"
      }
    });
  }
});

const target = document.getElementById("CommentList");

const observer = new MutationObserver((records) => {
  // 変化が発生したときの処理を記述
  var spc = document.getElementsByClassName("spc-div");

  new Spacha(spc[1], {
    message: spc[1].textContent,
    price: 500,
    user: {
      name: "Spacha User",
    },
  });
});



// 監視の開始
observer.observe(target, {
  childList: true,
});
