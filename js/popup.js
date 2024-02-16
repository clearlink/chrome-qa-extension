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
            if (response.data.code && response.data.code === 'unauthorized'){
              showMessage('Issue with authorization. Please contact the CB Eng team if issue persists.');
            } else {
              buildMenu(response.data);
            }
          }
          if (response.error) {
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
  'https://www.cabletv.com',
  'https://www.highspeedinternet.com',
  'https://www.reviews.org',
  'https://www.satelliteinternet.com',
  'https://www.safewise.com',
  'https://www.business.org',
  'https://www.move.org',
]

function getLangFromUrl(url) {
  const urlPath = new URL(url).pathname;
  if (urlPath.includes('/au/')) return 'au';
  if (urlPath.includes('/es/')) return 'es';
  return 'en'; // Default language
}

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

function createLinks(key, data, baseUrl, activeLang) {
  const container = document.getElementById('links-container');
  
  container.innerHTML = ''; // Clear existing links

  if (!data[key] || data[key] === '') {
    let message = key === 'high_priority_pages' ? 'No Priority Pages found.' : 'No Priority Pages found for this language.';
    message += '<br><br>';
    message += 'Please wait 15 mins for cache to clear or <br>';
    message += 'contact the CB Eng team if this is an error.';
    showMessage(message);
    createHomepageLink(baseUrl, activeLang, container);
    return;
  }
  
  const urls = data[key].split('\r\n');

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

  // Add homepage link
  createHomepageLink(baseUrl, activeLang, container);
  
  // Add open all link
  const openAllLink = document.createElement('a');
  openAllLink.href = '#';
  openAllLink.textContent = 'OPEN ALL IN NEW TABS';
  openAllLink.onclick = function(e) {
    e.preventDefault();
    urls.forEach(relativePath => {
      chrome.tabs.create({
        url: baseUrl + relativePath, 
        active: false
      });
    });
  };
  container.appendChild(openAllLink);
  container.appendChild(document.createElement('br')); // For spacing
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
      createLinks(langKey, data, baseUrl, activeLang);
    } else {
      createLinks(defaultLangKey, data, baseUrl, activeLang); // Fallback to default if not found
    }
    createSwitchLinks(data, baseUrl, activeLang);
  });
}

function createHomepageLink(baseUrl, activeLang, container) {
  const homepage = document.createElement('a');
  const homeUrl = baseUrl + ((activeLang === 'en' || activeLang === 'qa') ? '' : `/${activeLang}`);

  homepage.href = homeUrl;
  homepage.textContent = (activeLang === 'en' || activeLang === 'qa') ? 'HOMEPAGE' : `${activeLang.toUpperCase()} HOMEPAGE `;
  homepage.onclick = function() {
    chrome.tabs.update(undefined, {url: homeUrl});
  }
  container.appendChild(homepage);
  container.appendChild(document.createElement('br')); // For spacing
}

function createSwitchLinks(data, baseUrl, activeLang) {
  const possibleLangs = ['en', 'es', 'au', 'qa'];
  const footerContainer = document.getElementById('footer-container');
  footerContainer.innerHTML = ''; // Clear existing links

  possibleLangs.forEach(lang => {
    if (lang !== activeLang) {
      const key = lang === 'en' ? 'high_priority_pages' : `high_priority_pages_${lang}`;
      addSwitchLinkIfExists(`SWITCH VIEW TO ${lang.toUpperCase()} PAGES`, key, data, baseUrl, lang);
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

function showMessage(message, container = document.getElementById('links-container')) {
  const messageEl = document.createElement('p');

  container.innerHTML = ''; // Clear existing links
  messageEl.innerHTML = message;
  container.appendChild(messageEl);
  container.appendChild(document.createElement('br')); // For spacing
}
