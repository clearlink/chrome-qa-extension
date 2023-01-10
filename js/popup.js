
// For localhost: tab -> title key words

// For localhost, CTV and HSI are buggiest because they don't always incude the site name in each post's title
// If it is localhost, and the title approach doesn't work, using fetch instead (slower)
// This feature takes a couple seconds after opening the plugin, but if/when they fix titles it will require less patching later

document.addEventListener("DOMContentLoaded", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  const testURLS = getTestURLS(tab);
});


// DETECT SITE VIA THE URL PARAM

async function getTestURLS(tab){
  var url = tab.url;
  var urlHost = getURLHost(url);
  var mydiv = document.getElementById("rainbow-box");

  // Check for foreign language: au or es
  let lang = detectLang(url);
    
  // Go down this little rabbit hole to get all the site name
  let siteName = getSite(tab, urlHost);

  // Print the paths if it's one of our sites
  // This checks the url, and the title for our sites
  if (siteName !== 'other'){
    createPaths(siteName, mydiv, urlHost, lang);
  } 
  // If it didn't work earlier but still localhost, do it via fetch and schema for site name
  else if (urlHost.includes('localhost')){
  showAllSites(tab.url);
  const siteURL = await getSiteURL(tab);
  createPaths(siteURL, mydiv, urlHost, lang);
  } else { // not our site
    var noneFound = document.createElement('p');

    noneFound.innerText = 'No Test Pages Found';
    mydiv.appendChild(noneFound);
  }
}

// DETECT LANG

const detectLang = (url) => {
  if (url.includes('/au/')) {
    lang = 'au';
  } else if (url.includes('/es/')) {
    lang = 'es';
  } else {
    lang = 'en';
  }
  return lang;
}


// TRY TO FETCH SCHEMA FROM SITE (sometimes iffy for ctv)

const getSiteURL = async (tab) => {
  let siteURL = '';
  await fetch(tab.url)
    .then(response => response.text())
    .then(html => {
      let parser = new DOMParser();
      let doc = parser.parseFromString(html, 'text/html');
      let schemaElements = doc.querySelectorAll('script[type="application/ld+json"]');
      for (let schemaElement of schemaElements) {
        let schemaJson = schemaElement.textContent;
        console.log(schemaJson);
        // Replace the '\ufffd' character with an empty string - attempt to clean the json
        const fixedJsonString = schemaJson.replace(/\ufffd/g, '');
        // If json is parseable, use it.
        try { 
          let schema = JSON.parse(fixedJsonString);
          if (Object.keys(schema).includes('name')) {
            siteURL = schema.name;
            return siteURL;
            break; // exit the loop
          } else if ( schema["@graph"][0]["name"] ){ //ctv has different approach to schema apparently
            siteURL = schema["@graph"][0]["name"];
            return siteURL;
            break; // exit the loop
          }
        } catch {
          // Do nothing, just move on to the next iteration of the loop
        }
        return siteURL;
      }
    })
    .catch(error => {
      console.error(error);
    });
  return siteURL;
};


// SHOW ALL URLS FOR ALL THE SITES (LOCALHOST)

const showAllSites = (url) => { 
  let mydiv = document.getElementById("rainbow-box");
  selectList = document.createElement("div");
  selectList.name = "sites";
  selectList.id = "sites";
  mydiv.appendChild(selectList);
  allSites = getAllSites();

  for (let site of allSites) {
    var option = document.createElement("a");
    var linebreak = document.createElement("br");
    
    option.value = site[1];
    option.innerText = site[0];

    option.onclick = function () {
      let siteName = site[0].toLowerCase();
      let mydiv = document.getElementById("rainbow-box");
      let urlHost = getURLHost(url);
      document.getElementById("sites").remove();

      (createPaths(siteName, mydiv, url, 'en'));
    }
    selectList.appendChild(option);
    selectList.appendChild(linebreak);      
  
}}


// CREATE THE PATHS TO DISPLAY IN POPUP.HTML

