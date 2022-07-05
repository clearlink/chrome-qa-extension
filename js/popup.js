
document.addEventListener("DOMContentLoaded", async () => {

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  console.log(tab);
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getTestURLS(tab),
  });
});


// PIPELINE

function getTestURLS(tab) {
  console.log(tab);
  var url = tab.url;
  var urlHost = getURLHost(url);
  var mydiv = document.getElementById("rainbow-box");
  let siteName = getSite(tab, urlHost);
  let isLocalHost = urlHost.indexOf("localhost") > 1;

  // for sites not detected, and not localhost
  if ( !isLocalHost && (siteName == "other")){
    var noneFound = document.createElement('p');

    noneFound.innerText = 'No Test Pages Found';
    mydiv.appendChild(noneFound);
  }

  // for localhost
  if ( isLocalHost ){
    console.log("in local host");
    
    var selectList = document.createElement("div");
    selectList.name = "sites";
    selectList.id = "sites";
    mydiv.appendChild(selectList);

    let allSites = getAllSites();

    for (let site of allSites) {
      var option = document.createElement("a");
      var linebreak = document.createElement("br");
      
      option.value = site[1];
      option.innerText = site[0];

      option.onclick = function () {
        let siteName = site[0].toLowerCase();
        let mydiv = document.getElementById("rainbow-box");
        let urlHost = getURLHost(url);
        console.log("CLICK");
        console.log(siteName);
        console.log(mydiv);
        console.log(urlHost);
        document.getElementById("sites").remove();

        (createPaths(siteName, mydiv, urlHost))
        
      };
      
      selectList.appendChild(option);
      selectList.appendChild(linebreak);
    }

  }

  // for detected sites not localhost
  if ( !isLocalHost && (siteName != "other")){
    createPaths(siteName, mydiv, urlHost);
  }
}

// CREATE THE PATHS TO DISPLAY IN POPUP.HTML

function createPaths(siteName, mydiv, urlHost){
  let paths = getPaths(siteName);

  paths.forEach(path => {
    var aTag = document.createElement('a');
    var linebreak = document.createElement("br");

    console.log(path);
    aTag.innerText = "/" + path;
    mydiv.appendChild(aTag);
    mydiv.appendChild(linebreak);

    aTag.onclick = function() { 
      chrome.tabs.update(undefined, {url: urlHost + path}
    )};
  });

  var openAll = document.createElement('a');

  openAll.innerText = "OPEN ALL IN NEW TABS";
  mydiv.appendChild(openAll);

  openAll.onclick = function() { 
    openTabs(urlHost, paths)
  };

}


// GET THE SITES AND THEIR MULTI NAMES

function getAllSites(){
  var allSites = [
    ["Business", "borg"],
    ["CableTV", "ctv"],
    ["HighSpeedInternet", "hsi"],
    ["Move", "move"],
    ["Reviews", "reviews"],
    ["SatelliteInternet", "Satellite Internet"],
    ["SoftwareGuides", "softwareguides"],
    ["Safewise", "SafeWise"]
  ];
  return allSites;
}


// CREATE THE TABS

function openTabs(url, paths) {
  for (let path of paths){
    chrome.tabs.create({
      url : url + path,
      active: false
    });
  }
}


// GET THE URL HOST

function getURLHost(url){
  let urlHost = '';

  if (url.indexOf(".com/") > 1){
    let urlSplit = url.split('.com/');
    urlSplit[0] = urlSplit[0] + '.com/';
    urlHost = urlSplit[0];
  }
  if (url.indexOf(".io/") > 1){
    let urlSplit = url.split('.io/');
    urlSplit[0] = urlSplit[0] + '.io/';
    urlHost = urlSplit[0];
  }
  if (url.indexOf(".ca/") > 1){
    let urlSplit = url.split('.ca/');
    urlSplit[0] = urlSplit[0] + '.ca/';
    urlHost = urlSplit[0];
  }
  if (url.indexOf(".org/") > 1){
    let urlSplit = url.split('.org/');
    urlSplit[0] = urlSplit[0] + '.org/';
    urlHost = urlSplit[0];
  }
  if (url.indexOf("localhost") > 1 ){
    let index = url.indexOf("localhost") + "localhost".length + 6;
    urlHost = url.slice(0, index);
  }

  return urlHost;

}


