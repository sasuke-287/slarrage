window.addEventListener("load", () => {
  chrome.runtime.onMessage.addListener((request) => {
    if ("stop" in request) {
      observer.disconnect();
    }
  });

  const observer = new MutationObserver((records) => {
    const messages = records.map(toMessages).flat();
    if (messages.length > 0) {
      chrome.runtime.sendMessage({ messages });
    }
  });

  const observe = () => {
    const target = document.querySelector(
      'div[data-qa="message_pane"] .c-virtual_list__scroll_container'
    );
    // タイミングによってはtargetがまだできていないので見つかるまでループする
    if (target === null) {
      setTimeout(observe, 1000);
    } else {
      observer.observe(target, { childList: true });
    }
  };

  observe();

  const toMessages = (record) => {
    return Array.from(record.addedNodes, (node) => {
      // アイコンを取得
      var iconUrl = toIcons();

      // 名前を取得
      var userName = toUserName();

      // 自分で投稿したメッセージには仮のIDとしてタイムスタンプにxが含まれているっぽいので、これを無視
      if (node.id.indexOf("x") >= 0) {
        return;
      }

      // 古い投稿がなんらかの理由で紛れ込むのを防ぐ
      const ts = parseFloat(node.id);
      if (ts < new Date().getTime() / 1000 - 3) {
        return;
      }

      const targetDiv = node.querySelector(".p-rich_text_section");
      if (targetDiv == null) {
        // botの場合
        const botMessageSpan = node.querySelector(
          'span[data-qa="message-text"]'
        );
        if (botMessageSpan != null) {
          return toMessage(botMessageSpan);
        }
      }

      // その他、テキストのみ、テキスト絵文字混合の場合
      return toMessage(targetDiv, iconUrl, userName);
    }).filter((message) => message != null);
  };

  const toIcons = () => {
    var iconSpan = document.getElementsByClassName(
      "c-base_icon__width_only_container"
    );
    var lastIconSpan = iconSpan[iconSpan.length - 1];
    var IconImg = lastIconSpan.firstChild;

    return IconImg.src;
  };

  const toUserName = () => {
    var UserNameTargets = document.getElementsByClassName(
      "c-message__sender_button"
    );
    var UserName = UserNameTargets[UserNameTargets.length - 1];

    return UserName.textContent;
  };

  const toMessage = (element, iconUrl, userName) => {
    const commands = extractCommands(element.innerText);
    const contents = Array.from(element.childNodes, (child) => {
      if (child.nodeName === "#text") {
        return {
          text: removeCommands(child.textContent),
          iconUrl: iconUrl,
          userName: userName,
        };
      }
      const img = child.nodeName === "IMG" ? child : child.querySelector("img");
      if (img != null) {
      return { text: "{" + img.dataset.stringifyEmoji + "}", iconUrl: iconUrl, userName: userName, };
      }

      return {
        text: removeCommands(child.textContent),
        iconUrl: iconUrl,
        userName: userName,
      };
    });
    return { contents, commands };
  };

  const extractCommands = (innerText) => {
    const commandResult = innerText.match(/\[(.+?)]/);
    if (commandResult == null) return [];
    return commandResult[1].split(" ");
  };

  const removeCommands = (textContent) => {
    return textContent.replace(/\[(.+?)]/, "");
  };
});