function createPaths(siteName, mydiv, urlHost, lang){
  let linebreak = document.createElement("br");
  let paths = getPaths(siteName, lang);
  siteName = siteName.toLowerCase();

  console.log(lang);
  console.log(paths);
  mydiv.innerHTML = '';

  // Make all the paths
  paths.forEach(path => {
    var aTag = document.createElement('a');
    let linebreak = document.createElement("br");

    aTag.innerText = path;
    mydiv.appendChild(aTag);
    mydiv.appendChild(linebreak);

    aTag.onclick = function() { 
      chrome.tabs.update(undefined, {url: urlHost + path.substring(1)});
    };
  });

  // Add HOMEPAGE to en sites to be able to quickly get to homepage without just clicking on a "/"
  if (lang == 'en') {
    var aTag = document.createElement('a');
    let linebreak = document.createElement("br");

    aTag.innerText = "HOMEPAGE"
    mydiv.appendChild(aTag);
    mydiv.appendChild(linebreak);

    aTag.onclick = function() { 
      chrome.tabs.update(undefined, {url: urlHost});
    };
  }

  // Show the AU/US/ES Switching option
  // Manually add the site names here for multilingual sites
  if ( siteName.includes('safewise') || siteName.includes('reviews') || siteName.includes('highspeedinternet')) {
    var switchLang = document.createElement('a');
    if (lang != 'en') {
      switchLang.innerText = "SWITCH VIEW TO US PAGES";
      switchLang.onclick = () => { 
        createPaths( siteName, mydiv, urlHost, 'en' );
      }
    } else if (siteName.includes('safewise') || siteName.includes('reviews')){
      switchLang.innerText = "SWITCH VIEW TO AU PAGES";  
      switchLang.onclick = () => { 
        createPaths( siteName, mydiv, urlHost, 'au' );
      }
    } else if (siteName.includes('highspeedinternet')){
      switchLang.innerText = "SWITCH VIEW TO ES PAGES";  
      switchLang.onclick = () => { 
        createPaths( siteName, mydiv, urlHost, 'es' );
      }
    }
    mydiv.appendChild(switchLang);
    mydiv.appendChild(linebreak);
  }

  var openAll = document.createElement('a');

  openAll.innerText = "OPEN ALL IN NEW TABS";
  mydiv.appendChild(openAll);

  openAll.onclick = () => { 
    openTabs(urlHost, paths);
  };

}


// GET THE SITE NAMES AND THEIR MULTI NAMES

