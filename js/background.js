

let url = '';

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
  url = tabs[0].url;
  console.log(url);
});

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.storage.sync.set({ 'url': url });
//   console.log(`The url is stored as:${url}`);
// });

let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});