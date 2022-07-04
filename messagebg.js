
// IN CONTENT_SCRIPT.js
function handleResponse(message) {
    url = message.response;
    console.log(`yolo ${url}`);
    str = JSON.stringify(url, null, 4); // (Optional) beautiful indented output.
    console.log(str); // Logs output to dev tools console.
    getNextPath(url);
  }
  
function handleError(error) {
console.log(`Error: ${error}`);
}

function notifyBackgroundPage(e) {
let sending = chrome.runtime.sendMessage({
    greeting: "Send over to get_urls"
});
sending.then(handleResponse, handleError);
}

element.addEventListener("click", notifyBackgroundPage);

// FROM BACKGROUND.js
function handleMessage(request, sender, sendResponse) {

    console.log("Message from the content script: " +
      request.greeting);
      
      sendResponse({response: tab});
  };
  
  chrome.runtime.onMessage.addListener(handleMessage);