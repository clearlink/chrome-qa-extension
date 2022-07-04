
/*
    CREATE DRAGGABLE DIV
*/

var div = document.createElement("div"); 
div.setAttribute("Id","mydiv");
div.style.top = "5px";
div.style.right = "15px";

document.body.appendChild(div); 

var div2 = document.createElement("div"); 
div2.setAttribute("Id","mydivheader");
div2.innerText="Test Pages";
div.appendChild(div2);

dragElement(document.getElementById("mydiv"));

/* 
    CREATE ARROW IN DRAGGABLE DIV
*/

createArrows();

function createArrows(){
    if (isLast() == false && getPathIndex() < 1){
        createRightArrow();
    } else if (isLast() == false){
        createLeftArrow()
        createRightArrow();
    }
    else {
        createLeftArrow();
    }
}

function createRightArrow(){
    var right_arrow = document.createElement("img");
    right_arrow.setAttribute("Id","right-arrow");
    right_arrow.src = chrome.runtime.getURL("/images/right-arrow.png");
    document.getElementById("mydiv").appendChild(right_arrow);
}

function createLeftArrow(){
    var left_arrow = document.createElement("img");
    left_arrow.setAttribute("Id","left-arrow");
    left_arrow.src = chrome.runtime.getURL("/images/left-arrow.png");
    document.getElementById("mydiv").appendChild(left_arrow);
}

function isLast(){
    let paths = [];
    let currentIndex = getPathIndex()
    let sitePathsListLength = 0;

    paths = getPaths();
    sitePathsListLength = paths.length;
    if (currentIndex + 1 == sitePathsListLength){
        return true;
    }
    else{
        return false;
    }
}

/*
    INTERACTIONS WITH DRAGGABLE DIV
*/

document.body.addEventListener( 'click', function ( event ) {
    if( event.target.id == 'right-arrow' ) {
      getNextPath();
    };
    if( event.target.id == 'left-arrow' ) {
      getLastPath();
    };
    // if ( event.target.id == 'mydiv' ) {
    //   dragElement(document.getElementById("mydiv"));
    // }
  } );


function getLastPath(){
    let path_index = -1;
    let next_path = '';
    
    path_index = getPathIndex();
    next_path_index = previousPathIndex(path_index);
    next_path = getPath(next_path_index);
    window.location.href = next_path;
}

function getNextPath(){
    
    let path_index = -1;
    let next_path = '';
    
    path_index = getPathIndex();
    next_path_index = nextPathIndex(path_index);
    next_path = getPath(next_path_index);
    window.location.href = next_path;
}

function getPath(index){
    let paths = getPaths();
    let path = paths[index];

    return path;
}

function nextPathIndex(path_index){
    return path_index + 1;
}

function previousPathIndex(path_index){
    return path_index - 1;
}

function getPathIndex(){
    let paths = [];
    let index = -1;
    let currentPath = window.location.pathname

    paths = getPaths();
    paths.forEach( path => {
        
        if (path == currentPath){
            index = paths.indexOf(path)
        }
    });
    return index
}

/*
    Get list of paths 
*/

function getSite(){
    let url = window.location.href;
    var allSites = [
        "Business",
        "CableTV",
        "highSpeedInternet",
        "Move",
        "Reviews",
        "SatelliteInternet",
        "SoftwareGuides",
        "Safewise"
    ];
    let currentSite = 'current';

    allSites.forEach( site => {

        if (url.indexOf(site.toLowerCase()) > 1){
            currentSite = site.toLowerCase();
        }
    });

    return currentSite;
}

function getPaths(){
    let siteName = '';
    let urls = [];

    siteName = getSite();
  
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
      // case 'extension_test':
      //   urls = '';
      //   break;
    }
  
    return urls
  }

/*
    DRAGGABLE DIV JS
*/

// Make the DIV element draggable:
// https://www.w3schools.com/howto/howto_js_draggable.asp

function dragElement(elmnt) {
  // elmnt.position = "fixed";
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    elmnt.style.right = '';
  }
  
  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    // elmnt.position = "absolute";
  }
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
