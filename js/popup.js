
function _onClickAction() {

  let target_url = getTargetUrl();
  let site = getSite();
  let paths = getPaths(site, target_url);

  paths.forEach(path => 
    openTabs(path)
  );

}
function openTabs(path) {
  //update current url
  // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //   chrome.tabs.update(undefined, {url: "https://www.google.com"});
  // });

  // open new tab with current url
    // chrome.tabs.create({
    //   url : url
    // });

}

function getTargetUrl(){
  // target url is set in chrome.storage from background.js

  // chrome.windows.getCurrent(w => {
  //   chrome.tabs.query({active: true, windowId: w.id}, tabs => {
  //     const target_url = tabs[0].id;
  //     // use tabId here...
  //   });
  // });

  let target_url = 'default';

  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    console.log(tabs[0]);
  });

  alert(target_url);
  return target_url;
}

function businessUrls(){
  var paths = 
  [
      "/finance/loans/best-crowdfunding-sites-for-startups/",
      "/finance/accounting/small-business-bookkeeping-basics/"
  ]

  return paths;
};

function getSite(){
  var selectedSite = document.getElementById("sites").value;
 
  return selectedSite;
}

function getPaths(site){
  let urls = [];

  switch(site) {
    case 'business':
      urls = businessUrls();
      break;
    case 'reviews':
      //urls = reviewsUrls();
      break;
    default:
      break;
  }

  return urls

}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("sites").onclick = _onClickAction;
});