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
      const text = getMessageText(message);
      const iconUrl = getIconUrl(message);

      var comment_element = document.getElementById("CommentList");

      comment_element.insertAdjacentHTML('beforeend', 
        '<div class="spc-div">'
        + text
        +'<img src="' + iconUrl + '">'
        +'</img>'
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

  })();
}
