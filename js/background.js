/** 
 - Listens for messages from the popup script.
 - Fetches priority pages data from the API.
 - Sends data back to the popup script.
 */

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "fetchPriorityPages" && request.url) {''
//     // Perform the API call
//     console.log('request.url:', request.url)
//     fetch(`${request.url}/wp-json/coolwhip/v2/priority-pages`)
//         .then(response => response.json())
//         .then(data => sendResponse({data: data}))
//         .catch(error => sendResponse({error: error.toString()}));

//     return true; // Will respond asynchronously.
//   }
// });

// let cache = {};

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   const baseUrl = request.url;
//   console.log('request.url:', request.url)

//     if (request.action === "fetchData") {
//         if (cache[baseUrl]) {
//             sendResponse({data: cache[baseUrl]}); // Send cached data if available
//         } else {
//             // Perform the API call
//             fetch(baseUrl + '/wp-json/coolwhip/v2/priority-pages')
//                 .then(response => response.json())
//                 .then(data => {
//                     cache[baseUrl] = data; // Cache the data
//                     sendResponse({data: data});
//                 })
//                 .catch(error => sendResponse({error: error.toString()}));
//         }
//         return true; // Indicates asynchronous response
//     }
// });

let cache = {};

const CACHE_LIFETIME = 15 * 60 * 1000; // 15 minutes in milliseconds

function isCacheStale(baseUrl) {
  if (!cache[baseUrl]) return true; // Cache for URL does not exist
  const now = new Date().getTime();
  const cacheAge = now - cache[baseUrl].timestamp;
  return cacheAge > CACHE_LIFETIME;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  const baseUrl = request.url;

  if (request.action === "fetchData") {
    if (!isCacheStale(baseUrl) && cache[baseUrl]) {
      console.log('not stale');
      sendResponse({data: cache[baseUrl].data}); // Send cached data if not stale
    } else {
      // Fetch new data, cache it, and send response
      fetch(baseUrl + '/wp-json/coolwhip/v2/priority-pages')
        .then(response => response.json())
        .then(data => {
          cache[baseUrl] = {
            data: data,
            timestamp: new Date().getTime() // Update timestamp
          };
          sendResponse({data: data});
        })
        .catch(error => sendResponse({error: error.toString()}));
    }
    return true; // Indicates asynchronous response
  }
});
