/** 
 - Executed when the user clicks the extension icon.
 - Gets the current tab URL.
 - Sends a message to the background script to fetch data.
 - Receives data and updates the popup's DOM.
*/

document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    let currentTab = tabs[0];
    if (isEligibleSite(currentTab.url)) {
      console.log('is eligible site');

      const baseUrl = new URL(currentTab.url).origin;
      
      chrome.runtime.sendMessage(
        {action: "fetchPriorityPages", url: baseUrl},
        response => {
          if (response.data) {
            console.log('response data:', response.data);
              // Update popup DOM with links
          }
          if (response.error) {
            console.log('response error:', response.error);
              // Update popup DOM with error message
          }
        }
      );
    }
  });
});

const liveSites = [
  'https://www.cabletv.com',
  'https://www.highspeedinternet.com',
  'https://www.reviews.org',
  'https://www.satelliteinternet.com',
  'https://www.safewise.com',
  'https://www.business.org',
  'https://www.move.org/',
]

function isLiveSite(url) {
  let origin = new URL(url).origin;
  return liveSites.includes(origin);
}

function isFeatureBranch(url) {
  const featureBranchPattern = /\.pantheonsite\.io$/;
  let hostname = new URL(url).hostname;
  return featureBranchPattern.test(hostname);
}

function isLocalEnvironment(url) {
  const localPattern = /\.local/;
  let hostname = new URL(url).hostname;
  return localPattern.test(hostname);
}

function isEligibleSite(url) {
  return isLiveSite(url) || isFeatureBranch(url) || isLocalEnvironment(url);
}
