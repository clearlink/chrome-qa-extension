// Initialize button with user's preferred color
//let changeColor = document.getElementById("changeColor");

function openTabs() {



  // update current url
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.update(undefined, {url: "https://www.google.com"});
  });


  // open new tab with current url
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url

    chrome.tabs.create({
      url : url
    });
  });

}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("sites").onclick = openTabs;
});