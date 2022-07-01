
document.addEventListener("DOMContentLoaded", function () {
  sites.addEventListener("click", async () => {

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  console.log(tab);

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: _onClickAction(tab.url),

    });
  });
});

// PIPELINE

function _onClickAction(url) {

  console.log(url);
  let siteName = getSite();
  let paths = getPaths(siteName, url);

  paths.forEach(path => 
    openTabs(url, path)
  );

// CREATE THE TABS

}
function openTabs(url, path) {
  // if want to update current url (future)
  // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //   chrome.tabs.update(undefined, {url: "https://www.google.com"});
  // });

    chrome.tabs.create({
      url : url + path,
      active: false
    });

}

// GET POPUP SELECT VALUE

function getSite(){
  var selectedSite = document.getElementById("sites").value;
 
  return selectedSite;
}

// CHOOSE WHICH PATHS TO SELECT

function getPaths(siteName){
  let urls = [];

  switch(siteName) {
    case 'business':
      urls = businessUrls();
      break;
    case 'cable_tv':
      urls = CableTVUrls();
      break;
    case 'high_speed_internet':
      urls = highSpeedInternetUrls();
      break;
    case 'move':
      urls = moveUrls();
      break;
    case 'reviews':
      urls = reviewsUrls();
      break;
    case 'satellite_internet':
      urls = satelliteInternetUrls();
      break;
    case 'software_guides':
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
      "/finance/loans/business-startup-costs/",
      "/finance/loans/business-loan-requirements/",
      "/finance/accounting/best-payroll-companies/",
      "/software/point-of-sale/best-pos-systems-for-business/",
      "/services/internet/best-business-high-speed-internet-providers/",
      "/finance/loans/commercial-loan-calculator/",
      "/finance/loans/business-loan-calculator/",
      "/finance/loans/sba-business-loan-calculator/"
  ]

  return paths;
};

// ctv
function CableTVUrls(){
  var paths = 
  [
      "/xfinity/internet/",
      "/blog/best-streaming-services/",
      "/blog/low-income-internet/",
      "/ny/new-york/",
      "/tx/san-antonio/",
      "/blog"
  ]

  return paths;
};

// hsi
function highSpeedInternetUrls(){
  var paths = 
  [
      "/providers/",
      "/tools/speed-test/",
      "/view-plans3/",
      "/resources/internet-for-veterans/",
      "/resources/no-internet-connection-troubleshooting-guide/",
      "/how-much-internet-speed-do-i-need/",
      "/ca/los-angeles/",
      "/tx/houston/"
  ]

  return paths;
};

// mov
function moveUrls(){
  var paths = 
  [
      "/best-movers/long-distance/",
      "/best-interstate-moving-companies/",
      "/best-car-shipping-companies/",
      "/best-moving-container-companies/",
      "/utility-bills-101/"
  ]

  return paths;
};

// rev
function reviewsUrls(){
  var paths = 
  [
      "/home-security/best-home-security-systems/",
      "/home-security/best-outdoor-security-cameras/ ",
      "/home-security/vivint-smart-home-security-review/",
      "/tv-service/best-tv-service-providers/",
      "/tv-service/dish-vs-directv/",
      "/tv-service/dish-network-review/",
      "/internet-service/best-satellite-internet-providers/",
      "/internet-service/best-internet-service-providers/",
      "/internet-service/how-to-speed-internet-connection/",
      "/mobile/best-cell-phone-plans/",
      "/mobile/best-cell-phone-coverage/",
      "/mobile/visible-wireless-review/ "
  ]

  return paths;
};

// si
function satelliteInternetUrls(){
  var paths = 
  [
      "/in-your-area/",
      "/resources/high-speed-internet-for-rural-areas/",
      "/providers/starlink/",
      "/resources/viasat-vs-hughesnet/"
  ]

  return paths;
};

// swg
function softwareGuidesUrls(){
  var paths = 
  [
      "/project-management-software/",
      "/workforce-management-software/",
      "/scheduling-software/",
      "/learning-management-systems/",
      "/crm-software-2/ "
  ]

  return paths;
};

// sw
function safewiseUrls(){
  var paths = 
  [
      "/best-home-security-system/",
      "/blog/best-wireless-security-cameras/",
      "/resources/wearable-gps-tracking-devices-for-kids-guide/",
      "/state-of-safety/"
  ]

  return paths;
};