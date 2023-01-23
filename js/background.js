
// document.addEventListener("DOMContentLoaded", async () => {
//   const functionString = `
//     const schema = {};
//     let schemaElement = document.querySelector('script[type="application/ld+json"]');
//     let schemaJson = schemaElement.textContent;
//     let schema = JSON.parse(schemaJson);
//     return schema;
//   `;
//   const injectedFunction = new Function(functionString);

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: injectedFunction
//   }, schema => {
//     // The schema object returned from the script
//     // contains the schema information for the page
//     console.log(schema);
//   });
// });

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.type === "getPageSchema") {
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       var tab = tabs[0];
//       var functionString = `(function() {
//         let schemaElement = document.querySelector('script[type="application/ld+json"]');
//         let schemaJson = schemaElement.textContent;
//         return JSON.parse(schemaJson);
//       })();`;
//       const injectedFunction = new Function(functionString);

//       let schemaElement = document.querySelector('script[type="application/ld+json"]');
//       let schemaJson = schemaElement.textContent;
//       return JSON.parse(schemaJson);
//       sendResponse(JSON.parse(schemaJson))

//       chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         function: injectedFunction
//       }, schema => {
//         // The schema object returned from the script
//         // contains the schema information for the page
//         console.log(schema);
//         sendResponse({schema: schema});
//       });
//       console.error;

//       // Return true to indicate that the response will be sent later
//       return true;
//     });
//   }
// });

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.type === "getPageSchema") {
//     // let schemaElement = document.querySelector('script[type="application/ld+json"]');
//     // let schemaJson = schemaElement.textContent;
//     console.log(self,"self")
//     var window = window ?? self;
//     // let schemaElement = window.querySelector('script[type="application/ld+json"]');
//     // let schemaJson = schemaElement.textContent;
//     sendResponse(window);
//   }
//   return true;
// });

// function getPageSchema() {
  
// }

