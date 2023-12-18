/** 
 - Listens for messages from the popup script.
 - Fetches priority pages data from the API.
 - Sends data back to the popup script.
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchPriorityPages" && request.url) {''
    // Perform the API call
    console.log('request.url:', request.url)
    fetch(`${request.url}/wp-json/coolwhip/v2/priority-pages`)
        .then(response => response.json())
        .then(data => sendResponse({data: data}))
        .catch(error => sendResponse({error: error.toString()}));

    return true; // Will respond asynchronously.
  }
});
