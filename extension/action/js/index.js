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

        // ランキング更新
        UpdateRank(userName, value);
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

function UpdateRank(userName, value) {
  // 今回の情報を配列に追加
  results.push({
    userName: userName,
    price: value,
  });

  // 更新後のデータを集計
  // DOMを更新する

  // 総金額
  var totalElement = document.getElementsByClassName("total")[0];

  var totalPrice = results.reduce(function (sum, element) {
    return sum + element.price;
  }, 0);

  totalElement.textContent = totalPrice;

  // 単体金額ランキング
  var priceRankElement = document.getElementsByClassName("price-ranking")[0];

  var sortValue = sortBy(results, "DESC", "price");

  priceRankElement.getElementsByClassName("user-name")[0].textContent =
    sortValue[0].userName;
  priceRankElement.getElementsByClassName("value")[0].textContent =
    sortValue[0].price;

  if (typeof sortValue[1] !== "undefined") {
    priceRankElement.getElementsByClassName("user-name")[1].textContent =
      sortValue[1].userName;
    priceRankElement.getElementsByClassName("value")[1].textContent =
      sortValue[1].price;
  }

  if (typeof sortValue[2] !== "undefined") {
    priceRankElement.getElementsByClassName("user-name")[2].textContent =
      sortValue[2].userName;
    priceRankElement.getElementsByClassName("value")[2].textContent =
      sortValue[2].price;
  }

  // 合計金額ランキング
  var sumRankElement = document.getElementsByClassName("sum-price-ranking")[0];
  var timesRankElement = document.getElementsByClassName(
    "spacha-times-ranking"
  )[0];

  // ユーザーごとの金額
  var tmpPriceResult = {};
  for (const result of results) {
    if (!tmpPriceResult[result.userName]) {
      tmpPriceResult[result.userName] = 0;
    }
    tmpPriceResult[result.userName] += result.price;
  }

  // ユーザーごとの回数
  var tmpTimesResult = {};
  for (const result of results) {
    if (!tmpTimesResult[result.userName]) {
      tmpTimesResult[result.userName] = 0;
    }
    tmpTimesResult[result.userName] += 1;
  }

  // 完成配列
  var userResults = [];
  for (const userResult of Object.keys(tmpPriceResult)) {
    userResults.push({
      userName: userResult,
      price: tmpPriceResult[userResult],
      times: tmpTimesResult[userResult],
    });
  }

  var sumSortValue = sortBy(userResults, "DESC", "price");
  var timesSortValue = sortBy(userResults, "DESC", "times");

  sumRankElement.getElementsByClassName("user-name")[0].textContent =
    sumSortValue[0].userName;
  sumRankElement.getElementsByClassName("value")[0].textContent =
    sumSortValue[0].price;

  if (typeof sumSortValue[1] !== "undefined") {
    sumRankElement.getElementsByClassName("user-name")[1].textContent =
      sumSortValue[1].userName;
    sumRankElement.getElementsByClassName("value")[1].textContent =
      sumSortValue[1].price;
  }

  if (typeof sumSortValue[2] !== "undefined") {
    sumRankElement.getElementsByClassName("user-name")[2].textContent =
      sumSortValue[2].userName;
    sumRankElement.getElementsByClassName("value")[2].textContent =
      sumSortValue[2].price;
  }

  timesRankElement.getElementsByClassName("user-name")[0].textContent =
    timesSortValue[0].userName;
  timesRankElement.getElementsByClassName("times")[0].textContent =
    timesSortValue[0].times;

  if (typeof timesSortValue[1] !== "undefined") {
    timesRankElement.getElementsByClassName("user-name")[1].textContent =
      timesSortValue[1].userName;
    timesRankElement.getElementsByClassName("times")[1].textContent =
      timesSortValue[1].times;
  }

  if (typeof timesSortValue[2] !== "undefined") {
    timesRankElement.getElementsByClassName("user-name")[2].textContent =
      timesSortValue[2].userName;
    timesRankElement.getElementsByClassName("times")[2].textContent =
      timesSortValue[2].times;
  }
}

/**
 * 二次元配列または連想配列の並び替え
 * @param {*[]} array 並び替える配列
 * @param {'ASC'|'DESC'} [order] 並び替える方法
 * @param {...*} args 並び替えの基準となるキー
 * @return {*[]} 並び替えられた配列
 */
var sortBy = function (array, order) {
  if (!order || !order.match(/^(ASC|DESC)$/i)) order = "ASC";
  order = order.toUpperCase();

  var keys = [];
  for (var i = 2, len = arguments.length; i < len; i++) keys.push(arguments[i]);

  var targets = [].concat(array);

  targets.sort(function (a, b) {
    for (var i = 0, len = keys.length; i < len; i++) {
      if (typeof keys[i] === "string") {
        if (order === "ASC") {
          if (a[keys[i]] < b[keys[i]]) return -1;
          if (a[keys[i]] > b[keys[i]]) return 1;
        } else {
          if (a[keys[i]] > b[keys[i]]) return -1;
          if (a[keys[i]] < b[keys[i]]) return 1;
        }
      } else {
        var localOrder = keys[i].order || "ASC";
        if (!localOrder.match(/^(ASC|DESC)$/i)) order = "ASC";
        order = order.toUpperCase();

        if (localOrder === "ASC") {
          if (a[keys[i].key] < b[keys[i].key]) return -1;
          if (a[keys[i].key] > b[keys[i].key]) return 1;
        } else {
          if (a[keys[i].key] > b[keys[i].key]) return -1;
          if (a[keys[i].key] < b[keys[i].key]) return 1;
        }
      }
    }

    return 0;
  });

  return targets;
};