// GET POPUP SELECT VALUE

function getSite(tab, urlHost){
  let title = tab.title.toLowerCase();
  console.log(title);
  let url = tab.url;
  let allSites = getAllSites();

    let currentSite = 'other';

    for (let site of allSites) {
      console.log(site[0]);
        if (urlHost.indexOf(site[0].toString().toLowerCase()) > 1){
          currentSite = site[0].toLowerCase();
          break;
        }
        if (urlHost.indexOf(site[1].toLowerCase()) > 1){
          currentSite = site[0].toLowerCase();
          break;
        }
      }
 
  console.log(allSites);
  return currentSite;
}


// CHOOSE WHICH PATHS TO SELECT

function getPaths(siteName){
  let urls = [];
  console.log(siteName);

  switch(siteName) {
    case 'business':
      urls = businessUrls();
      break;
    case 'cabletv':
      urls = CableTVUrls();
      break;
    case 'highspeedinternet':
      urls = highSpeedInternetUrls();
      break;
    case 'move':
      urls = moveUrls();
      break;
    case 'reviews':
      urls = reviewsUrls();
      break;
    case 'satelliteinternet':
      urls = satelliteInternetUrls();
      break;
    case 'softwareguides':
      urls = softwareGuidesUrls();
      break;
    case 'safewise':
      urls = safewiseUrls();
      break;
  }

  return urls
}


// PATHS LISTS

// borg
function businessUrls(){
  var paths = 
  [
      "finance/loans/business-startup-costs/",
      "finance/loans/business-loan-requirements/",
      "finance/accounting/best-payroll-companies/",
      "software/point-of-sale/best-pos-systems-for-business/",
      "services/internet/best-business-high-speed-internet-providers/",
      "finance/loans/commercial-loan-calculator/",
      "finance/loans/business-loan-calculator/",
      "finance/loans/sba-business-loan-calculator/"
  ]

  return paths;
};

// ctv
function CableTVUrls(){
  var paths = 
  [
      "xfinity/internet/",
      "blog/best-streaming-services/",
      "blog/low-income-internet/",
      "ny/new-york/",
      "tx/san-antonio/",
      "blog/"
  ]

  return paths;
};

// hsi
function highSpeedInternetUrls(){
  var paths = 
  [
      "providers/",
      "tools/speed-test/",
      "view-plans3/",
      "resources/internet-for-veterans/",
      "resources/no-internet-connection-troubleshooting-guide/",
      "how-much-internet-speed-do-i-need/",
      "ca/los-angeles/",
      "tx/houston/"
  ]

  return paths;
};

// mov
function moveUrls(){
  var paths = 
  [
      "best-movers/long-distance/",
      "best-interstate-moving-companies/",
      "best-car-shipping-companies/",
      "best-moving-container-companies/",
      "utility-bills-101/"
  ]

  return paths;
};

// rev
function reviewsUrls(){
  var paths = 
  [
      "home-security/best-home-security-systems/",
      "home-security/best-outdoor-security-cameras/",
      "home-security/vivint-smart-home-security-review/",
      "tv-service/best-tv-service-providers/",
      "tv-service/dish-vs-directv/",
      "tv-service/dish-network-review/",
      "internet-service/best-satellite-internet-providers/",
      "internet-service/best-internet-service-providers/",
      "internet-service/how-to-speed-internet-connection/",
      "mobile/best-cell-phone-plans/",
      "mobile/best-cell-phone-coverage/",
      "mobile/visible-wireless-review/ "
  ]

  return paths;
};

// si
function satelliteInternetUrls(){
  var paths = 
  [
      "in-your-area/",
      "resources/high-speed-internet-for-rural-areas/",
      "providers/starlink/",
      "resources/viasat-vs-hughesnet/"
  ]

  return paths;
};

// swg
function softwareGuidesUrls(){
  var paths = 
  [
      "project-management-software/",
      "workforce-management-software/",
      "scheduling-software/",
      "learning-management-systems/",
      "crm-software-2/"
  ]

  return paths;
};

// sw
function safewiseUrls(){
  var paths = 
  [
      "best-home-security-system/",
      "blog/best-wireless-security-cameras/",
      "resources/wearable-gps-tracking-devices-for-kids-guide/",
      "state-of-safety/"
  ]

  return paths;
};
