window.addEventListener("load", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    initCommon();
    initActions(tab);
    initPreferences();
    initCommandsList();
  });
});

const initCommon = () => {
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", () =>
      chrome.tabs.create({ url: link.getAttribute("href") })
    );
  });
};

const initActions = (tab) => {
  const showSpachaCommentsButton = document.getElementById("show-spacha");
  const showCommentsButton = document.getElementById("show-comments");
  const clearCommentsButton = document.getElementById("clear-comments");

  showSpachaCommentsButton.addEventListener("click", () => {
    chrome.tabs.executeScript(tab.id, { file: "content/likeyoutube.js" });
    chrome.tabs.insertCSS(tab.id, { file: "content/presentation.css" });
    showSpachaCommentsButton.setAttribute("disabled", "true");
    chrome.runtime.sendMessage({ addTabId: tab.id});
  });  
  showCommentsButton.addEventListener("click", () => {
    chrome.tabs.executeScript(tab.id, { file: "content/presentation.js" });
    chrome.tabs.insertCSS(tab.id, { file: "content/presentation.css" });
    showCommentsButton.setAttribute("disabled", "true");
    chrome.runtime.sendMessage({ addTabId: tab.id});
  });
  clearCommentsButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({ clearComments: true });
  });

  chrome.runtime.sendMessage({ hasTabId: tab.id }, ({ result }) => {
    if (result) {
      showSpachaCommentsButton.setAttribute("disabled", "true");
      showCommentsButton.setAttribute("disabled", "true");
    } else {
      showSpachaCommentsButton.removeAttribute("disabled");
      showCommentsButton.removeAttribute("disabled");
    }
  });
};

const initPreferences = () => {
  const opacityInput = document.getElementById("opacity-input");
  const fontSizeInput = document.getElementById("font-size-input");

  opacityInput.addEventListener("change", (e) => {
    chrome.runtime.sendMessage({
      setPreference: { opacity: e.target.value },
    });
  });
  fontSizeInput.addEventListener("change", (e) => {
    chrome.runtime.sendMessage({
      setPreference: { fontSize: e.target.value },
    });
  });

  chrome.runtime.sendMessage({ getPreference: true }, (response) => {
    const { preference } = response;
    opacityInput.value = preference.opacity;
    fontSizeInput.value = preference.fontSize;
  });
};

const initCommandsList = () => {
  const positionCheckbox = document.getElementById("position");
  const animationCheckbox = document.getElementById("animation");
  const barrageCheckbox = document.getElementById("barrage");

  positionCheckbox.addEventListener("change", (e) => {
    chrome.runtime.sendMessage({
      setPreference: { position: e.target.checked },
    });
  });
  animationCheckbox.addEventListener("change", (e) => {
    chrome.runtime.sendMessage({
      setPreference: { animation: e.target.checked },
    });
  });
  barrageCheckbox.addEventListener("change", (e) => {
    chrome.runtime.sendMessage({
      setPreference: { barrage: e.target.checked },
    });
  });

  chrome.runtime.sendMessage({ getPreference: true }, (response) => {
    const { preference } = response;
    positionCheckbox.checked = preference.position;
    animationCheckbox.checked = preference.animation;
    barrageCheckbox.checked = preference.barrage;
  });
};
