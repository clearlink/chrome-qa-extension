let url = '';

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
  url = tabs[0].url;
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ url });
  console.log(`The url is stored as:${url}`);
});

let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});