if (typeof slarragePresentationLoaded === "undefined") {
  const slarragePresentationLoaded = true;

  (() => {
    let preference;

    // 初回読み込み時、プリファレンスの要求を行う
    chrome.runtime.sendMessage({ getPreference: true }, (response) => {
      preference = response.preference;
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      const { messages } = request;
      if (messages != null) {
        messages.forEach(showSuperChat);
      }
    });

    const showSuperChat = async (message) => {
      // メッセージテキストの抽出
      // テキストは展開する(複数行メッセージ対策)
      const texts = getMessageText(message);
      const iconUrls = getIconUrl(message);
      const userNames = getUserName(message);

      const value = message.commands[0];
      const text = texts.join('');
      const iconUrl = iconUrls[0];
      const userName = userNames[0];
      var comment_element = document.getElementById("CommentList");

      comment_element.insertAdjacentHTML('beforeend', 
        '<div class="spc-div">'
        +'<div class="user-message">' + text + '</div>'
        +'<img class="icon-url" src="' + iconUrl + '">' +'</img>'
        +'<div class="user-name">' + userName + '</div>'
        +'<div class="value">' + value + '</div>'
        +'</div>');  
    };

    const getMessageText = ({ contents }) => {
      return contents.map(({ text }) => {
        if (text != null) {
          return text;
        }
      });
    };

    const getIconUrl = ({ contents }) => {
      return contents.map(({ iconUrl }) => {
        if (iconUrl != null) {
          return iconUrl;
        }
      });
    };

    const getUserName = ({ contents }) => {
      return contents.map(({ userName }) => {
        if (userName != null) {
          return userName;
        }
      });
    };

  })();
}
