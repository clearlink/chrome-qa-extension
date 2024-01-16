/** 
 - Listens for messages from the popup script.
 - Fetches priority pages data from the API.
 - Sends data back to the popup script.
 */

let cache = {};
const CACHE_LIFETIME = 15 * 60 * 1000; // 15 minutes in milliseconds

function isCacheStale(baseUrl) {
  if (!cache[baseUrl]) return true; // Cache for URL does not exist
  const now = new Date().getTime();
  const cacheAge = now - cache[baseUrl].timestamp;
  return cacheAge > CACHE_LIFETIME;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  const secretKey = 'chrome_extension';
  const encodedKey = btoa(secretKey); // Base64 encoding
  const baseUrl = request.url;

  if (request.action === "fetchData") {
    if (!isCacheStale(baseUrl) && cache[baseUrl]) {
      console.log('Using cached data')
      sendResponse({data: cache[baseUrl].data}); // Send cached data if not stale
    } else {
      // Fetch new data, cache it, and send response
      fetch(baseUrl + '/wp-json/coolwhip/v2/priority-pages', {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'key': encodedKey
        }
      })
        .then(response => response.json())
        .then(data => {
          cache[baseUrl] = {
            data: data,
            timestamp: new Date().getTime() // Update timestamp
          };
          console.log(cache);
          console.log(data);
          sendResponse({data: data});
        })
        .catch(error => sendResponse({error: error.toString()}));
    }
    return true; // Indicates asynchronous response
  }
});