function getAllSites(){
  // [ "Live site name", "multidev name", "key word(s) in title", key word(s) in favIconUrl ]
  var allSites = [
    ["Business", "borg", "business.org"],
    ["CableTV", "ctv", "cable tv providers", "cropped-favicon2"],
    ["HighSpeedInternet", "hsi", "highspeedinternet.com", "hsi-favicon"],
    ["Move", "move", "move.org"],
    ["Reviews", "reviews", "reviews.org"],
    ["SatelliteInternet", "Satellite Internet", "satelliteinternet.com"],
    ["SoftwareGuides", "softwareguides", "softwareguides.org"],
    ["Safewise", "SafeWise", "safewise"]
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
  else if (url.indexOf(".io/") > 1){
    let urlSplit = url.split('.io/');
    urlSplit[0] = urlSplit[0] + '.io/';
    urlHost = urlSplit[0];
  }
  else if (url.indexOf(".ca/") > 1){
    let urlSplit = url.split('.ca/');
    urlSplit[0] = urlSplit[0] + '.ca/';
    urlHost = urlSplit[0];
  }
  else if (url.indexOf(".org/") > 1){
    let urlSplit = url.split('.org/');
    urlSplit[0] = urlSplit[0] + '.org/';
    urlHost = urlSplit[0];
  }
  else if (url.indexOf("localhost") > 1) {
    let index = url.indexOf("localhost") + "localhost".length + 6;
    urlHost = url.slice(0, index);
  }

  return urlHost;

}


// GET POPUP SELECT VALUE

function getSite(tab, urlHost){
  let title = tab.title.toLowerCase();
  console.log('title:', title);
  let url = tab.url;
  let allSites = getAllSites();
  let currentSite = 'other';

  for (let site of allSites) {
      if (urlHost.includes(site[0].toString().toLowerCase())){
        currentSite = site[0].toLowerCase();
      }
      else if (urlHost.includes(site[1].toLowerCase())){
        currentSite = site[0].toLowerCase();
      }
      // check the page title just in case
      else if (title.includes(site[2].toString().toLowerCase())){
        currentSite = site[0].toLowerCase();
      }
      // add favicon else if here
    }
 
  return currentSite;
}


// CHOOSE WHICH PATHS TO SELECT

function getPaths(siteName, lang) {
  siteName = siteName.toLowerCase();
  console.log(siteName);
  console.log(lang);
  let urls = [];

  if (siteName.includes('business')) {
    urls = businessUrls(lang);
  } 
  else if (siteName.includes('cabletv')) {
    urls = CableTVUrls(lang);
  } 
  else if (siteName.includes('highspeedinternet')) {
    urls = highSpeedInternetUrls(lang);
  } 
  else if (siteName.includes('move')) {
    urls = moveUrls(lang);
  } 
  else if (siteName.includes('reviews')) {
    urls = reviewsUrls(lang);
  } 
  else if (siteName.includes('satelliteinternet')) {
    urls = satelliteInternetUrls(lang);
  } 
  else if (siteName.includes('softwareguides')) {
    urls = softwareGuidesUrls(lang);
  } 
  else if (siteName.includes('safewise')) {
    urls = safewiseUrls(lang);
  }

  return urls;
}


// PATHS LISTS

// borg
function businessUrls(lang){
  var paths = {
    'en' : [
      "/finance/loans/business-startup-costs/",
      "/finance/loans/business-loan-requirements/",
      "/finance/accounting/best-payroll-companies/",
      "/software/point-of-sale/best-pos-systems-for-business/",
      "/services/internet/best-business-high-speed-internet-providers/",
      "/finance/loans/commercial-loan-calculator/",
      "/finance/loans/business-loan-calculator/",
      "/finance/loans/sba-business-loan-calculator/"
    ]
  }

  return paths[lang];
};

// ctv
function CableTVUrls(lang){
  var paths = {
    'en' : [
      "/xfinity/internet/",
      "/blog/best-streaming-services/",
      "/blog/low-income-internet/",
      "/ny/new-york/",
      "/tx/san-antonio/",
      "/blog/"
    ]
  }

  return paths[lang];
};

// hsi
function highSpeedInternetUrls(lang){
  var paths = {
    'en' : [
      "/providers/",
      "/tools/speed-test/",
      "/view-plans3/",
      "/resources/internet-for-veterans/",
      "/resources/no-internet-connection-troubleshooting-guide/",
      "/how-much-internet-speed-do-i-need/",
      "/providers/fiber/",
      "/ca/los-angeles/",
      "/tx/houston/"
    ],
    'es' : [
      "/es/",
      "/es/en-tu-area/",
      "/es/herramientas/test-velocidad/",
      "/es/que-velocidad-necesito/" 
    ]
  }

  return paths[lang];
};

// mov
function moveUrls(lang){
  var paths = {
    'en' : [
      "/best-movers/long-distance/",
      "/best-interstate-moving-companies/",
      "/best-car-shipping-companies/",
      "/best-moving-container-companies/",
      "/utility-bills-101/"
    ]
  }

  return paths[lang];
};

// rev
function reviewsUrls(lang){
  var paths = {
    'en' : [
      "/home-security/best-home-security-systems/",
      "/home-security/best-outdoor-security-cameras/",
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
    ],
    'au' : [
      "/au/",
      "/au/mobile/iphone-14-vs-iphone-11/",
      "/au/mobile/cheap-mobile-plans/",
      "/au/internet/best-pocket-wifi-dongles/",
      "/au/internet/nbn-internet-speed-test/",
      "/au/internet/best-nbn-internet-plans/",
      "/au/entertainment/where-to-watch-the-white-lotus-in-australia/",
      "/au/internet/best-cheap-unlimited-nbn-plans/",
      "/au/internet/best-nbn-modems/",
      "/au/internet/best-cheap-unlimited-nbn-plans/",
      "/au/mobile/apple-iphone-14-pro-max-review/"
    ]
  }

  return paths[lang];
};

// si
function satelliteInternetUrls(lang){
  var paths = {
    'en' : [
    "/in-your-area/",
    "/resources/high-speed-internet-for-rural-areas/",
    "/providers/starlink/",
    "/resources/viasat-vs-hughesnet/"
    ]
  }

  return paths[lang];
};

// sw
function safewiseUrls(lang){
  var paths = {
    'en' : [
      "/best-home-security-system/",
      "/blog/best-wireless-security-cameras/",
      "/resources/wearable-gps-tracking-devices-for-kids-guide/",
      "/state-of-safety/"
    ],
    'au' : [
      "/au/best-wireless-security-cameras/",
      "/au/best-phones-for-seniors/",
      "/au/best-smart-locks/",
      "/au/best-video-doorbell-cameras/",
      "/au/living-in-flood-zone/",
      "/au/best-home-security-cameras/",
      "/au/best-pet-cameras/",
      "/au/best-kids-smartwatches-gps-trackers/",
      "/au/best-phones-for-kids/",
      "/au/best-smoke-alarms/"
    ]
  }

  return paths[lang];
};

// swg
function softwareGuidesUrls(lang){
  var paths = {
    'en' : [
      "/project-management-software/",
      "/workforce-management-software/",
      "/scheduling-software/",
      "/learning-management-systems/",
      "/crm-software-2/"
    ]
  }

  return paths[lang];
};

// --------------------
// DEPRECATED FUNCTIONS
// --------------------


// LAST ATTEMPT TO ID WEBSITE USING FAVICONURL (for hsi and ctv)

const tryFavIcon = (favIconUrl) => {
  let sites = getAllSites()
  let siteName = "other";

  for ( let site of sites ) {
    if (site.length >= 4) {
      let keywords = site[3];
      
      if (favIconUrl.includes(keywords)){
        siteName = site[0];
      }
    }
  }
  return siteName;
}