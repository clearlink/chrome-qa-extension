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
      const baseUrl = new URL(currentTab.url).origin;
      
      chrome.runtime.sendMessage(
        { action: "fetchData", url: baseUrl },
        response => {
          if (response.data) {
            console.log('response data:', response.data);
              buildMenu(response.data);
          }
          if (response.error) {
            console.log('response error:', response.error); // this goes to popup console
            showMessage('An error occurred while fetching data from this site.');
          }
        }
      );
    } else {
      showMessage('This extension is not available on this site.');
    }
  });
});

const liveSites = [
  'https://www.cabletv.com/',
  'https://www.highspeedinternet.com/',
  'https://www.reviews.org/',
  'https://www.satelliteinternet.com/',
  'https://www.safewise.com/',
  'https://www.business.org/',
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

function createLinks(key, data, baseUrl) {
  const container = document.getElementById('links-container');
  container.innerHTML = ''; // Clear existing links

  const urls = data[key].split('\r\n');

  if (urls.length === 0 || urls[0] === '') {
    let message = key === 'high_priority_pages' ? 'No Priority Pages found.' : 'No Priority Pages found for this language.';
    message += '\n\n';
    message += 'Please wait 15 mins for cache to clear \n';
    message += 'or contact the CB Eng team if this is an error.';
    showMessage(message);
    return;
  }

  urls.forEach(relativePath => {
    if (relativePath) {
      const link = document.createElement('a');
      link.onclick = function() { 
        chrome.tabs.update(undefined, {url: baseUrl + relativePath});
      };
      link.textContent = relativePath; // Use the absolute URL as link text
      link.target = '_blank'; // Open in new tab
      container.appendChild(link);
      container.appendChild(document.createElement('br')); // For spacing
    }  
  });
}

function getLangFromUrl(url) {
  const urlPath = new URL(url).pathname;
  if (urlPath.includes('/au/')) return 'au';
  if (urlPath.includes('/es/')) return 'es';
  return 'en'; // Default language
}

function buildMenu(data, overrideLang = null) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    const baseUrl = new URL(currentTab.url).origin;
    const defaultLangKey = 'high_priority_pages';

    // Determine the active language: either the override language or from the URL
    const activeLang = overrideLang || getLangFromUrl(currentTab.url);

    // Construct the key for the data object
    const langKey = activeLang === 'en' ? defaultLangKey : `${defaultLangKey}_${activeLang}`;

    if (data.hasOwnProperty(langKey)) {
      createLinks(langKey, data, baseUrl);
    } else {
      createLinks(defaultLangKey, data, baseUrl); // Fallback to default if not found
    }

    createSwitchLinks(data, baseUrl, activeLang);
  });
}

function createSwitchLinks(data, baseUrl, activeLang) {
  const possibleLangs = ['en', 'es', 'au', 'qa'];
  const footerContainer = document.getElementById('footer-container');
  footerContainer.innerHTML = ''; // Clear existing links

  possibleLangs.forEach(lang => {
    if (lang !== activeLang) {
      const key = lang === 'en' ? 'high_priority_pages' : `high_priority_pages_${lang}`;
      addSwitchLinkIfExists(`${lang.toUpperCase()} Priority Pages`, key, data, baseUrl, lang);
    }
  });
}

function addSwitchLinkIfExists(text, key, data, baseUrl, lang) {
  if (data.hasOwnProperty(key)) {
    const switchLink = document.createElement('a');
    switchLink.href = '#';
    switchLink.textContent = text;
    switchLink.onclick = function(e) {
      e.preventDefault();
      buildMenu(data, lang); // Pass the selected language as an override
    };
    document.getElementById('footer-container').appendChild(switchLink);
    document.getElementById('footer-container').appendChild(document.createElement('br'));
  }
}

function showMessage(message) {
  message = message.replace(/\n/g, '<br>'); // Replace newlines with <br>
  const container = document.getElementById('links-container');
  container.innerHTML = ''; // Clear existing links
  const messageEl = document.createElement('p');
  messageEl.innerHTML = message;
  container.appendChild(messageEl);
}
